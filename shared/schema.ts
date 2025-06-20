import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 현장관리자, 작업자, 안전관리자 등
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  budgetUsed: decimal("budget_used", { precision: 15, scale: 2 }).default("0"),
  progress: integer("progress").default(0), // 0-100
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  gc: text("gc"),
  designCompany: text("design_company"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed
  assignedUserId: integer("assigned_user_id").references(() => users.id),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const personnel = pgTable("personnel", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  workDate: timestamp("work_date").notNull(),
  isPresent: boolean("is_present").default(false),
  workHours: decimal("work_hours", { precision: 4, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 지붕재, 방수재, 기타 등
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // 개, kg, m2 등
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalPrice: decimal("total_price", { precision: 15, scale: 2 }),
  supplier: text("supplier"),
  orderDate: timestamp("order_date"),
  deliveryDate: timestamp("delivery_date"),
  status: text("status").notNull().default("needed"), // needed, ordered, delivered, used
  createdAt: timestamp("created_at").defaultNow(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // pdf, xlsx, jpg, etc
  fileSize: integer("file_size").notNull(),
  category: text("category").notNull(), // 샵드로잉, 건축도면, 견적서, 현장사진 등
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, file, system
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // file_upload, task_complete, etc
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertPersonnelSchema = createInsertSchema(personnel).omit({ id: true, createdAt: true });
export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true, createdAt: true });
export const insertFileSchema = createInsertSchema(files).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect & {
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
};
export type InsertProject = z.infer<typeof insertProjectSchema> & {
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
};
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Personnel = typeof personnel.$inferSelect;
export type InsertPersonnel = z.infer<typeof insertPersonnelSchema>;
export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
