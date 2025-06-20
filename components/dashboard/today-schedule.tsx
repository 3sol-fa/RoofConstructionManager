'use client'

import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Task } from "@shared/schema";

export default function TodaySchedule({ projectId }: { projectId?: number }) {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: [`/api/projects/${projectId ?? 1}/tasks`],
  });

  const today = new Date();
  const todayTasks = tasks?.filter(task => {
    const taskDate = new Date(task.startDate);
    return taskDate.toDateString() === today.toDateString();
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
    );
  }

  return (
    <div className="space-y-3">
          {todayTasks.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedule for today</h3>
          <p className="text-gray-500">Add a new task to get started.</p>
        </div>
      )}
      
          {todayTasks.map((task) => (
        <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
          {getStatusIcon(task.status)}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{task.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">
                {task.startDate ? format(new Date(task.startDate), 'HH:mm', { locale: ko }) : ''}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                {task.status === 'completed' ? 'Completed' : 
                 task.status === 'in_progress' ? 'In Progress' : 
                 task.status === 'pending' ? 'Pending' : task.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Progress</div>
            <div className="text-sm font-medium text-gray-900">{task.progress ?? 0}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}
