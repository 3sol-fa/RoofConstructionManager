import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { FileItem } from '@/types';

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: files, isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files'],
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'fas fa-file-pdf text-red-400';
      case 'csv':
      case 'xlsx':
      case 'xls':
        return 'fas fa-table text-green-400';
      case 'glb':
      case 'gltf':
      case 'obj':
        return 'fas fa-cube text-blue-400';
      case 'dwg':
      case 'dxf':
        return 'fas fa-drafting-compass text-orange-400';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'fas fa-image text-purple-400';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-blue-500';
      default:
        return 'fas fa-file text-gray-400';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const filteredFiles = files?.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.fileType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Documents" />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Documents" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold text-white">Document Library</h1>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-gray-700 border-gray-600 text-white"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              <i className="fas fa-upload mr-2"></i>
              Upload File
            </Button>
          </div>
        </div>

        {filteredFiles?.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <i className="fas fa-folder-open text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm ? 'No matching files found' : 'No documents uploaded'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Upload files to start building your document library'
                }
              </p>
              {!searchTerm && (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <i className="fas fa-upload mr-2"></i>
                  Upload First File
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* File Type Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {['pdf', 'csv', 'glb', 'dwg', 'jpg', 'doc'].map((type) => {
                const count = filteredFiles?.filter(f => f.fileType.toLowerCase() === type).length || 0;
                return (
                  <Card key={type} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <i className={`${getFileIcon(type)} text-2xl mb-2`}></i>
                      <div className="text-lg font-bold text-white">{count}</div>
                      <div className="text-xs text-gray-400 uppercase">{type} Files</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles?.map((file) => (
                <Card key={file.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <i className={`${getFileIcon(file.fileType)} text-2xl`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                          {file.originalName}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatFileSize(file.fileSize)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(file.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-400 uppercase bg-gray-700 px-2 py-1 rounded">
                        {file.fileType}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <i className="fas fa-eye text-xs"></i>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                          <i className="fas fa-download text-xs"></i>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
