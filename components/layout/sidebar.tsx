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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <h1 className="text-xl font-bold text-white">InterstatePRO</h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "text-white bg-primary"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
              {item.badge && (
                <span className="ml-auto bg-accent text-white text-xs rounded-full px-2 py-1">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">JD</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">John Doe</p>
            <p className="text-xs text-gray-500">Site Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
