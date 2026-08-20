// Canonical scene list — shared by the deck orchestrator (active-scene tracking) and
// the HUD (scene label, mission clock, nav dots). Order and ids must match the
// section anchors and the SCENE_COMPONENTS / SCENE_INSTABILITY arrays.
// `t` is the scene's nominal mission time (T+ seconds) shown on the HUD clock.
export const SCENES = [
  { id: 'launch', name: 'Launch', t: 0.0 },
  { id: 'mission-briefing', name: 'Mission Briefing', t: 0.0 },
  { id: 'about-binary', name: 'Binary Basics', t: 30.0 },
  { id: 'register-room', name: 'Register Room', t: 36.7 },
  { id: 'dual-sri', name: 'Dual SRI Failure', t: 36.8 },
  { id: 'postmortem', name: 'Postmortem', t: 39.1 },
];
