import React, { useState, useEffect, useRef } from 'react';
import styles from './CoinDropIntro.module.css';

export default function CoinDropIntro({ onBootComplete }) {
  const [hasBooted, setHasBooted] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  
  // States: 'dropping' -> 'aligning' -> 'inserting' -> 'typing' -> 'loading' -> 'fading'
  const [bootState, setBootState] = useState('dropping'); 
  const [typedText, setTypedText] = useState('');
  const fullText = "⚡ STARTING GAME... INITIALIZING PIPELINE... ⚡";

  useEffect(() => {
    // Production ready: Remembers if the user already dropped the coin
    const visited = sessionStorage.getItem('arcade_token_inserted');

    if (visited) {
      setHasBooted(true);
      if (onBootComplete) onBootComplete();
    } else {
      const timer = setTimeout(() => setIsEntering(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [onBootComplete]);

  useEffect(() => {
    if (bootState === 'typing') {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullText.length) {
          setTypedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setBootState('loading'), 300);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [bootState]);

  useEffect(() => {
    if (bootState === 'loading') {
      // INCREASED LOADING TIME: Changed from 1200ms to 2800ms (2.8 seconds)
      const timer = setTimeout(() => {
        setBootState('fading');
        setTimeout(() => {
          sessionStorage.setItem('arcade_token_inserted', 'true');
          setHasBooted(true);
          if (onBootComplete) onBootComplete();
        }, 700);
      }, 2800); 
      return () => clearTimeout(timer);
    }
  }, [bootState]);

  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'drop') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'boot') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {}
  };

  const handlePointerDown = (e) => {
    if (bootState !== 'dropping' || isEntering) return;
    
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId); 
    
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);

    const slotElement = document.getElementById('standalone-coin-slot');
    if (slotElement) {
      const rect = slotElement.getBoundingClientRect();
      
      if (
        e.clientX >= rect.left - 60 &&
        e.clientX <= rect.right + 60 &&
        e.clientY >= rect.top - 60 &&
        e.clientY <= rect.bottom + 60
      ) {
        const tokenRect = e.target.getBoundingClientRect();
        const targetX = position.x + (rect.left + rect.width / 2) - (tokenRect.left + tokenRect.width / 2);
        const targetY = position.y + (rect.top + rect.height / 2) - (tokenRect.top + tokenRect.height / 2);

        setBootState('aligning');
        setPosition({ x: targetX, y: targetY - 60 }); 
        
        setTimeout(() => {
          setBootState('inserting');
          setPosition({ x: targetX, y: targetY + 30 }); 
          playSound('drop');
        }, 250);
        
        setTimeout(() => {
          setBootState('typing');
          playSound('boot');
        }, 650);
        return;
      }
    }
    
    setPosition({ x: 0, y: 0 });
  };

  if (hasBooted) return null;

  return (
    <div 
      className={`
        ${styles.blackoutOverlay} 
        ${isEntering ? styles.crtPowerOn : ''}
        ${bootState === 'typing' || bootState === 'loading' ? styles.screenShake : ''}
        ${bootState === 'fading' ? styles.fadeOutOverlay : ''}
      `}
      style={{ pointerEvents: 'auto' }}
    >
      {(bootState === 'dropping' || bootState === 'aligning' || bootState === 'inserting') && (
        <div className={`${styles.isolatedStage} ${isEntering ? styles.stageEntranceDrop : ''}`}>
          
          <div className={styles.promptHeader} style={{ 
            pointerEvents: 'none', 
            transition: 'opacity 0.3s', 
            opacity: (bootState === 'aligning' || bootState === 'inserting') ? 0 : 1 
          }}>
            <p className={styles.promptMain}>DRAG TOKEN TO COIN SLOT</p>
          </div>

          <div
            className={styles.arcadeToken}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            draggable={false} 
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${isDragging ? 1.1 : 1})`,
              opacity: bootState === 'inserting' ? 0 : 1,
              cursor: (bootState === 'aligning' || bootState === 'inserting') ? 'default' : (isDragging ? 'grabbing' : 'grab'),
              zIndex: 9999,
              touchAction: 'none', 
              userSelect: 'none',
              WebkitUserDrag: 'none',
              transition: isDragging 
                ? 'none' 
                : bootState === 'inserting'
                  ? 'transform 0.3s ease-in, opacity 0.2s ease-in 0.1s' 
                  : bootState === 'aligning'
                    ? 'transform 0.25s ease-out' 
                    : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
            }}
          >
            <span className={styles.tokenSymbol}>TOKEN</span>
          </div>

          <div className={styles.coinSlotWrapper} id="standalone-coin-slot">
            <div className={styles.slotOpening}>
              <div className={styles.slotGlow} style={{ 
                opacity: bootState === 'inserting' ? 1 : 0.6,
                transform: bootState === 'inserting' ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }} />
            </div>
            <span className={styles.slotText}>COIN SLOT</span>
          </div>
        </div>
      )}

      {(bootState === 'typing' || bootState === 'loading' || bootState === 'fading') && (
        <div className={styles.terminalBootScreen}>
          <h1 className={styles.terminalText}>
            {typedText}
            {bootState === 'typing' && <span className={styles.cursor}>_</span>}
          </h1>

          {(bootState === 'loading' || bootState === 'fading') && (
            <div className={styles.loadingBarContainer}>
              {/* SLOWED DOWN THE BAR FILL ANIMATION TO MATCH THE NEW TIMER */}
              <div className={styles.loadingBarFill} style={{ animationDuration: '2.5s' }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}