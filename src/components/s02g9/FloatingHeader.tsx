import React from 'react';

interface FloatingHeaderProps {
  roomName: string;
  roomDescription: string;
  onReturnToMap?: () => void;
}

const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  roomName,
  roomDescription,
  onReturnToMap,
}) => {
  return (
    <div className="floating-ui floating-header glass-panel">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="header-logo" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <text
              x="16"
              y="20"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="currentColor"
              fontFamily="monospace"
            >
              C2S
            </text>
          </svg>
        </div>

        <div className="header-info">
          <h1 className="room-title">{roomName}</h1>
          <p className="room-description">{roomDescription}</p>
        </div>
      </div>

      {/* Optional return to map button */}
      {onReturnToMap && (
        <div style={{ marginLeft: '12px' }}>
          <button
            type="button"
            className="glass-btn"
            aria-label="Return to museum map"
            onClick={onReturnToMap}
          >
            ⌂ Home
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingHeader;