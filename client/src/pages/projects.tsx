import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@shared/schema';

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'planning':
        return 'bg-blue-900 text-blue-300';
      case 'completed':
        return 'bg-gray-700 text-gray-300';
      case 'paused':
        return 'bg-yellow-900 text-yellow-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-900 text-red-300';
      case 'high':
        return 'bg-orange-900 text-orange-300';
      case 'medium':
        return 'bg-blue-900 text-blue-300';
      case 'low':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Projects" />
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
      <Header title="Projects" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">All Projects</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <i className="fas fa-plus mr-2"></i>
            New Project
          </Button>
        </div>

        {projects?.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <i className="fas fa-project-diagram text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-gray-400 mb-6">Create your first project to get started</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fas fa-plus mr-2"></i>
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-white">
                      {project.name}
                    </CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description || 'No description available'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Priority:</span>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    
                    {project.budget && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-white">${parseFloat(project.budget).toLocaleString()}</span>
                      </div>
                    )}
                    
                    {project.location && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{project.location}</span>
                      </div>
                    )}
                    
                    {project.startDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="text-white">
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <i className="fas fa-eye mr-1"></i>
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                      <i className="fas fa-edit mr-1"></i>
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
