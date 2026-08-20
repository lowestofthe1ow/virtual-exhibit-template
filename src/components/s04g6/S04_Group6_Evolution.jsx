import {
  useEffect,
  useRef,
  useState
} from "react";

import drum from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/Drum.webp";
import magnetic from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/MagneticCore.webp";
import matrix from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/MatrixCore.webp";
import dram from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/DRAM.webp";
import mos from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/mos-dram-epron.webp";
import sdram from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/sdram.webp";
import edo from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/edo.webp";
import drdram from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/drdram.webp";
import ddr1 from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/ddr1.webp";
import ddr2 from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/ddr2.webp";
import ddr3 from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/ddr3.webp";
import ddr4 from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/ddr4.webp";
import ddr5 from "../../assets/s04g6/S04_Group6_EvolutionRAMImg/ddr5.webp";

const ramData = [
  {
    name: "Drum Memory",
    shortName: "Drum Memory",
    year: "1932",
    category: "Magnetic Memory",
    image: drum.src,

    features: [
      {
        title: "Magnetic Storage",
        description:
          "Stored information magnetically on the surface of a rotating metal cylinder."
      },
      {
        title: "Larger Capacity",
        description:
          "Allowed early electronic computers to store more information than mechanical systems."
      },
      {
        title: "Practical Main Memory",
        description:
          "Became one of the first widely adopted forms of electronic computer memory."
      }
    ],

    description:
      "Drum memory stored information on a rotating metal cylinder coated with magnetic material. A computer waited for the required section of the drum to rotate beneath a read or write head before accessing the data.",

    significance:
      "Drum memory demonstrated that computers could use magnetic materials as practical main memory, but its mechanical delays encouraged engineers to develop faster direct-access technologies.",

    comparisonTitle: "Foundational Technology",

    comparisons: [
      {
        previous: "Mechanical storage methods",
        upgrade: "Magnetic electronic storage"
      },
      {
        previous: "Very limited stored information",
        upgrade: "Significantly larger memory capacity"
      },
      {
        previous: "Manual or mechanical operation",
        upgrade: "Automatic computer-controlled access"
      }
    ]
  },

  {
    name: "Magnetic Core Memory",
    shortName: "Core Memory",
    year: "1951",
    category: "Direct-Access Memory",
    image: magnetic.src,

    features: [
      {
        title: "Direct Access",
        description:
          "Allowed individual memory locations to be accessed without waiting for mechanical movement."
      },
      {
        title: "Non-Volatile",
        description:
          "Retained stored information even after electrical power was removed."
      },
      {
        title: "Greater Reliability",
        description:
          "Provided faster and more dependable operation than rotating drum memory."
      }
    ],

    description:
      "Magnetic core memory used thousands of tiny ferrite rings to represent binary data. The direction of magnetization inside each ring represented either a zero or a one.",

    significance:
      "Core memory became the dominant main-memory technology of the 1950s and 1960s and introduced the direct access of individual memory cells.",

    comparisonTitle: "Drum Memory → Core Memory",

    comparisons: [
      {
        previous: "Waited for a rotating drum",
        upgrade: "Direct access to individual locations"
      },
      {
        previous: "Mechanical access delays",
        upgrade: "Much faster magnetic switching"
      },
      {
        previous: "Dependent on rotating hardware",
        upgrade: "Reliable solid-state magnetic cores"
      }
    ]
  },

  {
    name: "Matrix Core Memory",
    shortName: "Matrix Core",
    year: "1950s–1960s",
    category: "Memory Array",
    image: matrix.src,

    features: [
      {
        title: "Row-and-Column Layout",
        description:
          "Organized magnetic cores into a structured two-dimensional memory grid."
      },
      {
        title: "Improved Scalability",
        description:
          "Made it practical to build larger memory systems containing thousands of cells."
      },
      {
        title: "Simplified Addressing",
        description:
          "Selected memory cells through intersecting horizontal and vertical wires."
      }
    ],

    description:
      "Matrix core memory arranged ferrite rings into horizontal and vertical grids. Activating the correct pair of wires selected a specific memory cell.",

    significance:
      "Its row-and-column organization directly influenced the array-based layout still used by modern semiconductor memory and DRAM chips.",

    comparisonTitle: "Core Memory → Matrix Core",

    comparisons: [
      {
        previous: "Individually arranged memory cores",
        upgrade: "Structured row-and-column arrays"
      },
      {
        previous: "Difficult expansion",
        upgrade: "Scalable memory grids"
      },
      {
        previous: "Complex individual wiring",
        upgrade: "Simplified coordinate-based addressing"
      }
    ]
  },

  {
    name: "Dynamic Random Access Memory",
    shortName: "DRAM",
    year: "1970",
    category: "Semiconductor Memory",
    image: dram.src,

    features: [
      {
        title: "One-Transistor Cell",
        description:
          "Stored one bit using only one transistor and one capacitor."
      },
      {
        title: "Higher Density",
        description:
          "Placed thousands and eventually billions of memory cells on silicon chips."
      },
      {
        title: "Lower Cost",
        description:
          "Reduced manufacturing complexity compared with hand-woven magnetic cores."
      }
    ],

    description:
      "DRAM stores information as tiny electrical charges inside microscopic capacitors. Because these charges leak over time, the memory cells must be refreshed repeatedly while the system is powered.",

    significance:
      "DRAM replaced magnetic core memory and became the architectural foundation of the main memory used in modern computers, laptops, phones, and servers.",

    comparisonTitle: "Matrix Core → DRAM",

    comparisons: [
      {
        previous: "Large magnetic ring arrays",
        upgrade: "Microscopic silicon memory cells"
      },
      {
        previous: "Labor-intensive manufacturing",
        upgrade: "Mass-produced integrated circuits"
      },
      {
        previous: "Limited memory density",
        upgrade: "Thousands of cells per chip"
      }
    ]
  },

  {
    name: "MOS DRAM and EPROM",
    shortName: "MOS / EPROM",
    year: "Early 1970s",
    category: "Integrated Memory",
    image: mos.src,

    features: [
      {
        title: "MOS Fabrication",
        description:
          "Enabled high-density memory through metal-oxide-semiconductor circuits."
      },
      {
        title: "Reduced Cost",
        description:
          "Allowed increasingly large numbers of transistors to be manufactured efficiently."
      },
      {
        title: "Reprogrammable Firmware",
        description:
          "EPROM allowed stored firmware to be erased and programmed again."
      }
    ],

    description:
      "MOS manufacturing made semiconductor memory commercially practical. During the same period, EPROM introduced a reusable form of permanent firmware storage that could be erased using ultraviolet light.",

    significance:
      "MOS technology became the manufacturing foundation of modern DRAM, SRAM, flash memory, solid-state drives, and other semiconductor storage devices.",

    comparisonTitle: "Early DRAM → MOS Memory",

    comparisons: [
      {
        previous: "Early limited semiconductor chips",
        upgrade: "Higher-density MOS integration"
      },
      {
        previous: "Expensive memory production",
        upgrade: "Lower manufacturing cost"
      },
      {
        previous: "Fixed permanent firmware",
        upgrade: "Erasable and reprogrammable EPROM"
      }
    ]
  },

  {
    name: "Synchronous Dynamic RAM",
    shortName: "SDRAM",
    year: "1993",
    category: "Synchronous Memory",
    image: sdram.src,

    features: [
      {
        title: "Clock Synchronization",
        description:
          "Coordinated memory operations directly with the computer system clock."
      },
      {
        title: "Burst Transfers",
        description:
          "Transferred multiple pieces of data through predictable sequences."
      },
      {
        title: "Pipelined Access",
        description:
          "Prepared upcoming operations while earlier memory operations were completing."
      }
    ],

    description:
      "SDRAM synchronized memory activity with the system clock. This allowed the processor, memory controller, and RAM to coordinate operations using predictable clock cycles.",

    significance:
      "SDRAM established the synchronous operating principles that every later DDR memory generation continues to use.",

    comparisonTitle: "Asynchronous DRAM → SDRAM",

    comparisons: [
      {
        previous: "Unpredictable asynchronous timing",
        upgrade: "Operations synchronized to the clock"
      },
      {
        previous: "One isolated request at a time",
        upgrade: "Pipelined and burst transfers"
      },
      {
        previous: "Frequent processor waiting",
        upgrade: "Predictable memory communication"
      }
    ]
  },

  {
    name: "Extended Data Out DRAM",
    shortName: "EDO DRAM",
    year: "1994",
    category: "Efficiency Upgrade",
    image: edo.src,

    features: [
      {
        title: "Overlapping Access",
        description:
          "Prepared the next memory request while the previous data was still transferring."
      },
      {
        title: "Reduced Idle Time",
        description:
          "Shortened waiting periods between consecutive memory operations."
      },
      {
        title: "Compatible Upgrade",
        description:
          "Improved performance without requiring a complete system redesign."
      }
    ],

    description:
      "EDO DRAM improved conventional Fast Page Mode memory by allowing one operation to begin before the previous data transfer had completely finished.",

    significance:
      "EDO DRAM demonstrated how overlapping operations could improve efficiency and helped drive the transition toward fully synchronous memory.",

    comparisonTitle: "FPM DRAM → EDO DRAM",

    comparisons: [
      {
        previous: "Completed one access before the next",
        upgrade: "Overlapped consecutive operations"
      },
      {
        previous: "Long idle periods",
        upgrade: "Reduced waiting between requests"
      },
      {
        previous: "Lower practical throughput",
        upgrade: "Improved memory efficiency"
      }
    ]
  },

  {
    name: "DRDRAM and PSRAM",
    shortName: "DRDRAM / PSRAM",
    year: "Late 1990s",
    category: "Alternative Designs",
    image: drdram.src,

    features: [
      {
        title: "High-Speed Interface",
        description:
          "DRDRAM used a narrow but extremely fast serial communication channel."
      },
      {
        title: "Simplified DRAM Access",
        description:
          "PSRAM automatically handled refresh operations behind an SRAM-like interface."
      },
      {
        title: "Portable Efficiency",
        description:
          "PSRAM offered lower power consumption for embedded and mobile electronics."
      }
    ],

    description:
      "DRDRAM targeted high-performance systems through a high-speed serial interface, while PSRAM combined DRAM density with an easier SRAM-style external interface.",

    significance:
      "RDRAM influenced the industry's pursuit of higher bandwidth, while PSRAM remains useful in embedded systems and power-sensitive portable devices.",

    comparisonTitle: "SDRAM → Alternative Memory",

    comparisons: [
      {
        previous: "Conventional parallel memory bus",
        upgrade: "High-speed serial RDRAM channel"
      },
      {
        previous: "Externally managed DRAM refresh",
        upgrade: "Automatic internal PSRAM refresh"
      },
      {
        previous: "Desktop-focused memory designs",
        upgrade: "Options for portable and embedded systems"
      }
    ]
  },

  {
    name: "DDR SDRAM",
    shortName: "DDR SDRAM",
    year: "2000",
    category: "Double Data Rate",
    image: ddr1.src,

    features: [
      {
        title: "Double Data Rate",
        description:
          "Transferred data on both the rising and falling edges of the clock."
      },
      {
        title: "Higher Bandwidth",
        description:
          "Doubled theoretical throughput without doubling the clock frequency."
      },
      {
        title: "Affordable Transition",
        description:
          "Preserved SDRAM principles while delivering a major performance increase."
      }
    ],

    description:
      "DDR SDRAM transferred data twice during every clock cycle—once on the rising edge and once on the falling edge. This significantly increased bandwidth without requiring the clock frequency itself to double.",

    significance:
      "DDR became the new industry standard and established the evolutionary family that now includes DDR2, DDR3, DDR4, and DDR5.",

    comparisonTitle: "SDRAM → DDR SDRAM",

    comparisons: [
      {
        previous: "One transfer per clock cycle",
        upgrade: "Two transfers per clock cycle"
      },
      {
        previous: "Limited SDRAM bandwidth",
        upgrade: "Approximately doubled throughput"
      },
      {
        previous: "Slower CPU-memory communication",
        upgrade: "Faster delivery of processor data"
      }
    ]
  },

  {
    name: "DDR2 SDRAM",
    shortName: "DDR2 SDRAM",
    year: "2003",
    category: "Faster and More Efficient",
    image: ddr2.src,

    features: [
      {
        title: "Higher Transfer Rates",
        description:
          "Used faster internal operation and wider prefetch buffers."
      },
      {
        title: "Lower Voltage",
        description:
          "Reduced electrical consumption and heat compared with original DDR."
      },
      {
        title: "Larger Capacity",
        description:
          "Supported denser modules for demanding operating systems and applications."
      }
    ],

    description:
      "DDR2 increased memory bandwidth through higher internal frequencies and larger prefetch buffers while operating at a lower voltage than original DDR.",

    significance:
      "DDR2 showed that memory development would increasingly balance transfer speed, energy efficiency, module capacity, and thermal performance.",

    comparisonTitle: "DDR → DDR2",

    comparisons: [
      {
        previous: "Smaller prefetch buffer",
        upgrade: "Larger four-bit prefetch architecture"
      },
      {
        previous: "Higher operating voltage",
        upgrade: "Reduced voltage and heat"
      },
      {
        previous: "Lower module capacity",
        upgrade: "Denser and larger memory modules"
      }
    ]
  },

  {
    name: "DDR3 SDRAM",
    shortName: "DDR3 SDRAM",
    year: "2007",
    category: "Modern Computing",
    image: ddr3.src,

    features: [
      {
        title: "Greater Bandwidth",
        description:
          "Delivered substantially faster transfer rates than DDR2."
      },
      {
        title: "Improved Efficiency",
        description:
          "Lowered operating voltage for reduced power consumption."
      },
      {
        title: "Higher Capacity",
        description:
          "Supported larger modules for gaming, multimedia, and virtualization."
      }
    ],

    description:
      "DDR3 increased memory bandwidth and module capacity while lowering voltage further. It supported demanding workloads such as high-definition media, virtualization, content creation, and modern gaming.",

    significance:
      "DDR3 became one of the longest-lasting consumer memory standards because it combined high performance, affordability, and reliability.",

    comparisonTitle: "DDR2 → DDR3",

    comparisons: [
      {
        previous: "Four-bit prefetch buffer",
        upgrade: "Eight-bit prefetch architecture"
      },
      {
        previous: "Higher DDR2 voltage",
        upgrade: "Lower power consumption"
      },
      {
        previous: "Mid-2000s bandwidth limits",
        upgrade: "Support for modern high-demand software"
      }
    ]
  },

  {
    name: "DDR4 SDRAM",
    shortName: "DDR4 SDRAM",
    year: "2014",
    category: "High-Density Memory",
    image: ddr4.src,

    features: [
      {
        title: "Bank Groups",
        description:
          "Improved parallel memory access and burst efficiency."
      },
      {
        title: "Lower Power",
        description:
          "Reduced standard operating voltage to approximately 1.2 volts."
      },
      {
        title: "Greater Density",
        description:
          "Supported higher-capacity modules and faster data transfer rates."
      }
    ],

    description:
      "DDR4 introduced architectural bank groups, lower operating voltage, and substantially higher module density. These improvements supported modern consumer computers and high-density servers.",

    significance:
      "DDR4 became the dominant memory standard for modern PCs and data centers, enabling larger workloads while improving thermal and energy efficiency.",

    comparisonTitle: "DDR3 → DDR4",

    comparisons: [
      {
        previous: "Traditional bank organization",
        upgrade: "Parallel bank-group architecture"
      },
      {
        previous: "Higher DDR3 voltage",
        upgrade: "Lower 1.2-volt operation"
      },
      {
        previous: "Lower module density",
        upgrade: "Much larger memory capacities"
      }
    ]
  },

  {
    name: "DDR5 SDRAM",
    shortName: "DDR5 SDRAM",
    year: "2020+",
    category: "Next-Generation Memory",
    image: ddr5.src,

    features: [
      {
        title: "Dual Subchannels",
        description:
          "Split each module into two independent channels for greater efficiency."
      },
      {
        title: "On-Module Power",
        description:
          "Moved power management directly onto the memory module."
      },
      {
        title: "On-Die ECC",
        description:
          "Added internal error correction for reliable high-speed operation."
      }
    ],

    description:
      "DDR5 was designed for increasingly demanding multi-core processors, cloud computing, artificial intelligence, and data-intensive workloads. It provides significantly higher bandwidth while changing how power delivery and internal reliability are managed.",

    significance:
      "DDR5 represents a major architectural step beyond DDR4 and prepares system memory for extremely high bandwidth, capacity, and reliability requirements.",

    comparisonTitle: "DDR4 → DDR5",

    comparisons: [
      {
        previous: "One 64-bit channel per module",
        upgrade: "Two independent 32-bit subchannels"
      },
      {
        previous: "Motherboard-managed power",
        upgrade: "On-module power management"
      },
      {
        previous: "Limited internal correction",
        upgrade: "Integrated on-die error correction"
      }
    ]
  }
];


export default function EvolutionLogic() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const timelineRef = useRef(null);
  const hasMountedRef = useRef(false);

  const currentGeneration = ramData[currentIndex];

  useEffect(() => {
    /*
     * Skip the first render so the timeline does not pull
     * the entire webpage down to Section 2 on initial load.
     */
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    const activeCard = timeline.querySelector(
      `[data-generation-index="${currentIndex}"]`
    );

    if (!activeCard) {
      return;
    }

    /*
     * Scroll only the horizontal timeline container.
     * Using scrollIntoView here can also move the main page vertically.
     */
    const targetScrollLeft =
      activeCard.offsetLeft -
      timeline.clientWidth / 2 +
      activeCard.clientWidth / 2;

    timeline.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth"
    });
  }, [currentIndex]);

  const selectGeneration = (index) => {
    if (index < 0 || index >= ramData.length) {
      return;
    }

    setCurrentIndex(index);
  };


  const showPrevious = () => {
    selectGeneration(currentIndex - 1);
  };

  const showNext = () => {
    selectGeneration(currentIndex + 1);
  };

  
  const scrollTimeline = (direction) => {
    const timeline = timelineRef.current;

    if (!timeline) {
      return;
    }

    const firstCard =
      timeline.querySelector(".evolution-card");

    const cardWidth =
      firstCard?.getBoundingClientRect().width || 120;

    
    const scrollDistance = cardWidth * 3;

    timeline.scrollBy({
      left:
        direction === "left"
          ? -scrollDistance
          : scrollDistance,
      behavior: "smooth"
    });
  };

  const scrollTimelineLeft = () => {
    scrollTimeline("left");
  };

  const scrollTimelineRight = () => {
    scrollTimeline("right");
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }
  };

  return (
    <section
      className="evolution-section"
      onKeyDown={handleKeyDown}
    >
      {/* Background HUD */}
      <div
        className="evolution-hud-background"
        aria-hidden="true"
      >
        <div className="evolution-grid"></div>

        <div className="evolution-background-glow"></div>

        <div className="evolution-outer-frame"></div>
      </div>

      {/* Header */}
      <header className="evolution-header">
        <div className="evolution-section-marker">
          <span className="evolution-marker-dots"></span>

          <span>SECTION 02</span>

          <span className="evolution-marker-dots"></span>
        </div>

        <h2 className="glow-title">
          THE EVOLUTION OF RAM
        </h2>

        <p>
          COMPUTER MEMORY THROUGH TIME
        </p>
      </header>

      {/* Main content */}
      <div
        className="evolution-main"
        key={`generation-${currentIndex}`}
      >
        {/* Left feature panel */}
        <aside className="evolution-info-panel">
          <div className="evolution-panel-heading">
            <span
              className="evolution-panel-heading-icon"
              aria-hidden="true"
            >
              ◇
            </span>

            <span>GENERATION</span>
          </div>

          <h3 className="evolution-name">
            {currentGeneration.name}
          </h3>

          <div className="evolution-generation-meta">
            <span>{currentGeneration.year}</span>

            <span>{currentGeneration.category}</span>
          </div>

          <div className="evolution-features">
            {currentGeneration.features.map(
              (feature) => (
                <article
                  className="evolution-feature evolution-feature-no-icon"
                  key={`${currentGeneration.name}-${feature.title}`}
                >
                  <div className="evolution-feature-copy">
                    <h4>
                      {feature.title}
                    </h4>

                    <p>
                      {feature.description}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </aside>

        {/* Center column */}
        <div className="evolution-center-column">
          {/* Main visual */}
          <div className="evolution-visual">
            <div
              className="evolution-reticle"
              aria-hidden="true"
            ></div>

            <div
              className="evolution-target-frame"
              aria-hidden="true"
            ></div>

            <div
              className="evolution-light-beams"
              aria-hidden="true"
            ></div>

            {/* Changes the active generation */}
            <button
              type="button"
              className="evolution-arrow evolution-arrow-left"
              aria-label="Show previous memory generation"
              onClick={showPrevious}
              disabled={currentIndex === 0}
            >
              <span aria-hidden="true">
                ‹
              </span>
            </button>

            <div className="evolution-image-stage">
              <img
                className="evolution-image"
                src={currentGeneration.image}
                alt={`${currentGeneration.name} memory technology`}
              />

            </div>

            {/* Changes the active generation */}
            <button
              type="button"
              className="evolution-arrow evolution-arrow-right"
              aria-label="Show next memory generation"
              onClick={showNext}
              disabled={
                currentIndex === ramData.length - 1
              }
            >
              <span aria-hidden="true">
                ›
              </span>
            </button>
          </div>

          {/* Generation comparison */}
          <section className="evolution-comparison">
            <div className="evolution-comparison-heading">
              <span
                className="evolution-comparison-stripes"
                aria-hidden="true"
              ></span>

              <span>
                GENERATION COMPARISON
              </span>

              <span
                className="evolution-comparison-stripes"
                aria-hidden="true"
              ></span>
            </div>

            <div className="evolution-comparison-subheading">
              <span>
                {currentGeneration.comparisonTitle}
              </span>

              <span>
                {currentGeneration.shortName} UPGRADE
              </span>
            </div>

            <div className="evolution-comparison-list">
              {currentGeneration.comparisons.map(
                (comparison, index) => (
                  <div
                    className="evolution-comparison-row"
                    style={{
                      "--comparison-delay":
                        `${index * 90}ms`
                    }}
                    key={`${comparison.previous}-${comparison.upgrade}`}
                  >
                    <div className="evolution-previous-feature">
                      <span>
                        PREVIOUS
                      </span>

                      <p>
                        {comparison.previous}
                      </p>
                    </div>

                    <div
                      className="evolution-upgrade-arrow"
                      aria-hidden="true"
                    >
                      <span>
                        →
                      </span>
                    </div>

                    <div className="evolution-current-upgrade">
                      <span>
                        UPGRADE
                      </span>

                      <p>
                        {comparison.upgrade}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        {/* Right description panel */}
        <aside className="evolution-description-panel">
          <section className="evolution-description-block">
            <div className="evolution-panel-heading">
              <span
                className="evolution-panel-heading-icon"
                aria-hidden="true"
              >
                ▣
              </span>

              <span>
                DESCRIPTION
              </span>
            </div>

            <p>
              {currentGeneration.description}
            </p>
          </section>

          <section className="evolution-significance-block">
            <div className="evolution-significance-heading">
              <span>
                HISTORICAL SIGNIFICANCE
              </span>
            </div>

            <p>
              {currentGeneration.significance}
            </p>
          </section>
        </aside>
      </div>

      {/* Bottom generation timeline */}
      <nav
        className="evolution-timeline"
        aria-label="RAM evolution timeline"
      >
     
        <button
          type="button"
          className="evolution-timeline-arrow evolution-timeline-arrow-left"
          onClick={scrollTimelineLeft}
          aria-label="Scroll generation timeline left"
        >
          <span aria-hidden="true">
            ‹
          </span>
        </button>

        <div
          className="evolution-track"
          ref={timelineRef}
        >
          {ramData.map((generation, index) => (
            <button
              type="button"
              className={`evolution-card ${
                index === currentIndex
                  ? "active"
                  : ""
              }`}
              data-generation-index={index}
              aria-current={
                index === currentIndex
                  ? "true"
                  : undefined
              }
              onClick={() => selectGeneration(index)}
              key={`${generation.name}-${generation.year}`}
            >
              <span className="evolution-card-year">
                {generation.year}
              </span>

              <span className="evolution-card-image-wrap">
                <img
                  src={generation.image}
                  alt=""
                  aria-hidden="true"
                />
              </span>

              <strong>
                {generation.shortName}
              </strong>
            </button>
          ))}
        </div>


        <button
          type="button"
          className="evolution-timeline-arrow evolution-timeline-arrow-right"
          onClick={scrollTimelineRight}
          aria-label="Scroll generation timeline right"
        >
          <span aria-hidden="true">
            ›
          </span>
        </button>
      </nav>

    </section>
  );
}