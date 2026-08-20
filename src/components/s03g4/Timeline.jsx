import { useState, useEffect, useCallback } from "react";
import "../../styles/s03g4/timeline.css";

import IC from "../../assets/s03g4/IC.webp";
import AGC from "../../assets/s03g4/AGC.webp";
import imp from "../../assets/s03g4/imp.webp";
import Philco from "../../assets/s03g4/Philco.webp";
import apollo11 from "../../assets/s03g4/apollo11.webp";
import moonlanding from "../../assets/s03g4/moonlanding.webp";
import spaceBg from '../../assets/s03g4/innovations-bg.webp';

export default function Timeline() {
  const events = [
    {
      year: "1961",
      title: "The Rise of Integrated Circuits",
      image: IC.src,
      description:
        "By the early 1960s, computers were large, heavy, and built from thousands of individual electronic parts called transistors. A new invention called the integrated circuit (IC) could combine several components into a single, much smaller chip. Although these early chips were expensive and still unproven, their small size and low power consumption made them ideal for spacecraft, where every gram of weight and every watt of power mattered. In 1961, engineers demonstrated that hundreds of integrated circuits could replace thousands of separate electronic components, proving that compact computers were possible. This breakthrough convinced engineers that integrated circuits could make space computers smaller, lighter, and more reliable. This was an important step toward the Apollo Guidance Computer."
    },

    {
      year: "1962",
      title: "AGC Development Starts",
      image: AGC.src, 
      description:
        "In 1962, the MIT Instrumentation Laboratory began designing the Apollo Guidance Computer (AGC). The AGC would become one of the first computers built almost entirely with integrated circuits, using about 4,000 logic chips. Not everyone believed this was the right decision. Since integrated circuits were still new technology, engineers from Bellcomm and members of the U.S. Congress questioned whether the computer would be reliable enough to safely take astronauts to the Moon. Some even suggested using a different computer made by International Business Machines Corporation (IBM), which relied on older but better-tested technology. Despite these concerns, NASA continued with MIT's design. The success of the Apollo Guidance Computer would later prove that integrated circuits were reliable enough for one of history's most ambitious space missions. NASA's decision helped prove that integrated circuits could be trusted in critical missions, paving the way for modern computers, smartphones, and spacecraft."
    },
        
    {
      year: "1963",
      title: "Proving Integrated Circuits for Space",
      image: imp.src,
      description:
        "Although integrated circuits were still a new technology, they quickly proved their value in aerospace applications. In 1963, NASA's Interplanetary Monitoring Probe (IMP) became the first spacecraft to carry integrated circuits into orbit. Around the same time, engineers developing the Apollo Guidance Computer continued working closely with manufacturers to improve the reliability of the Fairchild Micrologic chips used in the AGC. These successes demonstrated that integrated circuits could survive the harsh conditions of space, which strengthed NASA's confidence in using them for future crewed lunar missions."
    },

    {
      year: "1965",
      title: "The Apollo Program Drives the Chip Industry",
      image: Philco.src,
      description:
        "By 1965, the Apollo Guidance Computer had become the world's largest customer of integrated circuits, using approximately 4,000 logic chips in every computer. The large demand encouraged manufacturers such as Fairchild Semiconductor and Philco-Ford to improve production quality and reliability. In the same year, engineer Gordon Moore published his observation that the number of components on integrated circuits would increase rapidly over time. This prediction later became known as Moore's Law. Apollo's investment helped accelerate the growth of the semiconductor industry that would eventually give rise to Silicon Valley."
    },

    {
      year: "1969",
      title: "Apollo 11 Lands on the Moon",
      image: apollo11.src,
      description:
        "On July 20, 1969, the Apollo Guidance Computer guided the Lunar Module Eagle during its historic descent to the Moon. During landing, the computer displayed several 1201 and 1202 program alarms after becoming overloaded with incoming data. Instead of failing, the AGC's software prioritized critical landing tasks while temporarily delaying less important work. This intelligent design allowed Neil Armstrong and Buzz Aldrin to land safely in the Sea of Tranquility, making the Apollo Guidance Computer one of the most successful and reliable computers ever built."
    },

    {
      year: "1972",
      title: "Apollo 17 and the AGC's Legacy",
      image: moonlanding.src,
      description:
        "Apollo 17, launched in December 1972, became the final lunar landing mission of the Apollo program. The Apollo Guidance Computer once again guided astronauts during lunar landing, surface exploration, and the journey back to Earth. After more than a decade of development and successful missions, the AGC had demonstrated that integrated circuits were reliable enough for the most demanding space missions. Its success helped establish integrated circuits as the foundation of modern computers, smartphones, medical devices, and countless embedded systems used today."
    },
  ];

  useEffect(() => {
    document.documentElement.style.setProperty('--custom-html-bg', `url("${spaceBg.src}")`);
    return () => {
      document.documentElement.style.removeProperty('--custom-html-bg');
    };
  }, []);

  const [current, setCurrent] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrent((prev) => Math.min(events.length - 1, prev + 1));
  }, [events.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  const progressPercent = events.length > 1 ? (current / (events.length - 1)) * 100 : 0;

  return (
    <div className="timeline-container">
       
      <div className="timeline-carousel-wrapper" aria-roledescription="carousel">
        
        {/* rocket and moon*/}
        <div className="timeline-progress-track">
          <div 
            className="timeline-progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>

          <div 
            className="timeline-rocket-indicator"
            style={{ left: `${progressPercent}%` }}
            title={`Current: ${events[current].year}`}
          >
            🚀
          </div>

          {events.map((item, index) => {
            const isLast = index === events.length - 1;
            const nodeLeft = events.length > 1 ? (index / (events.length - 1)) * 100 : 50;

            return (
              <button
                key={`node-${index}`}
                onClick={() => setCurrent(index)}
                className={`timeline-progress-node ${index <= current ? 'node-active' : ''} ${isLast ? 'node-moon' : ''}`}
                style={{ left: `${nodeLeft}%` }}
                aria-label={`Jump to year ${item.year}: ${item.title}`}
              >
                {isLast && <span className="moon-icon">🌕</span>}
              </button>
            );
          })}
        </div>

        {/*axis line*/}
        <div className="timeline-axis-line"></div>

        <div className="timeline-carousel">
          {events.map((item, index) => {
            let cardPosition = "card-hidden";
            let onClickHandler = null;
            
            if (index === current) {
              cardPosition = "card-active";
            } else if (index === current + 1) {
              cardPosition = "card-next";
              onClickHandler = handleNext;
            } else if (index === current - 1) {
              cardPosition = "card-prev";
              onClickHandler = handlePrev;
            }

            return (
              <div 
                key={index} 
                className={`timeline-card ${cardPosition}`}
                onClick={onClickHandler}
                role={onClickHandler ? "button" : "presentation"}
                tabIndex={onClickHandler ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onClickHandler) onClickHandler();
                }}
              >
                <div className="card-year-header">{item.year}</div>
                <div className="card-image-frame">
                  <img src={item.image} alt={`Historical photograph for ${item.title}`} />
                  <div className="wireframe-cross"></div>
                </div>
              </div>
            );
          })}
        </div>

        {current > 0 && (
          <button className="nav-arrow arrow-left" onClick={handlePrev} aria-label="Previous event">
            ←
          </button>
        )}
        {current < events.length - 1 && (
          <button className="nav-arrow arrow-right" onClick={handleNext} aria-label="Next event">
            →
          </button>
        )}
      </div>

      <div className="timeline-details-panel" aria-live="polite">
        <h2 className="details-title">
          <span className="agc-accent">{events[current].year}</span> — {events[current].title}
        </h2>
        <p className="details-text">{events[current].description}</p>
        
        <div className="back-button-container">
          <button 
            className="agc-cardButton" 
            onClick={() => window.history.back()}
          >
            ← Return to Home Page
          </button>
        </div>
      </div>

    </div>
  );
}