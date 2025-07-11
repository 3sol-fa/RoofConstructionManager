# 🏗️ Roof Construction Manager

A web platform that simplifies and streamlines all aspects of on-site construction project management.

## 📌 Project Overview

Roof Construction Manager aims to consolidate distributed field data—such as schedules, workforce, materials, documents, and communication—into one intuitive digital system. It enables seamless real-time collaboration and data-driven decision-making among all project stakeholders, including field managers, workers, and inspectors.

| Item | Description |
|------|-------------|
| Purpose | Centralized, real-time management of schedules, materials, personnel, documents, and messaging |
| Target Users | Field managers, project managers, inspectors, construction workers |
| Core Values | Real-time synchronization, intuitive visualization, role-based access, data-driven field management |

## 🚀 Key Features

- **📊 Unified Dashboard**: Visualize project progress, budget, workforce/material usage, and key alerts at a glance
- **📁 Smart File Viewer**: Instantly preview PDFs, CSVs, and 3D models (glb, gltf, obj) within the browser
- **📍 Map-Based Project View**: Visualize project locations and status using react-leaflet and interactive maps
- **🌤️ Weather & Optimal Work Time Visualization**: Get real-time weather data via OpenWeatherMap and visualize suggested working hours based on temperature, rain, wind, etc.
- **🔄 Real-Time Collaboration**: WebSocket-powered chat, file update alerts, and live schedule syncing
- **🧑‍🔧 Role-Based Access Control**: Differentiated permissions for Admin, Manager, Worker, and Inspector roles (RBAC)
- **📱 Responsive UI**: Fully optimized for desktop, tablet, and mobile using Tailwind + shadcn/ui

## 👥 User Roles & Permissions

| Role | Description |
|------|-------------|
| Admin | Manage all projects, assign user roles, full access and edit rights |
| Manager | Create/manage assigned projects, update schedules/files/materials/personnel |
| Worker | View assigned tasks and schedules, access project files, view messages |
| Inspector | Review project progress and tasks, leave comments (no edit access) |

| Feature | Admin | Manager | Worker | Inspector |
|---------|-------|---------|--------|-----------|
| View full dashboard | ✅ | ✅ | ❌ | ✅ |
| Create/Edit projects | ✅ | ✅ | ❌ | ❌ |
| Upload files | ✅ | ✅ | ✅ | ❌ |
| Edit schedule | ✅ | ✅ | ❌ | ❌ |
| Join chat | ✅ | ✅ | ✅ | ✅ |
| Manage roles | ✅ | ❌ | ❌ | ❌ |

## 🛠️ Tech Stack

| Area | Stack |
|------|-------|
| Frontend | Next.js 14+, React 18, TypeScript, Tailwind CSS, React Query |
| UI/UX | shadcn/ui, Lucide-react, Radix UI, Framer Motion, Recharts |
| Maps | react-leaflet |
| File Previews | react-pdf, papaparse, @react-three/fiber, three.js |
| Realtime | WebSocket (ws) |
| State Management | React Context, Zustand |
| DB & ORM | PostgreSQL, Drizzle ORM |
| Storage | Supabase Storage, Dropbox |
| Auth | NextAuth.js (Google) |
| Others | Zod, ESLint, Prettier |

## 🌤️ Weather & Recommended Work Time

- **OpenWeatherMap API**: Collects temperature, humidity, wind, and precipitation
- **Custom Algorithm**: Recommends optimal roofing hours based on weather
- **WorkTimeChart.tsx**: Visual charts for suggested work slots (Recharts)

## 💻 System Requirements (30 concurrent users)

| Component | Recommended |
|-----------|-------------|
| Server | 2 vCPU, 4 GB RAM or more |
| DB | 1-2 vCPU, 2 GB RAM, SSD 25+ GB |
| Network | 100 Mbps+, CDN enabled |
| API | Cache weather/geocoding responses to reduce requests |

## 📁 Project Structure

```
RoofConstructionManager/
├── app/                  # Routing and API endpoints
├── components/           # UI and shared components
├── lib/                  # Core logic, auth, DB, weather, WebSocket
├── public/               # Static assets
└── types/                # Global TypeScript types
```

## ⚡ Getting Started

```bash
git clone https://github.com/your-username/RoofConstructionManager.git
cd RoofConstructionManager
npm install
```

Configure environment variables in `.env.local`:

```
DATABASE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_OPENWEATHER_API_KEY=...
GOOGLE_CLIENT_ID=...
```

```bash
npm run dev
```

## 🧪 Testing Strategy

- Unit: Core utility logic in `lib/`
- Component: UI rendering and interactions
- E2E: End-to-end user flows (e.g., login → project → upload)

## 🌱 Future Roadmap

- PWA support for offline mode
- AI-based PDF summarization
- Drawing version control
- Native mobile app (React Native / Flutter)

## 🙌 Contributing

1. Fork the repo
2. Create a branch → Add features → Commit → PR

## 📧 Contact

- GitHub: https://github.com/3sol-fa/RoofConstructionManager
- Email: jamesywkim79@gmail.com
