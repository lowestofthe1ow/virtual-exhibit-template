import { useEffect, useRef, useState } from 'react';

export default function ImageSlideshow({ images, alt = '' }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      timeoutRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % images.length);
        setVisible(true);
      }, 200);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, [images.length]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '640px',
        height: '420px',
        overflow: 'hidden',
        borderRadius: '8px',
        margin: '1.5rem auto',
        background: 'rgba(0,0,0,0.35)',
      }}
    >
      <img
        src={images[index]}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
      />
    </div>
  );
}
