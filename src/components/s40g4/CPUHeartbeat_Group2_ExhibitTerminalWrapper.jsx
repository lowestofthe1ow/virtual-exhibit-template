import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CPUHeartbeat_Group2_InstinctGame from './CPUHeartbeat_Group2_InstinctGame.jsx';
import CPUHeartbeat_Group2_FdeDiagram from './CPUHeartbeat_Group2_FdeDiagram.jsx';
import CPUHeartbeat_Group2_CulminatingActivity from './CPUHeartbeat_Group2_CulminatingActivity.jsx';
import CPUHeartbeat_Group2_FdeTheoryRoom from './CPUHeartbeat_Group2_FdeTheoryRoom.jsx';
import CPUHeartbeat_Group2_CitationsPanel from './CPUHeartbeat_Group2_CitationsPanel.jsx';

// Import the pre-rendered movie-accurate warp audio file
import warpSoundUrl from '../../assets/s40g4/warpsound.mp3';
import tronTrackUrl from '../../assets/s40g4/The Son of Flynn.mp3';

import tronThemeCss from '../../styles/s40g4/theme-cyber.css?inline';

const TRON_FONT_URL = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap';

const INITIAL_LINES = [
    { text: "[!] ENCOM OS v2.1.13 - LAB TERMINAL SYSTEM", color: "#febe0b" },
    { text: "> L3_SYSTEM_ENGINES: ACTIVE", color: "#537a85" },
    { text: "> RUNNING_TARGET: FETCH_DECODE_EXECUTE_CYCLE", color: "#537a85" },
    { text: "> WARNING: USER DETECTED.", color: "#fa0000" },
    { text: "PROCEED AND INTERCONNECT WITH THE GRID? (TYPE 'YES' OR 'NO')", color: "#c0f3ff" }
];

export default function ExhibitTerminalWrapper() {
    // Inject Tron theme CSS into document head on mount
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = TRON_FONT_URL;
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.textContent = tronThemeCss;
        document.head.appendChild(style);

        return () => {
            link.remove();
            style.remove();
        };
    }, []);

    // STATES: STANDBY (Click to wake), TYPING (Animating), IDLE (Waiting for input), BOOTING, ONLINE
    const [gridStatus, setGridStatus] = useState('STANDBY'); 
    const [refsOpen, setRefsOpen] = useState(false);
    
    // CLI State
    const [inputValue, setInputValue] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    
    const inputRef = useRef(null);
    const audioCtxRef = useRef(null);
    const ambientAudioRef = useRef(null);
    const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
    const [headerEl, setHeaderEl] = useState(null);

    // Auto-focus input when animation finishes
    useEffect(() => {
        if (gridStatus === 'IDLE' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gridStatus]);

    // --- AUDIO: MUTED MORSE CODE TYPING ---
    const playKeystroke = () => {
        try {
            if (!audioCtxRef.current) return;
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(750, ctx.currentTime); 
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
    };

    // --- AUDIO: LOAD AND PLAY MOVIE MP3 VIA WEB AUDIO API ---
    const playWarpSound = async () => {
        try {
            const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
            
            // Fetch and decode the custom asset audio stream
            const response = await fetch(warpSoundUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            
            // Create buffer source node
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            
            // Attach gain node for optional safety limits
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
            
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            source.start(ctx.currentTime);
        } catch (e) {
            console.error("Failed to load or play warp asset file:", e);
        }
    };

    // --- AUDIO: AMBIENT MUSIC (Daft Punk) ---
    const toggleAmbientMusic = () => {
        try {
            if (!ambientAudioRef.current) {
                const audio = new Audio(tronTrackUrl);
                audio.loop = true;
                audio.volume = 0.25;
                ambientAudioRef.current = audio;
            }
            const track = ambientAudioRef.current;
            if (isAmbientPlaying) {
                track.pause();
                setIsAmbientPlaying(false);
            } else {
                track.play().then(() => setIsAmbientPlaying(true)).catch(() => {});
            }
        } catch(e){}
    };

    useEffect(() => {
        return () => {
            if (ambientAudioRef.current) ambientAudioRef.current.pause();
        };
    }, []);

    useEffect(() => {
        setHeaderEl(document.querySelector('.header__titleblock'));
    }, []);

    // --- ANIMATION: LINE-BY-LINE TYPEWRITER ---
    const startTypingSequence = async () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
            if (audioCtxRef.current.state === 'suspended') {
                await audioCtxRef.current.resume();
            }
        } catch (e) {}

        setGridStatus('TYPING');
        setTerminalHistory([]);

        let currentHistory = [];

        for (let i = 0; i < INITIAL_LINES.length; i++) {
            const line = INITIAL_LINES[i];
            currentHistory.push({ text: '', color: line.color });
            setTerminalHistory([...currentHistory]);

            for (let j = 0; j < line.text.length; j++) {
                currentHistory[currentHistory.length - 1].text += line.text[j];
                setTerminalHistory([...currentHistory]);
                
                playKeystroke();
                await new Promise(r => setTimeout(r, 5 + Math.random() * 15)); 
            }
            await new Promise(r => setTimeout(r, 150)); 
        }

        setGridStatus('IDLE');
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const cmd = inputValue.trim().toLowerCase();
        
        const newHistory = [...terminalHistory, { text: `flynn@mcp:~$ ${inputValue}`, color: "#f0fafa" }];

        if (cmd === 'yes' || cmd === 'y') {
            newHistory.push({ text: "ACCESS GRANTED. INITIATING LASER SEQUENCE...", color: "#00bafa" });
            setTerminalHistory(newHistory);
            setInputValue('');
            
            playWarpSound();
            
            // Delays visual swap to align nicely right when the asset audio hits its peak impact state
            setTimeout(() => {
                setGridStatus('BOOTING');
                setTimeout(() => {
                    setGridStatus('ONLINE');
                }, 1500);
            }, 1800); 
            
        } else if (cmd === 'no' || cmd === 'n') {
            newHistory.push({ text: "CONNECTION REJECTED. TERMINAL IDLE.", color: "#fe006f" });
            newHistory.push({ text: "PROCEED AND INTERCONNECT WITH THE GRID? (TYPE 'YES' OR 'NO')", color: "#c0f3ff" });
            setTerminalHistory(newHistory);
            setInputValue('');
        } else {
            newHistory.push({ text: `ERROR: UNRECOGNIZED COMMAND '${cmd}'`, color: "#fe006f" });
            newHistory.push({ text: "PROCEED AND INTERCONNECT WITH THE GRID? (TYPE 'YES' OR 'NO')", color: "#c0f3ff" });
            setTerminalHistory(newHistory);
            setInputValue('');
        }
    };

    // 1. STANDBY GATEWAY
    if (gridStatus === 'STANDBY') {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#0a0c0D', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
                <div 
                    onClick={startTypingSequence}
                    style={{ background: '#020204', border: '2px solid #004d66', padding: '30px', width: '100%', maxWidth: '800px', minHeight: '400px', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '1rem', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,186,250,0.1)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <div style={{ color: '#537a85', animation: 'blink 1.2s step-end infinite' }}>
                        &gt; SYSTEM STANDBY. CLICK TERMINAL TO WAKE...
                    </div>
                </div>
                <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
            </div>
        );
    }

    // 2. TYPING / IDLE INTERACTIVE TERMINAL
    if (gridStatus === 'TYPING' || gridStatus === 'IDLE') {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#0a0c0D', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
                <div 
                    onClick={() => { if (gridStatus === 'IDLE' && inputRef.current) inputRef.current.focus(); }}
                    style={{ background: '#020204', border: '2px solid #004d66', padding: '30px', width: '100%', maxWidth: '800px', minHeight: '400px', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '1rem', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,186,250,0.1)', cursor: gridStatus === 'IDLE' ? 'text' : 'default', display: 'flex', flexDirection: 'column' }}
                >
                    {terminalHistory.map((line, idx) => (
                        <div key={idx} style={{ color: line.color, marginBottom: '8px', lineHeight: '1.4' }}>
                            {line.text}
                        </div>
                    ))}

                    {gridStatus === 'IDLE' && (
                        <form onSubmit={handleCommandSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ color: '#febe0b', marginRight: '10px' }}>flynn@mcp:~$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoComplete="off"
                                spellCheck="false"
                                style={{ background: 'transparent', border: 'none', color: '#00bafa', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '1rem', outline: 'none', flex: 1, caretColor: '#00bafa' }}
                            />
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // 3. GLITCHED TRANSITION MATRIX
    if (gridStatus === 'BOOTING') {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999, fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                <h2 style={{ color: '#00bafa', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.5rem', textAlign: 'center' }}>
                    &gt; INITIALIZING DIGITAL MOLECULAR DISASSEMBLY...
                </h2>
                <p style={{ color: '#febe0b', textAlign: 'center' }}>Loading Grid Matrix Vector Arrays...</p>
            </div>
        );
    }

    // 4. THE MAIN EXHIBIT CONTENT FLOW
    return (
        <div style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px', margin: '60px auto 0 auto', padding: '0 20px', boxSizing: 'border-box', overflow: 'hidden' }}>
            
            {/* STICKY NAVIGATION PROGRESS BAR */}
            {typeof document !== 'undefined' && createPortal(
                <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99998, background: 'rgba(2, 2, 4, 0.95)', borderBottom: '1px solid #004d66', padding: '6px 10px', backdropFilter: 'blur(8px)' }}>
                    <style>{`
                        @media (max-width: 480px) {
                            .nav-progress { gap: 4px !important; font-size: 0.55rem !important; padding: 2px 0 !important; }
                            .nav-progress span { display: none !important; }
                            .nav-progress a { padding: 3px 5px !important; }
                        }
                    `}</style>
                    <div className="nav-progress" style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem' }}>
                        <a href="#phase-1-intuition" style={{ color: '#00bafa', textDecoration: 'none', padding: '3px 6px', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#00bafa'; }} onMouseOut={(e) => { e.target.style.borderColor = 'transparent'; }}>
                            01 INTUITION
                        </a>
                        <span style={{ color: '#004d66' }}>|</span>
                        <a href="#phase-2-theory" style={{ color: '#00bafa', textDecoration: 'none', padding: '3px 6px', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#00bafa'; }} onMouseOut={(e) => { e.target.style.borderColor = 'transparent'; }}>
                            02 THEORY
                        </a>
                        <span style={{ color: '#004d66' }}>|</span>
                        <a href="#phase-3-diagram" style={{ color: '#00bafa', textDecoration: 'none', padding: '3px 6px', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#00bafa'; }} onMouseOut={(e) => { e.target.style.borderColor = 'transparent'; }}>
                            03 DIAGRAM
                        </a>
                        <span style={{ color: '#004d66' }}>|</span>
                        <a href="#phase-4-challenge" style={{ color: '#00bafa', textDecoration: 'none', padding: '3px 6px', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#00bafa'; }} onMouseOut={(e) => { e.target.style.borderColor = 'transparent'; }}>
                            04 CHALLENGE
                        </a>
                        <span style={{ color: '#004d66' }}>|</span>
                        <a href="#references" onClick={() => setRefsOpen(true)} style={{ color: '#00bafa', textDecoration: 'none', padding: '3px 6px', border: '1px solid transparent', transition: 'all 0.2s' }} onMouseOver={(e) => { e.target.style.borderColor = '#00bafa'; }} onMouseOut={(e) => { e.target.style.borderColor = 'transparent'; }}>
                            05 REFS
                        </a>
                    </div>
                </nav>,
                document.body
            )}
            
            {headerEl && createPortal(
                <button 
                    onClick={toggleAmbientMusic}
                    style={{
                        background: isAmbientPlaying ? 'rgba(0, 186, 250, 0.1)' : 'transparent',
                        border: `1px solid ${isAmbientPlaying ? '#00bafa' : '#004d66'}`,
                        borderRadius: '2px',
                        color: isAmbientPlaying ? '#00bafa' : '#537a85',
                        padding: '4px 10px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontFamily: '"JetBrains Mono", "Courier New", monospace',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px'
                    }}
                >
                    {isAmbientPlaying ? "Soundtrack On" : "Soundtrack Off"}
                </button>,
                headerEl
            )}
            
            <div style={{ width: '100%', borderBottom: '1px dashed #004d66', paddingBottom: '20px', marginBottom: '30px' }}>
                <style>{`
                    @media (max-width: 600px) {
                        .intro-title { font-size: 1.1rem !important; }
                        .intro-text { font-size: 0.8rem !important; }
                        .phase-heading { font-size: 1rem !important; }
                        .phase-subheading { font-size: 0.8rem !important; }
                        .phase-description { font-size: 0.78rem !important; }
                    }
                `}</style>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.2rem' }}>flynn@mcp:~$</span>
                    <h1 className="intro-title" style={{ color: '#00bafa', margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        ./execute_fde_core.sh
                    </h1>
                </div>
                <p className="intro-text" style={{ color: '#c0f3ff', margin: '15px 0 0 0', lineHeight: '1.6' }}>
                    &gt; Welcome to the Grid mainframe. Your CPU executes billions of Fetch-Decode-Execute cycles every second. Think of it like a chef in a kitchen: first they <strong style={{ color: '#00bafa' }}>FETCH</strong> the recipe card (instruction) from the shelf (memory), then they <strong style={{ color: '#8338ec' }}>DECODE</strong> what ingredients and steps are needed, and finally they <strong style={{ color: '#fe006f' }}>EXECUTE</strong> by chopping, mixing, and cooking. Let's explore each stage together.
                </p>
            </div>

            <div id="phase-1-intuition" style={{ width: '100%' }}>
                <CPUHeartbeat_Group2_InstinctGame triggerTrackDirectly={true} isAmbientPlaying={isAmbientPlaying} toggleAmbientMusic={toggleAmbientMusic} />
            </div>

            <hr style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '50px 0', width: '100%' }} />

            {/* PHASE 2: THE THEORY BRIEFING */}
            <div id="phase-2-theory" style={{ width: '100%', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span className="phase-subheading" style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>flynn@mcp:~/phase_2$</span>
                    <h2 className="phase-heading" style={{ color: '#00bafa', margin: 0, fontSize: '1.2rem' }}>./read_briefing.sh</h2>
                </div>
                <p className="phase-description" style={{ color: '#c0f3ff', margin: 0, lineHeight: '1.6', marginBottom: '20px' }}>
                    &gt; Hardware logic requires precision. Review the architecture briefing below and submit the correct system flags to proceed.
                </p>
                <CPUHeartbeat_Group2_FdeTheoryRoom />
            </div>

            <hr style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '50px 0', width: '100%' }} />

            {/* PHASE 3: INTERACTIVE CPU BLOCK DIAGRAM */}
            <div id="phase-3-diagram" style={{ width: '100%', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span className="phase-subheading" style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>flynn@mcp:~/phase_3$</span>
                    <h2 className="phase-heading" style={{ color: '#00bafa', margin: 0, fontSize: '1.2rem' }}>cat hardware_routing.log</h2>
                </div>
                <p className="phase-description" style={{ color: '#c0f3ff', margin: 0, lineHeight: '1.6', marginBottom: '20px' }}>
                    &gt; Analyze how custom logic gates process data streams. Select the stages below to track trace currents through the hardware buses.
                </p>
                <CPUHeartbeat_Group2_FdeDiagram />
            </div>

            <hr style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '50px 0', width: '100%' }} />

            {/* PHASE 4: CULMINATING DATA PATH CHALLENGE */}
            <div id="phase-4-challenge" style={{ width: '100%', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <span className="phase-subheading" style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>flynn@mcp:~/phase_4$</span>
                    <h2 className="phase-heading" style={{ color: '#00bafa', margin: 0, fontSize: '1.2rem' }}>sudo ./culminating_challenge.exe</h2>
                </div>
                <p className="phase-description" style={{ color: '#c0f3ff', margin: 0, lineHeight: '1.6' }}>
                    &gt; [AUTH REQUIRED] You have mapped out execution streams and clocked the register ticks. Now, demonstrate full system control by routing machine code blocks manually.
                </p>
            </div>
            
            <CPUHeartbeat_Group2_CulminatingActivity />

            <CPUHeartbeat_Group2_CitationsPanel initialOpen={refsOpen} />
        </div>
    );
}