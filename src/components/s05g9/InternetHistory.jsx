import {useState} from "react";
import { css } from './InternetSimulation.jsx';
import SpeedComparison from './SpeedComparison.jsx';

export default function InternetHistory({onReplay = () => {} }){
    const [activeTab, setActiveTab] = useState('timeline');
    const [activeEra, setActiveEra] = useState(0);
    const eras = [
        {
            year: "1994",
            label: "1994",
            name: "The First Live Link",
            icon: "🌐",
            desc: "On March 29, 1994, at 1:15 AM, engineer Benjie Tan established the Philippines' first live connection to the global internet via a 64 kbps international leased line using a Cisco 7000 router connected to SprintLink in California. Later that morning at 10:18 AM, the historic milestone was officially announced to the public during the First International Email Conference at the University of San Carlos in Cebu.",
            stats: [
                { val: "3", lbl: "ISPs" },
                { val: "~500", lbl: "Users" },
            ],
        },
        {
            year: "1996",
            label: "1996",
            name: "Commercial ISP Boom",
            icon: "🌐",
            desc: "Following the initial connection, the passage of the Public Telecommunications Policy Act allowed companies and institutions to connect without requiring a full legislative franchise. This regulatory shift birthed the country's first commercial Internet Service Providers (ISPs), expanding access beyond scientists and universities to businesses and the general public.",
            stats: [
                { val: "20+", lbl: "ISPs" },
                { val: "~50000", lbl: "Users" },
            ],
        },
        {
            year: "1997-1999",
            label: "1997-1999",
            name: "Local Traffic & Early Web Culture",
            icon: "🌐",
            desc: "During this period, the Philippines built out domestic infrastructure like local exchanges to keep internal internet traffic within the country rather than routing it through overseas servers. Early digital culture began to take root as adoption grew around platforms like mIRC, Yahoo Mail, and early personal websites.",
            stats: [
                { val: "40", lbl: "ISPs" },
                { val: "~1 million", lbl: "Users" },
            ],
        },
        {
            year: "2000-2004",
            label: "2000-2004",
            name: "DSL & Cyber Café Era",
            icon: "🌐",
            desc: "The early 2000s marked a major shift when PLDT introduced DSL broadband in 2000, replacing slow 56k dial-up connections and freeing up landlines during web use. This era sparked an explosion of local cyber cafés, which became social hubs where millions of Filipinos got their first taste of the internet through web browsing and online multiplayer games like Ragnarok Online and Counter-Strike.",
            stats: [
                { val: "70+", lbl: "ISPs" },
                { val: "~7 million", lbl: "Users" },
            ],
        },
        {
            year: "2010",
            label: "2010",
            name: "Mobile Data & Social Media",
            icon: "🌐",
            desc: "Telecom operators expanded TD-LTE broadband and mobile networks during this decade, accelerating a nationwide transition toward mobile data. Powered by cheap mobile access and exploding smartphone adoption, mobile subscriptions rapidly climbed past 100 million, turning the country into one of the most hyper-connected social media populations in the world.",
            stats: [
                { val: "~30 million", lbl: "Internet Users" },
            ],
        },
        {
            year: "2020",
            label: "2020",
            name: "Modern High-Speed Era",
            icon: "🌐",
            desc: "Increased government pressure on telecommunications providers in 2020 triggered massive network upgrades, driving average internet speeds from single digits up to over 80 Mbps. Modern developments followed rapidly, including the entry of a third major telco, the introduction of Starlink satellite internet, and large-scale national fiber backbone projects to connect remote islands and provinces.",
            stats: [
                { val: "~73 million", lbl: "Internet Users" },
            ],
        },
    ];
    return(
        <>
            <style>{css}</style>

            <style>{`
                .sim-connected-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--cream);
                    border: 2px solid var(--teal);
                    border-radius: 6px;
                    padding: 12px 18px;
                    margin-bottom: 15px;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .sim-connected-status {
                font-family: 'IBM Plex Mono', monospace;
                    font-size: 12px;
                    color: var(--teal);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .sim-connected-sub {
                    font-size: 10px;
                    color: var(--text-secondary);
                    margin-top: 4px;
                }
                .sim-replay-btn {
                    font-family: 'IBM Plex Mono', monospace;
                    font-size: 11px;
                    color: var(--paper);
                    background: var(--brown-bg);
                    border: 2px solid var(--brown-bg-dark);
                    border-radius: 4px;
                    padding: 6px 14px;
                    cursor: pointer;
                }
                .sim-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
                .sim-tab {
                    font-family: 'IBM Plex Mono', monospace;
                    font-size: 11px;
                    background: var(--cream);
                    border: 2px solid rgba(109, 61, 61, 0.25);
                    color: var(--text-secondary);
                    border-radius: 4px;
                    padding: 8px 16px;
                    cursor: pointer;
                }
                .sim-tab.active {
                    border-color: var(--orange);
                    color: var(--orange);
                    background: rgba(210, 140, 75, 0.1);
                }
                .sim-story-title {
                    text-align: center;
                    font-family: 'Bebas Neue', sans-serif;
                    color: var(--orange);
                    font-size: 24px;
                    letter-spacing: 2px;
                    margin-bottom: 20px;
                    text-shadow: 0 0 8px rgba(210, 140, 75, 0.2);
                }
                .sim-era-pills { display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; flex-wrap: wrap; }
                .sim-era-pill {
                    font-family: 'IBM Plex Mono', monospace;
                    font-size: 11px;
                    background: var(--cream);
                    border: 2px solid rgba(109, 61, 61, 0.25);
                    color: var(--text-secondary);
                    border-radius: 4px;
                    padding: 6px 14px;
                    cursor: pointer;
                }
                .sim-era-pill.active {
                    border-color: var(--orange);
                    color: var(--orange);
                    background: rgba(210, 140, 75, 0.1);
                }

                .sim-timeline-track { display: flex; align-items: center; margin-bottom: 25px; padding: 0 10px; }
                
                .sim-timeline-dot {
                    flex-grow: 1;
                    height: 2px;
                    background: rgba(109, 61, 61, 0.2);
                    position: relative;
                }
                .sim-timeline-dot::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translate(50%, -50%);
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(109, 61, 61, 0.3);
                    cursor: pointer;
                }
                .sim-timeline-dot.active::after {
                    width: 14px;
                    height: 14px;
                    background: var(--orange);
                    box-shadow: 0 0 10px rgba(210, 140, 75, 0.5);
                }
                .sim-era-card {
                    display: flex;
                    gap: 18px;
                    background: var(--cream);
                    border: 2px solid var(--teal);
                    border-radius: 6px;
                    padding: 20px;
                    margin-bottom: 20px;
                }
                .sim-era-icon { font-size: 22px; filter: sepia(0.4) saturate(1.2); }
                .sim-era-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
                .sim-era-year { font-family: 'IBM Plex Mono', monospace; color: var(--orange); font-size: 12px; }
                .sim-era-name { font-family: 'Bebas Neue', sans-serif; font-size: 18px; color: var(--teal); letter-spacing: 1px; }
                .sim-era-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 15px; }
                .sim-era-stats { display: flex; gap: 25px; flex-wrap: wrap; }
                .sim-era-stat-val { font-family: 'IBM Plex Mono', monospace; color: var(--orange); font-size: 14px; font-weight: bold; }
                .sim-era-stat-lbl { font-size: 9px; color: var(--teal); text-transform: uppercase; letter-spacing: 1px; }

                .sim-nav { display: flex; justify-content: space-between; align-items: center; }

                .sim-nav-btn {
                    font-family: 'IBM Plex Mono', monospace;
                    font-size: 12px;
                    background: var(--cream);
                    border: 2px solid rgba(109, 61, 61, 0.25);
                    border-radius: 4px;
                    color: var(--teal);
                    cursor: pointer;
                    padding: 8px 14px;
                }
                .sim-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
                .sim-nav-count { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--text-secondary); }
                .system-credits {
                    text-align: center;
                    font-family: 'IBM Plex Mono', monospace;
                    font-size: 9px;
                    color: var(--text-secondary);
                    margin-top: 18px;
                    letter-spacing: 0.5px;
                    opacity: 0.7;
                }
            `}</style>

            <div className="sim-root">
                <header className="sim-header">
                    <div className="sim-brand">
                        <div></div>
                        <div className="sim-brand-title">Pilipinas Online</div>
                        <div className="sim-brand-sub">
                            The Birth of Philippine Internet — March 29, 1994
                        </div>
                    </div>

                    <div className="sim-status sim-online">
                        <span className="sim-status-dot"></span>
                        <span>ONLINE</span>
                    </div>
                </header>

            <div className="sim-connected-bar">
                <div>
                    <div className="sim-connected-status">
                        <span>🇵🇭</span> CONNECTED — MARCH 29, 1994 · 01:15 AM
                    </div>
                    <div className="sim-connected-sub">
                        64 kbps leased line - PLDT Makati → Sprint San Francisco - Cisco 7000
                    </div>
                </div>
                <button className="sim-replay-btn" onClick={onReplay}>↻ Replay Simulation</button>
            </div>

            {/* wired tab buttons to hook state directly */}
            <div className="sim-tabs">
                <button 
                    className={`sim-tab ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    TIMELINE
                </button>
                <button 
                    className={`sim-tab ${activeTab === 'speed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('speed')}
                >
                    SPEED COMPARISON
                </button>
            </div>

            {/* render split block */}
            {activeTab === 'timeline' ? (
                <main>
                    <h2 className="sim-story-title">THE PHILIPPINE INTERNET STORY</h2>

                    <div className="sim-era-pills">
                        {eras.map((era, i) => (
                            <button
                                key={i}
                                className={`sim-era-pill ${i === activeEra ? "active" : ""}`}
                                onClick={() => setActiveEra(i)}
                            >
                                {era.label}
                            </button>
                        ))}
                    </div>

                    <div className="sim-timeline-track">
                        {eras.map((era, i) => (
                            <div
                                key={i}
                                className={`sim-timeline-dot ${i === activeEra ? "active" : ""}`}
                                onClick={() => setActiveEra(i)}
                            ></div>
                        ))}
                    </div>

                    <div className="sim-era-card">
                        <div className="sim-era-icon">{eras[activeEra].icon}</div>
                        <div>
                            <div className="sim-era-header">
                                <span className="sim-era-year">{eras[activeEra].year}</span>
                                <span className="sim-era-name">{eras[activeEra].name}</span>
                            </div>
                            <div className="sim-era-desc">{eras[activeEra].desc}</div>
                            <div className="sim-era-stats">
                                {eras[activeEra].stats.map((s, i) => (
                                    <div key={i} className="sim-era-stat">
                                        <div className="sim-era-stat-val">{s.val}</div>
                                        <div className="sim-era-stat-lbl">{s.lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="sim-nav">
                        <button
                            className="sim-nav-btn"
                            disabled={activeEra === 0}
                            onClick={() => setActiveEra(activeEra - 1)}
                        >
                            ‹ Previous
                        </button>
                        <span className="sim-nav-count">{activeEra + 1} / {eras.length}</span>
                        <button
                            className="sim-nav-btn"
                            disabled={activeEra === eras.length - 1}
                            onClick={() => setActiveEra(activeEra + 1)}
                        >
                            Next ›
                        </button>
                    </div>
                </main>
                ) : (
                    <main>
                        <SpeedComparison />
                    </main>
                )}

                <footer className="system-credits">
                    Educational simulation • Based on historical records • PLDT • DOST • NTC Philippines
                </footer>
            </div>

        </>
    )
}