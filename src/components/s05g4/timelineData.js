// timelineData.js
// Data source for the "Mga Nanguna: Filipino Pioneers Who Shaped the Digital World" timeline.
// Node types: "era" (decade markers) and "person" (individual/institution pioneers).
// See REFERENCES.md for full source list.

// Photo files live in `public/images/pioneers/` in this repo. Since this site

export const timelineNodes = [
  // ---------------- ERA: 1900s-1950s ----------------
  {
    id: "era-1900s",
    type: "era",
    era: "1900s-1950s",
    label: "Foundations",
    chapter: "Introduction",
  },
  {
    id: "person-zara",
    type: "person",
    era: "1900s-1950s",
    chapter: "Chapter 1: The Pioneers",
    name: "Gregorio Y. Zara",
    years: "1902-1978",
    photo: "s05g4/images/pioneers/Gregorio_Y_Zara.webp",
    contribution: "Inventor of the first two-way videophone (1955); pioneering aeronautical engineer",
    yearOfImpact: 1955,
    impact:
      "A National Scientist from Lipa, Batangas, Zara patented a 'photo phone signal separator network' in 1955, an early two-way video communication device now recognized as a forerunner of modern videoconferencing. He also engineered an alcohol-fueled airplane engine, a solar water heater, and held roughly 30 patents across physics and aeronautics.",
    citation: "(Videophone Pioneer, Zara, 1955)",
  },

  // ---------------- ERA: 1960s ----------------
  {
    id: "era-1960s",
    type: "era",
    era: "1960s",
    label: "The Institutions",
    chapter: "Chapter 2",
  },
  {
    id: "person-up-computer-center",
    type: "person",
    era: "1960s",
    chapter: "Chapter 2: The Institutions",
    name: "UP Diliman Computer Center",
    years: "est. 1966",
    photo: "s05g4/images/pioneers/UP_Computer_Center.webp",
    contribution: "Established the Philippines' first university computing and Computer Science program",
    yearOfImpact: 1968,
    impact:
      "Created by the UP Board of Regents in 1966 and operational by 1968, the Center acquired the university's first IBM 360/40 mainframe with support from the Ford Foundation and a discount from IBM. It became the country's first hub for centralized computing services and formal Computer Science education, seeding the institutional base that later pioneers would build on.",
    citation: "(University Computer Center History, UP Diliman, 1968)",
  },

  // ---------------- ERA: 1980s-1990s ----------------
  {
    id: "era-1980s",
    type: "era",
    era: "1980s-1990s",
    label: "The Overseas",
    chapter: "Chapter 3",
  },
  {
    id: "person-banatao",
    type: "person",
    era: "1980s-1990s",
    chapter: "Chapter 3: The Overseas",
    name: 'Diosdado "Dado" Banatao',
    years: "1946-2025",
    photo: "s05g4/images/pioneers/Dado_Banatao.webp",
    contribution: "Co-designed the first PC/AT-compatible chipset and an early GUI accelerator chip",
    yearOfImpact: 1985,
    impact:
      "Born to a rice-farming family in Iguig, Cagayan, Banatao rose to become one of Silicon Valley's most influential engineers. He is credited with the first 10-Mbit Ethernet CMOS chip (1981), the first chipset compatible with IBM's PC/XT and PC/AT, and one of the earliest GUI accelerator chips through his company S3 Graphics. He co-founded Mostron, Chips and Technologies, and S3 Graphics, and later founded PhilDev, a foundation supporting Filipino STEM scholars.",
    citation: "(Silicon Valley Pioneer, Banatao, 1985)",
  },
  {
    id: "person-marcelo",
    type: "person",
    era: "1980s-1990s",
    chapter: "Chapter 3: The Overseas",
    name: "Sheila Lirio Marcelo",
    years: "b. 1970s",
    photo: "s05g4/images/pioneers/Sheila_Marcelo.webp",
    contribution: "Founder of Care.com, a major U.S. care-services tech platform",
    yearOfImpact: 2006,
    impact:
      "Born in the Philippines and raised partly in the U.S., Marcelo built Care.com into one of the most recognizable marketplace platforms in American tech before it was acquired, becoming one of the most prominent Filipina founders in Silicon Valley.",
    citation: "(Care.com Founder, Marcelo, 2006)",
  },

  // ---------------- ERA: 2000s-2010s ----------------
  {
    id: "era-2000s",
    type: "era",
    era: "2000s-2010s",
    label: "Coming Home",
    chapter: "Chapter 4",
  },
  {
    id: "person-damarillo",
    type: "person",
    era: "2000s-2010s",
    chapter: "Chapter 4: Coming Home",
    name: "Winston Damarillo",
    years: "active 2000s-present",
    photo: "s05g4/images/pioneers/Winston_Damarillo.webp",
    contribution: "Serial tech entrepreneur who returned to build cloud and telco ventures in the Philippines",
    yearOfImpact: 2010,
    impact:
      "After building and selling companies acquired by IBM and Iona Technologies in the U.S., Damarillo returned to found Morphlabs and later served as Chief Strategy Officer at PLDT, bringing Silicon Valley cloud-computing experience back into Philippine telecom infrastructure.",
    citation: "(Returning Technopreneur, Damarillo, 2010)",
  },
  {
    id: "person-rivera",
    type: "person",
    era: "2000s-2010s",
    chapter: "Chapter 4: Coming Home",
    name: "Paul Rivera",
    years: "active 2010s-present",
    photo: "s05g4/images/pioneers/Paul_Rivera.webp",
    contribution: "Co-founder of Kalibrr, the first Philippine company accepted into Y Combinator",
    yearOfImpact: 2013,
    impact:
      "Rivera identified a skills-matching gap in the local BPO industry and built Kalibrr, a job-matching platform that became the first Philippine startup admitted into Y Combinator, opening a path for later local startups seeking global accelerator support.",
    citation: "(Kalibrr Co-founder, Rivera, 2013)",
  },

  // ---------------- ERA: 2020s ----------------
  {
    id: "era-2020s",
    type: "era",
    era: "2020s",
    label: "Modern Pioneers",
    chapter: "Chapter 5",
  },
  {
    id: "person-sazon",
    type: "person",
    era: "2020s",
    chapter: "Chapter 5: Modern Pioneers",
    name: "Martha Sazon",
    years: "active 2019-present",
    photo: "s05g4/images/pioneers/Martha_Sazon.webp",
    contribution: "President and CEO of Mynt (GCash), scaling the country's leading fintech platform",
    yearOfImpact: 2021,
    impact:
      "Under Sazon's leadership, GCash grew to serve the large majority of Filipino mobile users, becoming a central pillar of financial inclusion in the Philippines and one of the most-cited fintech success stories in Southeast Asia.",
    citation: "(GCash CEO, Sazon, 2021)",
  },
];

export const eras = [
  "1900s-1950s",
  "1960s",
  "1980s-1990s",
  "2000s-2010s",
  "2020s",
];

export const nodeTypes = ["era", "person"];
