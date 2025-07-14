import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
  { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
  { path: '/schedule', icon: 'fas fa-calendar-alt', label: 'Schedule' },
  { path: '/team', icon: 'fas fa-users', label: 'Team' },
  { path: '/materials', icon: 'fas fa-warehouse', label: 'Materials' },
  { path: '/documents', icon: 'fas fa-file-alt', label: 'Documents' },
  { path: '/messages', icon: 'fas fa-comments', label: 'Messages' },
];

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <div className={cn("hidden md:flex md:w-64 md:flex-col", className)}>
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-gray-800 border-r border-gray-700">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <i className="fas fa-hard-hat text-blue-500 text-2xl mr-3"></i>
          <h1 className="text-xl font-bold text-white">RoofManager</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={cn(
                "w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                location === item.path
                  ? "bg-blue-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <i className={cn(item.icon, "mr-3", location === item.path ? "text-blue-300" : "")}></i>
              {item.label}
              {item.label === 'Messages' && (
                <span className="bg-blue-500 text-white ml-auto inline-block py-0.5 px-2 text-xs rounded-full">
                  3
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">{initials}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white p-1"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
