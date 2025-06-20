'use client'

import { useQuery } from "@tanstack/react-query";
import { Upload, CheckCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { Activity } from "@shared/schema";

export default function RecentActivities({ projectId }: { projectId?: number }) {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: [`/api/projects/${projectId ?? 1}/activities`],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'file_upload':
        return <Upload className="text-blue-500 w-4 h-4" />;
      case 'task_complete':
        return <CheckCircle className="text-green-500 w-4 h-4" />;
      default:
        return <AlertTriangle className="text-orange-500 w-4 h-4" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'file_upload':
        return 'bg-blue-100';
      case 'task_complete':
        return 'bg-green-100';
      default:
        return 'bg-orange-100';
    }
  };

  if (isLoading) {
    return (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
    );
  }

  return (
        <div className="space-y-4">
          {activities?.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
          No recent activities.
            </p>
          )}
          {activities?.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityBgColor(activity.activityType)}`}>
                {getActivityIcon(activity.activityType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
              {activity.createdAt ? formatDistanceToNow(new Date(activity.createdAt), { 
                    addSuffix: true, 
                    locale: ko 
              }) : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
  );
}
