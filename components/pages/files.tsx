'use client'

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Search, 
  FileText, 
  FileSpreadsheet, 
  Image, 
  Eye, 
  Download,
  Trash2 
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { File } from "@shared/schema";

export default function Files() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: files, isLoading } = useQuery<File[]>({
    queryKey: ['/api/projects/1/files'],
  });

  const categories = [
    { id: "all", name: "All" },
    { id: "샵드로잉", name: "Shop Drawing" },
    { id: "건축도면", name: "Architectural Drawing" },
    { id: "견적서", name: "Estimate" },
    { id: "현장사진", name: "Site Photo" },
    { id: "기타", name: "Other" },
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-600 w-8 h-8" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="text-green-600 w-8 h-8" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="text-blue-600 w-8 h-8" />;
      default:
        return <FileText className="text-gray-600 w-8 h-8" />;
    }
  };

  const getFileIconBg = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100';
      case 'xlsx':
      case 'xls':
        return 'bg-green-100';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const filteredFiles = files?.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Drawings & Files Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by file name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-primary hover:bg-primary/90" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Upload className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== "all" ? "No search results found" : "No files uploaded"}
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              {searchTerm || selectedCategory !== "all" 
                ? "Try a different search term or change the filter."
                : "Upload the first file to start your project."
              }
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileIconBg(file.fileType)}`}>
                  {getFileIcon(file.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate mb-1" title={file.originalName}>
                    {file.originalName}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {file.category}
                    </Badge>
                    <span className="text-xs text-gray-500 uppercase">
                      {file.fileType}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>{formatFileSize(file.fileSize)}</p>
                    <p>{file.createdAt ? format(new Date(file.createdAt), 'yyyy.MM.dd', { locale: ko }) : 'No date'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 