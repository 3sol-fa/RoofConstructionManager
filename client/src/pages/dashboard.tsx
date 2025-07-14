import { Header } from '@/components/layout/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { WeatherWidget } from '@/components/dashboard/weather-widget';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { ProjectMap } from '@/components/dashboard/project-map';
import { TasksPanel } from '@/components/dashboard/tasks-panel';
import { TeamStatus } from '@/components/dashboard/team-status';
import { RecentFiles } from '@/components/dashboard/recent-files';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ChatOverlay } from '@/components/chat/chat-overlay';

export default function Dashboard() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Project Dashboard" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        {/* Stats Overview Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Progress & Weather */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather & Work Conditions */}
            <WeatherWidget />

            {/* Project Progress Chart */}
            <ProgressChart />

            {/* Interactive Map */}
            <ProjectMap />
          </div>

          {/* Right Column - Tasks & Team */}
          <div className="space-y-6">
            {/* Today's Tasks */}
            <TasksPanel />

            {/* Team Status */}
            <TeamStatus />

            {/* Recent Files */}
            <RecentFiles />

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </main>

      {/* Real-time Chat Overlay */}
      <ChatOverlay />
    </div>
  );
}
