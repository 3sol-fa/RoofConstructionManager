import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
  { path: '/projects', icon: 'fas fa-project-diagram', label: 'Projects' },
  { path: '/schedule', icon: 'fas fa-calendar-alt', label: 'Schedule' },
  { path: '/team', icon: 'fas fa-users', label: 'Team' },
  { path: '/messages', icon: 'fas fa-comments', label: 'Chat' },
];

export function MobileNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-2 z-50">
      <div className="flex justify-around">
        {mobileNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => setLocation(item.path)}
            className={cn(
              "flex flex-col items-center py-2 transition-colors",
              location === item.path ? "text-blue-500" : "text-gray-400"
            )}
          >
            <i className={cn(item.icon, "text-lg")}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
