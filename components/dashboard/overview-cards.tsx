'use client'

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, HardHat, Calendar, DollarSign } from "lucide-react";
import type { Project } from "@shared/schema";

export default function OverviewCards({ projectId }: { projectId?: number }) {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const currentProject = projectId
    ? projects?.find(p => p.id === projectId)
    : projects?.[0];

  if (!currentProject) {
    return <div>Loading project information...</div>;
  }

  const remainingDays = Math.ceil((new Date(currentProject.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const budgetUsagePercent = Math.round((parseFloat(currentProject.budgetUsed || "0") / parseFloat(currentProject.budget || "1")) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900">{currentProject.progress}%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-500 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${currentProject.progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Personnel On Site</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <HardHat className="text-green-500 h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Present Today</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Days Remaining</p>
              <p className="text-3xl font-bold text-gray-900">{remainingDays} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-orange-500 h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Until scheduled completion</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Usage</p>
              <p className="text-3xl font-bold text-gray-900">{budgetUsagePercent}%</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-red-500 h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ₩{Math.round(parseFloat(currentProject.budgetUsed || "0") / 1000000)}M / 
            ₩{Math.round(parseFloat(currentProject.budget || "0") / 1000000)}M
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
