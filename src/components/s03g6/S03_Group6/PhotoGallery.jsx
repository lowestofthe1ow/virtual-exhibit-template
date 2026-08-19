import React, { useState, useEffect, useCallback } from 'react';

export default function PhotoGallery({ photos = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('next');

    if (!photos || photos.length === 0) return null;

    const currentPhoto = photos[currentIndex];

    const handleNext = useCallback(() => {
        setDirection('next');
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const handlePrev = useCallback(() => {
        setDirection('prev');
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    const handleSelectThumbnail = (index) => {
        if (index === currentIndex) return;
        setDirection(index > currentIndex ? 'next' : 'prev');
        setCurrentIndex(index);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    return (
        <>
            <style>{animationStyles}</style>

            <div style={styles.container}>
                <div style={styles.imageDisplayContainer}>
                    {currentPhoto.src && (
                        <React.Fragment key={`${currentIndex}-${direction}`}>
                            <img
                                src={currentPhoto.src}
                                alt=""
                                style={styles.blurredBackdrop}
                            />
                            <img
                                src={currentPhoto.src}
                                alt={currentPhoto.alt || currentPhoto.title || ''}
                                className={`gallery-animate-${direction}`}
                                style={styles.mainImage}
                            />
                        </React.Fragment>
                    )}

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                style={{ ...styles.navButton, ...styles.prevButton }}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                onClick={handleNext}
                                style={{ ...styles.navButton, ...styles.nextButton }}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </>
                    )}
                </div>

                <div style={styles.photoInfoSection}>
                    <div style={styles.infoTextWrapper}>
                        {currentPhoto.title && (
                            <h3 style={styles.title}>
                                {currentPhoto.title}
                            </h3>
                        )}
                        {currentPhoto.caption && (
                            <p style={styles.caption}>
                                {currentPhoto.caption}
                            </p>
                        )}
                    </div>

                    <div style={styles.counterBadge}>
                        {currentIndex + 1} / {photos.length}
                    </div>
                </div>

                {photos.length > 1 && (
                    <div style={styles.thumbnailsStrip}>
                        {photos.map((photo, idx) => {
                            const isActive = idx === currentIndex;
                            return (
                                <button
                                    key={photo.id || idx}
                                    onClick={() => handleSelectThumbnail(idx)}
                                    aria-label={`Thumbnail ${idx + 1}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    style={{
                                        ...styles.thumbnailButton,
                                        ...(isActive ? styles.thumbnailButtonActive : styles.thumbnailButtonInactive),
                                    }}
                                >
                                    <img
                                        src={photo.src}
                                        alt=""
                                        style={styles.thumbnailImage}
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

const animationStyles = `
  @keyframes slideInNext {
    from {
      opacity: 0;
      transform: scale(0.96) translateX(30px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }

  @keyframes slideInPrev {
    from {
      opacity: 0;
      transform: scale(0.96) translateX(-30px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateX(0);
    }
  }

  .gallery-animate-next {
    animation: slideInNext 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .gallery-animate-prev {
    animation: slideInPrev 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

const styles = {
    container: {
        width: '100%',
        margin: '32px auto',
        backgroundColor: '#020617',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
    },
    imageDisplayContainer: {
        position: 'relative',
        width: '100%',
        height: '420px',
        backgroundColor: '#020617',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blurredBackdrop: {
        position: 'absolute',
        top: '-5%',
        left: '-5%',
        width: '110%',
        height: '110%',
        objectFit: 'cover',
        filter: 'blur(24px) saturate(80%) brightness(40%)',
        zIndex: 0,
        transition: 'src 0.3s ease-in-out',
    },
    mainImage: {
        height: '88%',
        width: 'auto',
        objectFit: 'contain',
        zIndex: 1,
        borderRadius: '6px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontSize: '22px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
    },
    prevButton: {
        left: '16px',
    },
    nextButton: {
        right: '16px',
    },
    photoInfoSection: {
        backgroundColor: '#0f172a',
        borderTop: '1px solid #1e293b',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
    },
    infoTextWrapper: {
        flex: '1',
    },
    title: {
        margin: '0 0 6px 0',
        fontSize: '18px',
        color: '#f8fafc',
        fontWeight: '600',
    },
    caption: {
        margin: 0,
        fontSize: '14px',
        color: '#94a3b8',
        lineHeight: '1.5',
    },
    counterBadge: {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid #334155',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontFamily: 'monospace',
        color: '#cbd5e1',
        whiteSpace: 'nowrap',
    },
    thumbnailsStrip: {
        backgroundColor: '#020617',
        borderTop: '1px solid #1e293b',
        padding: '12px 20px',
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    thumbnailButton: {
        flex: 1,
        minWidth: '40px',
        height: '44px',
        borderRadius: '6px',
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        backgroundColor: '#0f172a',
        transition: 'all 0.2s ease',
    },
    thumbnailButtonActive: {
        border: '2px solid #38bdf8',
        opacity: 1,
    },
    thumbnailButtonInactive: {
        border: '2px solid transparent',
        opacity: 0.4,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
};