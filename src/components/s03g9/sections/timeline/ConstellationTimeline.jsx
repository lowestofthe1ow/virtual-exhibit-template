import React, { useState } from 'react';

export default function ConstellationTimeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const [burstStar, setBurstStar] = useState(null);


  const events = [
    { 
      id: 0, x: 20, y: 20, // Top Left
      title: "1. Alarm Appears", timestamp: "T-Minus 5 Mins",
      what: "The 1202 Program Alarm flashes.", why: "AGC is out of core memory space."
    },
    { 
      id: 1, x: 80, y: 20, // Top Right
      title: "2. Computer Overloaded", timestamp: "Descent Orbit",
      what: "Hardware radar switch steals 15% of processing.", why: "Causes the memory overload."
    },
    { 
      id: 2, x: 65, y: 50, // Middle Right
      title: "3. Mission Control Reviews", timestamp: "30 Secs Later",
      what: "Houston evaluates the alarm.", why: "Must decide to abort or trust the computer."
    },
    { 
      id: 3, x: 40, y: 50, // Middle Left
      title: "4. Low-Priority Work Dropped", timestamp: "Real-Time",
      what: "AGC uses preemptive priority scheduling.", why: "Sheds unimportant tasks to survive."
    },
    { 
      id: 4, x: 80, y: 80, // Bottom Right
      title: "5. The 'GO' is Given", timestamp: "Alt: 33,000 Ft",
      what: "Jack Garman says 'We're Go on that alarm.'", why: "Landing trajectory remains safe."
    },
    { 
      id: 5, x: 45, y: 80, // Bottom Center 
      title: "6. Landing Continues", timestamp: "Touchdown",
      what: "Armstrong takes manual control.", why: "The Eagle lands safely."
    }
  ];

  const handleStarClick = (id) => {
    if (id === activeStep + 1) {
      setActiveStep(id);
      setBurstStar(id);
      setTimeout(() => setBurstStar(null), 560);
    }
  };

  const isComplete = activeStep >= events.length - 1;

  // Calculate angle between current star and next star
  const getRocketRotation = () => {
    if (activeStep < 0) return 45; // Default starting angle
    if (activeStep >= events.length - 1) return -90; // Point up when finished

    const current = events[activeStep];
    const next = events[activeStep + 1];
    
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return angle + 45; 
  };


  // Generate 40 random stars for the background
  const backgroundStars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2, 
    delay: Math.random() * 5
  }));

return (
    <div style={{ width: '100%', margin: '2rem 0' }}>

      {/* HORIZONTAL SCROLL WRAPPER */}
      <div style={{ 
        width: '100%', 
        overflowX: 'auto', 
        WebkitOverflowScrolling: 'touch', 
        paddingBottom: '20px' 
      }}>
        
        {/* INNER TIMELINE CONTAINER */}
        <div className="card timeline-container" style={{ 
          position: 'relative', 
          width: '100%', 
          minWidth: '1000px', 
          height: '700px', 
          padding: 'var(--space-md)', 
          overflow: 'hidden'
        }}>

          {/* Animated Background Stars */}
          {backgroundStars.map((star) => (
            <div
              key={`bg-${star.id}`}
              className="bg-star"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                '--twinkle-duration': `${star.duration}s`,
                animationDelay: `${star.delay}s`
              }}
            />
          ))}
          
          {/* Connecting Lines */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            {events.map((ev, index) => {
              if (index === 0) return null;
              const prev = events[index - 1];
              const isConnected = activeStep >= index;
              return (
                <line 
                  key={`line-${index}`}
                  x1={`${prev.x}%`} y1={`${prev.y}%`}
                  x2={`${ev.x}%`} y2={`${ev.y}%`}
                  stroke={isConnected ? "var(--amber)" : "var(--border)"}
                  strokeWidth={isConnected ? "4" : "2"}
                  style={{ transition: "stroke 1s ease-in-out" }}
                />
              );
            })}
          </svg>
          
        {/* Render Stars & Popups */}
          {events.map((ev, index) => {
            const isVisited = activeStep >= index;
            const isNext = activeStep + 1 === index;

            return (
              <div key={ev.id} style={{ position: 'absolute', left: `${ev.x}%`, top: `${ev.y}%`, zIndex: 100 }}>
                
                {/* Clickable Star */}
                <button 
                  onClick={() => handleStarClick(ev.id)}
                  className={burstStar === ev.id ? 'star-burst' : (isComplete && isVisited ? 'star-complete' : (isVisited ? 'star-glow' : (isNext ? 'star-flash' : '')))}
                  style={{
                    position: 'absolute', 
                    transform: 'translate(-50%, -50%)', 
                    zIndex: isNext ? 10 : 5,
                    width: isNext && !isComplete ? '44px' : '32px', 
                    height: isNext && !isComplete ? '44px' : '32px', 
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isNext ? 'pointer' : 'default',
                    transition: 'var(--transition)'
                  }}
                  aria-label={ev.title}
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    style={{ width: '100%', height: '100%', overflow: 'visible' }}
                  >
                    <path 
                      d="M 12 2 Q 13 11 22 12 Q 13 13 12 22 Q 11 13 2 12 Q 11 11 12 2 Z"
                      fill={isVisited ? 'var(--amber)' : (isNext ? 'white' : 'rgba(255,255,255,0.3)')} 
                      stroke="var(--text-primary)"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: isVisited ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                  opacity: isVisited ? 1 : 0.5,
                  pointerEvents: 'none'
                }}>
                  {ev.title}
                </div>

              </div>
            );
          })}
        

          {/* Rocket Icon */}
          <div 
            className="rocket-transition"
            style={{
              position: 'absolute',
              left: `${activeStep >= 0 ? events[activeStep].x : events[0].x}%`,
              top: `${activeStep >= 0 ? events[activeStep].y : events[0].y}%`,
              transform: `translate(-50%, -50%) rotate(${getRocketRotation()}deg)`,
              transition: 'left 1s ease-in-out, top 1s ease-in-out, transform 0.6s ease-in-out, filter 0.8s ease',
              fontSize: '2.5rem', 
              zIndex: 50, 
              pointerEvents: 'none',
              filter: isComplete ? 'drop-shadow(0 0 14px var(--amber))' : 'drop-shadow(0 0 8px rgba(167,139,250,0.6))'
            }}
          >
            🚀
          </div>

          {/* Mission Control Information Panel */}
          {activeStep >= 0 && activeStep < events.length && (
            <div 
              className="card border timeline-info-card"
              key={activeStep}
              style={{
                position: 'absolute',
                bottom: 'var(--space-md)',
                left: 'var(--space-md)',
                width: '320px',
                backgroundColor: 'rgba(9, 10, 15, 0.9)', 
                backdropFilter: 'blur(8px)',
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                zIndex: 300,
                boxShadow: 'var(--shadow-md)',
                borderLeft: '4px solid var(--amber)'
              }}
            >
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {events[activeStep].timestamp}
              </span>
              <h3 style={{ margin: '0 0 var(--space-sm) 0', color: 'var(--amber)', fontSize: '1.2rem' }}>
                {events[activeStep].title}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>STATUS UPDATE:</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    {events[activeStep].what}
                  </p>
                </div>
                
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>MISSION IMPACT:</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                    {events[activeStep].why}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <p className="timeline-scroll-hint">← SWIPE TO EXPLORE THE TIMELINE →</p>
    </div>
  );
}