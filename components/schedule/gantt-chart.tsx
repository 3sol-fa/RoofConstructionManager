'use client'

import { useQuery } from "@tanstack/react-query";
import { format, startOfWeek, addDays } from "date-fns";
import { enUS, ko } from "date-fns/locale";
import type { Task } from "@shared/schema";

export default function GanttChart({ projectId }: { projectId?: number }) {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: [`/api/projects/${projectId ?? 1}/tasks`],
  });

  const getWeekDays = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getTaskBarWidth = (task: Task, dayIndex: number) => {
    // Simplified logic - in a real app, you'd calculate based on actual dates
    const taskDuration = Math.ceil((new Date(task.endDate).getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const progressWidth = ((task.progress ?? 0) / 100) * taskDuration;
    
    if (dayIndex < progressWidth) return 'w-full';
    if (dayIndex < taskDuration) return 'w-1/2';
    return '';
  };

  const getTaskBarColor = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const weekDays = getWeekDays();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Gantt Chart Header */}
        <div className="flex mb-4">
          <div className="w-48 flex-shrink-0 font-medium text-gray-700 text-sm py-2">
            Task Item
          </div>
          <div className="flex-1 grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day.toString()} className="text-center text-xs font-medium text-gray-600 py-2">
                {format(day, 'M/d', { locale: enUS })}
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Chart Rows */}
        {tasks?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks registered.</p>
          </div>
        )}
        
        {tasks?.map((task) => (
          <div key={task.id} className="flex items-center mb-2 border-b border-gray-100 pb-2">
            <div className="w-48 flex-shrink-0 text-sm text-gray-700 py-2">
              {task.name}
            </div>
            <div className="flex-1 grid grid-cols-7 gap-1 relative">
              {weekDays.map((_, dayIndex) => (
                <div key={dayIndex} className="h-8 flex items-center">
                  <div 
                    className={`h-4 rounded transition-all duration-200 ${getTaskBarWidth(task, dayIndex)} ${getTaskBarColor(task)}`}
                    title={`${task.name} - ${task.status}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Pending</span>
        </div>
      </div>
    </div>
  );
}
