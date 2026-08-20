import { useState } from "react";
import gpuTimeline from "../../data/s01g8/gpuTimeline.js";

export default function S01_Group8_InteractiveTimeline() {
  const [selectedEvent, setSelectedEvent] = useState(gpuTimeline[0]);

  return (
    <div className="timeline-layout">
      {/* Left Vertical Nodes */}
      <div className="timeline-nodes">
        {gpuTimeline.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className={`timeline-node ${selectedEvent.id === event.id ? "selected" : ""}`}
          >
            <div className="timeline-node-dot"></div>
            <p className="timeline-node-year">{event.year}</p>
            <p className="timeline-node-title">{event.title}</p>
            <p className="timeline-node-desc">
              {event.description.length > 60
                ? event.description.substring(0, 57) + "..."
                : event.description}
            </p>
          </div>
        ))}
      </div>

      {/* Right Detail Pane */}
      {selectedEvent && (
        <div className="timeline-pane">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.imageAlt}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain"
            }}
          />
          <p className="timeline-pane-year">ERA: {selectedEvent.year}</p>
          <h4 className="timeline-pane-title">{selectedEvent.title}</h4>
          <p className="timeline-pane-desc">{selectedEvent.description}</p>
        </div>
      )}
    </div>
  );
}
