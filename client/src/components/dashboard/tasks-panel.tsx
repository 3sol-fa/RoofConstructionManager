import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { TaskWithProject } from '@/types';
import { apiRequest } from '@/lib/queryClient';

export function TasksPanel() {
  const queryClient = useQueryClient();
  
  const { data: tasks, isLoading } = useQuery<TaskWithProject[]>({
    queryKey: ['/api/tasks?today=true'],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number; status: string }) => {
      return apiRequest('PATCH', `/api/tasks/${taskId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    updateTaskMutation.mutate({
      taskId,
      status: completed ? 'completed' : 'pending'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return 'bg-red-900 text-red-300';
      case 'medium':
        return 'bg-blue-900 text-blue-300';
      case 'low':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const formatDueTime = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            <i className="fas fa-tasks mr-2 text-blue-400"></i>
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-700 rounded-lg border border-gray-600 animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          <i className="fas fa-tasks mr-2 text-blue-400"></i>
          Today's Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-check-circle text-4xl mb-2"></i>
              <p>No tasks for today</p>
              <p className="text-sm">Great job staying on top of your work!</p>
            </div>
          ) : (
            tasks?.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) => handleTaskToggle(task.id, !!checked)}
                    className="border-gray-400"
                  />
                  <div>
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-gray-400">
                        Due: {formatDueTime(task.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.status === 'completed' ? 'Done' : task.priority}
                </Badge>
              </div>
            ))
          )}
        </div>
        
        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
          <i className="fas fa-plus mr-2"></i>
          Add New Task
        </Button>
      </CardContent>
    </Card>
  );
}
