import { 
  type User, type InsertUser, type Project, type InsertProject, 
  type Task, type InsertTask, type Personnel, type InsertPersonnel,
  type Material, type InsertMaterial, type File, type InsertFile,
  type Message, type InsertMessage, type Activity, type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;

  // Tasks
  getTask(id: number): Promise<Task | undefined>;
  getTasksByProject(projectId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;

  // Personnel
  getPersonnelByProject(projectId: number): Promise<Personnel[]>;
  getPersonnelByDate(projectId: number, date: Date): Promise<Personnel[]>;
  getPersonnelByUser(userId: number): Promise<Personnel[]>;
  createPersonnel(personnel: InsertPersonnel): Promise<Personnel>;
  updatePersonnel(id: number, personnel: Partial<InsertPersonnel>): Promise<Personnel | undefined>;

  // Materials
  getMaterialsByProject(projectId: number): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>): Promise<Material | undefined>;

  // Files
  getFilesByProject(projectId: number): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: number): Promise<boolean>;

  // Messages
  getMessagesByProject(projectId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Activities
  getActivitiesByProject(projectId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private tasks: Map<number, Task> = new Map();
  private personnel: Map<number, Personnel> = new Map();
  private materials: Map<number, Material> = new Map();
  private files: Map<number, File> = new Map();
  private messages: Map<number, Message> = new Map();
  private activities: Map<number, Activity> = new Map();
  private currentId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const sampleUsers: InsertUser[] = [
      { username: "admin", password: "admin123", name: "김현장", role: "현장관리자", isActive: true },
      { username: "worker1", password: "worker123", name: "이작업", role: "작업자", isActive: true },
      { username: "worker2", password: "worker123", name: "박작업", role: "작업자", isActive: true },
      { username: "safety", password: "safety123", name: "최안전", role: "안전관리자", isActive: true },
    ];

    sampleUsers.forEach(user => {
      const id = this.currentId++;
      this.users.set(id, { ...user, id, createdAt: new Date() } as User);
    });

    // Create sample project
    const projectId = this.currentId++;
    const sampleProject: InsertProject = {
      name: "Lincoln High School Roof Repair",
      description: "Comprehensive roof repair for a US high school building",
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-05-30'),
      budget: "600000000",
      budgetUsed: "450000000",
      progress: 68,
      isActive: true,
      gc: "Acme Construction",
      designCompany: "Skyline Architects",
      location: {
        address: "3101 Wisconsin Ave NW, Washington, DC 20016, USA",
        lat: 38.9306,
        lng: -77.0723
      }
    };
    this.projects.set(projectId, { ...sampleProject, id: projectId, createdAt: new Date() } as Project);

    // Add more sample projects
    const projectId2 = this.currentId++;
    const sampleProject2: InsertProject = {
      name: "Maple Elementary School Roof Replacement",
      description: "Full roof replacement for Maple Elementary School main building",
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-15'),
      budget: "350000000",
      budgetUsed: "120000000",
      progress: 32,
      isActive: true,
      gc: "Maple Construction Group",
      designCompany: "Green Design Studio",
      location: {
        address: "201 E 37th St, Baltimore, MD 21218, USA",
        lat: 39.3292,
        lng: -76.6156
      }
    };
    this.projects.set(projectId2, { ...sampleProject2, id: projectId2, createdAt: new Date() } as Project);

    const projectId3 = this.currentId++;
    const sampleProject3: InsertProject = {
      name: "Downtown Library Roof Renovation",
      description: "Renovation and waterproofing of the downtown public library roof",
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-07-01'),
      budget: "800000000",
      budgetUsed: "600000000",
      progress: 75,
      isActive: true,
      gc: "Urban Builders",
      designCompany: "Cityline Architects",
      location: {
        address: "101 Maple Ave W, Vienna, VA 22180, USA",
        lat: 38.9012,
        lng: -77.2653
      }
    };
    this.projects.set(projectId3, { ...sampleProject3, id: projectId3, createdAt: new Date() } as Project);

    const projectId4 = this.currentId++;
    const sampleProject4: InsertProject = {
      name: "Greenfield Community Center Roof Upgrade",
      description: "Upgrade and insulation of Greenfield Community Center's roof structure",
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-08-20'),
      budget: "500000000",
      budgetUsed: "90000000",
      progress: 12,
      isActive: true,
      gc: "Greenfield Construction",
      designCompany: "EcoDesign Partners",
      location: {
        address: "1200 N Veitch St, Arlington, VA 22201, USA",
        lat: 38.8895,
        lng: -77.0897
      }
    };
    this.projects.set(projectId4, { ...sampleProject4, id: projectId4, createdAt: new Date() } as Project);

    // Create sample tasks for each project
    const sampleTasks: InsertTask[] = [
      // Lincoln High School
      { projectId, name: "Remove Old Roof", description: "Remove all old roofing materials", startDate: new Date('2024-03-15'), endDate: new Date('2024-03-20'), status: "completed", assignedUserId: 2, progress: 100 },
      { projectId, name: "Waterproofing", description: "Full roof waterproofing", startDate: new Date('2024-03-18'), endDate: new Date('2024-03-25'), status: "in_progress", assignedUserId: 3, progress: 75 },
      { projectId, name: "Install New Roof", description: "Install new roofing materials", startDate: new Date('2024-03-22'), endDate: new Date('2024-04-15'), status: "pending", assignedUserId: 2, progress: 0 },
      // Maple Elementary
      { projectId: projectId2, name: "Site Preparation", description: "Prepare site for roof replacement", startDate: new Date('2024-04-01'), endDate: new Date('2024-04-03'), status: "completed", assignedUserId: 2, progress: 100 },
      { projectId: projectId2, name: "Material Delivery", description: "Receive and inspect roofing materials", startDate: new Date('2024-04-04'), endDate: new Date('2024-04-05'), status: "completed", assignedUserId: 3, progress: 100 },
      { projectId: projectId2, name: "Roof Installation", description: "Install new roof panels", startDate: new Date('2024-04-06'), endDate: new Date('2024-04-20'), status: "in_progress", assignedUserId: 2, progress: 40 },
      // Downtown Library
      { projectId: projectId3, name: "Inspection", description: "Initial roof inspection", startDate: new Date('2024-02-10'), endDate: new Date('2024-02-12'), status: "completed", assignedUserId: 1, progress: 100 },
      { projectId: projectId3, name: "Waterproof Layer", description: "Apply waterproof layer", startDate: new Date('2024-02-13'), endDate: new Date('2024-02-20'), status: "completed", assignedUserId: 3, progress: 100 },
      { projectId: projectId3, name: "Final Touches", description: "Final roof finishing and checks", startDate: new Date('2024-06-20'), endDate: new Date('2024-07-01'), status: "pending", assignedUserId: 4, progress: 0 },
      // Greenfield Community Center
      { projectId: projectId4, name: "Insulation Delivery", description: "Deliver insulation materials", startDate: new Date('2024-05-01'), endDate: new Date('2024-05-03'), status: "completed", assignedUserId: 2, progress: 100 },
      { projectId: projectId4, name: "Roof Upgrade", description: "Upgrade roof structure", startDate: new Date('2024-05-04'), endDate: new Date('2024-06-10'), status: "in_progress", assignedUserId: 3, progress: 30 },
    ];
    sampleTasks.forEach(task => {
      const id = this.currentId++;
      this.tasks.set(id, { ...task, id, createdAt: new Date() } as Task);
    });

    // Create sample materials for each project
    const sampleMaterials: InsertMaterial[] = [
      // Lincoln High School
      { projectId, name: "Roof Tile", category: "Roofing", unitPrice: "15000", quantity: 500, unit: "pcs", supplier: "US Roofing", status: "ordered", totalPrice: "7500000", orderDate: new Date('2024-03-10'), deliveryDate: null },
      { projectId, name: "Waterproof Sheet", category: "Waterproofing", unitPrice: "25000", quantity: 20, unit: "rolls", supplier: "Waterproof Co.", status: "delivered", totalPrice: "500000", orderDate: new Date('2024-03-05'), deliveryDate: new Date('2024-03-12') },
      // Maple Elementary
      { projectId: projectId2, name: "Metal Panel", category: "Roofing", unitPrice: "20000", quantity: 300, unit: "pcs", supplier: "Maple Roofs", status: "ordered", totalPrice: "6000000", orderDate: new Date('2024-04-01'), deliveryDate: null },
      // Downtown Library
      { projectId: projectId3, name: "Sealant", category: "Waterproofing", unitPrice: "10000", quantity: 50, unit: "tubes", supplier: "SealPro", status: "delivered", totalPrice: "500000", orderDate: new Date('2024-02-13'), deliveryDate: new Date('2024-02-15') },
      // Greenfield Community Center
      { projectId: projectId4, name: "Insulation Board", category: "Insulation", unitPrice: "30000", quantity: 100, unit: "sheets", supplier: "EcoInsulate", status: "needed", totalPrice: "3000000", orderDate: null, deliveryDate: null },
    ];
    sampleMaterials.forEach(material => {
      const id = this.currentId++;
      this.materials.set(id, { ...material, id, createdAt: new Date() } as Material);
    });

    // Create sample files for each project
    const sampleFiles: InsertFile[] = [
      // Lincoln High School
      { projectId, originalName: "RoofPlan_Lincoln.pdf", filename: "roof_lincoln.pdf", fileType: "pdf", fileSize: 2048576, category: "Architectural Drawing", uploadedBy: 1, filePath: "/uploads/roof_lincoln.pdf" },
      // Maple Elementary
      { projectId: projectId2, originalName: "Estimate_Maple.xlsx", filename: "estimate_maple.xlsx", fileType: "xlsx", fileSize: 512000, category: "Estimate", uploadedBy: 1, filePath: "/uploads/estimate_maple.xlsx" },
      // Downtown Library
      { projectId: projectId3, originalName: "SitePhoto_Library.jpg", filename: "site_library.jpg", fileType: "jpg", fileSize: 1024000, category: "Site Photo", uploadedBy: 2, filePath: "/uploads/site_library.jpg" },
      // Greenfield Community Center
      { projectId: projectId4, originalName: "InsulationSpec_Greenfield.pdf", filename: "insulation_greenfield.pdf", fileType: "pdf", fileSize: 1048576, category: "Specification", uploadedBy: 3, filePath: "/uploads/insulation_greenfield.pdf" },
    ];
    sampleFiles.forEach(file => {
      const id = this.currentId++;
      this.files.set(id, { ...file, id, createdAt: new Date() } as File);
    });

    // Create sample activities for each project
    const sampleActivities: InsertActivity[] = [
      // Lincoln High School
      { projectId, activityType: "task_completed", description: "Removed old roof", userId: 2 },
      // Maple Elementary
      { projectId: projectId2, activityType: "material_ordered", description: "Ordered metal panels", userId: 1 },
      // Downtown Library
      { projectId: projectId3, activityType: "safety_check", description: "Safety inspection completed", userId: 4 },
      // Greenfield Community Center
      { projectId: projectId4, activityType: "task_completed", description: "Insulation delivered", userId: 2 },
    ];
    sampleActivities.forEach(activity => {
      const id = this.currentId++;
      this.activities.set(id, { ...activity, id, createdAt: new Date() } as Activity);
    });
  }

  // Users methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      isActive: insertUser.isActive ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updateUser };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Projects methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date(),
      isActive: insertProject.isActive ?? null,
      gc: insertProject.gc ?? null,
      designCompany: insertProject.designCompany ?? null,
      description: insertProject.description ?? null,
      budget: insertProject.budget ?? null,
      budgetUsed: insertProject.budgetUsed ?? null,
      progress: insertProject.progress ?? null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateProject: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updatedProject = { ...project, ...updateProject };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Tasks methods
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByProject(projectId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.projectId === projectId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = { 
      ...insertTask, 
      id, 
      createdAt: new Date(),
      status: insertTask.status ?? 'pending',
      description: insertTask.description ?? null,
      progress: insertTask.progress ?? null,
      assignedUserId: insertTask.assignedUserId ?? null
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, updateTask: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updatedTask = { ...task, ...updateTask };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Personnel methods
  async getPersonnelByProject(projectId: number): Promise<Personnel[]> {
    return Array.from(this.personnel.values()).filter(p => p.projectId === projectId);
  }

  async getPersonnelByDate(projectId: number, date: Date): Promise<Personnel[]> {
    const dateStr = date.toDateString();
    return Array.from(this.personnel.values()).filter(p => 
      p.projectId === projectId && p.workDate.toDateString() === dateStr
    );
  }

  async getPersonnelByUser(userId: number): Promise<Personnel[]> {
    return Array.from(this.personnel.values()).filter(p => p.userId === userId);
  }

  async createPersonnel(insertPersonnel: InsertPersonnel): Promise<Personnel> {
    const id = this.currentId++;
    const personnel: Personnel = { 
      ...insertPersonnel, 
      id, 
      createdAt: new Date(),
      isPresent: insertPersonnel.isPresent ?? null,
      workHours: insertPersonnel.workHours ?? null,
      notes: insertPersonnel.notes ?? null
    };
    this.personnel.set(id, personnel);
    return personnel;
  }

  async updatePersonnel(id: number, updatePersonnel: Partial<InsertPersonnel>): Promise<Personnel | undefined> {
    const personnel = this.personnel.get(id);
    if (!personnel) return undefined;
    const updatedPersonnel = { ...personnel, ...updatePersonnel };
    this.personnel.set(id, updatedPersonnel);
    return updatedPersonnel;
  }

  // Materials methods
  async getMaterialsByProject(projectId: number): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(m => m.projectId === projectId);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.currentId++;
    const material: Material = { 
      ...insertMaterial, 
      id, 
      createdAt: new Date(),
      status: insertMaterial.status ?? 'needed',
      unitPrice: insertMaterial.unitPrice ?? null,
      totalPrice: insertMaterial.totalPrice ?? null,
      supplier: insertMaterial.supplier ?? null,
      orderDate: insertMaterial.orderDate ?? null,
      deliveryDate: insertMaterial.deliveryDate ?? null
    };
    this.materials.set(id, material);
    return material;
  }

  async updateMaterial(id: number, updateMaterial: Partial<InsertMaterial>): Promise<Material | undefined> {
    const material = this.materials.get(id);
    if (!material) return undefined;
    const updatedMaterial = { ...material, ...updateMaterial };
    this.materials.set(id, updatedMaterial);
    return updatedMaterial;
  }

  // Files methods
  async getFilesByProject(projectId: number): Promise<File[]> {
    return Array.from(this.files.values()).filter(f => f.projectId === projectId);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentId++;
    const file: File = { 
      ...insertFile, 
      id, 
      createdAt: new Date()
    };
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }

  // Messages methods
  async getMessagesByProject(projectId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(m => m.projectId === projectId);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      messageType: insertMessage.messageType ?? 'text',
      isRead: insertMessage.isRead ?? false
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    const updatedMessage = { ...message, isRead: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Activities methods
  async getActivitiesByProject(projectId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(a => a.projectId === projectId);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }
}

// Create a singleton instance
export const storage = new MemStorage(); 