// src/store/cacheStore.js
import { create } from 'zustand';

// ========== RAM DATA (5 slots) ==========
const INITIAL_RAM = {
  '0x00': { data: 'Teacup' },
  '0x01': { data: 'Key' },
  '0x02': { data: 'Top Hat' },
  '0x03': { data: 'Knife' },
  '0x04': { data: 'Clock' },
};

const RAM_ADDRESSES = ['0x00', '0x01', '0x02', '0x03', '0x04'];

const createEmptySlot = () => ({
  address: null,
  data: null,
  state: 'empty'
});

export const useCacheStore = create((set, get) => ({
  ram: { ...INITIAL_RAM },

  core0: {
    name: 'Classic Alice',
    slot: createEmptySlot(),
  },
  core1: {
    name: 'Hysteria Alice',
    slot: createEmptySlot(),
  },

  selectedCore: 0, 
  selectedRamAddress: null, // NEW: Tracks which RAM item is clicked

  isBusActive: false,
  busMessage: {
    text: 'Bus idle... Waiting for action',
    sub: 'Snooping for memory operations',
    type: 'idle'
  },
  explanation: {
    alice: 'Click an item in the Rabbit Hole, select a core, then "Remember".',
    hardware: 'Cache is empty. Select a RAM address and click "Remember".',
  },
  log: ['All cache lines empty. Ready for operations...'],

  selectCore: (coreId) => {
    set({ selectedCore: coreId });
  },

  // NEW: Select RAM item
  selectRamAddress: (address) => {
    set({ selectedRamAddress: address });
  },

  setExplanation: (aliceText, hardwareText) => {
    set({ explanation: { alice: aliceText, hardware: hardwareText } });
  },

  addLog: (entry) => {
    set((state) => ({
      log: [`[${new Date().toLocaleTimeString()}] ${entry}`, ...state.log.slice(0, 9)],
    }));
  },

  triggerBus: (message, subMessage, type = 'read') => {
    set({
      isBusActive: true,
      busMessage: { text: message, sub: subMessage, type: type }
    });
    setTimeout(() => {
      set({
        isBusActive: false,
        busMessage: { text: 'Bus idle...', sub: 'Waiting for next action', type: 'idle' }
      });
    }, 2000);
  },

  // ========== HANDLE READ (REMEMBER) ==========
  handleRead: (coreId) => {
    const state = get();
    const address = state.selectedRamAddress;

    if (!address) {
      state.setExplanation(
        'Select a memory from the Rabbit Hole (RAM) first!',
        'No RAM address selected. Click a RAM slot before issuing a Read.'
      );
      return;
    }

    const coreKey = coreId === 0 ? 'core0' : 'core1';
    const core = state[coreKey];
    const coreName = core.name;
    const otherCoreKey = coreId === 0 ? 'core1' : 'core0';
    const otherCore = state[otherCoreKey];
    const otherCoreName = otherCore.name;

    // Cache Hit Check (Same address)
    if (core.slot.address === address && core.slot.state !== 'empty' && core.slot.state !== 'i') {
      state.setExplanation(
        `"${core.slot.data}" is already in ${coreName}'s Memory Pocket!`,
        `Cache hit! Address ${address} already in cache.`
      );
      return;
    }

    const data = state.ram[address]?.data;
    const otherHasIt = otherCore.slot.address === address && otherCore.slot.state !== 'empty' && otherCore.slot.state !== 'i';
    
    // Core B remembers -> BOTH Shared (S)
    if (otherHasIt) {
      if (otherCore.slot.state === 'm') {
        const modifiedData = otherCore.slot.data;
        set({
          [coreKey]: { ...core, slot: { address, data: modifiedData, state: 's' } },
          [otherCoreKey]: { ...otherCore, slot: { ...otherCore.slot, state: 's' } }
        });
        state.setExplanation(
          `"${modifiedData}" is corrupted! ${coreName} remembers it, and they now share it.`,
          `Cache-to-cache transfer from Modified (M). Both cores enter Shared (S). Address: ${address}`
        );
        state.addLog(`${coreName} read Modified data → Shared (S)`);
        state.triggerBus(`BUS: READ "${modifiedData}"`, `Transfer from Modified.`, 'read');
        return;
      }

      set({
        [coreKey]: { ...core, slot: { address, data, state: 's' } },
        [otherCoreKey]: { ...otherCore, slot: { ...otherCore.slot, state: 's' } }
      });
      state.setExplanation(
        `"${data}" is now shared between ${coreName} and ${otherCoreName}!`,
        `Both cache lines enter Shared (S) state. Address: ${address}`
      );
      state.addLog(`${coreName} read ${data} → Shared (S)`);
      state.triggerBus(`BUS: READ "${data}" (Shared)`, `Both cores share this memory. State: Shared (S).`, 'read');
      return;
    }

    // Core A remembers (first) -> Exclusive (E)
    set({
      [coreKey]: { ...core, slot: { address, data, state: 'e' } }
    });
    state.setExplanation(
      `${coreName} remembered "${data}"! She is the only one with this memory.`,
      `Fetched from RAM. No other core has this data → Exclusive (E) state. Address: ${address}`
    );
    state.addLog(`${coreName} read ${data} from RAM → Exclusive (E)`);
    state.triggerBus(`BUS: READ "${data}" from RAM`, `Exclusive (E) state.`, 'read');
  },

  // ========== HANDLE WRITE (CORRUPT) ==========
  handleWrite: (coreId) => {
    const state = get();
    const coreKey = coreId === 0 ? 'core0' : 'core1';
    const core = state[coreKey];
    const coreName = core.name;
    const otherCoreKey = coreId === 0 ? 'core1' : 'core0';
    const otherCore = state[otherCoreKey];
    const otherCoreName = otherCore.name;

    if (core.slot.state === 'empty' || core.slot.state === 'i' || core.slot.address === null) {
      state.setExplanation(`Nothing here to corrupt!`, `Cannot write to an Empty or Invalid line.`);
      return;
    }

    const address = core.slot.address;
    const dataToCorrupt = core.slot.data;
    const brokenVersions = {
      'Teacup': 'Broken Teacup',
      'Key': 'Broken Key',
      'Top Hat': 'Broken Top-Hat',
      'Knife': 'Broken Knife',
      'Clock': 'Broken Clock',
    };
    const corruptedData = brokenVersions[dataToCorrupt] || 'Broken Mirror';

    const otherHasIt = otherCore.slot.address === address;
    let invalidatedOther = false;

    // Hysteria corrupts -> Classic is Invalid (I)
    if (otherHasIt && otherCore.slot.state !== 'empty' && otherCore.slot.state !== 'i') {
      set({ [otherCoreKey]: { ...otherCore, slot: { ...otherCore.slot, state: 'i' } } });
      invalidatedOther = true;
    }

    // Corrupting core -> Modified (M)
    set({ [coreKey]: { ...core, slot: { address, data: corruptedData, state: 'm' } } });

    state.setExplanation(
      invalidatedOther
        ? `${coreName} corrupted "${dataToCorrupt}" into "${randomCorrupt}"! ${otherCoreName}'s memory is now Invalid!`
        : `${coreName} corrupted "${dataToCorrupt}" into "${corruptedData}"!`,
      invalidatedOther
        ? `${otherCoreName} transitioned to Invalid (I). ${coreName} entered Modified (M).`
        : `Cache line entered Modified (M).`
    );
    state.addLog(`${coreName} corrupted data → Modified (M)`);
    state.triggerBus(`BUS: MODIFIED "${dataToCorrupt}" → "${corruptedData}"`, invalidatedOther ? `${otherCoreName} Invalidated!` : '', 'write');
  },

  // ========== GLOBAL WRITEBACK (EMBRACE SANITY) ==========
  handleGlobalWriteback: () => {
    const state = get();
    const { core0, core1, ram } = state;

    let mCoreKey = null;
    let otherCoreKey = null;

    if (core0.slot.state === 'm') { mCoreKey = 'core0'; otherCoreKey = 'core1'; } 
    else if (core1.slot.state === 'm') { mCoreKey = 'core1'; otherCoreKey = 'core0'; }

    if (!mCoreKey) {
      state.setExplanation(`No corrupted memories to embrace!`, `No cache lines are in Modified (M).`);
      return;
    }

    const mCore = state[mCoreKey];
    const otherCore = state[otherCoreKey];
    const address = mCore.slot.address;
    const data = mCore.slot.data;

    // 1. Update RAM with corrupted ver
    set((state) => ({ ram: { ...state.ram, [address]: { data: data } } }));

    // 2. Modified core -> Shared (S)
    set({ [mCoreKey]: { ...mCore, slot: { ...mCore.slot, state: 's' } } });

    // 3. Invalid core -> Shared (S) with corrupted ver
    if (otherCore.slot.address === address && otherCore.slot.state === 'i') {
      set({ [otherCoreKey]: { ...otherCore, slot: { address, data, state: 's' } } });
    }

    state.setExplanation(
      `Sanity embraced! The corrupted "${data}" is now saved in RAM and shared by both Alices.`,
      `Global Writeback (WB) flushed Modified (M) data to RAM. Both cache lines are now Shared (S).`
    );
    state.addLog(`RAM Writeback: "${data}" → Both Shared (S)`);
    state.triggerBus(`BUS: WRITEBACK "${data}" to RAM`, 'RAM updated. Coherence restored!', 'writeback');
  },

  resetAll: () => {
    set({
      ram: { ...INITIAL_RAM },
      core0: { name: 'Classic Alice', slot: createEmptySlot() },
      core1: { name: 'Hysteria Alice', slot: createEmptySlot() },
      selectedCore: 0,
      selectedRamAddress: null,
      isBusActive: false,
      busMessage: { text: 'Bus idle...', sub: 'Ready for action', type: 'idle' },
      explanation: { alice: 'Reset complete.', hardware: 'Lines are Invalid (I).' },
      log: ['System reset.'],
    });
  },
}));