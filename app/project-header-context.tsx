'use client'
import { createContext, useContext, useState } from 'react';

export const ProjectHeaderContext = createContext<any>(null);

export function ProjectHeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerInfo, setHeaderInfo] = useState<any>(null);
  return (
    <ProjectHeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
      {children}
    </ProjectHeaderContext.Provider>
  );
}

export function useProjectHeader() {
  return useContext(ProjectHeaderContext);
} 