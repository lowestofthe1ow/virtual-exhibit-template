import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const customIcon = new L.DivIcon({
  className: "custom-marker",
  html: `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" fill="#0038A8"/>
      <circle cx="16" cy="16" r="7" fill="#FCD116"/>
      <circle cx="16" cy="16" r="3" fill="#CE1126"/>
    </svg>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

const selectedIcon = new L.DivIcon({
  className: "custom-marker-selected",
  html: `
    <svg width="40" height="52" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" fill="#CE1126"/>
      <circle cx="16" cy="16" r="7" fill="#FCD116"/>
      <circle cx="16" cy="16" r="3" fill="#0038A8"/>
    </svg>
  `,
  iconSize: [40, 52],
  iconAnchor: [20, 52],
  popupAnchor: [0, -52],
});

const DEFAULT_CENTER = [12.8797, 121.774];
const DEFAULT_ZOOM = 6;
const FOCUS_ZOOM = 12;

function FlyToSelected({ selectedEvent }) {
  const map = useMap();
  const key = selectedEvent ? `${selectedEvent.year}-${selectedEvent.title}` : null;

  useEffect(() => {
    if (selectedEvent) {
      map.flyTo([selectedEvent.lat, selectedEvent.lng], FOCUS_ZOOM, {
        duration: 1.2,
      });
    }
  }, [key]);

  return null;
} 

export default function PhilippineMap({ events, selectedEvent, onSelectEvent }) {
  return (
    <div className="h-[500px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          const isSelected =
            selectedEvent?.title === event.title && selectedEvent?.year === event.year;
          return (
            <Marker
              key={`${event.year}-${event.title}`}
              position={[event.lat, event.lng]}
              icon={isSelected ? selectedIcon : customIcon}
              eventHandlers={{ click: () => onSelectEvent(event) }}
            >
              <Popup>
                <strong>{event.year}</strong> — {event.title}
              </Popup>
            </Marker>
          );
        })}
      <FlyToSelected selectedEvent={selectedEvent} />
      </MapContainer>
    </div>
  );
}