import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("worker"), // admin, manager, worker, inspector
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("planning"), // planning, active, completed, paused
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  budget: decimal("budget", { precision: 12, scale: 2 }),
  budgetUsed: decimal("budget_used", { precision: 12, scale: 2 }).default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  location: text("location"),
  coordinates: jsonb("coordinates"), // {lat, lng}
  managerId: integer("manager_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  assignedToId: integer("assigned_to_id").references(() => users.id),
  createdById: integer("created_by_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Materials table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  unit: text("unit").notNull(), // pieces, kg, m2, m3, etc.
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  currentStock: integer("current_stock").default(0),
  minStock: integer("min_stock").default(0),
  supplierId: integer("supplier_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Project Materials (many-to-many)
export const projectMaterials = pgTable("project_materials", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  materialId: integer("material_id").references(() => materials.id).notNull(),
  quantityNeeded: integer("quantity_needed").notNull(),
  quantityUsed: integer("quantity_used").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Files table
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // pdf, csv, glb, gltf, obj, etc.
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  projectId: integer("project_id").references(() => projects.id),
  uploadedById: integer("uploaded_by_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project team members (many-to-many)
export const projectTeamMembers = pgTable("project_team_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull().default("worker"), // manager, worker, inspector
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Weather data cache
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  coordinates: jsonb("coordinates").notNull(), // {lat, lng}
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: integer("humidity"),
  windSpeed: decimal("wind_speed", { precision: 5, scale: 2 }),
  precipitation: decimal("precipitation", { precision: 5, scale: 2 }),
  condition: text("condition"),
  workCondition: text("work_condition"), // good, caution, unsafe
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  managedProjects: many(projects),
  assignedTasks: many(tasks),
  createdTasks: many(tasks),
  uploadedFiles: many(files),
  sentMessages: many(messages),
  projectMemberships: many(projectTeamMembers),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  manager: one(users, {
    fields: [projects.managerId],
    references: [users.id],
  }),
  tasks: many(tasks),
  materials: many(projectMaterials),
  files: many(files),
  messages: many(messages),
  teamMembers: many(projectTeamMembers),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
  }),
}));

export const materialsRelations = relations(materials, ({ many }) => ({
  projectMaterials: many(projectMaterials),
}));

export const projectMaterialsRelations = relations(projectMaterials, ({ one }) => ({
  project: one(projects, {
    fields: [projectMaterials.projectId],
    references: [projects.id],
  }),
  material: one(materials, {
    fields: [projectMaterials.materialId],
    references: [materials.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  uploadedBy: one(users, {
    fields: [files.uploadedById],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [messages.projectId],
    references: [projects.id],
  }),
}));

export const projectTeamMembersRelations = relations(projectTeamMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectTeamMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectTeamMembers.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ProjectTeamMember = typeof projectTeamMembers.$inferSelect;
export type WeatherData = typeof weatherData.$inferSelect;
