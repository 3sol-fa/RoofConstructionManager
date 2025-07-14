import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, DollarSign, MapPin, Sun } from 'lucide-react';
import RecentActivities from '@/components/dashboard/recent-activities';
import TodaySchedule from '@/components/dashboard/today-schedule';
import OverviewCards from '@/components/dashboard/overview-cards';

// 임시 mock 데이터 (실제 프로젝트 데이터 fetch로 대체 필요)
const mockProjects = [
  {
    id: 1,
    name: 'Lincoln High School Roof Repair',
    period: '2024-03-14 ~ 2024-05-29',
    gc: 'Acme Construction',
    designCompany: 'Skyline Architects',
    progress: 68,
    budgetUsage: 450,
    budgetTotal: 600,
    personnel: 12,
    location: '123 Education Ave, Lincoln City',
    weather: '22°C',
    weatherDesc: 'Partly Cloudy',
    milestones: [
      { name: 'Site Preparation', date: '2024-03-20', status: 'completed' },
      { name: 'Material Delivery', date: '2024-04-01', status: 'completed' },
      { name: 'Roof Removal', date: '2024-04-15', status: 'in progress' },
      { name: 'Installation', date: '2024-05-01', status: 'pending' },
      { name: 'Final Inspection', date: '2024-05-25', status: 'pending' },
    ],
    description: 'Complete roof repair and waterproofing project for Lincoln High School main building.',
    startDate: '2024-03-14',
    endDate: '2024-05-29',
    contractor: 'Acme Construction',
    designer: 'Skyline Architects',
    weatherInfo: {
      current: { temp: '22°C', desc: 'Partly Cloudy', humidity: '65%', wind: '12 km/h' },
      forecast: [
        { day: 'Today', desc: 'Partly Cloudy', temp: '25°/18°', status: 'Workable' },
        { day: 'Tomorrow', desc: 'Sunny', temp: '28°/20°', status: 'Workable' },
        { day: 'Wed', desc: 'Light Rain', temp: '24°/16°', status: 'Caution' },
        { day: 'Thu', desc: 'Cloudy', temp: '26°/19°', status: 'Workable' },
        { day: 'Fri', desc: 'Sunny', temp: '23°/17°', status: 'Workable' },
      ],
    },
  },
];

export default async function ProjectDetail({ params }: { params: { projectId: string } }) {
  const project = mockProjects.find(p => p.id === Number(params.projectId));
  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* 상단: 프로젝트명/기간/GC/디자인사 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h1>
          <div className="text-gray-500 text-sm mb-2">
            Project Period: {project.period} | General Contractor: {project.gc} | Design Company: {project.designCompany}
          </div>
        </div>
        {/* 주요 통계 카드 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="text-xs text-gray-500 mb-1">Progress</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{project.progress}%</div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${project.progress}%` }}></div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="text-xs text-gray-500 mb-1">Budget Usage</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">${project.budgetUsage}M</div>
              <div className="text-xs text-gray-500">of ${project.budgetTotal}M</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="text-xs text-gray-500 mb-1">Personnel</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{project.personnel}</div>
              <div className="text-xs text-gray-500">On-site workers</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="text-xs text-gray-500 mb-1">Location</div>
              <div className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" />{project.location}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="text-xs text-gray-500 mb-1">Weather</div>
              <div className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Sun className="w-5 h-5 text-yellow-400" />{project.weather}</div>
              <div className="text-xs text-gray-500">{project.weatherDesc}</div>
            </CardContent>
          </Card>
        </section>
        {/* 하단: 설명/마일스톤/날씨 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project Description */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm col-span-1">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span>📝</span> Project Description</h2>
              <div className="text-gray-700 mb-4">{project.description}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Start Date: <span className="font-semibold text-gray-900">{project.startDate}</span></div>
                <div>End Date: <span className="font-semibold text-gray-900">{project.endDate}</span></div>
                <div>Contractor: <span className="font-semibold text-gray-900">{project.contractor}</span></div>
                <div>Designer: <span className="font-semibold text-gray-900">{project.designer}</span></div>
              </div>
            </CardContent>
          </Card>
          {/* Project Milestones */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm col-span-1">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Project Milestones</h2>
              <ul className="space-y-3">
                {project.milestones.map(m => (
                  <li key={m.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.date}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === 'completed' ? 'bg-green-100 text-green-700' : m.status === 'in progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{m.status}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Weather Information */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm col-span-1">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Sun className="w-5 h-5 text-yellow-400" /> Weather Information</h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">{project.weatherInfo.current.temp}</div>
                  <div className="text-gray-600">{project.weatherInfo.current.desc}</div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>💧 {project.weatherInfo.current.humidity}</span>
                  <span>💨 {project.weatherInfo.current.wind}</span>
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-800 mb-2">5-Day Forecast</div>
                <ul className="space-y-2">
                  {project.weatherInfo.forecast.map(f => (
                    <li key={f.day} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-700">{f.day}</div>
                        <div className="text-xs text-gray-500">{f.desc}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{f.temp}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.status === 'Workable' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{f.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* 하단: 프로젝트별 세트 컴포넌트 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <RecentActivities projectId={project.id} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Today's Schedule</h2>
            <TodaySchedule projectId={project.id} />
          </div>
        </section>
        <div className="mt-10">
          <OverviewCards projectId={project.id} />
        </div>
        {/* 하단 버튼 */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button className="bg-gray-900 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-800 transition">Manage Project</button>
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-50 transition flex items-center gap-2"><span>📄</span> View Documents</button>
          <button className="bg-white border border-gray-200 text-gray-900 px-6 py-2 rounded-xl font-semibold shadow hover:bg-gray-50 transition flex items-center gap-2"><span>📅</span> Schedule Meeting</button>
        </div>
      </div>
    </main>
  );
} 