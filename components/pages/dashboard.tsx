'use client'

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, HardHat, Calendar, DollarSign, Users, FileText, Clock, AlertTriangle, MapPin, Sun } from "lucide-react";
import OverviewCards from "@/components/dashboard/overview-cards";
import RecentActivities from "@/components/dashboard/recent-activities";
import RecentFiles from "@/components/dashboard/recent-files";
import TodaySchedule from "@/components/dashboard/today-schedule";
import GanttChart from "@/components/schedule/gantt-chart";
import type { Project } from "@shared/schema";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Dashboard() {
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(projects?.[0]?.id);
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  const currentProject = projects?.find(p => p.id === selectedProjectId) || projects?.[0];
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedProjectId?.toString()} onValueChange={v => setSelectedProjectId(Number(v))}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={() => setIsMapOpen(true)}
              title="View Location on Map"
            >
              <MapPin className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Map</span>
            </button>
            <div className="flex items-center gap-1 text-yellow-600 ml-2">
              <Sun className="w-5 h-5" />
              <span className="text-sm font-medium">Sunny, 25°C (77°F)</span>
            </div>
            {!currentProject?.location && (
              <span className="ml-2 text-xs text-gray-400">No location info, showing default (New York)</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}</span>
            </div>
          </div>
        </div>
        {/* 지도 미리보기 모달 */}
        {isMapOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setIsMapOpen(false)}>&times;</button>
              <h2 className="text-lg font-bold mb-2">{currentProject?.name || 'Project'} Location</h2>
              <div className="mb-2 text-sm text-gray-600">{currentProject?.location?.address || 'New York, NY, USA'}</div>
              <iframe
                title="Google Map Preview"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${currentProject?.location?.lat || 40.7128},${currentProject?.location?.lng || -74.0060}&hl=en&z=16&output=embed`}
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <OverviewCards projectId={currentProject?.id} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Activities and Schedule */}
          <div className="xl:col-span-2 space-y-6">
            {/* Recent Activities */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RecentActivities projectId={currentProject?.id} />
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <TodaySchedule projectId={currentProject?.id} />
              </CardContent>
            </Card>

            {/* Gantt Chart */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Project Progress Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <GanttChart projectId={currentProject?.id} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Files and Quick Actions */}
          <div className="space-y-6">
            {/* Recent Files */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="w-5 h-5 mr-2 text-orange-600" />
                  Recent Files
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RecentFiles projectId={currentProject?.id} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                    <Users className="w-5 h-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Personnel Assignment</p>
                      <p className="text-sm text-blue-700">Check Today's Personnel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                    <HardHat className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Materials Overview</p>
                      <p className="text-sm text-green-700">Required Materials</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                    <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">Schedule Management</p>
                      <p className="text-sm text-purple-700">Check Weekly Schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                    <FileText className="w-5 h-5 mr-3 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900">Upload Drawing</p>
                      <p className="text-sm text-orange-700">Register New Drawing</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-lg font-semibold text-indigo-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">12</p>
                      <p className="text-xs text-gray-500">Completed Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">8</p>
                      <p className="text-xs text-gray-500">Ongoing Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">5</p>
                      <p className="text-xs text-gray-500">Pending Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">2</p>
                      <p className="text-xs text-gray-500">Delayed Tasks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 