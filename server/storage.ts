import { 
  users, projects, tasks, materials, projectMaterials, files, messages, 
  projectTeamMembers, weatherData,
  type User, type InsertUser, type Project, type InsertProject, 
  type Task, type InsertTask, type Material, type InsertMaterial,
  type File, type InsertFile, type Message, type InsertMessage,
  type ProjectTeamMember, type WeatherData
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Tasks
  getTasksByProject(projectId: number): Promise<Task[]>;
  getTasksByUser(userId: number): Promise<Task[]>;
  getTodaysTasks(userId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  
  // Materials
  getMaterials(): Promise<Material[]>;
  getProjectMaterials(projectId: number): Promise<any[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  
  // Files
  getFilesByProject(projectId: number): Promise<File[]>;
  getRecentFiles(limit?: number): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  
  // Messages
  getMessagesByProject(projectId: number): Promise<any[]>;
  getRecentMessages(limit?: number): Promise<any[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Team
  getProjectTeamMembers(projectId: number): Promise<any[]>;
  addTeamMember(projectId: number, userId: number, role: string): Promise<ProjectTeamMember>;
  
  // Weather
  getLatestWeather(location: string): Promise<WeatherData | undefined>;
  saveWeatherData(weather: Omit<WeatherData, 'id'>): Promise<WeatherData>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db
      .insert(projects)
      .values(project)
      .returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTasksByUser(userId: number): Promise<Task[]> {
    return await db.select().from(tasks)
      .where(eq(tasks.assignedToId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async getTodaysTasks(userId: number): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await db.select().from(tasks)
      .where(and(
        eq(tasks.assignedToId, userId),
        eq(tasks.status, 'pending')
      ))
      .orderBy(asc(tasks.dueDate));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const [updated] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updated || undefined;
  }

  async getMaterials(): Promise<Material[]> {
    return await db.select().from(materials).orderBy(asc(materials.name));
  }

  async getProjectMaterials(projectId: number): Promise<any[]> {
    return await db.select({
      id: projectMaterials.id,
      material: materials,
      quantityNeeded: projectMaterials.quantityNeeded,
      quantityUsed: projectMaterials.quantityUsed,
    })
    .from(projectMaterials)
    .leftJoin(materials, eq(projectMaterials.materialId, materials.id))
    .where(eq(projectMaterials.projectId, projectId));
  }

  async createMaterial(material: InsertMaterial): Promise<Material> {
    const [newMaterial] = await db
      .insert(materials)
      .values(material)
      .returning();
    return newMaterial;
  }

  async getFilesByProject(projectId: number): Promise<File[]> {
    return await db.select().from(files)
      .where(eq(files.projectId, projectId))
      .orderBy(desc(files.createdAt));
  }

  async getRecentFiles(limit: number = 10): Promise<File[]> {
    return await db.select().from(files)
      .orderBy(desc(files.createdAt))
      .limit(limit);
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db
      .insert(files)
      .values(file)
      .returning();
    return newFile;
  }

  async getMessagesByProject(projectId: number): Promise<any[]> {
    return await db.select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      sender: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role
      }
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .where(eq(messages.projectId, projectId))
    .orderBy(asc(messages.createdAt));
  }

  async getRecentMessages(limit: number = 50): Promise<any[]> {
    return await db.select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      projectId: messages.projectId,
      sender: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role
      }
    })
    .from(messages)
    .leftJoin(users, eq(messages.senderId, users.id))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getProjectTeamMembers(projectId: number): Promise<any[]> {
    return await db.select({
      id: projectTeamMembers.id,
      role: projectTeamMembers.role,
      joinedAt: projectTeamMembers.joinedAt,
      user: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role
      }
    })
    .from(projectTeamMembers)
    .leftJoin(users, eq(projectTeamMembers.userId, users.id))
    .where(eq(projectTeamMembers.projectId, projectId));
  }

  async addTeamMember(projectId: number, userId: number, role: string): Promise<ProjectTeamMember> {
    const [member] = await db
      .insert(projectTeamMembers)
      .values({ projectId, userId, role })
      .returning();
    return member;
  }

  async getLatestWeather(location: string): Promise<WeatherData | undefined> {
    const [weather] = await db.select().from(weatherData)
      .where(eq(weatherData.location, location))
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return weather || undefined;
  }

  async saveWeatherData(weather: Omit<WeatherData, 'id'>): Promise<WeatherData> {
    const [saved] = await db
      .insert(weatherData)
      .values(weather)
      .returning();
    return saved;
  }
}

export const storage = new DatabaseStorage();
