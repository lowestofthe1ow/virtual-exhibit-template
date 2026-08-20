import { useState } from "react";
import gpuTimeline from "../../data/s01g8/gpuTimeline.js";
import TimelineEvent from "./TimelineEvent.jsx";

export default function InteractiveTimeline() {

    // The currently selected event
    const [selectedEvent, setSelectedEvent] = useState(gpuTimeline[0]);

    return (
        <div>

            <h2>GPU Timeline</h2>

            <div>

                {gpuTimeline.map((event) => (

                    <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                    >
                        {event.year}
                    </button>

                ))}

            </div>

            <TimelineEvent event={selectedEvent} />

        </div>
    );

}