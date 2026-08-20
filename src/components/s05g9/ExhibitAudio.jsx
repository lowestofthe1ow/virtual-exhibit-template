import { useEffect, useRef, useState } from 'react';
import bgmUrl from '../../assets/s05g9/exhibit_background_music.mp3';

const STORAGE_KEY = 'kumusta-audio-started';

export default function ExhibitAudio({ volume = 0.4 }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(bgmUrl);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    const alreadyStarted = sessionStorage.getItem(STORAGE_KEY) === 'true';

    if (alreadyStarted) {
      // Resume on first mouse move or touch (automatic to the user)
      const resume = () => {
        audio.play().catch(() => {});
        window.removeEventListener('mousemove', resume);
        window.removeEventListener('touchstart', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('mousemove', resume, { once: true });
      window.addEventListener('touchstart', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
    } else {
      const start = () => {
        if (!muted) {
          audio.play().catch(() => {});
          sessionStorage.setItem(STORAGE_KEY, 'true');
        }
      };
      window.addEventListener('click', start, { once: true });
      window.addEventListener('keydown', start, { once: true });

      return () => {
        audio.pause();
        window.removeEventListener('click', start);
        window.removeEventListener('keydown', start);
      };
    }

    return () => {
      audio.pause();
    };
  }, []);

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    setMuted(next);
    audio.muted = next;
    if (!next) {
      audio.play().catch(() => {});
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  }

  return (
    <button
      onClick={toggleMute}
      aria-label="Toggle music"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 99999,
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.2)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: '#ffffff',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
