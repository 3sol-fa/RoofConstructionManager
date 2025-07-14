import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskWithProject } from '@/types';

export default function Schedule() {
  const { data: tasks, isLoading } = useQuery<TaskWithProject[]>({
    queryKey: ['/api/tasks'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-300';
      case 'in_progress':
        return 'bg-blue-900 text-blue-300';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-900 text-red-300';
      case 'high':
        return 'bg-orange-900 text-orange-300';
      case 'medium':
        return 'bg-blue-900 text-blue-300';
      case 'low':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Schedule" />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const groupedTasks = tasks?.reduce((acc, task) => {
    const date = task.dueDate ? new Date(task.dueDate).toDateString() : 'No due date';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, TaskWithProject[]>) || {};

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    if (a === 'No due date') return 1;
    if (b === 'No due date') return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Schedule" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Task Schedule</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>
            New Task
          </Button>
        </div>

        {tasks?.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <i className="fas fa-calendar-alt text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">No tasks scheduled</h3>
              <p className="text-gray-400 mb-6">Create your first task to get started</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fas fa-plus mr-2"></i>
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((dateKey) => (
              <div key={dateKey}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <i className="fas fa-calendar mr-2 text-blue-400"></i>
                  {dateKey === 'No due date' ? 'No Due Date' : 
                   new Date(dateKey).toLocaleDateString('en-US', {
                     weekday: 'long',
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                   })}
                </h2>
                
                <div className="space-y-3">
                  {groupedTasks[dateKey].map((task) => (
                    <Card key={task.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            
                            {task.description && (
                              <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              {task.dueDate && (
                                <span>
                                  <i className="fas fa-clock mr-1"></i>
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              )}
                              <span>
                                <i className="fas fa-project-diagram mr-1"></i>
                                Project ID: {task.projectId}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <i className="fas fa-edit mr-1"></i>
                              Edit
                            </Button>
                            {task.status === 'pending' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <i className="fas fa-play mr-1"></i>
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
