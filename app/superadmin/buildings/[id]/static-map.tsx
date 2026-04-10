"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface StaticMapProps {
  latitude: number;
  longitude: number;
}

export default function StaticMap({ latitude, longitude }: StaticMapProps) {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className="w-full h-full min-h-[300px] rounded-[32px] overflow-hidden border border-slate-100 shadow-inner">
      <MapContainer 
        center={position} 
        zoom={16} 
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon} />
      </MapContainer>
    </div>
  );
}
