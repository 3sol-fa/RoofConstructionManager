export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'worker' | 'inspector';
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  workCondition: 'good' | 'caution' | 'unsafe';
  timestamp: string;
}

export interface DashboardStats {
  activeProjects: number;
  totalProjects: number;
  completedTasks: number;
  pendingTasks: number;
  budgetUsed: number;
  totalBudget: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface TaskWithProject {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  projectId: number;
  assignedToId?: number;
}

export interface FileItem {
  id: number;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  projectId?: number;
}

export interface TeamMember {
  id: number;
  role: string;
  joinedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}
