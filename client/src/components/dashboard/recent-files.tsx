import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileItem } from '@/types';

export function RecentFiles() {
  const { data: files, isLoading } = useQuery<FileItem[]>({
    queryKey: ['/api/files?recent=true'],
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

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            <i className="fas fa-file-alt mr-2 text-orange-400"></i>
            Recent Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-700 rounded-lg border border-gray-600 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          <i className="fas fa-file-alt mr-2 text-orange-400"></i>
          Recent Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-folder-open text-4xl mb-2"></i>
              <p>No files available</p>
              <p className="text-sm">Upload some files to get started</p>
            </div>
          ) : (
            files?.map((file) => (
              <div 
                key={file.id} 
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className={`${getFileIcon(file.fileType)} text-lg`}></i>
                  <div>
                    <p className="text-sm font-medium text-white">{file.originalName}</p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(file.fileSize)} • {getTimeAgo(file.createdAt)}
                    </p>
                  </div>
                </div>
                <i className="fas fa-download text-gray-400 hover:text-white transition-colors"></i>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
