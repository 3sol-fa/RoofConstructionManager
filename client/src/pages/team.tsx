import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TeamMember } from '@/types';

// Mock team data for demonstration
const mockTeamData = [
  {
    id: 1,
    role: 'Site Supervisor',
    joinedAt: '2024-01-01',
    user: {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Miller',
      email: 'sarah.miller@roofmanager.com',
      role: 'manager'
    }
  },
  {
    id: 2,
    role: 'Senior Roofer',
    joinedAt: '2024-01-15',
    user: {
      id: 2,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@roofmanager.com',
      role: 'worker'
    }
  },
  {
    id: 3,
    role: 'Quality Inspector',
    joinedAt: '2024-02-01',
    user: {
      id: 3,
      firstName: 'Anna',
      lastName: 'Lee',
      email: 'anna.lee@roofmanager.com',
      role: 'inspector'
    }
  },
  {
    id: 4,
    role: 'Apprentice Roofer',
    joinedAt: '2024-02-15',
    user: {
      id: 4,
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@roofmanager.com',
      role: 'worker'
    }
  },
  {
    id: 5,
    role: 'Safety Coordinator',
    joinedAt: '2024-01-10',
    user: {
      id: 5,
      firstName: 'Lisa',
      lastName: 'Chen',
      email: 'lisa.chen@roofmanager.com',
      role: 'manager'
    }
  }
];

export default function Team() {
  // In a real application, this would fetch from the API
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
    queryFn: () => Promise.resolve(mockTeamData),
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-green-900 text-green-300';
      case 'worker':
        return 'bg-blue-900 text-blue-300';
      case 'inspector':
        return 'bg-purple-900 text-purple-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-green-500';
      case 'worker':
        return 'bg-blue-500';
      case 'inspector':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Team" />
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
      <Header title="Team" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <i className="fas fa-user-plus mr-2"></i>
            Add Member
          </Button>
        </div>

        {teamMembers?.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <i className="fas fa-users text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">No team members yet</h3>
              <p className="text-gray-400 mb-6">Add team members to start collaborating</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fas fa-user-plus mr-2"></i>
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Team Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{teamMembers?.length || 0}</div>
                  <div className="text-sm text-gray-400">Total Members</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {teamMembers?.filter(m => m.user.role === 'manager').length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Managers</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {teamMembers?.filter(m => m.user.role === 'worker').length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Workers</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {teamMembers?.filter(m => m.user.role === 'inspector').length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Inspectors</div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers?.map((member) => (
                <Card key={member.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className={`w-12 h-12 ${getAvatarColor(member.user.role)}`}>
                        <AvatarFallback className="text-white font-semibold">
                          {getInitials(member.user.firstName, member.user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg text-white">
                          {member.user.firstName} {member.user.lastName}
                        </CardTitle>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Role:</span>
                        <Badge className={getRoleColor(member.user.role)}>
                          {member.user.role}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Email:</span>
                        <span className="text-sm text-white">{member.user.email}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Joined:</span>
                        <span className="text-sm text-white">
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <i className="fas fa-eye mr-1"></i>
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        <i className="fas fa-comment mr-1"></i>
                        Message
                      </Button>
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
