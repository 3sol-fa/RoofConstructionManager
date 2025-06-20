'use client'
import { Bell, Menu, MapPin, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectHeader } from "@/app/project-header-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { useState, useEffect } from "react";

export default function Header() {
  const { headerInfo } = useProjectHeader();
  const { data: projects } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(projects?.[0]?.id);
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);
  const currentProject = projects?.find(p => p.id === selectedProjectId) || projects?.[0];
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Select value={selectedProjectId?.toString()} onValueChange={v => setSelectedProjectId(Number(v))}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            {projects?.map(p => (
              <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
          onClick={() => setIsMapOpen(true)}
          title="View Location on Map"
        >
          <MapPin className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Map</span>
        </button>
        <div className="flex items-center gap-1 text-yellow-600 ml-2">
          <Sun className="w-5 h-5" />
          <span className="text-sm font-medium">Sunny, 25°C (77°F)</span>
        </div>
        <span className="ml-2 text-xs text-gray-700">{currentProject?.location?.address || 'No address info'}</span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            {headerInfo?.activityCount !== undefined && (
              <span className="text-[10px] text-white font-bold">{headerInfo.activityCount}</span>
            )}
          </span>
        </Button>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsMapOpen(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-2">{currentProject?.name || 'Project'} Location</h2>
            <div className="mb-2 text-sm text-gray-600">{currentProject?.location?.address || 'No address info'}</div>
            <iframe
              title="Google Map Preview"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${currentProject?.location?.lat || 40.7128},${currentProject?.location?.lng || -74.0060}&hl=en&z=16&output=embed`}
            ></iframe>
          </div>
        </div>
      )}
    </header>
  );
}
