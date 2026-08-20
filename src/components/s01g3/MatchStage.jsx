"use client";
import {useState, useRef, useEffect} from "react";

export default function MatchStage({ setStage, setAnswers, currentAnswers }) {
  // Define descriptions and its correct zone
 const[items, setItems] = useState([
    {id: 1, text: "The first Wi-Fi standard, introducing wireless networking on the 2.4 GHz band with speeds up to 2 Mbps.", correctZone: "IEEE 802.11"},
    {id: 2, text: "An early 2.4 GHz Wi-Fi standard that increased speeds up to 11 Mbps.", correctZone: "IEEE 802.11b"},
    {id: 3, text: "The first Wi-Fi standard to use OFDM (Orthogonal Frequency Division Multiplexing), providing higher data rates and supporting multiple transmission speeds on the 5 GHz band.", correctZone: "IEEE 802.11a"},
    {id: 4, text: "Brought OFDM multi-carrier modulation to the 2.4 GHz band, offering an affordable upgrade to 54 Mbps", correctZone: "IEEE 802.11g"},
    {id: 5, text: "Introduced MIMO (Multiple-Input Multiple-Output) technology and first to support dual-band operations (simultaneous 2.4 GHz and 5 GHz)", correctZone: "IEEE 802.11n (Wi-Fi 4)"},
    {id: 6, text: "Operating exclusively in the 5 GHz band to achieve gigabit speeds, this standard eliminated network lag by debuting MU-MIMO for simultaneous transmission to multiple devices and directional beamforming to target signals directly at clients.", correctZone: "IEEE 802.11ac (Wi-Fi 5)"},
    {id: 7, text: "Designed for crowded environments, this standard introduced OFDMA to bundle data for multiple devices into a single transmission, while expanding bidirectional MU-MIMO across the 2.4 GHz and 5 GHz bands. ", correctZone: "IEEE 802.11ax (Wi-Fi 6 / 6E)"},
    {id: 8, text: "Introduced Multi-Link Operation (MLO) for simultaneous multi-band connections, doubled channel widths to 320 MHz, and utilized Multi-RU Puncturing to bypass channel interference for speeds up to 46 Gbps. ", correctZone: "IEEE 802.11be (Wi-Fi 7)"}
  ]);

  // Declare the zones
  const [zones, setZones] = useState({
    "IEEE 802.11": [],
    "IEEE 802.11b": [],
    "IEEE 802.11a": [],
    "IEEE 802.11g": [],
    "IEEE 802.11n (Wi-Fi 4)": [],
    "IEEE 802.11ac (Wi-Fi 5)": [],
    "IEEE 802.11ax (Wi-Fi 6 / 6E)": [],
    "IEEE 802.11be (Wi-Fi 7)": []
  });

  // Store item being dragged (PC)
  const [draggedItem, setDraggedItem] = useState(null);
  const draggedItemRef = useRef(null);

  // Store item being selected (Mobile)
  const [selectedItem, setSelectedItem] = useState(null);

  const placeItem = (item, zoneName) => {
    // Remove from source list
    setItems(prev => prev.filter(i => i.id !== item.id));

    // Check if answer is correct
    const isCorrect = item.correctZone === zoneName;

    // Add to target zone
    setZones(prev => ({
      ...prev,
      [zoneName]: [...prev[zoneName], { ...item, assignedZone: zoneName, isCorrect }]
    }));

    setSelectedItem(null);
  };

  // PC layout (Drag)
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    draggedItemRef.current = item;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, zoneName) => {
    e.preventDefault();
    const item = draggedItem || draggedItemRef.current;
    if (!item) return;

    placeItem(item, zoneName);
    setDraggedItem(null);
    draggedItemRef.current = null;
  };

  // Mobile Layout (Click)
  const handleItemClick = (item, e) => {
    e.stopPropagation();

    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleZoneClick = (zoneName, e) => {
    e.stopPropagation();
    if (!selectedItem) return;
    placeItem(selectedItem, zoneName);
  };

  // Move item back to list
  const moveBack = (item, zone, e) => {
    e.stopPropagation();
    setZones(prev => ({
      ...prev,
      [zone]: prev[zone].filter(i => i.id !== item.id)
    }));
    setItems(prev => [...prev, { id: item.id, text: item.text, correctZone: item.correctZone }]);
  };

  // Save results and go to next stage
  const goToMCQ = () => {
    const allMatches = [
      ...zones["IEEE 802.11"],
      ...zones["IEEE 802.11b"],
      ...zones["IEEE 802.11a"],
      ...zones["IEEE 802.11g"],
      ...zones["IEEE 802.11n (Wi-Fi 4)"],
      ...zones["IEEE 802.11ac (Wi-Fi 5)"],
      ...zones["IEEE 802.11ax (Wi-Fi 6 / 6E)"],
      ...zones["IEEE 802.11be (Wi-Fi 7)"]
    ];
    const allResults = [
      ...allMatches,
      ...items.map(item => ({
        ...item,
        assignedZone: "Not Answered",
        isCorrect: false
      }))
    ];
    setAnswers({ ...currentAnswers, matchResults: allResults });
    setStage("mcq");
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {items.map(item => (
            <div
              key={item.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={(e) => handleItemClick(item, e)}
              style={{
                padding: "12px 14px",
                background: selectedItem?.id === item.id ? "#bbdefb" : "#e3f2fd",
                border: selectedItem?.id === item.id ? "1px solid #1976d2" : "1px solid #002270a7",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "100%",
                minHeight: "44px",
                cursor: "pointer",
                touchAction: "pan-y"
              }}
            >
              {item.text}
              {selectedItem?.id === item.id && <span style={{ marginLeft: 8, fontSize: 12, color: "#0d47a1" }}>Selected</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
        gap: "16px"
      }}>
        {[
          { key: "IEEE 802.11", label: "IEEE 802.11" },
          { key: "IEEE 802.11b", label: "IEEE 802.11b" },
          { key: "IEEE 802.11a", label: "IEEE 802.11a" },
          { key: "IEEE 802.11g", label: "IEEE 802.11g" },
          { key: "IEEE 802.11n (Wi-Fi 4)", label: "IEEE 802.11n (Wi-Fi 4)" },
          { key: "IEEE 802.11ac (Wi-Fi 5)", label: "IEEE 802.11ac (Wi-Fi 5)" },
          { key: "IEEE 802.11ax (Wi-Fi 6 / 6E)", label: "IEEE 802.11ax (Wi-Fi 6 / 6E)" },
          { key: "IEEE 802.11be (Wi-Fi 7)", label: "IEEE 802.11be (Wi-Fi 7)" }
        ].map(zone => (
          <div
            key={zone.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, zone.key)}
            onClick={(e) => handleZoneClick(zone.key, e)}
            className="drop-zone"
            style={{
              minHeight: "140px",
              padding: "14px",
              border: selectedItem ? "2px solid #64b5f6" : "2px dashed #999",
              borderRadius: "8px",
              background: selectedItem ? "#e3f2fd" : "#f9f9f9",
              cursor: "pointer"
            }}
          >
            <h4 style={{ marginTop: 0, fontSize: "17px" }}>{zone.label}</h4>
            {zones[zone.key].map(item => (
              <div
                key={item.id}
                style={{
                  padding: "8px 10px",
                  margin: "6px 0",
                  borderRadius: "4px",
                  background: "#002170",
                  border: "1px solid #002170",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff"
                }}
              >
                <span>{item.text}</span>
                <button
                  onClick={(e) => moveBack(item, zone.key, e)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#fff"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={goToMCQ}
        style={{
          marginTop: "24px",
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "6px",
          background: "#002170",
          color: "white",
          cursor: "pointer",
          width: "100%",
          maxWidth: "200px"
        }}
      >
        Next →
      </button>
    </div>
  );
}
