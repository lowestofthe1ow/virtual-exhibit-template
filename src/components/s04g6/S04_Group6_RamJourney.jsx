import cpuImg from '../../assets/s04g6/S04_Group6_InsideRAMImg/cpuImg.webp';
import monitor from '../../assets/s04g6/S04_Group6_InsideRAMImg/monitor.webp';
import pokeball from '../../assets/s04g6/S04_Group6_InsideRAMImg/pokeball.webp';
import pokemonMini from '../../assets/s04g6/S04_Group6_InsideRAMImg/S04_Group6_pokemon-mini.webp';
import ashImg from "../../assets/s04g6/S04_Group6_InsideRAMImg/ash.webp";
import { useState, useEffect } from "react";

export default function RamJourney() {
  const stepsData = [
    {
      title: " CPU REQUEST",
      guide:
        "Hey, Trainer! Click the glowing CPU to request Pikachu's data and begin the mission!",
      desc:
        "The CPU executes application code to load Pikachu's assets. After checking L1–L3 cache lines and encountering a cache miss, the Integrated Memory Controller (IMC) issues a physical memory read request across the system bus.",
      target: "cpu",
      hint: "Click the glowing CPU to send a memory request."
    },

    {
      title: " SYSTEM RAM FETCH",
      guide:
        "Great job! Now RAM has to find Pikachu's battle stats. Click the RAM module so it can retrieve the requested data.",
      desc:
        "The read command reaches System RAM. The physical memory address is decoded into RAS (Row Address Strobe) and CAS (Column Address Strobe). The row decoder activates the target wordline, allowing sense amplifiers to read Pikachu's raw data into the buffer.",
      target: "ram",
      hint: "Click the RAM module to fetch Pikachu's data."
    },

    {
      title: " CPU PROCESSING",
      guide:
        "Awesome! Pikachu's data is back. The CPU now processes it into graphics commands. Click the CPU again!",
      desc:
        "The CPU loads Pikachu’s stats into registers to process game logic (like damage calculations). The graphics driver then translates this data into API commands (DirectX/Vulkan) and packages them into an executable GPU Command Buffer.",
      target: "cpu",
      hint: "Click the CPU to process the retrieved data."
    },

    {
      title: " PCI EXPRESS TRANSPORT",
      guide:
        "Perfect! Now let's send Pikachu's processed data to the graphics card. Click the RAM/VRAM area to transfer everything through PCI Express.",
      desc:
        "The CPU initiates a Direct Memory Access (DMA) transfer over PCIe lanes. Command buffers, vertex geometry, and Pikachu’s texture maps stream directly into dedicated VRAM, bypassing software overhead.",
      target: "ram",
      hint: "Transfer the processed data into VRAM."
    },

    {
      title: " GPU EXECUTION",
      guide:
        "The GPU is ready! Click the graphics processor so it can begin rendering Pikachu using thousands of parallel cores.",
      desc:
        "The GPU’s Command Processor parses the incoming VRAM buffer and dispatches workload across parallel compute units. Vertex Shaders calculate Pikachu’s geometry, while Fragment Shaders color and shade the pixels.",
      target: "ram",
      hint: "The GPU begins rendering Pikachu's frame."
    },

    {
      title: " PAGE FLIPPING",
      guide:
        "We're almost there! The frame is complete. Click again so the Back Buffer becomes the Front Buffer, preparing Pikachu for display.",
      desc:
        "Once rendering completes in the off-screen Back Buffer, the system synchronizes with the display refresh rate (VSync). A pointer swap (page flip) instantly promotes the Back Buffer to the active Front Buffer to prevent screen tearing.",
      target: "ram",
      hint: "Complete the page flip."
    },

    {
      title: " SIGNAL GENERATION",
      guide:
        "Excellent! The GPU is converting every pixel into a video signal. Click the monitor to send the finished image.",
      desc:
        "The GPU's Display Engine reads pixel data row-by-row from the Front Buffer in VRAM. It serializes RGB color bytes into high-speed differential signal streams (like TMDS for HDMI or Main Link for DisplayPort).",
      target: "screen",
      hint: "Send the completed frame to the monitor."
    },

    {
      title: " SCREEN DISPLAY",
      guide:
        "Mission complete, Trainer! Click the monitor one last time to reveal Pikachu on the screen. We did it!",
      desc:
        "The monitor's Timing Controller (TCON) decodes the incoming differential bitstream into voltage commands. These signals drive individual pixel transistors on the panel to illuminate Pikachu’s sprite on screen!",
      target: "screen",
      hint: "Reveal Pikachu on the display."
    }
  ];


const [ashTalking, setAshTalking] = useState(false);
const [started, setStarted] = useState(false);
const [currentStep, setCurrentStep] = useState(0);
const [missionComplete, setMissionComplete] = useState(false);

/* MISSION COMPLETE SCREEN*/
const [journeyFinished, setJourneyFinished] = useState(false);

const [typedGuide, setTypedGuide] = useState("");

useEffect(() => {
    setAshTalking(true);

    const timer = setTimeout(() => {
        setAshTalking(false);
    }, 600);

    return () => clearTimeout(timer);
}, [currentStep]);


  /* typewriter animation */
  useEffect(() => {
    const fullText = stepsData[currentStep].guide;
    setTypedGuide("");

    let i = 0;
    const typingSpeed = 22; // ms per character — lower = faster

    const interval = setInterval(() => {
      i++;
      setTypedGuide(fullText.slice(0, i));

      if (i >= fullText.length) {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [currentStep]);
  
  const handleComponentClick = (component) => {
    if (
      component === stepsData[currentStep].target &&
      !missionComplete
    ) {
      setMissionComplete(true);
    }
  };


  /* RESTART JOURNEY */
  const handleRestartJourney = () => {
    setCurrentStep(0);
    setMissionComplete(false);
    setJourneyFinished(false);
  };


  /* PROGRESS BAR */
  const progressPercent = Math.round(
    ((currentStep + (missionComplete ? 1 : 0)) / stepsData.length) * 100
  );


  const getPacketPosition = () => {
  const target = stepsData[currentStep].target;

  if (target === "cpu") return "packet-cpu";
  if (target === "ram") return "packet-ram";

  return "packet-screen";
};

  return (
    <div className="ram-journey-wrapper">
      {/* ================= INTRO ================= */}
      {!started && (
        <div className="journey-intro">

          <img
            src={pokemonMini.src}
            alt="Pikachu"
            className="intro-pikachu"
          />

                <button
        className="start-btn"
        onClick={() => {
          setStarted(true);

          document
            .getElementById("switch-container")
            ?.classList.add("journey-started");
        }}
      >
        START JOURNEY ▶
      </button>

        </div>
      )}

      {/* ================= JOURNEY ================= */}
      {started && (
        <div className="ram-journey-hud">

          {/* HEADER */}
          <div className="ram-journey-header">

            <div className="ram-journey-mission">
              <img
                src={pokeball.src}
                alt=""
                className="pokeball-icon"
              />
              MISSION: LOAD PIKACHU DATA
            </div>

            <div className="ram-journey-counter">
              STEP {currentStep + 1} / {stepsData.length}
            </div>

          </div>


          {/* PROGRESS BAR */}
          <div className="ram-journey-progress">
            <div className="ram-journey-progress-track">
              <div
                className="ram-journey-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="ram-journey-progress-label">
              {progressPercent}%
            </span>
          </div>



          {journeyFinished ? (
            /* ================= MISSION COMPLETE ================= */
            <div className="ram-journey-complete">
              <img
                src={pokemonMini.src}
                alt="Pikachu"
                className="complete-pikachu"
              />

              <h2 className="complete-title">MISSION COMPLETE!</h2>

              <p className="complete-text">
                You successfully guided Pikachu's data all the way from
                the CPU request to the screen display. Great work, Trainer!
              </p>

              <button
                className="restart-btn"
                onClick={handleRestartJourney}
              >
                ⟲ RESTART JOURNEY
              </button>
            </div>
          ) : (
            <>
              {/* TRACKER */}
              <div className="ram-journey-tracker">

                {stepsData.map((_, index) => {

                  let stepClass = "ram-journey-step";

                  if (index === currentStep)
                    stepClass += " active";

                  else if (index < currentStep)
                    stepClass += " completed";

                  return (
                    <div
                      key={index}
                      className={stepClass}
                      onClick={() => {
                        if (index <= currentStep) {
                          setCurrentStep(index);
                          setMissionComplete(false);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="number">
                        {index + 1}
                      </div>
                    </div>
                  );

                })}

              </div>

             {/* BODY */}
    <div className="ram-journey-body">

      {/* LEFT PANEL */}
      <div className="ram-journey-info">

        {/* ASH GUIDE */}
        <div className="ram-journey-guide">

          <img
            src={ashImg.src}
        alt="Ash Ketchum"
        className={`ash-avatar ${ashTalking ? "talk" : ""}`}
          />

          <div className="ash-dialogue">

            <div className="ash-name">
              ASH KETCHUM
            </div>

            <p className="ash-guide-text">
              {typedGuide}
              <span className="ash-cursor">▌</span>
            </p>

          </div>

        </div>

        {/* STEP INFO */}
    <div className="step-info">

      <div className="step-badge">
        STEP {currentStep + 1}
      </div>

      <div className="status-line">
        <span className="status-label">
          STATUS:  
        </span>

        <span className="status-value">
          {stepsData[currentStep].title}
        </span>
      </div>

      <p className="desc">
        {stepsData[currentStep].desc}
      </p>

    </div>

      </div>

                {/* RIGHT PANEL */}

                <div className="ram-journey-visual">

                  <div className="ram-journey-visual-labels">
                    <span>CPU</span>
                    <span>RAM MODULE</span>
                    <span>SCREEN</span>
                  </div>

                  <div className="ram-journey-track">

                    {/* CPU */}

                    <div
                      className={`ram-journey-cpu ${stepsData[currentStep].target === "cpu" &&
                        !missionComplete
                        ? "mission-target"
                        : ""
                        }`}
                      onClick={() =>
                        handleComponentClick("cpu")
                      }
                    >

                      <img
                        src={cpuImg.src}
                        alt="CPU"
                        className="cpu-pika"
                      />

                    </div>

                    {/* RAM */}

                    <div
                      className={`ram-journey-chips ${stepsData[currentStep].target === "ram" &&
                        !missionComplete
                        ? "mission-target"
                        : ""
                        }`}
                      onClick={() =>
                        handleComponentClick("ram")
                      }
                    >

                      {stepsData.map((_, index) => (
                        <div
                          key={index}
                          className={`ram-journey-chip ${currentStep >= index
                            ? "active"
                            : ""
                            }`}
                        />
                      ))}

                    </div>

                    {/* SCREEN */}

                    <div
                      className={`ram-journey-screen
                      ${currentStep === 7 ? "loaded" : ""}
                      ${currentStep === 7 &&
                          missionComplete
                          ? "screen-finished"
                          : ""
                        }
                      ${stepsData[currentStep].target ===
                          "screen" &&
                          !missionComplete
                          ? "mission-target"
                          : ""
                        }`}
                      onClick={() =>
                        handleComponentClick("screen")
                      }
                    >

                      <img
                        src={monitor.src}
                        alt="Screen"
                        className="cpu-pika"
                      />

                    </div>

                    {/* PACKET */}

                    {!(currentStep === 7 && missionComplete) && (
                      <div
                        className={`ram-journey-packet show ${getPacketPosition()}`}
                      >
                        <img
                          src={pokemonMini.src}
                          alt="Pokemon Data"
                        />
                      </div>
                    )}

                  </div>

                  {/* HINT */}

                  <div className="ram-journey-hint">

                    {missionComplete
                      ? `✓ ${stepsData[currentStep].title} completed`
                      : stepsData[currentStep].target ===
                        "cpu"
                        ? "Awaiting CPU activation..."
                        : stepsData[currentStep].target ===
                          "ram"
                          ? "Awaiting memory response..."
                          : "Awaiting display initialization..."}

                  </div>

                  {/* CONTROLS */}

                  <div className="ram-journey-controls">

                    <button
                      disabled={currentStep === 0}
                      onClick={() => {
                        setCurrentStep((s) =>
                          Math.max(0, s - 1)
                        );
                        setMissionComplete(false);
                      }}
                    >
                      ◀ BACK
                    </button>

                    <button
                      className="primary"
                      disabled={!missionComplete}
                      onClick={() => {
                        if (currentStep === stepsData.length - 1) {
                          setJourneyFinished(true);
                        } else {
                          setCurrentStep((s) =>
                            Math.min(
                              stepsData.length - 1,
                              s + 1
                            )
                          );
                          setMissionComplete(false);
                        }
                      }}
                    >
                      {currentStep === stepsData.length - 1
                        ? "FINISH ✔"
                        : "NEXT ▶"}
                    </button>

                  </div>

                </div>

              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}