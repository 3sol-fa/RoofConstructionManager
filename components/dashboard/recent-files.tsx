'use client'

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Image, Upload, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { File } from "@shared/schema";

export default function RecentFiles({ projectId }: { projectId?: number }) {
  const { data: files, isLoading } = useQuery<File[]>({
    queryKey: [`/api/projects/${projectId ?? 1}/files`],
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-600 w-6 h-6" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="text-green-600 w-6 h-6" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <Image className="text-blue-600 w-6 h-6" />;
      default:
        return <FileText className="text-gray-600 w-6 h-6" />;
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

  if (isLoading) {
    return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
    );
  }

  return (
    <div>
        {files?.length === 0 && (
          <div className="text-center py-8">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
          <p className="mt-1 text-sm text-gray-500">Upload your first file.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files?.slice(0, 6).map((file) => (
            <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileIconBg(file.fileType)}`}>
                  {getFileIcon(file.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500">
                  {file.createdAt ? format(new Date(file.createdAt), 'yyyy.MM.dd', { locale: ko }) : ''} | {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                Preview
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <Download className="w-3 h-3 mr-1" />
                Download
                </Button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
