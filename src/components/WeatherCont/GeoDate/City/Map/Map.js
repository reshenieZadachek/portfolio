import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const OSMMap = ({ selectedCity, onMapClick }) => {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([55.7558, 37.6173], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Мой прогноз погоды'
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });
    }
  }, [onMapClick]);

  useEffect(() => {
    if (selectedCity && mapInstanceRef.current) {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      markerRef.current = L.marker([selectedCity.lat, selectedCity.lon]).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView([selectedCity.lat, selectedCity.lon], 10);
    }
  }, [selectedCity]);

  return (
  <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
  )
};

export default OSMMap;