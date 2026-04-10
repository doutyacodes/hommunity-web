"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (p: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

function MapUpdater({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { animate: true, duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  // Default to Bangalore/India or user's provided loc
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  
  const [position, setPosition] = useState<L.LatLng | null>(
    latitude && longitude ? new L.LatLng(latitude, longitude) : null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (position) {
      onChange(position.lat, position.lng);
    }
  }, [position]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setPosition(new L.LatLng(parseFloat(lat), parseFloat(lon)));
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Error searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[300px]">
      <div className="absolute top-4 left-4 z-[400] w-[calc(100%-80px)] md:w-80">
        <form onSubmit={handleSearch} className="flex bg-white shadow-md rounded-xl overflow-hidden border border-slate-200">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, neighborhood, or street..."
            className="flex-1 px-4 py-2.5 text-sm text-slate-900 outline-none w-full"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 font-bold text-xs transition-colors disabled:opacity-70"
          >
            {isSearching ? "..." : "Find"}
          </button>
        </form>
      </div>

      <MapContainer 
        center={position ? [position.lat, position.lng] : defaultCenter} 
        zoom={13} 
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <MapUpdater position={position} />
      </MapContainer>
    </div>
  );
}
