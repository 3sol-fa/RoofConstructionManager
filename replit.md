# Roof Construction Manager

## Overview

Roof Construction Manager is a comprehensive web platform designed to streamline on-site construction project management. The application consolidates distributed field data including schedules, workforce, materials, documents, and communication into one intuitive digital system with real-time collaboration capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query for server state, React Context for local state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization
- **Maps**: react-leaflet for interactive map functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Real-time Communication**: WebSocket server using 'ws' library
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Storage**: Planned integration with Supabase Storage or Dropbox

### Database Architecture
- **Database**: PostgreSQL with Neon serverless client
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication & Authorization
- Role-based access control (RBAC) with four user roles:
  - **Admin**: Full system access and user management
  - **Manager**: Project creation and management capabilities
  - **Worker**: Task viewing and file access
  - **Inspector**: Read-only access with commenting capabilities
- JWT token-based authentication stored in localStorage
- Protected routes with automatic redirection to login

### Real-time Features
- WebSocket connections for live chat messaging
- Real-time task updates and notifications
- Live project status synchronization
- Connection management with automatic reconnection

### Project Management
- Project creation, tracking, and status management
- Task assignment and progress tracking
- Budget monitoring and resource allocation
- Team member management with role-based permissions

### File Management
- Support for multiple file types (PDF, CSV, 3D models, CAD files, images)
- File preview capabilities in browser
- Recent files tracking and organization
- Upload and sharing functionality

### Weather Integration
- OpenWeatherMap API integration for real-time weather data
- Work condition recommendations based on weather
- Optimal work hours calculation and visualization
- Weather-based safety alerts

### Communication System
- Real-time chat with WebSocket backend
- Project-specific messaging channels
- Message history persistence
- User presence indicators

## Data Flow

1. **Authentication Flow**: User credentials → JWT verification → Role-based access determination
2. **Real-time Updates**: Client WebSocket connection → Server broadcast → All connected clients
3. **Data Fetching**: React Query → REST API endpoints → Database queries via Drizzle ORM
4. **File Operations**: Client upload → Server processing → Storage service → Database metadata
5. **Weather Data**: Scheduled API calls → Processing → Client updates → Chart visualization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Client-side routing
- **ws**: WebSocket server implementation

### UI Dependencies
- **@radix-ui/***: Primitive UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **recharts**: Chart and visualization library
- **react-leaflet**: Map components

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for server development

### Planned Integrations
- **OpenWeatherMap API**: Weather data and forecasting
- **Supabase Storage**: File storage and management
- **NextAuth.js**: Enhanced authentication (future upgrade)

## Deployment Strategy

### Development Environment
- Vite development server for frontend hot reload
- tsx for backend TypeScript execution
- Automatic database schema synchronization with Drizzle Kit

### Production Build
- Frontend: Vite build process generating optimized static assets
- Backend: esbuild bundling with ESM format for Node.js
- Database: Migration-based schema deployment

### Environment Configuration
- Database URL configuration via environment variables
- JWT secret configuration for authentication security
- Weather API key management for external service integration

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon serverless recommended)
- WebSocket support for real-time features
- Static file serving for frontend assets

The application follows a monorepo structure with shared TypeScript schemas between frontend and backend, ensuring type safety across the entire stack. The architecture prioritizes real-time collaboration, mobile responsiveness, and role-based security while maintaining a scalable and maintainable codebase.