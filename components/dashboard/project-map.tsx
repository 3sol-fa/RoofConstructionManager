'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo, useEffect, useState } from 'react';

export interface ProjectMapProps {
  projects: {
    id: number;
    name: string;
    location: string;
    lat: number;
    lng: number;
  }[];
  hoveredProjectId: number | null;
  onMapContainerClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

// Leaflet 마커 아이콘 기본 설정 (안 하면 아이콘 깨질 수 있음)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ProjectMap = ({ projects, hoveredProjectId, onMapContainerClick }: ProjectMapProps) => {
  const [mapReady, setMapReady] = useState(false);

  // projects가 바뀔 때마다 새로운 key 생성
  const mapKey = useMemo(() => projects.map(p => p.id).join('-'), [projects]);

  useEffect(() => {
    setMapReady(false);
    const timer = setTimeout(() => setMapReady(true), 0);
    return () => clearTimeout(timer);
  }, [mapKey]);

  if (projects.length === 0) return <p>No projects to show</p>;

  return (
    <div onClick={onMapContainerClick}>
      {mapReady && (
        <MapContainer
          key={mapKey}
          center={[38.89511, -77.03637]}
          zoom={9}
          style={{ height: 350, width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {projects.map(project => (
            <Marker key={project.id} position={[project.lat, project.lng]}>
              <Popup>
                {project.name}<br />
                {project.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default ProjectMap;
