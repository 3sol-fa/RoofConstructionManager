'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export interface Project {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

export interface ProjectMapProps {
  projects: Project[];
  hoveredProjectId: number | null;
  onMapContainerClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

// 마커 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ProjectMap = ({ projects, hoveredProjectId, onMapContainerClick }: ProjectMapProps) => {
  const key = projects.map(p => p.id).join('-') + (hoveredProjectId ?? '');

  return (
    <div onClick={onMapContainerClick}>
      <MapContainer
        key={key}
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
    </div>
  );
};

export default ProjectMap;
