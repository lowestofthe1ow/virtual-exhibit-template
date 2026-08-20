import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setShow(false);
      return;
    }

    setShow(true);
    const interval = setInterval(() => {
      setProgress((p) => {
        const newProgress = p + Math.random() * 30;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (progress >= 90 && isVisible) {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setShow(false);
          onComplete?.();
        }, 300);
      }, 500);
    }
  }, [progress, isVisible, onComplete]);

  if (!show) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1>Cipher to Silicon</h1>
        <p>Virtual Museum</p>
        <div className="loading-spinner" />
        <p>Loading Exhibition...</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.round(progress)}%` }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;