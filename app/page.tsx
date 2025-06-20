'use client'
import { useState, useEffect, useContext } from 'react';
import OverviewCards from '@/components/dashboard/overview-cards'
import RecentActivities from '@/components/dashboard/recent-activities'
import TodaySchedule from '@/components/dashboard/today-schedule'
import { ProjectHeaderContext } from './project-header-context';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityCounts, setActivityCounts] = useState<{ [projectId: number]: number }>({});
  const { setHeaderInfo } = useContext(ProjectHeaderContext);
  const router = useRouter();

  // Fetch projects
  useEffect(() => {
    setLoading(true);
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id as number);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch activity counts for all projects
  useEffect(() => {
    if (projects.length === 0) return;
    let cancelled = false;

    const fetchCounts = async () => {
      const counts: { [projectId: number]: number } = {};
      await Promise.all(
        projects.map(async (project) => {
          const res = await fetch(`/api/projects/${project.id}/activities`);
          const activities = await res.json();
          counts[project.id] = Array.isArray(activities) ? activities.length : 0;
        })
      );
      if (!cancelled) setActivityCounts(counts);
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5000); // Poll every 5 seconds

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [projects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  useEffect(() => {
    if (!selectedProject) return;
    const formatDate = (dateStr: string | Date) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    };
    setHeaderInfo({
      projectName: selectedProject.name,
      projectPeriod: `${formatDate(selectedProject.startDate)} ~ ${formatDate(selectedProject.endDate)}`,
      gc: selectedProject.gc,
      designCompany: selectedProject.designCompany,
      activityCount: activityCounts[selectedProject.id] ?? 0,
    });
  }, [selectedProject, activityCounts, setHeaderInfo]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <section className="pt-10 pb-4">
          {selectedProject && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow flex flex-col items-start gap-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProject.name}</h2>
              <p className="text-sm text-gray-600">Project Period: {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : ''} ~ {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : ''}</p>
              {selectedProject.gc && <p className="text-sm text-gray-600">General Contractor: {selectedProject.gc}</p>}
              {selectedProject.designCompany && <p className="text-sm text-gray-600">Design Company: {selectedProject.designCompany}</p>}
              {selectedProject.county && <p className="text-sm text-gray-600">County: {selectedProject.county}</p>}
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project List</h2>
          {loading ? (
            <div>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-gray-500">No projects found.</div>
          ) : (
            <ul className="flex flex-wrap gap-4">
              {projects.map((project: any) => (
                <li key={project.id} className="relative">
                  <button
                    className={`px-4 py-2 rounded-lg border font-medium shadow-sm transition-colors ${selectedProjectId === project.id ? 'bg-primary text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    {project.name}
                    <span className="ml-2 inline-block align-middle">
                      <span className="relative inline-flex items-center">
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-1">
                          {activityCounts[project.id] ?? 0}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Recent Activities</h2>
              {selectedProjectId !== null && <RecentActivities projectId={selectedProjectId} />}
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Today's Schedule</h2>
              {selectedProjectId !== null && <TodaySchedule projectId={selectedProjectId} />}
            </div>
          </div>
          <div className="mt-8">
            {selectedProjectId !== null && <OverviewCards projectId={selectedProjectId} />}
          </div>
        </section>
      </div>
    </main>
  )
}