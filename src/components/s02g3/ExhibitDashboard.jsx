/**
 * ExhibitDashboard.jsx
 *
 * Top-level 3-panel layout component that orchestrates:
 * - Left column: Table of Contents (top) + Quiz (bottom)
 * - Center: Content Viewer (image + description)
 * - Right: Scrollable Timeline
 */

import { useState } from "react";
import Timeline from "./Timeline.jsx";
import ExhibitViewer from "./ExhibitViewer.jsx";
import DistroQuiz from "./DistroQuiz.jsx";
import "../../styles/s02g3/dashboard.css";

export default function ExhibitDashboard({ nodes = [], headings = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="exhibit-dashboard">
      {/* ── Center viewer (Now occupies left & center) ── */}
      <div className="exhibit-center">
        <h2 className="exhibit-center__title">
          {selectedNode ? selectedNode.title : "Evolution of Windows OS"}
        </h2>
        <div className="exhibit-center__body">
          <ExhibitViewer node={selectedNode} />
        </div>
      </div>

      {/* ── Right column: Timeline ── */}
      <div className="exhibit-right">
        <Timeline
          nodes={nodes}
          onNodeSelect={setSelectedNode}
          activeNodeId={selectedNode?.id ?? null}
        />
      </div>

      {/* ── Bottom row: Quiz ── */}
      <div className="exhibit-quiz-section">
        <DistroQuiz />
      </div>
    </div>
  );
}
