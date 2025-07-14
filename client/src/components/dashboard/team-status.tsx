import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TeamMember } from '@/types';

// Mock team status data
const mockTeamStatus = [
  { 
    id: 1, 
    user: { id: 1, firstName: 'Sarah', lastName: 'Miller', email: 'sarah@example.com', role: 'manager' },
    role: 'Site Supervisor',
    status: 'on_site',
    joinedAt: '2024-01-01'
  },
  { 
    id: 2, 
    user: { id: 2, firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', role: 'worker' },
    role: 'Roofer',
    status: 'break',
    joinedAt: '2024-01-01'
  },
  { 
    id: 3, 
    user: { id: 3, firstName: 'Anna', lastName: 'Lee', email: 'anna@example.com', role: 'inspector' },
    role: 'Inspector',
    status: 'off_site',
    joinedAt: '2024-01-01'
  },
];

export function TeamStatus() {
  // In a real app, this would fetch from /api/projects/{id}/team or similar
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/status'],
    // For now, return mock data
    queryFn: () => Promise.resolve(mockTeamStatus),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_site':
        return 'bg-green-400 text-green-400';
      case 'break':
        return 'bg-yellow-400 text-yellow-400';
      case 'off_site':
        return 'bg-red-400 text-red-400';
      default:
        return 'bg-gray-400 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_site':
        return 'On Site';
      case 'break':
        return 'Break';
      case 'off_site':
        return 'Off Site';
      default:
        return 'Unknown';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            <i className="fas fa-users mr-2 text-green-400"></i>
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-600 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-600 rounded w-12"></div>
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
          <i className="fas fa-users mr-2 text-green-400"></i>
          Team Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamMembers?.map((member) => {
            const statusColors = getStatusColor(member.status);
            const [bgColor, textColor] = statusColors.split(' ');
            
            return (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className={`w-8 h-8 ${getAvatarColor(member.user.role)}`}>
                    <AvatarFallback className="text-white text-xs font-medium">
                      {getInitials(member.user.firstName, member.user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${bgColor}`}></span>
                  <span className={`text-xs ${textColor}`}>
                    {getStatusLabel(member.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
