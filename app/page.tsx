'use client'
import { useState, useEffect, useContext, useMemo } from 'react';
import { ProjectHeaderContext } from './project-header-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';

const ProjectMap = dynamic(() => import('@/components/dashboard/project-map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [activityCounts, setActivityCounts] = useState<{ [projectId: number]: number }>({});
  const { setHeaderInfo } = useContext(ProjectHeaderContext);
  const router = useRouter();
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

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

  // 전체 통계 계산 (예시)
  const totalProgress = projects.length ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0;
  const totalPersonnel = projects.reduce((sum, p) => sum + (p.personnel || 0), 0);
  const totalBudgetUsage = projects.length ? Math.round(projects.reduce((sum, p) => sum + (p.budgetUsage || 0), 0) / projects.length) : 0;
  const combinedSchedule = projects.length ? projects.reduce((sum, p) => sum + (p.scheduleDelay || 0), 0) : 0;

  // 미국 MDV 지역 내 mock 좌표
  const mdvCoords = useMemo(() => [
    [38.89511, -77.03637], // 워싱턴 DC
    [39.2904, -76.6122],   // 볼티모어(MD)
    [38.8816, -77.0910],   // 알링턴(VA)
    [38.8048, -77.0469],   // 알렉산드리아(VA)
    [39.083997, -77.152758], // 락빌(MD)
  ], []);
  const projectsWithLatLng = useMemo(() => projects.map((p, i) => ({
    ...p,
    lat: p.lat ?? mdvCoords[i % mdvCoords.length][0],
    lng: p.lng ?? mdvCoords[i % mdvCoords.length][1],
    location: typeof p.location === 'object' && p.location !== null ? p.location.address : p.location,
  })), [projects, mdvCoords]);

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* 상단 제목/설명 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Project Dashboard</h1>
          <p className="text-gray-500 text-base">
            Overview of All Construction Projects | Total Active Projects: {projects.length} | Combined Schedule Performance
          </p>
        </div>

        {/* 전체 통계 카드 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                Overall Progress <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalProgress}%</div>
              <div className="text-xs text-gray-500">Average across all projects</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                Total Personnel <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalPersonnel}</div>
              <div className="text-xs text-gray-500">Across all active sites</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                Combined Schedule <Calendar className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{combinedSchedule} days</div>
              <div className="text-xs text-gray-500">Total delay across projects</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                Total Budget Usage <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalBudgetUsage}%</div>
              <div className="text-xs text-gray-500">Average budget usage</div>
            </CardContent>
          </Card>
        </section>

        {/* All Active Projects */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Active Projects</h2>
          {loading ? (
            <div className="text-gray-400">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-gray-400">No projects found.</div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {projectsWithLatLng.map((project: any) => (
                <li key={project.id}>
                  <div
                    className={`rounded-2xl border border-gray-100 bg-white shadow-sm p-5 flex flex-col gap-2 transition-all hover:shadow-md cursor-pointer ${
                      selectedProjectId === project.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => router.push(`/project/${project.id}`)}
                    onMouseEnter={() => setHoveredProjectId(project.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-gray-900 truncate">{project.name}</span>
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                        {activityCounts[project.id] ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          project.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {project.status || 'In Progress'}
                      </span>
                      <span className="text-xs text-gray-500">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Project Locations */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Locations</h2>
          <div
            className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            <ProjectMap
              key={selectedProjectId || Math.random()}
              projects={projectsWithLatLng}
              hoveredProjectId={hoveredProjectId}
              onMapContainerClick={() => setHoveredProjectId(null)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
