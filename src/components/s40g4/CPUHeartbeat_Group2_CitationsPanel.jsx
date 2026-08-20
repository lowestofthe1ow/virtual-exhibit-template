import React, { useState, useEffect } from 'react';

const REFERENCES = [
  { id: 1, text: 'Fetch, decode, execute (repeat!) – Clayton Cafiero. (n.d.). https://www.uvm.edu/~cbcafier/cs2210/content/02_basics_of_architecture/fetch_decode_execute.html' },
  { id: 2, text: 'Sheldon, R. (2024, March 6). Program Counter. TechTarget. https://www.techtarget.com/whatis/definition/program-counter' },
  { id: 3, text: 'Memory Address Register. (n.d.). Science Direct. https://www.sciencedirect.com/topics/engineering/memory-address-register' },
  { id: 4, text: 'Reliability Availability and Maintainability (Reliability Engineering). (n.d.). Science Direct. https://www.sciencedirect.com/topics/engineering/reliability-availability-and-maintainability-reliability-engineering' },
  { id: 5, text: 'Central Processing Unit. (n.d.). Science Direct. https://www.sciencedirect.com/topics/computer-science/central-processing-unit' },
  { id: 6, text: 'Memory data register. (n.d.). NordVPN. https://nordvpn.com/cybersecurity/glossary/memory-data-register/' },
  { id: 7, text: 'Ghosh, P. (n.d.). CPU: ALU and CU Explained. SCRIBD. https://www.scribd.com/document/706018817/CPU' },
  { id: 8, text: 'CPU registers and their functions. (n.d.). Algor Education. https://cards.algoreducation.com/en/content/slE8hMSy/cpu-registers-computing' },
  { id: 9, text: 'GeeksforGeeks. (2026, April 2). Von Neumann Architecture. GeeksforGeeks. https://www.geeksforgeeks.org/computer-organization-architecture/computer-organization-von-neumann-architecture/' },
  { id: 10, text: 'GeeksforGeeks. (2022, August 17). EFLAGS registers of 80386 microprocessor. GeeksforGeeks. https://www.geeksforgeeks.org/computer-organization-architecture/eflags-registers-of-80386-microprocessor/' },
  { id: 11, text: 'Hulatt, L., & Freitas, G. (2023, November 24). Understanding Gate in Computer Organisation. StudySmarter UK. https://www.studysmarter.co.uk/explanations/computer-science/computer-organisation-and-architecture/gate/' },
  { id: 12, text: 'What is a data bus? (n.d.). ExpressVPN. https://www.expressvpn.com/glossary/data-bus/' },
  { id: 13, text: 'Distance Vector Routing protocol in computer networks. (n.d.). Slideshare. https://slideshare.net/slideshow/distance-vector-routing-protocol-in-computer-networks/284636835' },
  { id: 14, text: 'Daft Punk. "The Son of Flynn." Tron: Legacy (Original Motion Picture Soundtrack). Walt Disney Records, 2010.' },
  { id: 15, text: 'Warp / light-cycle sound effect. Tron: Legacy. Directed by Joseph Kosinski. Walt Disney Pictures, 2010.' },
  { id: 16, text: 'Light-cycle and grid mainframe imagery. Tron: Legacy. \u00a9 Walt Disney Pictures, 2010.' },
  { id: 17, text: 'Digital processing and virtual grid concept inspired by Tron (1982) and Tron: Legacy (2010), Walt Disney Pictures.' },
];

const SectionHeader = ({ children }) => (
  <h3 className="cp-section-header" style={{
    fontFamily: '"JetBrains Mono", monospace',
    fontWeight: '700',
    fontSize: '1rem',
    color: '#febe0b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 12px 0',
    paddingBottom: '6px',
    borderBottom: '1px dashed #004d66',
    textShadow: '0 0 6px rgba(254, 190, 11, 0.3)',
  }}>
    &gt; {children}
  </h3>
);

const DefBlock = ({ term, sub, def, citations, activeKey, onCitationClick }) => (
  <div className="cp-def-block" style={{ marginBottom: '14px' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
      <strong className="cp-term" style={{ color: '#00bafa', fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>
        {term}
      </strong>
      {sub && (
        <span className="cp-sub" style={{ color: '#537a85', fontSize: '0.7rem', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          [{sub}]
        </span>
      )}
    </div>
    <p className="cp-def" style={{
      color: '#c0f3ff',
      fontSize: '0.82rem',
      lineHeight: '1.6',
      margin: '3px 0 0 0',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      {def}
      {citations.map(id => {
        const key = `${term}-${id}`;
        const isActive = activeKey === key;
        return (
          <span key={key} style={{ position: 'relative', display: 'inline' }}>
            <sup
              onClick={() => onCitationClick(key)}
              style={{
                color: isActive ? '#020204' : '#00bafa',
                backgroundColor: isActive ? '#00bafa' : 'transparent',
                fontWeight: '700',
                cursor: 'pointer',
                padding: '1px 3px',
                borderRadius: '3px',
                transition: 'all 0.15s ease',
              }}
            >
              [{id}]
            </sup>
            {isActive && (
              <div className="cp-popup" style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                top: '100%',
                zIndex: 100,
                minWidth: '260px',
                maxWidth: '380px',
                padding: '8px 12px',
                backgroundColor: '#05080c',
                border: '1px solid #004d66',
                borderLeft: '3px solid #febe0b',
                borderRadius: '4px',
                fontSize: '0.72rem',
                color: '#c0f3ff',
                lineHeight: '1.5',
                fontFamily: '"JetBrains Mono", monospace',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                marginTop: '4px',
                overflowWrap: 'break-word',
              }}>
                <strong style={{ color: '#febe0b' }}>[{id}]</strong>{' '}
                {REFERENCES.find(r => r.id === id)?.text}
              </div>
            )}
          </span>
        );
      })}
    </p>
  </div>
);

export default function CitationsPanel({ initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (initialOpen) setIsOpen(true);
  }, [initialOpen]);

  const toggleOpen = () => setIsOpen(o => !o);
  const handleCitationClick = (key) => setActiveKey(prev => prev === key ? null : key);

  return (
    <div id="references" className="cp-root" style={{ width: '100%', margin: '30px auto 0', padding: '20px', boxSizing: 'border-box', overflow: 'hidden', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
      <style>{`
        @keyframes cpFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .cp-root { padding: 12px !important; margin-top: 20px !important; }
          .cp-btn { font-size: 0.8rem !important; padding: 10px 12px !important; gap: 6px !important; }
          .cp-panel { padding: 14px !important; margin-top: 12px !important; }
          .cp-intro { margin-bottom: 14px !important; }
          .cp-intro p { font-size: 0.7rem !important; line-height: 1.4 !important; }
          .cp-sections { gap: 14px !important; }
          .cp-section-header { font-size: 0.8rem !important; margin-bottom: 8px !important; padding-bottom: 4px !important; }
          .cp-def-block { margin-bottom: 8px !important; }
          .cp-term { font-size: 0.75rem !important; }
          .cp-sub { font-size: 0.6rem !important; }
          .cp-def { font-size: 0.68rem !important; line-height: 1.4 !important; }
          .cp-popup {
            position: fixed !important;
            left: 10px !important;
            right: 10px !important;
            top: auto !important;
            bottom: 10px !important;
            transform: none !important;
            min-width: unset !important;
            max-width: unset !important;
            width: auto !important;
            max-height: 40vh !important;
            overflow-y: auto !important;
            font-size: 0.65rem !important;
            padding: 10px !important;
            border-radius: 8px !important;
          }
          .cp-refs-list { gap: 6px !important; }
          .cp-ref-item { font-size: 0.62rem !important; line-height: 1.4 !important; gap: 4px !important; }
          .cp-ref-num { width: 22px !important; font-size: 0.6rem !important; }
          .cp-hr { margin: 0 0 12px 0 !important; }
        }
        @media (max-width: 480px) {
          .cp-root { padding: 8px !important; margin-top: 16px !important; }
          .cp-btn { font-size: 0.72rem !important; padding: 8px 10px !important; }
          .cp-panel { padding: 10px !important; margin-top: 10px !important; }
          .cp-intro { margin-bottom: 10px !important; }
          .cp-intro p { font-size: 0.65rem !important; }
          .cp-sections { gap: 10px !important; }
          .cp-section-header { font-size: 0.72rem !important; }
          .cp-def-block { margin-bottom: 6px !important; }
          .cp-term { font-size: 0.7rem !important; }
          .cp-def { font-size: 0.62rem !important; }
          .cp-ref-item { font-size: 0.58rem !important; }
        }
      `}</style>

      <hr className="cp-hr" style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '0 0 16px 0' }} />

      <button
        onClick={toggleOpen}
        className="cp-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '14px 20px',
          backgroundColor: isOpen ? '#05080c' : '#020204',
          border: `1px solid ${isOpen ? '#00bafa' : '#004d66'}`,
          borderRadius: '4px',
          color: '#00bafa',
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: '700',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ color: '#febe0b' }}>{isOpen ? '▼' : '▶'}</span>
        {isOpen ? 'Hide References' : 'View References'}
      </button>

      {isOpen && (
        <div className="cp-panel" style={{
          marginTop: '20px',
          padding: '25px',
          backgroundColor: '#05080c',
          border: '1px solid #004d66',
          borderRadius: '4px',
          animation: 'cpFadeIn 0.25s ease',
          overflow: 'hidden',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
        }}>

          <div className="cp-intro" style={{ marginBottom: '24px' }}>
            <SectionHeader>Citations, Definitions, &amp; References</SectionHeader>
            <p className="cp-intro-text" style={{ color: '#537a85', fontSize: '0.78rem', fontFamily: '"JetBrains Mono", monospace', lineHeight: '1.5', margin: '0' }}>
              Based on the film <em>Tron: Legacy</em> (2010, Walt Disney Pictures). All Tron-related assets are used for educational purposes within this academic exhibit.
            </p>
          </div>

          <div className="cp-sections" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <SectionHeader>Game 1 — System Register</SectionHeader>
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick}
                term="Vector Routing"
                def="A fundamental network routing algorithm used to determine the shortest path between nodes based on distance metrics and next-hop information."
                citations={[13]}
              />
            </section>

            <section>
              <SectionHeader>Game 2 — Hardware Logic</SectionHeader>
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="System Architecture" def="A computer design where instructions and data are stored in the same memory space. This means the CPU fetches both instructions and data from the same memory, using the same pathways." citations={[9]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="System Flags" def="Reflect the current status of the machine and are usually used by the operating systems than by application programs." citations={[10]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="PIPELINE" def="Pipelining combines multiple steps into one combined process, allowing simultaneous fetch, decode, execute, and write steps for different instructions." citations={[5]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="CPU" def="Central Processing Unit (CPU) can be defined as the main component of a computer that performs most of the processing inside the computer." citations={[5]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="RAM" def="Random access memory is defined as a volatile general-purpose memory that stores user data in a program and loses its contents when power is removed." citations={[4]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Register" def="Small memory locations that a CPU or ALU uses to hold operands, results of computations, memory addresses, and so on." citations={[1]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Clock / Register Tick" def="A device which emits pulses of a fixed very precise frequency, which are used to regulate the fetch-decode-execute cycle." citations={[1]} />
            </section>

            <section>
              <SectionHeader>Game 3 — Logic &amp; Buses</SectionHeader>
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Logic Gates" def="Performs basic logical functions that are fundamental to digital circuits. These gates are used to create Boolean functions, which ultimately define how binary data is processed in digital electronics." citations={[11]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Address Bus" def="To carry the addresses of memory locations so that data stored at a particular location can be accessed by the CPU, either to read data located there or write data there." citations={[5]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Data Bus" def="Carries data signals between connected components using a defined protocol and timing." citations={[12]} />
            </section>

            <section>
              <SectionHeader>FDE Cycle Stages</SectionHeader>
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Fetch" def="The control unit sends the memory address over the address bus to main memory, which then returns the instruction's binary code over the data bus." citations={[1]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Decode" def="Decoding is handled by the control unit, which translates the instruction's binary fields into a set of control signals." citations={[1]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Execute" def="The CPU actually performs the operation specified by the instruction. This may involve arithmetic in the ALU, accessing memory, or updating the program counter for a branch." citations={[1]} />
            </section>

            <section>
              <SectionHeader>Register Definitions</SectionHeader>
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="POINTER REGISTER" sub="Program Counter (PC)" def="A special register in a computer processor that contains the memory address (location) of the next program instruction to be executed." citations={[2]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="BUS INTERFACE REGISTER" sub="Memory Address Register (MAR)" def="Holds the active physical memory address currently being read from or written to by the processing core configuration." citations={[3]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="Buffer Register" sub="Memory Data Register (MDR)" def="Holds the information fetched from the main memory. It operates as a buffer between CPU and memory." citations={[6]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="EXECUTION PIPELINE STAGE" sub="Instruction Register (IR)" def="Holds the instruction after it is fetched from memory. Once the instruction is in the instruction register, the CPU can decode and execute it." citations={[2]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="MAINFRAME LOGIC COORDINATOR" sub="Control Unit (CU)" def="It controls and coordinates the functioning of all parts of the computer. It takes instructions from the memory and then decodes and executes these instructions." citations={[7]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="MATH EXECUTION CORE" sub="Arithmetic Logic Unit (ALU)" def="Executes mathematical computations (addition, subtraction, multiplication and division) and discrete boolean logic compares across register lines." citations={[7]} />
              <DefBlock activeKey={activeKey} onCitationClick={handleCitationClick} term="PRIMARY CORE REGISTER" sub="Accumulator (ACC)" def="A central register within the CPU's ALU that is used to accumulate the results of arithmetic and logic operations." citations={[8]} />
            </section>

            <section>
              <SectionHeader>References</SectionHeader>
              <div className="cp-refs-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REFERENCES.map(ref => (
                  <div key={ref.id} className="cp-ref-item" style={{ display: 'flex', gap: '6px', fontSize: '0.72rem', fontFamily: '"JetBrains Mono", monospace', color: '#537a85', lineHeight: '1.5', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    <span className="cp-ref-num" style={{ color: '#febe0b', fontWeight: '700', flexShrink: 0, minWidth: '32px' }}>[{ref.id}].</span>
                    <span>{ref.text}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
