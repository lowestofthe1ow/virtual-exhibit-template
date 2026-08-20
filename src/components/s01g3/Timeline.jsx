import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useRef, useState, useEffect } from 'react';
import '../../styles/s01g3/wifi.css'; 

/* Content constants for individual timeline modals */
const modalContent1 = "This was the original blueprint for wireless networking. It established the foundational architecture for Wi-Fi but was incredibly slow by modern standards. It utilized two primary spread-spectrum technologies to transmit data: Frequency Hopping Spread Spectrum (FHSS) and Direct Sequence Spread Spectrum (DSSS). Because of its low speeds and limited range, it was mostly used in specialized industrial applications rather than commercial or home environments."
const modalContent2a = "This was the version that made Wi-Fi popular. It was affordable and fast enough for everyday use, like browsing the web and sending files. Its downside was that it used a busy radio channel, the same one used by cordless phones, microwave ovens, and Bluetooth devices, so it could suffer from interference and slowdowns when those devices were nearby."
const modalContent2b = "This version was much faster than 802.11b and used a quieter radio channel with less interference. The tradeoff was range, the signal didn't travel as far or pass through walls as well. It also couldn't connect with 802.11b devices since they used different bands, so it was mostly used in offices and businesses rather than homes."
const modalContent3 = "This version combined the best of both earlier standards, the speed of 802.11a with the wider range and lower cost of 802.11b's band. It could also work with older 802.11b devices. This combination made it the first Wi-Fi standard good enough for widespread, everyday use in homes and businesses."
const modalContent4 = "Wi-Fi 4 was the first standard branded with a generation number by the Wi-Fi Alliance and the first considered fully ready for mainstream commercial use. It marked a major jump in both speed and reliability by introducing multiple antennas and wider channels, and it was the first standard to officially support both the 2.4 GHz and 5 GHz bands."
const modalContent5 = "Wi-Fi 5 delivered the largest single speed increase in Wi-Fi's history, moving exclusively to the 5 GHz band to take advantage of wider channels and less interference. It was the first generation built with home entertainment and high-definition streaming in mind."
const modalContent6 = "Wi-Fi 6's focus shifted away from chasing higher peak speeds and toward efficiency — making networks handle many connected devices smoothly at once, which had become the real bottleneck in homes and offices full of phones, laptops, and smart devices. Wi-Fi 6E later extended the same technology into the brand-new 6 GHz band, opened by the FCC in April 2020."
const modalContent7 = "Wi-Fi 7, also called Extremely High Throughput (EHT), is a major generation of the wireless standard. Its defining architectural breakthrough is that a device is no longer limited to utilizing one frequency band at a time. Instead, it can aggregate multiple bands simultaneously to dramatically increase capacity and reduce latency, satisfying highly demanding modern applications like 8K video streaming, real-time virtual/augmented reality (XR), and cloud gaming."

/* Main database array for chronological timeline populating */
const TIMELINE_DATA = [
  {
    id: "wifi_1",
    themeClass: "wifi_1", 
    date: "1997",
    title: "802.11",
    description: "Original blueprint for wireless networking",
    modalContent: modalContent1,
    improvements: "As the pioneer of wireless networking, this standard successfully cut the physical cord by establishing the first standardized framework for Wireless Local Area Networks (WLANs). It introduced the fundamental architecture that allowed devices to dynamically discover, authenticate, and connect to a central access point.",
    limitations: "One of the major drawbacks of this Wi-Fi standard was its maximum speed of only 2 Mbps, which was too slow to support activities beyond simple text-based data transfers and basic internet use. Another major limitation was that devices using Frequency-Hopping Spread Spectrum (FHSS) could not communicate with devices using Direct-Sequence Spread Spectrum (DSSS) because these were two different wireless transmission methods that were not compatible with each other. As a result, devices from different manufacturers often could not connect, leading to market fragmentation and interoperability issues."
  },
  {
    id: "wifi_2a",
    themeClass: "wifi_2a", 
    date: "1999",
    title: "802.11b",
    description: "Made Wi-Fi popular",
    modalContent: modalContent2a,
    improvements: "This Wi-Fi standard significantly improved wireless networking by increasing the maximum speed from 2 Mbps to 11 Mbps through the use of High-Rate Direct Sequence Spread Spectrum (HR-DSSS). HR-DSSS achieved these higher speeds by using Complementary Code Keying (CCK), a more efficient data encoding technique that allowed more information to be transmitted within the same bandwidth. As a result, users experienced faster web browsing, quicker file transfers, and more reliable wireless connections. These improvements also made Wi-Fi practical and affordable for everyday home and office use. ",
    limitations: " Since this standard operated entirely on the 2.4 GHz frequency band, it often experienced interference from common household devices such as microwave ovens, cordless phones, and baby monitors, which also used the same frequency. This interference weakened the wireless signal and caused slower speeds, unstable connections, and occasional data loss. "
  },
  {
    id: "wifi_2b",
    themeClass: "wifi_2b", 
    date: "1999",
    title: "802.11a",
    description: "Faster than 802.11b, but shorter range",
    modalContent: modalContent2b,
    improvements: " Operating as a high-speed alternative to 802.11b, this standard achieved a major increase in maximum bandwidth, reaching up to 54 Mbps by introducing Orthogonal Frequency Division Multiplexing (OFDM). OFDM improves data transmission by dividing the wireless signal into multiple smaller sub-signals that transmit data simultaneously, making communication faster, more efficient, and more resistant to interference. In addition, by operating entirely on the less congested 5 GHz frequency band, it avoided much of the interference caused by common household devices, resulting in more stable and reliable wireless connections. ",
    limitations: "  The primary drawback of utilizing the higher-frequency 5 GHz band was its significantly reduced signal range and poor physical penetration through solid walls. Additionally, because it used an entirely different frequency band, it suffered from zero backward compatibility with 802.11b devices, creating a fragmented hardware ecosystem. " 
  },
  {
    id: "wifi_3",
    themeClass: "wifi_3",
    date: "2003",
    title: "802.11g",
    description: "Combined the best of both earlier standards",
    modalContent: modalContent3,
    improvements: " This standard combined the best features of 802.11a and 802.11b by bringing the faster Orthogonal Frequency Division Multiplexing (OFDM) technology to the 2.4 GHz frequency band. As a result, it increased the maximum speed to 54 Mbps while maintaining the wider coverage of the 2.4 GHz band. It also remained backward compatible with older 802.11b devices, allowing users to upgrade their networks without replacing all of their existing hardware.",
    limitations: " One major drawback was that when an older 802.11b device connected to the network, the router had to slow down its communication to support the older technology, reducing the overall performance of the entire network. In addition, because it continued to operate on the 2.4 GHz frequency band, it remained vulnerable to interference from nearby Wi-Fi networks and common household devices such as microwave ovens and cordless phones, which could reduce connection speed and reliability."
  },
  {
    id: "wifi_4",
    themeClass: "wifi_4", 
    date: "2009",
    title: "Wi-Fi 4 (802.11n)",
    description: "First considered fully ready for mainstream commercial use",
    modalContent: modalContent4,
    improvements: "This generation introduced Multiple Input, Multiple Output (MIMO), which used multiple smart antennas to broadcast data simultaneously rather than relying on a single stream. It was also the first truly dual-band standard, allowing routers to transmit over both the far-reaching 2.4 GHz band and the faster 5 GHz band at the same time. These architectural changes dramatically increased maximum throughput up to 600 Mbps and significantly extended indoor signal range",
    limitations: " Despite utilizing the 5 GHz band, devices frequently reverted back to the cluttered 2.4 GHz band, which remained plagued by interference from everyday electronics. Additionally, while MIMO supported multiple antennas, the router could still only talk to one device at a time in rapid succession. This meant that if multiple family members tried to use the internet at once, the network experienced immediate lag as it cycled through each device."
  },
  {
    id: "wifi_5",
    themeClass: "wifi_5", 
    date: "2013",
    title: "Wi-Fi 5 (802.11ac)",
    description: "Largest single speed increase",
    modalContent: modalContent5,
    improvements: "This generation solved multi-device lag by introducing Multi-User MIMO (MU-MIMO), which allowed the router to transmit data to up to four different devices simultaneously. It also added Beamforming, a technology that detects where a device is located and shoots a targeted, concentrated beam of data directly to it rather than broadcasting equally in all directions. By focusing entirely on wider channels in the 5 GHz band, it pushed maximum speeds past the gigabit barrier.",
    limitations: " The major limitation was that its architectural upgrades, like MU-MIMO and beamforming, only functioned over the 5 GHz frequency band. Any data sent over the longer-range 2.4 GHz band was forced to drop back to old Wi-Fi 4 technology, making it incredibly slow. Furthermore, MU-MIMO only worked for downloading data, meaning uploading files or video-calling still choked under heavy network strain"
  },
  {
    id: "wifi_6",
    themeClass: "wifi_6", 
    date: "2019",
    title: "Wi-Fi 6 (802.11ax)",
    description: "Handled many connected devices smoothly at once",
    modalContent: modalContent6,
    improvements: "Designed for crowded smart homes, this generation introduced Orthogonal Frequency Division Multiple Access (OFDMA), which allows a router to bundle data for multiple completely different devices into a single transmission. Wi-Fi 6 applied these massive upgrades to both the 2.4 GHz and 5 GHz bands, while the 6E update unlocked an entirely new, pristine 6 GHz spectrum highway with zero appliance interference. It also brought MU-MIMO to both uploads and downloads, drastically reducing network latency.",
    limitations: " The primary downside of the advanced Wi-Fi 6E upgrade is that the newly introduced 6 GHz signals have an incredibly short range and struggle to pass through thick walls or glass. To experience these high-speed benefits, consumers are forced to buy entirely new, expensive hardware, as older legacy devices cannot see or connect to the 6 GHz band. Additionally, configuring a multi-band network correctly to stop devices from constantly dropping down to slower bands became much more complex."
  },
  {
    id: "wifi_7",
    themeClass: "wifi_7", 
    date: "2024",
    title: "Wi-Fi 7 (802.11be)",
    description: "Major generation of the wireless standard",
    modalContent: modalContent7,
    improvements: " Named as the Extremely High Throughput standard, Wi-Fi 7 introduced Multi-Link Operation (MLO), which allows a single device to connect to the 2.4 GHz, 5 GHz, and 6 GHz bands all at the same time to combine their speeds and backup data paths. It also doubled maximum channel widths to 320 MHz and implemented Multi-RU Puncturing, a feature that lets the network slice out a small, jammed piece of a radio channel while continuing to use the rest of it. These combined features skyrocketed theoretical speeds to a massive 46 Gbps while cutting latency to near-zero levels.",
    limitations: " The extreme speeds offered by this standard are largely overkill for average households, as normal consumer internet plans cannot even come close to saturating its massive bandwidth capacity. Furthermore, the specialized hardware requires significantly more power to run, causing routers to run hotter and often require bulky internal cooling sinks or fans. The premium price tag of both routers and compatible client devices makes it highly cost-prohibitive for the average user."
  }
];

export default function TimelineDemo() {
  const dialogRef = useRef(null);
  const animDialogRef = useRef(null); 
  const timelineRef = useRef(null); 
  const [activeEvent, setActiveEvent] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [activeAcronym, setActiveAcronym] = useState(null);

  /* Track mini-tab selections for complex multi-animation popups like DSSS and OFDM */
  const [dsssTab, setDsssTab] = useState(1);
  const [ofdmTab, setOfdmTab] = useState(1);
  const [fhssTab, setFhssTab] = useState(1);
  const [dssStep, setDssStep] = useState(0);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [boxVisible, setBoxVisible] = useState(true);
  const [boxExited, setBoxExited] = useState(false);

  // Interval for bit-by-bit XOR animation
  useEffect(() => {
    let interval;
    if ((activeAcronym === "DSSS") && dsssTab === 2) {
      interval = setInterval(() => {
        setDssStep((prev) => (prev + 1) % 18);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [activeAcronym, dsssTab]);

  // Reset the System Pipeline animation whenever the DSSS Tab 1 view is opened
  useEffect(() => {
    if (activeAcronym === "DSSS" && dsssTab === 1) {
      setPipelineStep(0);
      setBoxVisible(true);
      setBoxExited(false);
    }
  }, [activeAcronym, dsssTab]);

  // Manually advance the System Pipeline animation by one stage (triggered by the arrow button)
  const goToNextPipelineStep = () => {
    setPipelineStep((prev) => {
      const next = (prev + 1) % 4;
      if (next === 0) {
        /* Momentarily hide the box while it jumps back to the start position, 
           then fade it back in so it looks like it re-enters from the left */
        setBoxVisible(false);
        setBoxExited(false);
        setTimeout(() => setBoxVisible(true), 60);
      }
      return next;
    });
  };

  // Pause the box at the demodulator exit for a beat before it continues off-screen
  useEffect(() => {
    let exitTimeout;
    if (activeAcronym === "DSSS" && dsssTab === 1 && pipelineStep === 3) {
      exitTimeout = setTimeout(() => setBoxExited(true), 900);
    }
    return () => clearTimeout(exitTimeout);
  }, [activeAcronym, dsssTab, pipelineStep]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        } else {
          setShouldAnimate(false);
        }
      },
      { threshold: 0.05 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const openModal = (eventData) => {
    setActiveEvent(eventData);
    dialogRef.current?.showModal();
  };

  const openAnimModal = (acronym) => {
    setActiveAcronym(acronym);
    /* Reset active view states for step-by-step animations upon launching modal */
    setDsssTab(1);
    setOfdmTab(1);
    setPipelineStep(0);
    animDialogRef.current?.showModal();
  };

  /* Helper function to scan text blocks and highlight active acronyms to trigger interactive visualization boxes */
  const renderTextWithLinks = (text) => {
    if (!text) return "";
    const acronyms = ["WLANs", "WLAN", "FHSS", "DSSS", "HR-DSSS", "CCK", "OFDM", "FDM", "MU-MIMO", "MIMO", "OFDMA", "MLO"];
    const regex = new RegExp(`\\b(${acronyms.join("|")})\\b`, "g");
    const parts = text.split(regex);
  
    return parts.map((part, index) => {
      const isMatch = acronyms.includes(part) || (part === "WLANs" && acronyms.includes("WLAN"));
      const lookupKey = part === "WLANs" ? "WLAN" : part;
      if (isMatch) {
        return (
          <span 
            key={index} 
            className="interactive-acronym-link"
            onClick={() => openAnimModal(lookupKey)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div>
      <div style={{ marginBottom: "20px", padding: "14px 16px", border: "1px solid #dbe7ff", borderRadius: "10px", background: "#f5f8ff" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>Instruction</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          <div style={{ marginTop: "4px", fontSize: "14px" }}>Explore the evolution of Wi-Fi by clicking each timeline box to discover the descriptions, improvements, and limitations. Inside the popups, click highlighted acronyms to view technical animations.</div>
          <div style={{ marginTop: "4px", fontSize: "14px" }}>Click the question mark on the lower right corner of your screen for more fun facts about Wi-Fi!</div>        
        </div>
      </div>
      <p>Over the years, Wi-Fi standards have evolved to support higher throughput and become much more efficient in bandwidth use.</p>
      
      <div ref={timelineRef} className="wifi_history_timeline">
        <VerticalTimeline key={shouldAnimate ? "visible" : "hidden"} animate={shouldAnimate}>
          {TIMELINE_DATA.map((event) => (
            <VerticalTimelineElement
              key={event.id}
              date={event.date}
              className={`custom-timeline-element ${event.themeClass}`}
              iconOnClick={() => openModal(event)}
              onTimelineElementClick={() => openModal(event)}
            >
              <h3 className="vertical-timeline-element-title">{event.title}</h3>
              <p>{event.description}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>

        {/* Primary Event Details Dialog */}
        <dialog ref={dialogRef} className="timeline-modal">
          <h2>{activeEvent?.title} Details</h2>
          <b>Description</b>
          <p>{renderTextWithLinks(activeEvent?.modalContent)}</p>
          <b>Improvements</b>
          <p>{renderTextWithLinks(activeEvent?.improvements)}</p>
          <b>Limitations</b>
          <p>{renderTextWithLinks(activeEvent?.limitations)}</p>
          <button onClick={() => dialogRef.current?.close()}>Close</button>
        </dialog>

        {/* Technical Deep Dive & Animation Dialog */}
        <dialog ref={animDialogRef} className="timeline-modal animation-submodal">
          <h2>Technical Explanations: {activeAcronym}</h2>
          
          <div className="animation-container-workspace">
            {/* this is the WLAN popup - shows a router talking to a few devices with the internet globe above it */}
            {activeAcronym === "WLAN" && (
              <div className="anim-box wlan-layout">
                <div className="wlan-visual">
                  <div className="wlan-node globe-icon">🌐</div>
                  <div className="wlan-node router-icon">
                    <div className="radiating-circle"></div>
                    📶
                  </div>
                  <div className="wlan-node pc-icon">🖥️</div>
                  <div className="wlan-node laptop-icon">💻</div>
                  <div className="wlan-node printer-icon">🖨️</div>
                  <svg className="wlan-lines-svg">
                    <line x1="50%" y1="20%" x2="50%" y2="45%" className="pulse-line" />
                    <line x1="50%" y1="45%" x2="20%" y2="80%" className="pulse-line" />
                    <line x1="50%" y1="45%" x2="50%" y2="80%" className="pulse-line" />
                    <line x1="50%" y1="45%" x2="80%" y2="80%" className="pulse-line" />
                  </svg>
                </div>
                <div className="anim-description">
                  <p>A Wireless Local Area Network (WLAN) connects devices in a local area without any cables. The globe represents the Wide Area Network (WAN), the broader internet, that the router pulls its connection from, then broadcasts out to nearby devices. The dashed lines show data flowing back and forth between the router and each connected device, in this case a desktop PC, a laptop, and a printer, all sharing the same wireless signal.</p>
                </div>
              </div>
            )}

            {/* FHSS popup - has its own tabs, so it's set up a bit differently from the others below */}
            {activeAcronym === "FHSS" && (
              <div className="fhss-container">
                <div className="animation-tab-bar">
                  <button className={fhssTab === 1 ? "active-tab" : ""} onClick={() => setFhssTab(1)}>1. Single Channel Transmission</button>
                  <button className={fhssTab === 2 ? "active-tab" : ""} onClick={() => setFhssTab(2)}>2. Frequency Hopping (FHSS)</button>
                </div>

                {fhssTab === 1 && (
                  <div className="anim-box">
                    <h4>Fixed Single Frequency Channel Transmission</h4>
                    <div className="fhss-svg-workspace">
                      <svg className="fhss-chart" viewBox="0 0 650 330">
                        <line x1="80" y1="50" x2="570" y2="50" stroke="#444" strokeWidth="1" strokeDasharray="4" />
                        <text x="70" y="55" className="axis-value-text" textAnchor="end">2.4835 GHz</text>
                        <text x="70" y="300" className="axis-value-text" textAnchor="end">2.4 GHz</text>
                        
                        <line x1="80" y1="30" x2="80" y2="295" stroke="#4285f4" strokeWidth="2.5" markerEnd="url(#arrow-y)" />
                        <line x1="80" y1="295" x2="600" y2="295" stroke="#4285f4" strokeWidth="2.5" markerEnd="url(#arrow-x)" />
                        <text x="80" y="23" className="axis-title-text" textAnchor="middle">Frequency</text>
                        <text x="612" y="300" className="axis-title-text" textAnchor="start">Time</text>

                        <g className="fhss-scroll-packet sp1">
                          <rect x="80" y="254" width="75" height="40" rx="3" fill="#00b074" />
                          <text x="117.5" y="279" fill="#fff" className="packet-internal-text">Data</text>
                        </g>
                        <g className="fhss-scroll-packet sp2">
                          <rect x="80" y="254" width="75" height="40" rx="3" fill="#00b074" />
                          <text x="117.5" y="279" fill="#fff" className="packet-internal-text">Data</text>
                        </g>
                        <g className="fhss-scroll-packet sp3">
                          <rect x="80" y="254" width="75" height="40" rx="3" fill="#00b074" />
                          <text x="117.5" y="279" fill="#fff" className="packet-internal-text">Data</text>
                        </g>
                        <g className="fhss-scroll-packet sp4">
                          <rect x="80" y="254" width="75" height="40" rx="3" fill="#00b074" />
                          <text x="117.5" y="279" fill="#fff" className="packet-internal-text">Data</text>
                        </g>

                        <defs>
                          <marker id="arrow-y" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 5 0 L 10 10 L 0 10 Z" fill="#4285f4" />
                          </marker>
                          <marker id="arrow-x" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#4285f4" />
                          </marker>
                        </defs>
                      </svg>
                    </div>
                    <div className="anim-description">
                      <p>Without hopping, data streams continuously over one static slice of frequency. If any physical barrier or competing signal interferes with this exact frequency, the entire data sequence is corrupted or blocked entirely.</p>
                    </div>
                  </div>
                )}

                {fhssTab === 2 && (
                  <div className="anim-box">
                    <h4>Frequency-Hopping Spread Spectrum (FHSS) Grid Engine</h4>
                    <div className="fhss-svg-workspace">
                      <svg className="fhss-chart" viewBox="0 0 650 330">
                        <line x1="80" y1="50" x2="570" y2="50" stroke="#444" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="55" className="axis-value-text" textAnchor="end">2.4835 GHz</text>
                        <line x1="80" y1="85" x2="570" y2="85" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="90" className="grid-axis-label" textAnchor="end">F6</text>
                        <line x1="80" y1="120" x2="570" y2="120" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="125" className="grid-axis-label" textAnchor="end">F5</text>
                        <line x1="80" y1="155" x2="570" y2="155" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="160" className="grid-axis-label" textAnchor="end">F4</text>
                        <line x1="80" y1="190" x2="570" y2="190" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="195" className="grid-axis-label" textAnchor="end">F3</text>
                        <line x1="80" y1="225" x2="570" y2="225" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="230" className="grid-axis-label" textAnchor="end">F2</text>
                        <line x1="80" y1="260" x2="570" y2="260" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="70" y="265" className="grid-axis-label" textAnchor="end">F1</text>
                        <text x="70" y="300" className="axis-value-text" textAnchor="end">2.4 GHz</text>

                        <line x1="150" y1="50" x2="150" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="115" y="315" className="grid-axis-label" textAnchor="middle">T1</text>
                        <line x1="220" y1="50" x2="220" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="185" y="315" className="grid-axis-label" textAnchor="middle">T2</text>
                        <line x1="290" y1="50" x2="290" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="255" y="315" className="grid-axis-label" textAnchor="middle">T3</text>
                        <line x1="360" y1="50" x2="360" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="325" y="315" className="grid-axis-label" textAnchor="middle">T4</text>
                        <line x1="430" y1="50" x2="430" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="395" y="315" className="grid-axis-label" textAnchor="middle">T5</text>
                        <line x1="500" y1="50" x2="500" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="465" y="315" className="grid-axis-label" textAnchor="middle">T6</text>
                        <line x1="570" y1="50" x2="570" y2="295" stroke="#333" strokeWidth="1" strokeDasharray="3" />
                        <text x="535" y="315" className="grid-axis-label" textAnchor="middle">Tn</text>

                        <line x1="80" y1="30" x2="80" y2="295" stroke="#4285f4" strokeWidth="2.5" markerEnd="url(#arrow-y)" />
                        <line x1="80" y1="295" x2="600" y2="295" stroke="#4285f4" strokeWidth="2.5" markerEnd="url(#arrow-x)" />
                        <text x="80" y="23" className="axis-title-text" textAnchor="middle">Frequency</text>
                        <text x="612" y="300" className="axis-title-text" textAnchor="start">Time</text>

                        <g className="fhss-hop-node h1">
                          <rect x="81" y="226" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="115" y="247" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>
                        <g className="fhss-hop-node h2">
                          <rect x="151" y="121" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="185" y="142" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>
                        <g className="fhss-hop-node h3">
                          <rect x="221" y="191" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="255" y="212" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>
                        <g className="fhss-hop-node h4">
                          <rect x="291" y="86" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="325" y="107" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>
                        <g className="fhss-hop-node h5">
                          <rect x="361" y="261" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="395" y="282" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>
                        <g className="fhss-hop-node h6">
                          <rect x="431" y="156" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="465" y="177" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>
                        <g className="fhss-hop-node hn">
                          <rect x="501" y="226" width="68" height="33" fill="rgba(0, 176, 116, 0.45)" stroke="#00b074" strokeWidth="1.5" />
                          <text x="535" y="247" fill="#fff" className="packet-internal-text font-bold">Data</text>
                        </g>

                        <path d="M 115 226 L 175 154" fill="none" stroke="#dc3545" strokeWidth="2" markerEnd="url(#hop-arrow)" className="vector-arrow v1" />
                        <path d="M 185 154 L 245 191" fill="none" stroke="#dc3545" strokeWidth="2" markerEnd="url(#hop-arrow)" className="vector-arrow v2" />
                        <path d="M 255 191 L 315 119" fill="none" stroke="#dc3545" strokeWidth="2" markerEnd="url(#hop-arrow)" className="vector-arrow v3" />
                        <path d="M 325 119 L 385 261" fill="none" stroke="#dc3545" strokeWidth="2" markerEnd="url(#hop-arrow)" className="vector-arrow v4" />
                        <path d="M 395 261 L 455 189" fill="none" stroke="#dc3545" strokeWidth="2" markerEnd="url(#hop-arrow)" className="vector-arrow v5" />
                        <path d="M 465 189 L 525 226" fill="none" stroke="#dc3545" strokeWidth="2" markerEnd="url(#hop-arrow)" className="vector-arrow v6" />

                        <defs>
                          <marker id="hop-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 0 1 L 10 5 L 0 9 Z" fill="#dc3545" />
                          </marker>
                        </defs>
                      </svg>
                    </div>
                    <div className="anim-description">
                      <p>FHSS splits data into small parts and rapidly shifts transmission frequencies between slots (F1 to F6) across time boundaries (T1 to Tn). Because transmitter and receiver change channels in sync using a shared pattern, data remains clear and avoids local channel blocks. Meaning, data is spread across many frequencies so that a short burst of noise does not destroy the whole exchange.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* DSSS popup, this one has 3 tabs of its own for the different sub-animations */}
            {(activeAcronym === "DSSS") && (
              <div className="dsss-container">
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div style={{ width: "5px", alignSelf: "stretch", borderRadius: "999px", background: "#1f6feb" }} />
                  <div>
                    <h4 style={{ marginTop: 0, marginBottom: "6px" }}>Direct Sequence Spread Spectrum</h4>
                    <p style={{ margin: 0 }}>DSSS is a modulation technique used in wireless communications to make signal transmissions more reliable, secure, and resistant to interference and jamming.</p>
                  </div>
                </div>
                

                <div className="animation-tab-bar">
                  <button className={dsssTab === 1 ? "active-tab" : ""} onClick={() => setDsssTab(1)}>1. System Pipeline</button>
                  <button className={dsssTab === 2 ? "active-tab" : ""} onClick={() => setDssStep(0) || setDsssTab(2)}>2. Bit-by-Bit XOR Modulation</button>
                  <button className={dsssTab === 3 ? "active-tab" : ""} onClick={() => setDsssTab(3)}>3. Spectral Power Overlay</button>
                </div>

                {dsssTab === 1 && (
                  <div className="anim-box">
                    <h4>DSSS Modulation and Demodulation Pipeline (Click the arrow to advance)</h4>

                    <div className="dsss-pipeline-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="dsss-workspace-centered" style={{ background: "#0d1117", borderRadius: "8px", padding: "20px", flex: 1 }}>
                      <svg viewBox="0 0 750 320" style={{ width: "100%", height: "auto", display: "block" }}>
                        {/* conveyor belt on the left side, this is where the data box starts out */}
                        <line x1="20" y1="245" x2="140" y2="245" stroke="#30363d" strokeWidth="6" />
                        <line x1="40" y1="245" x2="40" y2="285" stroke="#30363d" strokeWidth="4" />
                        <line x1="110" y1="245" x2="110" y2="285" stroke="#30363d" strokeWidth="4" />
                        {[30, 55, 80, 105, 130].map((cx, i) => (
                          <circle key={i} cx={cx} cy="245" r="3" fill="#8b949e" />
                        ))}

                        {/* conveyor belt on the right side, where the box ends up leaving from */}
                        <line x1="590" y1="245" x2="710" y2="245" stroke="#30363d" strokeWidth="6" />
                        <line x1="610" y1="245" x2="610" y2="285" stroke="#30363d" strokeWidth="4" />
                        <line x1="680" y1="245" x2="680" y2="285" stroke="#30363d" strokeWidth="4" />
                        {[600, 625, 650, 675, 700].map((cx, i) => (
                          <circle key={i} cx={cx} cy="245" r="3" fill="#8b949e" />
                        ))}

                        {/* machine 1, the spreading modulator, this is where the data box disappears into */}
                        <rect x="140" y="145" width="140" height="110" rx="6" fill="#467194" stroke="#2e4a61" strokeWidth="2" />
                        <text x="210" y="215" fill="#0d1117" fontSize="12" fontWeight="bold" textAnchor="middle">Spreading</text>
                        <text x="210" y="230" fill="#0d1117" fontSize="12" fontWeight="bold" textAnchor="middle">Modulator</text>
                        <circle cx="165" cy="165" r="8" fill="#1f2937" />
                        <circle cx="165" cy="165" r="4" fill="#8b949e" />
                        <rect x="230" y="160" width="30" height="6" rx="2" fill="#1f2937" />
                        <circle cx="235" cy="175" r="3" fill="#ffc107" />
                        <circle cx="245" cy="175" r="3" fill="#00b074" />
                        <line x1="190" y1="160" x2="190" y2="185" stroke="#1f2937" strokeWidth="2" />
                        <line x1="200" y1="160" x2="200" y2="185" stroke="#1f2937" strokeWidth="2" />
                        <line x1="210" y1="160" x2="210" y2="185" stroke="#1f2937" strokeWidth="2" />
                        <rect x="165" y="255" width="15" height="30" fill="#1f2937" />
                        <rect x="240" y="255" width="15" height="30" fill="#1f2937" />

                        {/* machine 2, the spreading demodulator, the box comes back out here */}
                        <rect x="450" y="145" width="140" height="110" rx="6" fill="#467194" stroke="#2e4a61" strokeWidth="2" />
                        <text x="520" y="215" fill="#0d1117" fontSize="12" fontWeight="bold" textAnchor="middle">Spreading</text>
                        <text x="520" y="230" fill="#0d1117" fontSize="12" fontWeight="bold" textAnchor="middle">Demodulator</text>
                        <rect x="470" y="155" width="65" height="35" rx="3" fill="#161b22" stroke="#21262d" />
                        <path d="M 475 172 Q 485 160, 495 172 T 515 172 T 530 172" fill="none" stroke="#00b074" strokeWidth="1.5" />
                        <circle cx="560" cy="165" r="4" fill="#ff3b30" />
                        <circle cx="570" cy="165" r="4" fill="#00b074" />
                        <rect x="555" y="175" width="20" height="12" rx="1" fill="#1f2937" />
                        <rect x="475" y="255" width="15" height="30" fill="#1f2937" />
                        <rect x="550" y="255" width="15" height="30" fill="#1f2937" />

                        {/* little funnel shapes connecting the machines to the belts above */}
                        <path d="M 190 95 L 230 95 L 217 125 L 217 145 L 203 145 L 203 125 Z" fill="#21262d" stroke="#30363d" />
                        <path d="M 500 95 L 540 95 L 527 125 L 527 145 L 513 145 L 513 125 Z" fill="#21262d" stroke="#30363d" />

                        {/* the dashed line between the two machines, only shows up on stage 3 when the signal is being sent over */}
                        <path d="M 280 195 L 450 195" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray={pipelineStep === 2 ? "5" : "none"} markerEnd="url(#pipe-arrow)" style={{ opacity: pipelineStep === 2 ? 1 : 0.2, transition: "opacity 0.4s" }} />
                        <text x="365" y="175" fill="#8b949e" fontSize="12" textAnchor="middle" fontWeight="bold" style={{ opacity: pipelineStep === 2 ? 1 : 0.3, transition: "opacity 0.4s" }}>Transmitted Signals</text>

                        {/* the PN code label that drops down on the sending side, only shows during stage 2 */}
                        <g style={{
                          transform: pipelineStep === 1 ? "translate(0px, 110px)" : "translate(0px, 0px)",
                          transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
                          opacity: pipelineStep === 1 ? 1 : 0
                        }}>
                          <rect x="155" y="-50" width="110" height="30" rx="3" fill="#007acc" stroke="#005999" strokeWidth="1.5" />
                          <text x="210" y="-32" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">Pseudonoise (PN)</text>
                        </g>

                        {/* the matching PN code label on the receiving side, shows up during stage 3 */}
                        <g style={{
                          transform: pipelineStep === 2 ? "translate(0px, 110px)" : "translate(0px, 0px)",
                          transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease",
                          opacity: pipelineStep === 2 ? 1 : 0
                        }}>
                          <rect x="465" y="-50" width="110" height="30" rx="3" fill="#007acc" stroke="#005999" strokeWidth="1.5" />
                          <text x="520" y="-32" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">Pseudonoise (PN)</text>
                        </g>

                        {/* this is the orange data box that travels across the whole animation.
                            it disappears once it enters the modulator, comes back when it leaves
                            the demodulator, pauses there for a second, then slides all the way off
                            screen to the right. once it's gone, it resets off screen on the left so
                            it looks like a fresh box is entering when the loop starts again */}
                        <g style={{
                          transform: !boxVisible ? "translate(-200px, 0px)" :
                                     pipelineStep === 0 ? "translate(0px, 0px)" :
                                     pipelineStep === 1 ? "translate(140px, 0px)" :
                                     pipelineStep === 2 ? "translate(430px, 0px)" :
                                     boxExited ? "translate(900px, 0px)" : "translate(660px, 0px)",
                          transition: `transform ${!boxVisible ? "0s" : pipelineStep === 1 ? "1.8s" : "0.85s"} cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease`,
                          opacity: boxVisible && (pipelineStep === 0 || pipelineStep === 3) ? 1 : 0
                        }}>
                          <rect x="40" y="185" width="60" height="50" rx="4" fill="#d84b20" stroke="#b03512" strokeWidth="2" />
                          <text x="70" y="210" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Original</text>
                          <text x="70" y="225" fill="#fff" fontSize="11" textAnchor="middle" fontWeight="bold">Data</text>
                        </g>

                        <defs>
                          <marker id="pipe-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 0 1 L 10 5 L 0 9 Z" fill="#fff" />
                          </marker>
                        </defs>
                      </svg>
                      </div>

                      <button
                        className="dsss-pipeline-play-btn"
                        onClick={goToNextPipelineStep}
                        aria-label="Next stage"
                        style={{
                          flexShrink: 0,
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          border: "1px solid #30363d",
                          background: "#161b22",
                          color: "#fff",
                          fontSize: "16px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background 0.2s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#00b074")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "#161b22")}
                      >
                        ▶
                      </button>
                    </div>

                    <div className="anim-description" style={{ marginTop: "15px" }}>
                      {pipelineStep === 0 && <p><strong>Stage 1:</strong> At the transmission terminal end, the raw narrowband source input data payload enters the structural spreading modulator architecture.</p>}
                      {pipelineStep === 1 && <p><strong>Stage 2:</strong> The base stream is mixed/multiplied with a high-speed pseudo-random noise code sequence (also called chip sequences), widely spreading out signal bandwidth layout parameters across the spectrum space.</p>}
                      {pipelineStep === 2 && <p><strong>Stage 3:</strong> The aggregated spread spectrum signal sequence maps over the shared wireless medium and hits the receiver station, where an identical, synchronized local tracking PN code replica extracts it.</p>}
                      {pipelineStep === 3 && <p><strong>Stage 4:</strong> Through this complementary reverse correlation math mechanism, background noise elements discard smoothly and the clean original user payload dataset outputs safely at its destination target.</p>}
                    </div>
                  </div>
                )}

                {dsssTab === 2 && (
                  <div className="anim-box">
                    <h4>Spreading the Input Signal Using XOR Logic</h4>
                    <div className="dsss-flex-workspace">
                      
                      {/* left side, the truth table that highlights whichever row matches the current chip */}
                      <div className="xor-table-container">
                        <table className="xor-truth-table">
                          <thead>
                            <tr>
                              <th>X (Data)</th>
                              <th>Y (PN)</th>
                              <th>Z (XOR)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className={dssStep < 9 && [0, 1, 3, 7].includes(dssStep) ? "active-table-row" : ""}>
                              <td>1</td>
                              <td>1</td>
                              <td className="highlight-out">0</td>
                            </tr>
                            <tr className={(dssStep < 9 && [2, 4, 5, 6, 8].includes(dssStep)) ? "active-table-row" : ""}>
                              <td>1</td>
                              <td>0</td>
                              <td className="highlight-out">1</td>
                            </tr>
                            <tr className={(dssStep >= 9 && [9, 10, 12, 13, 14, 17].includes(dssStep)) ? "active-table-row" : ""}>
                              <td>0</td>
                              <td>1</td>
                              <td className="highlight-out">1</td>
                            </tr>
                            <tr className={(dssStep >= 9 && [11, 15, 16].includes(dssStep)) ? "active-table-row" : ""}>
                              <td>0</td>
                              <td>0</td>
                              <td className="highlight-out">0</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="step-readout">
                          Active Chip: <span className="text-emerald-400 font-bold">#{dssStep + 1} / 18</span>
                          <div className="text-[10px] text-gray-500 mt-1">
                            Current Logic: {dssStep < 9 ? "Data '1' Bit" : "Data '0' Bit"}
                          </div>
                        </div>
                      </div>

                      {/* right side, the waveform rows for the PN code, the data, and the resulting XOR output */}
                      <div className="dsss-svg-workspace compact-mode">
                        <svg viewBox="0 0 650 250" className="dsss-waveform-svg">
                          <rect x={140 + dssStep * 25} y="5" width="25" height="210" fill="rgba(0, 176, 116, 0.06)" stroke="rgba(0, 176, 116, 0.25)" strokeDasharray="2" strokeWidth="1" />
                          <line x1="365" y1="5" x2="365" y2="215" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="4 3" />
                          
                          <line x1="20" y1="45" x2="600" y2="45" stroke="#1f2937" strokeWidth="1" />
                          <line x1="20" y1="115" x2="600" y2="115" stroke="#1f2937" strokeWidth="1" />
                          <line x1="20" y1="185" x2="600" y2="185" stroke="#1f2937" strokeWidth="1" />

                          {/* row 1: the PN code sequence */}
                          <text x="15" y="40" className="wave-label text-bold">PN Code</text>
                          <path d="M 140 25 L 190 25 L 190 45 L 215 45 L 215 25 L 240 25 L 240 45 L 315 45 L 315 25 L 340 25 L 340 45 L 365 45 L 365 25 L 415 25 L 415 45 L 440 45 L 440 25 L 515 25 L 515 45 L 565 45 L 565 25 L 590 25" fill="none" stroke="#38bdf8" strokeWidth="2" />
                          {[1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1].map((val, idx) => (
                            <text key={idx} x={152.5 + idx * 25} y="18" className={`wave-bit ${dssStep === idx ? "active-bit-text text-sky-400" : ""}`}>{val}</text>
                          ))}

                          {/* row 2: the raw data, just a single 1 bit followed by a single 0 bit */}
                          <text x="15" y="110" className="wave-label">Data</text>
                          <path d="M 140 95 L 365 95 L 365 115 L 590 115" fill="none" stroke="#00b074" strokeWidth="2" />
                          <text x="252.5" y="85" className={`wave-bit font-bold ${dssStep < 9 ? "active-bit-text" : ""}`}>1</text>
                          <text x="477.5" y="85" className={`wave-bit font-bold ${dssStep >= 9 ? "active-bit-text" : ""}`}>0</text>

                          {/* row 3: what actually gets sent out, this is the data XOR'd with the PN code */}
                          <text x="15" y="180" className="wave-label">Transmitted</text>
                          <path d="M 140 185 L 190 185 L 190 165 L 215 165 L 215 185 L 240 185 L 240 165 L 315 165 L 315 185 L 340 185 L 340 165 L 415 165 L 415 185 L 440 185 L 440 165 L 515 165 L 515 185 L 565 185 L 565 165 L 590 165" fill="none" stroke="#fbbf24" strokeWidth="2" />
                          {[0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1].map((val, idx) => (
                            <text key={idx} x={152.5 + idx * 25} y="158" className={`wave-bit ${dssStep === idx ? "active-xor-text" : ""}`}>{val}</text>
                          ))}

                          <circle cx={140 + dssStep * 25 + 12.5} cy="14" r="9" fill="none" stroke="#00b074" strokeWidth="2" className="pulse-ring" />
                          <circle cx={dssStep < 9 ? 252.5 : 477.5} cy="81" r="9" fill="none" stroke="#00b074" strokeWidth="2" className="pulse-ring" />

                          <path d="M 140 225 L 140 232 M 365 225 L 365 232 M 590 225 L 590 232 M 140 228 L 590 228" stroke="#4b5563" strokeWidth="1" />
                          <text x="252.5" y="244" className="wave-timing-caption" textAnchor="middle">← 1st Bit Period (Spreading) →</text>
                          <text x="477.5" y="244" className="wave-timing-caption" textAnchor="middle">← 2nd Bit Period (Spreading) →</text>
                        </svg>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginTop: "14px" }}>
                      <div style={{ width: "5px", alignSelf: "stretch", borderRadius: "999px", background: "#1f6feb" }} />
                      <div>
                        <p style={{ margin: 0 }}>When transmitting a DSSS signal, the original data stream is combined with a high-speed spreading code (or "chip code"). Using the <strong>XOR (Exclusive OR)</strong> function, this process creates an output bitstream with a significantly higher rate than the raw data itself, effectively spreading the signal energy across a broad frequency band. In Wi-Fi networks, this spreading is crucial because it allows signals to cut through heavy interference from household appliances like microwaves and Bluetooth devices, maintaining a stable connection.</p>
                      </div>
                    </div>
                  </div>
                )}

                {dsssTab === 3 && (
                  <div className="anim-box">
                    <h4>Signal Spectral Densities Layer Transformation</h4>
                    <div className="dsss-svg-workspace scale-down-container">
                      <svg viewBox="0 0 640 280" className="spectral-density-svg">
                        <line x1="60" y1="20" x2="60" y2="240" stroke="#555" strokeWidth="2" markerEnd="url(#spec-arrow-y)" />
                        <line x1="60" y1="240" x2="550" y2="240" stroke="#555" strokeWidth="2" markerEnd="url(#spec-arrow-x)" />
                        <text x="60" y="14" className="axis-title-text" textAnchor="middle">Power</text>
                        <text x="562" y="245" className="axis-title-text" textAnchor="start">Frequency</text>

                        <g className="spectral-shape narrow-signal-group">
                          <path d="M 235 240 Q 265 60 295 240 Z" fill="rgba(220, 53, 69, 0.75)" stroke="#dc3545" strokeWidth="2" />
                          <text x="265" y="50" className="spec-shape-label red-txt" textAnchor="middle">Narrowband Signal</text>
                        </g>

                        <g className="spectral-shape wide-signal-group">
                          <path d="M 120 240 Q 265 190 410 240 Z" fill="rgba(66, 133, 244, 0.45)" stroke="#4285f4" strokeWidth="2" />
                          <text x="420" y="195" className="spec-shape-label blue-txt" textAnchor="start">Spread Spectrum Signal (DSSS)</text>
                        </g>

                        <defs>
                          <marker id="spec-arrow-y" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 5 0 L 10 10 L 0 10 Z" fill="#555" />
                          </marker>
                          <marker id="spec-arrow-x" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 Z" fill="#555" />
                          </marker>
                        </defs>
                      </svg>
                    </div>
                    <div className="anim-description">
                      <p>By blending the data with the PN sequence code, the signal energy spreads over a much wider frequency channel. Although peak power drops significantly below background environmental noise floor levels, it retains protection against targeted frequency jamming.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* this popup covers both OFDM and FDM since they share the same tabs and animations */}
            {(activeAcronym === "OFDM" || activeAcronym === "FDM") && (
              <div className="ofdm-container">
                <div className="animation-tab-bar">
                  <button className={ofdmTab === 1 ? "active-tab" : ""} onClick={() => setOfdmTab(1)}>1. FDM Isolated Waves</button>
                  <button className={ofdmTab === 2 ? "active-tab" : ""} onClick={() => setOfdmTab(2)}>2. FDM vs OFDM Contrast</button>
                  <button className={ofdmTab === 3 ? "active-tab" : ""} onClick={() => setOfdmTab(3)}>3. OFDM Orthogonality</button>
                </div>

                {ofdmTab === 1 && (
                  <div className="anim-box">
                    <h4>FDM Spectrum Architecture (Traditional Separated Signals)</h4>
                    <div className="fdm-animation-space-svg">
                      <div className="wave-channel-row">
                        <span className="wave-row-label">Channel 1</span>
                        <svg className="wave-svg-canvas" viewBox="0 0 600 60">
                          <path className="propagating-sine-wave wave-amber" d="M 0 30 Q 15 5, 30 30 T 60 30 T 90 30 T 120 30 T 150 30 T 180 30 T 210 30 T 240 30 T 270 30 T 300 30 T 330 30 T 360 30 T 390 30 T 420 30 T 450 30 T 480 30 T 510 30 T 540 30 T 570 30 T 600 30 T 630 30" />
                        </svg>
                      </div>
                      <div className="wave-channel-row guard-band-gap">
                        <span className="guard-band-text">🚫 Guard Band (Empty Spectrum Space to Prevent Crosstalk)</span>
                      </div>
                      <div className="wave-channel-row">
                        <span className="wave-row-label">Channel 2</span>
                        <svg className="wave-svg-canvas" viewBox="0 0 600 60">
                          <path className="propagating-sine-wave wave-teal" d="M 0 30 Q 10 8, 20 30 T 40 30 T 60 30 T 80 30 T 100 30 T 120 30 T 140 30 T 160 30 T 180 30 T 200 30 T 220 30 T 240 30 T 260 30 T 280 30 T 300 30 T 320 30 T 340 30 T 360 30 T 380 30 T 400 30 T 420 30 T 440 30 T 460 30 T 480 30 T 500 30 T 520 30 T 540 30 T 560 30 T 580 30 T 600 30 T 620 30" />
                        </svg>
                      </div>
                    </div>
                    <div className="anim-description">
                      <p>Traditional Frequency Division Multiplexing (FDM) splits the radio spectrum into completely distinct, separate channels. Each signal wave oscillates inside its own isolated band, separated by wide, wasted buffers called guard bands to prevent data corruption and overlapping interference.</p>
                    </div>
                  </div>
                )}

                {ofdmTab === 2 && (
                  <div className="anim-box">
                    <h4>Spectral Packing (FDM Spaced vs OFDM Tightly Overlapped)</h4>
                    <div className="comparison-stack-frame">
                      <div className="stack-half">
                        <h5>Traditional FDM (Spaced Waves + Wasted Space)</h5>
                        <div className="signal-canvas-container dark-canvas">
                          <svg className="static-wave-svg" viewBox="0 0 500 80">
                            <path d="M 20 70 Q 50 10, 80 70" fill="none" stroke="#ffc107" strokeWidth="3" />
                            <line x1="80" y1="70" x2="160" y2="70" stroke="#444" strokeWidth="2" strokeDasharray="4" />
                            <path d="M 160 70 Q 190 10, 220 70" fill="none" stroke="#17a2b8" strokeWidth="3" />
                            <line x1="220" y1="70" x2="300" y2="70" stroke="#444" strokeWidth="2" strokeDasharray="4" />
                            <path d="M 300 70 Q 330 10, 360 70" fill="none" stroke="#dc3545" strokeWidth="3" />
                          </svg>
                        </div>
                      </div>
                      <div className="stack-half">
                        <h5>OFDM (Signals Condensing Over One Another)</h5>
                        <div className="signal-canvas-container dark-canvas">
                          <svg className="static-wave-svg" viewBox="0 0 500 80">
                            <path className="sliding-ofdm-wave-svg wave-svg-a" d="M 40 70 Q 80 10, 120 70" fill="none" stroke="#ffc107" strokeWidth="3" opacity="0.75" />
                            <path className="sliding-ofdm-wave-svg wave-svg-b" d="M 80 70 Q 120 10, 160 70" fill="none" stroke="#17a2b8" strokeWidth="3" opacity="0.75" />
                            <path className="sliding-ofdm-wave-svg wave-svg-c" d="M 120 70 Q 160 10, 200 70" fill="none" stroke="#dc3545" strokeWidth="3" opacity="0.75" />
                            <path className="sliding-ofdm-wave-svg wave-svg-d" d="M 160 70 Q 200 10, 240 70" fill="none" stroke="#85b2ec" strokeWidth="3" opacity="0.75" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="anim-description">
                      <p>This comparison demonstrates spectral density. While traditional FDM requires broad physical separations, Orthogonal Frequency Division Multiplexing (OFDM) brings subcarrier channels directly on top of each other. Because the waves are mathematically coordinated, they blend together safely without data corruption, removing the need for empty guard bands.</p>
                    </div>
                  </div>
                )}

                {ofdmTab === 3 && (
                  <div className="anim-box">
                    <h4>OFDM Mathematical Orthogonality Intersection</h4>
                    <div className="ofdm-orthogonal-space-svg">
                      <svg className="orthogonal-axis-canvas" viewBox="0 0 600 220">
                        <line x1="50" y1="170" x2="550" y2="170" stroke="#444" strokeWidth="2" />
                        <path d="M 80 170 Q 140 170, 160 170 Q 200 20, 240 170 Q 260 170, 320 170" fill="none" stroke="#4285f4" strokeWidth="3.5" opacity="0.85" />
                        <path d="M 120 170 Q 180 170, 200 170 Q 240 20, 280 170 Q 300 170, 360 170" fill="none" stroke="#ea4335" strokeWidth="3.5" opacity="0.85" />
                        <path d="M 160 170 Q 220 170, 240 170 Q 280 20, 320 170 Q 340 170, 400 170" fill="none" stroke="#fabc05" strokeWidth="3.5" opacity="0.85" />

                        <g className="orthogonal-marker-group line-m1">
                          <line x1="200" y1="10" x2="200" y2="190" stroke="#fff" strokeWidth="1.5" strokeDasharray="3" />
                          <circle cx="200" cy="20" r="5" fill="#4285f4" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="200" cy="170" r="5" fill="#ea4335" stroke="#fff" strokeWidth="1.5" />
                        </g>

                        <g className="orthogonal-marker-group line-m2">
                          <line x1="240" y1="10" x2="240" y2="190" stroke="#fff" strokeWidth="1.5" strokeDasharray="3" />
                          <circle cx="240" cy="20" r="5" fill="#ea4335" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="240" cy="170" r="5" fill="#fabc05" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="240" cy="170" r="5" fill="#4285f4" stroke="#fff" strokeWidth="1.5" />
                        </g>

                        <g className="orthogonal-marker-group line-m3">
                          <line x1="280" y1="10" x2="280" y2="190" stroke="#fff" strokeWidth="1.5" strokeDasharray="3" />
                          <circle cx="280" cy="20" r="5" fill="#fabc05" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="280" cy="170" r="5" fill="#4285f4" stroke="#fff" strokeWidth="1.5" />
                          <circle cx="280" cy="170" r="5" fill="#ea4335" stroke="#fff" strokeWidth="1.5" />
                        </g>
                      </svg>
                    </div>
                    <div className="anim-description">
                      <p>Orthogonality means that at the exact peak frequency of one subcarrier or signal, all other subcarriers or signals are at their zero value. This mathematical independence lets them overlap perfectly without interfering with each other.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* HR-DSSS and CCK don't have their own animation, just a text explanation */}
            {(activeAcronym === "HR-DSSS" || activeAcronym === "CCK") && (
              <div className="anim-box fallback-panel">
                <h4>High-Rate Direct Sequence Spread Spectrum & Complementary Code Keying</h4>
                <p>HR-DSSS increases pipeline transmission bit speeds safely up to 11 Mbps within the historic 2.4 GHz distribution band. It replaces the classic 11-bit Barker sequences with specialized 8-chip Complementary Code Keying (CCK) math functions.</p>
                <p>CCK uses complex mathematical formulas to efficiently encode more data per radio symbol, allowing faster transfers while remaining backward compatible with standard DSSS equipment.</p>
              </div>
            )}

            {/* MIMO popup - a little city scene comparing what it looks like with vs without MIMO antennas */}
            {activeAcronym === "MIMO" && (
              <div className="anim-box">
                <h4>MIMO: Multiple Spatial Streams via Multipath</h4>
                <div className="mimo-city-workspace" style={{ background: "#0d1117", borderRadius: "8px", padding: "20px" }}>
                  <svg viewBox="0 0 700 380" style={{ width: "100%", height: "auto", display: "block" }}>
                    {/* top half of the picture: what it looks like with MIMO antennas */}
                    <text x="670" y="35" fill="#28a745" fontSize="16" fontWeight="bold" textAnchor="end">With MIMO antenna</text>
                    <line x1="20" y1="175" x2="680" y2="175" stroke="#30363d" strokeWidth="3" />

                    {/* a few simple buildings in the background */}
                    <rect x="140" y="110" width="55" height="65" fill="#d8c9a3" opacity="0.35" />
                    <rect x="210" y="75" width="40" height="100" fill="#7fd9c4" opacity="0.35" />
                    <rect x="270" y="115" width="60" height="60" fill="#cbb8e8" opacity="0.3" />
                    <rect x="430" y="150" width="28" height="25" fill="#f4c98b" opacity="0.5" />
                    <polygon points="430,150 444,135 458,150" fill="#e8a15c" opacity="0.5" />

                    {/* the red and white striped pole for the cell tower */}
                    <line x1="37.5" y1="175" x2="37.5" y2="60" stroke="#c0392b" strokeWidth="4" />
                    <line x1="37.5" y1="175" x2="37.5" y2="60" stroke="#fff" strokeWidth="4" strokeDasharray="8 8" opacity="0.6" />

                    {/* the two antennas, one blue stream and one orange stream */}
                    <polygon points="25,55 50,55 37.5,75" fill="#2f6fed" />
                    <polygon points="25,78 50,78 37.5,98" fill="#e08b2f" />

                    {/* the phone receiving the signal */}
                    <rect x="560" y="100" width="30" height="55" rx="4" fill="#111" stroke="#333" />
                    <rect x="564" y="108" width="22" height="38" fill="#4fd1c5" />
                    <line x1="575" y1="100" x2="575" y2="90" stroke="#8b949e" strokeWidth="2" />

                    {/* blue stream, one solid line for the direct path and one dotted line for the reflected path */}
                    <path d="M37.5,75 L575,120" fill="none" stroke="#2f6fed" strokeWidth="2" />
                    <path d="M37.5,75 Q300,25 575,120" fill="none" stroke="#2f6fed" strokeWidth="1.5" strokeDasharray="6 6" className="mimo-dotted-flow" />

                    {/* same thing for the orange stream */}
                    <path d="M37.5,98 L575,140" fill="none" stroke="#e08b2f" strokeWidth="2" />
                    <path d="M37.5,98 Q300,170 575,140" fill="none" stroke="#e08b2f" strokeWidth="1.5" strokeDasharray="6 6" className="mimo-dotted-flow" />

                    <circle r="4" fill="#2f6fed">
                      <animateMotion dur="1.6s" repeatCount="indefinite" path="M37.5,75 L575,120" />
                    </circle>
                    <circle r="4" fill="#e08b2f">
                      <animateMotion dur="1.6s" repeatCount="indefinite" path="M37.5,98 L575,140" />
                    </circle>

                    {/* bottom half: same scene, but without MIMO antennas */}
                    <text x="670" y="225" fill="#8b949e" fontSize="16" textAnchor="end">Without MIMO antenna</text>
                    <line x1="20" y1="365" x2="680" y2="365" stroke="#30363d" strokeWidth="3" />

                    <rect x="140" y="300" width="55" height="65" fill="#d8c9a3" opacity="0.25" />
                    <rect x="210" y="265" width="40" height="100" fill="#7fd9c4" opacity="0.25" />
                    <rect x="270" y="305" width="60" height="60" fill="#cbb8e8" opacity="0.2" />
                    <rect x="430" y="340" width="28" height="25" fill="#f4c98b" opacity="0.35" />
                    <polygon points="430,340 444,325 458,340" fill="#e8a15c" opacity="0.35" />

                    <line x1="37.5" y1="365" x2="37.5" y2="250" stroke="#c0392b" strokeWidth="4" opacity="0.5" />
                    <line x1="37.5" y1="365" x2="37.5" y2="250" stroke="#fff" strokeWidth="4" strokeDasharray="8 8" opacity="0.3" />

                    {/* only one antenna this time */}
                    <polygon points="25,245 50,245 37.5,265" fill="#8b949e" />

                    <rect x="560" y="290" width="30" height="55" rx="4" fill="#111" stroke="#333" opacity="0.8" />
                    <rect x="564" y="298" width="22" height="38" fill="#4a5560" />
                    <line x1="575" y1="290" x2="575" y2="280" stroke="#8b949e" strokeWidth="2" />

                    {/* the only path that actually gets used */}
                    <path d="M37.5,265 L575,310" fill="none" stroke="#8b949e" strokeWidth="2" />
                    <circle r="4" fill="#8b949e">
                      <animateMotion dur="1.8s" repeatCount="indefinite" path="M37.5,265 L575,310" />
                    </circle>

                    {/* this reflected copy still exists physically, but with no second antenna to pick it up, it just fades away unused */}
                    <path d="M37.5,265 Q250,215 400,300" fill="none" stroke="#8b949e" strokeWidth="1.5" strokeDasharray="4 6" className="mimo-lost-path" />
                  </svg>
                </div>
                <div className="anim-description">
                  <p><strong>Solid lines</strong> are the direct, line-of-sight path each spatial stream takes straight from an antenna to the device.</p>
                  <p><strong>Dotted lines</strong> are the same stream's reflected copy, bouncing off buildings and obstacles along the way (multipath).</p>
                  <p>With Multiple Input, Multiple Output (MIMO), the router uses <strong>multiple antennas</strong> (blue and orange here) to send two separate streams at once, and can combine each stream's direct and reflected copies to boost speed and reliability. Without MIMO, only one antenna and one stream is used, so the reflected copy of the signal goes uncaptured and wasted, shown fading out below.</p>
                </div>
              </div>
            )}

            {/* MU-MIMO popup - side by side comparison, SU-MIMO taking turns vs MU-MIMO serving everyone at once */}
            {activeAcronym === "MU-MIMO" && (
              <div className="anim-box">
                <h4>SU-MIMO vs MU-MIMO: Serving Multiple Devices</h4>
                <div className="mumimo-compare-workspace" style={{ background: "#0d1117", borderRadius: "8px", padding: "20px" }}>
                  <svg viewBox="0 0 760 340" style={{ width: "100%", height: "auto", display: "block" }}>

                    <text x="150" y="28" fill="#e08b2f" fontSize="16" fontWeight="bold" textAnchor="middle">SU-MIMO (takes turns)</text>
                    <text x="610" y="28" fill="#28a745" fontSize="16" fontWeight="bold" textAnchor="middle">MU-MIMO (all at once)</text>

                    {/* the SU-MIMO access point on the left, with its 3 antennas */}
                    <rect x="40" y="50" width="90" height="230" fill="none" stroke="#e08b2f" strokeWidth="2" rx="4" />
                    <text x="85" y="298" fill="#8b949e" fontSize="10" textAnchor="middle">3x3 Access Point</text>
                    {[90, 165, 240].map((y, i) => (
                      <g key={`su-ant-${i}`}>
                        <path d={`M 68 ${y - 8} Q 85 ${y - 24} 102 ${y - 8}`} fill="none" stroke="#e08b2f" strokeWidth="1.5" opacity="0.5" />
                        <path d={`M 74 ${y - 14} Q 85 ${y - 26} 96 ${y - 14}`} fill="none" stroke="#e08b2f" strokeWidth="1.5" opacity="0.7" />
                        <polygon points={`70,${y + 22} 100,${y + 22} 85,${y - 5}`} fill="#e08b2f" />
                        <text x="15" y={y + 4} fill="#8b949e" fontSize="10">Stream {i + 1}</text>
                      </g>
                    ))}

                    {/* the 3 clients waiting on the SU-MIMO side, only one gets lit up and served at a time */}
                    {[90, 165, 240].map((y, i) => (
                      <g key={`su-client-${i}`} className={`su-cycle su-cycle-${i}`}>
                        <rect x="255" y={y - 16} width="28" height="38" rx="3" fill="#1f2937" stroke="#e08b2f" strokeWidth="1.5" />
                        <polygon points={`257,${y + 20} 281,${y + 20} 269,${y - 2}`} fill="#3a4152" />
                        <text x="269" y={y + 34} fill="#8b949e" fontSize="9" textAnchor="middle">Client {i + 1}</text>
                        {[90, 165, 240].map((antY, j) => (
                          <path key={`su-line-${i}-${j}`} d={`M 100 ${antY} L 255 ${y}`} fill="none" stroke="#e08b2f" strokeWidth="1.5" />
                        ))}
                      </g>
                    ))}

                    {/* the MU-MIMO access point on the right, same 3 antennas */}
                    <rect x="430" y="50" width="90" height="230" fill="none" stroke="#28a745" strokeWidth="2" rx="4" />
                    <text x="475" y="298" fill="#8b949e" fontSize="10" textAnchor="middle">3x3 Access Point</text>
                    {[90, 165, 240].map((y, i) => (
                      <g key={`mu-ant-${i}`}>
                        <path d={`M 458 ${y - 8} Q 475 ${y - 24} 492 ${y - 8}`} fill="none" stroke="#28a745" strokeWidth="1.5" opacity="0.5" />
                        <path d={`M 464 ${y - 14} Q 475 ${y - 26} 486 ${y - 14}`} fill="none" stroke="#28a745" strokeWidth="1.5" opacity="0.7" />
                        <polygon points={`460,${y + 22} 490,${y + 22} 475,${y - 5}`} fill="#28a745" />
                        <text x="405" y={y + 4} fill="#8b949e" fontSize="10">Stream {i + 1}</text>
                      </g>
                    ))}

                    {/* all 3 clients here get their own stream and are served together, not one at a time */}
                    {[90, 165, 240].map((y, i) => (
                      <g key={`mu-client-${i}`}>
                        <path d={`M 520 ${y} L 645 ${y}`} fill="none" stroke="#28a745" strokeWidth="2" />
                        <circle r="4" fill="#28a745">
                          <animateMotion dur="1.4s" repeatCount="indefinite" path={`M 520 ${y} L 645 ${y}`} begin={`${i * 0.15}s`} />
                        </circle>
                        <rect x="645" y={y - 16} width="28" height="38" rx="3" fill="#1f2937" stroke="#28a745" strokeWidth="1.5" />
                        <polygon points={`647,${y + 20} 671,${y + 20} 659,${y - 2}`} fill="#3a5a44" />
                        <text x="659" y={y + 34} fill="#8b949e" fontSize="9" textAnchor="middle">Client {i + 1}</text>
                      </g>
                    ))}
                  </svg>
                </div>
                <div className="anim-description">
                  <p>A Single-User MIMO <strong>(SU-MIMO)</strong> access point can still only aim all of its spatial streams at <strong>one device at a time</strong>. If three devices need service, it has to serve Client 1, then Client 2, then Client 3 in turn, watch how the beam swaps between them above, even though the hardware technically has three streams available.</p>
                  <p>A Multi-User MIMO <strong>(MU-MIMO)</strong> access point splits those same three streams across <strong>three different devices at once</strong>, each getting its own dedicated stream simultaneously instead of waiting for a turn.</p>
                  <p>This is why MU-MIMO serves more devices better: instead of one client monopolizing all the streams while others queue, each connected device gets its own slice of bandwidth in parallel, so a busy network with many phones, laptops, and smart devices sees far less lag overall.</p>
                </div>
              </div>
            )}


            {/* OFDMA popup - the grid showing multiple users squeezed into one frame */}
            {activeAcronym === "OFDMA" && (
              <div className="anim-box">
                <h4>OFDMA: Splitting One Frame Across Multiple Users</h4>
                <div className="ofdma-grid-workspace" style={{ background: "#0d1117", borderRadius: "8px", padding: "20px" }}>
                  <div className="ofdma-bandwidth-label">⟷ System Bandwidth ⟷</div>

                  <div className="ofdma-body-row">
                    <span className="ofdma-axis-time">Time</span>
                    <span className="ofdma-frame-label">1 frame</span>

                    <div className="ofdma-rows">
                      {[
                        [{ u: "u1", span: 2 }, { u: "u2", span: 2 }, { u: "u3", span: 2 }],
                        [{ u: "u2", span: 3 }, { u: "u4", span: 1 }, { u: "u1", span: 2 }],
                        [{ u: "u3", span: 2 }, { u: "u1", span: 1 }, { u: "u4", span: 3 }],
                        [{ u: "u4", span: 2 }, { u: "u3", span: 2 }, { u: "u2", span: 2 }],
                      ].map((row, ri) => (
                        <div className="ofdma-row" key={`ofdma-row-${ri}`}>
                          {row.map((block, bi) => (
                            <div
                              key={`ofdma-row-${ri}-${bi}`}
                              className={`ofdma-block ofdma-${block.u}`}
                              style={{ flexGrow: block.span }}
                            />
                          ))}
                        </div>
                      ))}
                      <div className="ofdma-scan-highlight" />
                    </div>
                  </div>

                  <div className="ofdma-axis-freq">Frequency →</div>

                  <div className="ofdma-legend">
                    <span className="legend-item"><span className="legend-swatch ofdma-u1" />User 1</span>
                    <span className="legend-item"><span className="legend-swatch ofdma-u2" />User 2</span>
                    <span className="legend-item"><span className="legend-swatch ofdma-u3" />User 3</span>
                    <span className="legend-item"><span className="legend-swatch ofdma-u4" />User 4</span>
                  </div>
                </div>
                <div className="anim-description">
                  <p>In regular OFDM, a single frame's entire channel bandwidth is handed to just <strong>one device at a time</strong>, even if that device only has a small amount of data to send. Every other waiting device simply has to sit and wait its turn.</p>
                  <p><strong>OFDMA</strong> slices that same channel into smaller frequency resource units, so a single frame (the highlighted band scanning through the grid above) can be divided up and handed to <strong>several devices at once</strong>, User 1 through User 4 here, each getting only the small slice of bandwidth it actually needs.</p>
                  <p>This is why OFDMA beats regular OFDM on busy networks: instead of one small request tying up the entire channel and forcing everyone else to queue, many small requests get bundled together and answered in parallel within the same frame, cutting down on wasted airtime and reducing lag for everyone connected.</p>
                </div>
              </div>
            )}

            {/* MLO popup - shows a device connected to all three bands at the same time */}
            {activeAcronym === "MLO" && (
              <div className="anim-box mlo-layout">
                <h4>Multi-Link Operation (MLO) Simultaneous Connections</h4>
                <div className="mlo-visual">
                  <div className="mlo-node">Wi-Fi 7 Router AP</div>
                  <div className="mlo-channels">
                    <div className="mlo-channel band-24">
                      <span className="band-label">2.4 GHz Spectrum Track</span>
                      <div className="mlo-packet packet-24"></div>
                    </div>
                    <div className="mlo-channel band-5">
                      <span className="band-label">5 GHz Spectrum Track</span>
                      <div className="mlo-packet packet-5"></div>
                    </div>
                    <div className="mlo-channel band-6">
                      <span className="band-label">6 GHz Spectrum Track</span>
                      <div className="mlo-packet packet-6"></div>
                    </div>
                  </div>
                  <div className="mlo-node client-box">Wi-Fi 7 Client Station</div>
                </div>
                <div className="anim-description">
                  <p>Multi-Link Operation lets a device connect to multiple wireless bands (2.4 GHz, 5 GHz, and 6 GHz) at the exact same time. Data travels across all links simultaneously to boost speed and provide a reliable backup path if one band experiences interference.</p>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => animDialogRef.current?.close()}>Close</button>
        </dialog>
      </div>
    </div>
  );
}