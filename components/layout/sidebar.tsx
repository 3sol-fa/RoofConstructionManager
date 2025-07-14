'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Calendar, 
  Users, 
  Package, 
  MessageCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Drawings & Files", href: "/files", icon: FolderOpen },
  { name: "Project Schedule", href: "/schedule", icon: Calendar },
  { name: "Personnel", href: "/personnel", icon: Users },
  { name: "Materials", href: "/materials", icon: Package },
  { name: "Team Chat", href: "/chat", icon: MessageCircle, badge: 3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 bg-white border-r shadow-sm min-h-screen">
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <span className="text-lg font-bold text-primary tracking-tight">IPRO</span>
      </div>
      <nav className="flex-1 px-2 py-6 space-y-1">
        <Link href="/" className="block px-4 py-2 rounded hover:bg-gray-100">Dashboard</Link>
        <Link href="/chat" className="block px-4 py-2 rounded hover:bg-gray-100">Chat</Link>
        <Link href="/materials" className="block px-4 py-2 rounded hover:bg-gray-100">Materials</Link>
        <Link href="/personnel" className="block px-4 py-2 rounded hover:bg-gray-100">Personnel</Link>
        <Link href="/schedule" className="block px-4 py-2 rounded hover:bg-gray-100">Schedule</Link>
        <Link href="/files" className="block px-4 py-2 rounded hover:bg-gray-100">Files</Link>
      </nav>
      <div className="p-4 border-t flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-base font-bold">JD</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">John Doe</p>
          <p className="text-xs text-gray-500">Site Manager</p>
        </div>
      </div>
    </aside>
  );
}
