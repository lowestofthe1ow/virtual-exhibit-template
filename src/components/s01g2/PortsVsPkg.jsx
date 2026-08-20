import React, { useState, useRef, useEffect } from 'react';
import '../../styles/s01g2/ports-vs-pkg.css';

// Constant containing our simulation data
const COMPILER_LOGS = [
  "===> Fetching nginx-1.24.0.tar.gz",
  "===> Extracting for nginx-1.24.0",
  "===> Patching for nginx-1.24.0",
  "===> Configuring for nginx-1.24.0",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/nginx.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_log.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_palloc.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_array.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_list.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_hash.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_buf.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_queue.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/core/ngx_string.c",
  "cc -c -pipe -O2 -g -Wall -Wextra -Wpointer-arith src/os/unix/ngx_alloc.c",
  "===> Linking binary: nginx",
  "===> Staging for nginx-1.24.0",
  "===> Installing nginx-1.24.0 to /usr/local",
  "===> Cleaning up source files",
  "Done."
];

// Data for the What Just Happened panel
const POINTS = [
  {
    label: "Pkg finishes instantly",
    detail: "The package manager simply downloads and extracts a pre-compiled binary from FreeBSD's servers. It requires virtually zero CPU power and is ready in seconds."
  },
  {
    label: "Ports compiles from scratch",
    detail: "The terminal on the left downloaded raw C source code and used your local compiler (cc) to translate it into machine code line by line. This is a CPU-intensive process, which is why it took significantly longer."
  },
  {
    label: "Why choose the slower Ports method?",
    detail: "Compiling from source gives administrators absolute control. You can strip out unneeded features (saving RAM), enable experimental flags, and optimize the binary specifically for your server's exact CPU architecture. It yields a leaner, highly customized operating system."
  },
  {
    label: "The FreeBSD Ecosystem",
    detail: "Unlike many Linux distributions that force you into one method, FreeBSD officially supports and maintains both. Administrators can mix and match speed (pkg) and customization (Ports) on the exact same machine."
  }
];

export default function PortsVsPkg() {
  const [btnText, setBtnText] = useState("Execute Installation");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Pkg State
  const [pkgProgress, setPkgProgress] = useState(0);
  const [pkgLog, setPkgLog] = useState("Awaiting command...");
  const [pkgStatus, setPkgStatus] = useState("Waiting to start...");
  const [pkgStatusClass, setPkgStatusClass] = useState("status-indicator");

  // Ports State
  const [portsOutput, setPortsOutput] = useState([]);
  const [portsStatus, setPortsStatus] = useState("Waiting to start...");
  const [portsStatusClass, setPortsStatusClass] = useState("status-indicator");

  const compileIntervalRef = useRef(null);
  
  // Ref for auto-scrolling the terminal
  const terminalEndRef = useRef(null);

  // Automatically scroll to the bottom of the terminal when new logs appear
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [portsOutput]);

  const startSimulation = () => {
    setBtnDisabled(true);
    setBtnText("Installation in progress...");
    setShowExplanation(false);
    
    setPkgProgress(0);
    setPortsOutput([]);
    
    setPkgStatus("Downloading...");
    setPkgStatusClass("status-indicator status-active");
    
    setPortsStatus("Compiling Source Code...");
    setPortsStatusClass("status-indicator status-active");

    if (compileIntervalRef.current) clearInterval(compileIntervalRef.current);

    setTimeout(() => {
      setPkgProgress(100);
      setPkgLog("Successfully installed in 1.2s");
      setPkgStatus("COMPLETE");
      setPkgStatusClass("status-indicator status-done");
    }, 1200);

    let logIndex = 0;
    compileIntervalRef.current = setInterval(() => {
      if (logIndex < COMPILER_LOGS.length) {
        setPortsOutput((prevLogs) => [...prevLogs, COMPILER_LOGS[logIndex]]);
        logIndex++;
      } else {
        clearInterval(compileIntervalRef.current);
        setPortsStatus("COMPLETE");
        setPortsStatusClass("status-indicator status-done");
        setBtnText("Race Finished");
        
        setShowExplanation(true);
        
        setTimeout(() => {
          setBtnDisabled(false);
          setBtnText("Run Simulation Again");
        }, 3000);
      }
    }, 350);
  };

  return (
  
    <div className="minigame-wrapper px-4 md:px-8 w-full max-w-6xl mx-auto overflow-x-hidden">
      <div className="header-section">
        <h1 className="game-title">Software Installation: Ports vs. Pkg</h1>
        
        <div className="context-box">
          <p>FreeBSD provides two distinct methods for installing software on your system:</p>
          <ul className="context-list">
            <li><strong>1. The Pkg Manager (Binary):</strong> Similar to Linux's <code>apt</code> or Windows installers. It downloads a pre-compiled binary file that is ready to run immediately.</li>
            <li><strong>2. The Ports Collection (Source):</strong> A massive directory of build recipes. Instead of downloading a finished program, your server downloads the raw source code and uses its own CPU to compile and build the software locally.</li>
          </ul>
          <p className="instruction-text">Click the button below to simulate installing the Nginx web server using both methods simultaneously. Watch the difference in how the system processes them.</p>
        </div>
        
        <button 
          className="start-btn" 
          onClick={startSimulation} 
          disabled={btnDisabled}
        >
          <span className="btn-text">{btnText}</span>
          <span className="btn-icon">▶</span>
        </button>
      </div>

      <div className="race-track flex flex-col xl:flex-row gap-6 w-full mt-8">
        
   
        <div className="competitor-card ports-card w-full xl:w-1/2 min-w-0">
          <h2 className="comp-title">The Ports Collection</h2>
          <div className="badge ports-badge">Building from Source</div>
          
          <div className="terminal-window overflow-hidden w-full">
            <div className="terminal-header flex items-center gap-1 w-full overflow-hidden">
              <span className="dot red shrink-0"></span>
              <span className="dot yellow shrink-0"></span>
              <span className="dot green shrink-0"></span>
              <span className="term-title text-xs sm:text-sm truncate w-full ml-1">root@freebsd:/usr/ports/www/nginx # make install</span>
            </div>
            
            <div className="terminal-body w-full overflow-x-auto overflow-y-auto max-h-[250px] pb-2">
              {portsOutput.map((line, index) => (
                <div key={index} className="terminal-line whitespace-nowrap text-xs sm:text-sm pr-4">{line}</div>
              ))}
              <span className="cursor">_</span>
              <div ref={terminalEndRef} />
            </div>
          </div>
          <div className={portsStatusClass}>{portsStatus}</div>
        </div>

        {/* CHANGED: Replaced lg:w-1/2 with xl:w-1/2 */}
        <div className="competitor-card pkg-card w-full xl:w-1/2 min-w-0">
          <h2 className="comp-title">The Pkg Manager</h2>
          <div className="badge pkg-badge">Pre-compiled Binary</div>
          
          <div className="gui-window w-full overflow-hidden">
            <div className="gui-header">Package Installer</div>
            <div className="gui-body w-full">
              <div className="pkg-info flex justify-between w-full">
                <span className="pkg-name truncate mr-2">nginx-1.24.0.pkg</span>
                <span className="pkg-size shrink-0">2.4 MB</span>
              </div>
              <div className="progress-container w-full">
                <div 
                  className="progress-bar" 
                  style={{ width: `${pkgProgress}%` }}
                ></div>
              </div>
              <div className="log-output text-xs sm:text-sm">{pkgLog}</div>
            </div>
          </div>
          <div className={pkgStatusClass}>{pkgStatus}</div>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          showExplanation ? "max-h-[800px] opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-md border border-zinc-700 bg-zinc-900/80 p-6 font-mono">
          <h2 className="mb-5 text-sm tracking-widest text-red-400 uppercase">
            // What just happened
          </h2>
          <ul className="space-y-4 m-0 p-0" style={{ listStyle: 'none' }}>
            {POINTS.map((p) => (
              <li key={p.label} className="grid grid-cols-[auto_1fr] gap-3 text-sm">
                <span className="text-red-500 mt-0.5">▸</span>
                <span>
                  <span className="text-white font-semibold">{p.label}. </span>
                  <span className="text-zinc-400">{p.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}