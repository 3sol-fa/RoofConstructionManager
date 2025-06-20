'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, Calendar, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Personnel, User } from "@shared/schema";

export default function Personnel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: personnel, isLoading } = useQuery<Personnel[]>({
    queryKey: ['/api/projects/1/personnel'],
  });

  const { data: todayPersonnel } = useQuery<Personnel[]>({
    queryKey: ['/api/projects/1/personnel/today'],
  });

  // Mock user data for display
  const mockUsers = [
    { id: 1, name: "Kim Manager", role: "Site Manager", initials: "KM", status: "Active" },
    { id: 2, name: "Lee Worker", role: "Worker", initials: "LW", status: "Vacation" },
    { id: 3, name: "Park Worker", role: "Worker", initials: "PW", status: "Sick Leave" },
    { id: 4, name: "Choi Safety", role: "Safety Manager", initials: "CS", status: "Other" },
  ];

  const getUserById = (id: number) => {
    return mockUsers.find(user => user.id === id) || { id, name: "Unknown", role: "Unassigned", initials: "NA" };
  };

  const presentCount = todayPersonnel?.filter(p => p.isPresent).length || 0;
  const totalCount = mockUsers.length;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Personnel Management</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Personnel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Personnel</p>
                  <p className="text-3xl font-bold text-gray-900">{totalCount} persons</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Personnel</p>
                  <p className="text-3xl font-bold text-green-600">{presentCount} persons</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-green-500 h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Today's Present Personnel</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-orange-500 h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Today's Basis</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => {
          const userPersonnel = todayPersonnel?.find(p => p.userId === user.id);
          const isPresent = userPersonnel?.isPresent || false;
          const workHours = userPersonnel?.workHours || "0";

          return (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-white font-medium">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                  <Badge 
                    className={
                      isPresent 
                        ? "bg-green-100 text-green-800 hover:bg-green-100" 
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                      {isPresent ? "Present" : "Absent"}
                    </Badge>
                    <Badge
                      className={
                        user.status === 'Active' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        user.status === 'Vacation' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        user.status === 'Sick Leave' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {user.status}
                  </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Work Hours:</span>
                    <span className="font-medium">{workHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in Time:</span>
                    <span className="font-medium">
                      {isPresent ? "08:00" : "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Work Record
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mockUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No personnel registered</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Add the first team member to start managing personnel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
