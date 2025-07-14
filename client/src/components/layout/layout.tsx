import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
