import React from 'react';

interface InfoPanelProps {
  title: string;
  description: string;
  image?: string;
  buttonLabel?: string;
  onClose: () => void;
  onAction?: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ title, description, image, buttonLabel, onClose, onAction }) => {
  return (
    <aside className="tour-info-panel">
      <button type="button" className="tour-info-panel__close" onClick={onClose} aria-label="Close information panel">
        ×
      </button>
      <h3>{title}</h3>
      {image && <img src={image} alt={title} className="tour-info-panel__image" />}
      <p>{description}</p>
      {onAction && buttonLabel && (
        <button type="button" className="tour-info-panel__action" onClick={onAction}>
          {buttonLabel}
        </button>
      )}
    </aside>
  );
};

export default InfoPanel;
