import { useState } from "react";
import { timeline } from "../../data/s02g6/Timeline.js";
import InfoPanel from "./InfoPanel.jsx";
import PhilippineMap from "./PhilippineMap.jsx";

// Get sorted list of unique years that actually have entries
const availableYears = [...new Set(timeline.map((e) => e.year))].sort(
  (a, b) => a - b
);

export default function TimelineExhibit() {
  const [yearIndex, setYearIndex] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Determine if the user has started interacting with the timeline
  const hasStarted = yearIndex !== null;

  // Get the year corresponding to the current slider index
  const selectedYear = availableYears[yearIndex];

  // Show all events up to the selected year
  const visibleEvents = hasStarted
    ? timeline.filter((event) => event.year <= selectedYear)
    : [];

  // Default to the most recent visible event unless a marker was clicked
  const currentEvent = hasStarted
    ? selectedEvent ??
      (visibleEvents.length > 0 ? visibleEvents[visibleEvents.length - 1] : null)
    : null;
  
  // When the slider moves, clear any manually selected marker
  // so it falls back to "most recent event" behavior again
  const handleYearChange = (index) => {
    setYearIndex(index === -1 ? null : index);
    setSelectedEvent(null);
  };

  return (
    <section className="max-w-6xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">
        Evolution of Computing in the Philippines
      </h1>
      <p className="text-gray-300 mb-8">
        Drag the timeline to explore important milestones in Philippine
        computing history.
      </p>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>{availableYears[0]}</span>
          <span className="font-semibold">Selected Year: {selectedYear ?? "None"}</span>
          <span>{availableYears[availableYears.length - 1]}</span>
        </div>
        <input
          type="range"
          min="-1"
          max={availableYears.length - 1}
          step="1"
          value={yearIndex ?? -1}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="ph-slider w-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <PhilippineMap
          events={visibleEvents}
          selectedEvent={currentEvent}
          onSelectEvent={setSelectedEvent}
        />
        <InfoPanel event={currentEvent} />
      </div>
    </section>
  );
}