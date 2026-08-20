import { useState } from "react";
import "../../styles/s40g6/usb-exhibit.css";

const USB_TYPES = [
  {
    id: "usbA",
    name: "USB-A",
    color: "#378ADD",
    tagline: "The universal classic",
    specs: [
      { label: "Shape", value: "Flat rectangle" },
      { label: "Reversible", value: "No" },
      { label: "Max Speed", value: "USB 3.2 — 10 Gbps" },
      { label: "Max Power", value: "4.5W (5V / 0.9A)" },
      { label: "Introduced", value: "1996" },
    ],
    characteristics: [
      "Most common USB connector ever made",
      "Found on virtually every desktop PC and laptop from 2000–2020",
      "Used by flash drives, keyboards, mice, and USB hubs",
      "Only plugs in one way — flat side up",
      "Host-side only — always on the power source end",
      "Being phased out in favor of USB-C on modern devices",
    ],
    funFact: "There are estimated to be over 10 billion USB-A ports in use worldwide.",
  },
  {
    id: "usbB",
    name: "USB-B",
    color: "#1D9E75",
    tagline: "The peripheral workhorse",
    specs: [
      { label: "Shape", value: "Square with beveled top corners" },
      { label: "Reversible", value: "No" },
      { label: "Max Speed", value: "USB 3.2 — 10 Gbps (USB 3.0 B)" },
      { label: "Max Power", value: "4.5W (5V / 0.9A)" },
      { label: "Introduced", value: "1996" },
    ],
    characteristics: [
      "Almost exclusively found on the device end of printer and scanner cables",
      "Distinctly boxy, nearly square shape with two beveled top corners",
      "Designed to be plugged in rarely and left connected",
      "USB 3.0 version has an extra blue section on top for SuperSpeed",
      "Rarely seen on consumer devices today",
      "Still common in professional audio interfaces and MIDI controllers",
    ],
    funFact: "USB-B was specifically designed so it couldn't be confused with USB-A — the shapes are completely different to prevent mis-insertion.",
  },
  {
    id: "usbC",
    name: "USB-C",
    color: "#EFB800",
    tagline: "The universal future",
    specs: [
      { label: "Shape", value: "Symmetrical oval" },
      { label: "Reversible", value: "Yes — either way up" },
      { label: "Max Speed", value: "USB4 / Thunderbolt 4 — 40 Gbps" },
      { label: "Max Power", value: "240W (USB PD 3.1)" },
      { label: "Introduced", value: "2014" },
    ],
    characteristics: [
      "Reversible — inserts either way up thanks to symmetrical oval design",
      "Supports Thunderbolt 4 and DisplayPort Alt Mode for 4K monitors",
      "Can deliver up to 240W for charging laptops and even some monitors",
      "24 pins across two mirrored rows enable all its capabilities",
      "Single cable can carry power, data, and video simultaneously",
      "Now mandated by the EU as the universal charging standard",
      "Replacing all other USB types and even 3.5mm audio jacks on some devices",
    ],
    funFact: "The EU passed a law in 2022 requiring all small electronics sold in Europe to use USB-C by 2024 — forcing even Apple to switch from Lightning.",
  },
  {
    id: "microUsb",
    name: "Micro USB",
    color: "#D85A30",
    tagline: "The old Android standard",
    specs: [
      { label: "Shape", value: "Small trapezoid" },
      { label: "Reversible", value: "No" },
      { label: "Max Speed", value: "USB 2.0 — 480 Mbps" },
      { label: "Max Power", value: "9W (5V / 1.8A)" },
      { label: "Introduced", value: "2007" },
    ],
    characteristics: [
      "Standard charging port for Android phones from 2007 to ~2017",
      "Has a distinct top and bottom — cannot be plugged in upside down",
      "Much smaller than USB-A or USB-B, designed for compact devices",
      "Notoriously fragile — the port often breaks with heavy use",
      "Still found on budget devices, power banks, and accessories",
      "Largely replaced by USB-C on flagship and mid-range devices",
      "Also used in Micro USB-B variant for external hard drives",
    ],
    funFact: "Micro USB's fragility was such a common complaint that it was a major selling point when USB-C launched with its more robust design.",
  },
];

export default function UsbTypeGallery({ images }) {
  const [selected, setSelected] = useState(0);

  const resolveImg = (usbId) => {
    if (images && images[usbId]) {
      const img = images[usbId];
      return typeof img === "string" ? img : img?.src ?? String(img);
    }
    return `/src/assets/${usbId}.png`;
  };

  const type = USB_TYPES[selected];

  return (
    <div className="usb-exhibit-wrap" style={{ fontFamily: "var(--font-sans)", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
      {/* Tab selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {USB_TYPES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setSelected(i)}
            style={{
              padding: "10px 8px",
              borderRadius: "10px",
              border: selected === i ? `2px solid ${t.color}` : "1.5px solid var(--color-border-tertiary)",
              background: selected === i ? `${t.color}18` : "transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.15s",
            }}
          >
            <img src={resolveImg(t.id)} alt={t.name} style={{ width: "48px", height: "36px", objectFit: "contain" }} />
            <span style={{ fontSize: "12px", fontWeight: "600", color: selected === i ? t.color : "var(--color-text-secondary)" }}>
              {t.name}
            </span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      <div style={{
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: "14px",
        border: `1.5px solid ${type.color}44`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "600px",
      }}>
        {/* Header */}
        <div style={{
          background: `${type.color}18`,
          borderBottom: `1px solid ${type.color}33`,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexShrink: 0,
        }}>
          <img src={resolveImg(type.id)} alt={type.name} style={{ width: "80px", height: "60px", objectFit: "contain", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{
                background: type.color,
                color: type.id === "usbC" ? "#1a1200" : "#fff",
                fontSize: "11px", fontWeight: "700",
                padding: "2px 10px", borderRadius: "99px",
                whiteSpace: "nowrap",
              }}>{type.name}</span>
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--color-text-primary)" }}>{type.tagline}</div>
          </div>
        </div>

        {/* Specs + Characteristics */}
        <div style={{
          flex: 1,
          overflow: "auto",
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          boxSizing: "border-box",
        }}>
          {/* Specs */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: "12px" }}>
              Specifications
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {type.specs.map(s => (
                <div key={s.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  padding: "6px 0", borderBottom: "0.5px solid var(--color-border-tertiary)",
                  gap: "8px",
                }}>
                  <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)", flexShrink: 0 }}>{s.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--color-text-primary)", textAlign: "right" }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Characteristics */}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: "12px" }}>
              Key Characteristics
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "7px" }}>
              {type.characteristics.map((c, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
                  <span style={{ color: type.color, fontWeight: "700", flexShrink: 0 }}>→</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fun fact */}
        <div style={{
          margin: "0 24px 20px",
          padding: "12px 16px",
          background: `${type.color}12`,
          borderLeft: `3px solid ${type.color}`,
          borderRadius: "0 8px 8px 0",
          flexShrink: 0,
          boxSizing: "border-box",
        }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: type.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>Did you know? </span>
          <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>{type.funFact}</span>
        </div>
      </div>
    </div>
  );
}