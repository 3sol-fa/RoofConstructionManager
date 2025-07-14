'use client'
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectHeader } from "@/app/project-header-context";
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

  return (
    <header className="w-full h-16 bg-white shadow-sm flex items-center px-8 justify-between border-b">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl tracking-tight text-primary">InterstatePRO</span>
        <span className="ml-4 text-gray-400 text-xs font-semibold tracking-widest uppercase">Roof Construction Manager</span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {headerInfo?.activityCount !== undefined && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">{headerInfo.activityCount}</span>
            </span>
          )}
        </Button>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">JD</span>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
