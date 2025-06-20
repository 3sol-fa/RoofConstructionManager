'use client'

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarIcon, Plus, Edit, Eye } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertTaskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import GanttChart from "@/components/schedule/gantt-chart";
import type { Task } from "@shared/schema";

const taskFormSchema = insertTaskSchema.extend({
  startDate: z.string(),
  endDate: z.string(),
});

export default function Schedule() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['/api/projects/1/tasks'],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: z.infer<typeof taskFormSchema>) => {
      const response = await apiRequest("POST", "/api/projects/1/tasks", {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects/1/tasks'] });
      toast({ title: "Task created successfully." });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ 
        title: "Failed to create task.", 
        variant: "destructive" 
      });
    },
  });

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "pending",
      progress: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof taskFormSchema>) => {
    createTaskMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const statusFilters = [
    { id: "all", name: "All" },
    { id: "pending", name: "Pending" },
    { id: "in_progress", name: "In Progress" },
    { id: "completed", name: "Completed" },
  ];

  const filteredTasks = tasks?.filter(task => {
    if (selectedStatus === "all") return true;
    return task.status === selectedStatus;
  }) || [];

  // Mock schedule data for Product Data and Shop Drawing
  const scheduleSubmissions = [
    {
      type: 'Product Data',
      submitDate: '2024-06-10',
      status: 'on_going',
    },
    {
      type: 'Shop Drawing',
      submitDate: '2024-06-15',
      status: 'submitted',
    },
  ];

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'on_going':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">On Going</Badge>;
      case 'submitted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Submitted</Badge>;
      case 'resubmitted':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Resubmitted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Project Schedule Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter task name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter task description" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTaskMutation.isPending}>
                      {createTaskMutation.isPending ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedStatus === filter.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(filter.id)}
              className={selectedStatus === filter.id ? "bg-primary hover:bg-primary/90" : ""}
            >
              {filter.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <GanttChart />
      </div>

      {/* Submission Schedule Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {scheduleSubmissions.map((item) => (
          <Card key={item.type}>
            <CardHeader>
              <CardTitle>{item.type} Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Submit Date:</span>
                <span className="text-gray-900">{item.submitDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Status:</span>
                {getSubmissionStatusBadge(item.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedStatus === "all" ? "No tasks registered" : `${statusFilters.find(f => f.id === selectedStatus)?.name} tasks not found`}
              </h3>
              <p className="text-gray-500">Add new tasks to manage your schedule.</p>
            </div>
          )}
          
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900">{task.name}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {format(new Date(task.startDate), 'yyyy.MM.dd', { locale: ko })} ~ 
                        {format(new Date(task.endDate), 'yyyy.MM.dd', { locale: ko })}
                      </span>
                      <span>Progress: {task.progress}%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
