import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardStats } from '@/types';

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const budgetPercentage = stats.totalBudget > 0 ? (stats.budgetUsed / stats.totalBudget * 100) : 0;
  const completionRate = stats.completedTasks + stats.pendingTasks > 0 
    ? (stats.completedTasks / (stats.completedTasks + stats.pendingTasks) * 100) 
    : 0;

  const cards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      change: stats.totalProjects > stats.activeProjects ? `+${stats.totalProjects - stats.activeProjects} total` : 'All projects active',
      icon: 'fas fa-project-diagram',
      iconBg: 'bg-blue-500',
      changeColor: 'text-green-400'
    },
    {
      title: 'Team Members',
      value: '48', // This would come from a separate API call
      change: '42 active today',
      icon: 'fas fa-users',
      iconBg: 'bg-blue-500',
      changeColor: 'text-gray-400'
    },
    {
      title: 'Budget Used',
      value: `${Math.round(budgetPercentage)}%`,
      change: `$${(stats.totalBudget - stats.budgetUsed).toFixed(1)}M remaining`,
      icon: 'fas fa-dollar-sign',
      iconBg: 'bg-yellow-500',
      changeColor: 'text-yellow-400'
    },
    {
      title: 'Task Completion',
      value: `${Math.round(completionRate)}%`,
      change: `${stats.completedTasks} of ${stats.completedTasks + stats.pendingTasks} tasks`,
      icon: 'fas fa-check-circle',
      iconBg: 'bg-green-500',
      changeColor: 'text-green-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                <i className={`${card.icon} ${card.iconBg.replace('bg-', 'text-')} text-xl`}></i>
              </div>
            </div>
            <p className={`text-sm mt-2 ${card.changeColor}`}>
              {card.changeColor === 'text-green-400' && <i className="fas fa-arrow-up mr-1"></i>}
              <span>{card.change}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
