import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      icon: 'fas fa-plus',
      label: 'New Project',
      action: () => setLocation('/projects/new'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: 'fas fa-user-plus',
      label: 'Add Worker',
      action: () => setLocation('/team/add'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: 'fas fa-upload',
      label: 'Upload File',
      action: () => setLocation('/documents/upload'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      icon: 'fas fa-calendar-plus',
      label: 'Schedule',
      action: () => setLocation('/schedule/new'),
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          <i className="fas fa-bolt mr-2 text-yellow-400"></i>
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              className={`p-3 ${action.color} text-white text-sm font-medium transition-colors text-center h-auto flex-col space-y-1`}
            >
              <i className={`${action.icon} text-lg`}></i>
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
