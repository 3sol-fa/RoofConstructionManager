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
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertMaterialSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Material } from "@shared/schema";

const materialFormSchema = insertMaterialSchema.extend({
  orderDate: z.string().optional(),
  deliveryDate: z.string().optional(),
});

export default function Materials() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ['/api/projects/1/materials'],
  });

  const createMaterialMutation = useMutation({
    mutationFn: async (data: z.infer<typeof materialFormSchema>) => {
      const response = await apiRequest("POST", "/api/projects/1/materials", {
        ...data,
        orderDate: data.orderDate ? new Date(data.orderDate) : null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects/1/materials'] });
      toast({ title: "Material added successfully." });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ 
        title: "Failed to add material.", 
        variant: "destructive" 
      });
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Material> }) => {
      const response = await apiRequest("PUT", `/api/materials/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects/1/materials'] });
      toast({ title: "Material information updated." });
    },
    onError: () => {
      toast({ 
        title: "Failed to update material.", 
        variant: "destructive" 
      });
    },
  });

  const form = useForm<z.infer<typeof materialFormSchema>>({
    resolver: zodResolver(materialFormSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      unitPrice: "0",
      totalPrice: "0",
      supplier: "",
      orderDate: "",
      deliveryDate: "",
      status: "needed",
    },
  });

  const onSubmit = (data: z.infer<typeof materialFormSchema>) => {
    createMaterialMutation.mutate(data);
  };

  const categories = [
    { id: "all", name: "All" },
    { id: "Roofing", name: "Roofing" },
    { id: "Waterproofing", name: "Waterproofing" },
    { id: "Insulation", name: "Insulation" },
    { id: "Others", name: "Others" },
  ];

  const statuses = [
    { id: "all", name: "All" },
    { id: "needed", name: "Needed" },
    { id: "ordered", name: "Ordered" },
    { id: "delivered", name: "Delivered" },
    { id: "used", name: "Used" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'needed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Needed</Badge>;
      case 'ordered':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Ordered</Badge>;
      case 'delivered':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Delivered</Badge>;
      case 'used':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Used</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'needed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ordered':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'delivered':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'used':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const updateMaterialStatus = (id: number, status: string) => {
    updateMaterialMutation.mutate({ id, data: { status } });
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(num);
  };

  const filteredMaterials = materials?.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (material.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || material.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  // Calculate statistics
  const totalMaterials = materials?.length || 0;
  const neededMaterials = materials?.filter(m => m.status === 'needed').length || 0;
  const totalValue = materials?.reduce((sum, m) => sum + parseFloat(m.totalPrice || '0'), 0) || 0;

  // 단위 변환 함수 예시 (필요시)
  function kgToLb(kg: number) {
    return (kg * 2.20462).toFixed(2);
  }
  function m2ToSqFt(m2: number) {
    return (m2 * 10.7639).toFixed(2);
  }
  function mToFeetInch(m: number) {
    const totalInches = m * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = (totalInches % 12).toFixed(1);
    return `${feet} ft ${inches} in`;
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Materials Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Material</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter material name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="roofing">Roofing</SelectItem>
                              <SelectItem value="waterproofing">Waterproofing</SelectItem>
                              <SelectItem value="insulation">Insulation</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="pcs, lb, sq ft, ft/in" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unitPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter supplier name" 
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="orderDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Delivery Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMaterialMutation.isPending}>
                      {createMaterialMutation.isPending ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Materials</p>
                  <p className="text-3xl font-bold text-gray-900">{totalMaterials} pcs</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="text-blue-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Needs Ordering</p>
                  <p className="text-3xl font-bold text-red-600">{neededMaterials} pcs</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-500 h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Order Immediately</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Material Cost</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-500 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by material name, category, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all" 
                ? "No results found" 
                : "No materials registered"}
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                ? "Try a different search or change the filter."
                : "Add the first material to start managing materials."
              }
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(material.status)}
                    <h3 className="font-medium text-gray-900">{material.name}</h3>
                    {getStatusBadge(material.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{material.category}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium">{material.quantity} {material.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Unit Price:</span>
                      <span className="ml-2 font-medium">{formatCurrency(material.unitPrice || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-2 font-medium">{formatCurrency(material.totalPrice || 0)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Supplier:</span>
                      <span className="ml-2 font-medium">{material.supplier || '-'}</span>
                    </div>
                  </div>
                  {material.orderDate && (
                    <div className="mt-2 text-sm text-gray-500">
                      Order Date: {format(new Date(material.orderDate), 'yyyy.MM.dd', { locale: ko })}
                    </div>
                  )}
                  {material.deliveryDate && (
                    <div className="text-sm text-gray-500">
                      배송 예정: {format(new Date(material.deliveryDate), 'yyyy.MM.dd', { locale: ko })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Select 
                  value={material.status} 
                  onValueChange={(value) => updateMaterialStatus(material.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="needed">Needed</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
