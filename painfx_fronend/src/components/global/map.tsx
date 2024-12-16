import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export function LeafletMap({ latitude, longitude, zoom = 13 }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current as HTMLElement, {
        center: [latitude, longitude],
        zoom,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    } else {
      // Update map center and zoom
      mapRef.current.setView([latitude, longitude], zoom);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '300px' }} />;
}
