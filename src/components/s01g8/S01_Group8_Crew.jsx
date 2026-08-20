import React from 'react';

const members = [
  {
    name: "Bendol, Trisha Mae R.",
    role: "Lead Researcher",
    callsign: "PHANTOM",
    intel: "Historical timeline research and GPU architecture documentation. Primary author of the CPU Empire section."
  },
  {
    name: "Canato, Karl Kristoffer R.",
    role: "Systems Analyst",
    callsign: "RENEGADE",
    intel: "3DFX and early GPU hardware analysis. Voodoo chipset deep-dive and performance benchmarking documentation."
  },
  {
    name: "Descalzo, Alberto Miguel T.",
    role: "Technical Engineer",
    callsign: "CIRCUIT",
    intel: "Shader architecture research and interactive lab implementation. Phong lighting model implementation."
  },
  {
    name: "Gregorio, John Marc Joepherl M.",
    role: "UX Commander",
    callsign: "FALCON",
    intel: "Interface design, navigation architecture, and exhibit visual language. Star Wars thematic direction."
  },
  {
    name: "Martin, Kurt Nehemiah Z.",
    role: "CUDA Specialist",
    callsign: "VOLTAGE",
    intel: "GPGPU and AI era documentation. CUDA platform analysis and AI supercomputing era research."
  }
];

export default function S01_Group8_Crew() {
  return (
    <div>
      <div className="crew-cards-grid">
        {members.map((m, i) => (
          <div key={i} className="crew-card">
            <div className="crew-card-header">
              <div className="crew-card-avatar">
                {String(i + 1).padStart(2, "0")}
              </div>
              <span className="crew-card-callsign">{m.callsign}</span>
            </div>
            <p className="crew-card-name">{m.name}</p>
            <p className="crew-card-role">{m.role}</p>
            <p className="crew-card-intel">{m.intel}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
