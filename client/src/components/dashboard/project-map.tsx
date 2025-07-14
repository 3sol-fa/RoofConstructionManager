import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef } from 'react';

export function ProjectMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Leaflet map when component mounts
    if (mapRef.current && window.L) {
      const map = window.L.map(mapRef.current).setView([40.7128, -74.0060], 10);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Mock project locations
      const projects = [
        { name: 'Building A Roof', lat: 40.7128, lng: -74.0060, status: 'active' },
        { name: 'Warehouse Complex', lat: 40.7589, lng: -73.9851, status: 'planning' },
        { name: 'Office Building', lat: 40.6892, lng: -74.0445, status: 'completed' },
      ];

      // Add markers for each project
      projects.forEach(project => {
        const color = project.status === 'active' ? 'green' : 
                     project.status === 'planning' ? 'orange' : 'blue';
        
        const marker = window.L.circleMarker([project.lat, project.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.8,
          radius: 8
        }).addTo(map);

        marker.bindPopup(`<b>${project.name}</b><br/>Status: ${project.status}`);
      });

      // Cleanup function
      return () => {
        map.remove();
      };
    }
  }, []);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          <i className="fas fa-map-marked-alt mr-2 text-blue-400"></i>
          Project Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef}
          className="h-64 rounded-lg bg-gray-700 border border-gray-600"
          style={{ height: '256px' }}
        >
          {/* Fallback content if Leaflet is not available */}
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <i className="fas fa-map text-4xl mb-2"></i>
              <p>Interactive Map View</p>
              <p className="text-sm">Showing active project sites</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
