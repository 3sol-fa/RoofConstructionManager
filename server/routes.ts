import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertTaskSchema, insertMessageSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "roof-construction-secret";

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket setup for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<WebSocket, { userId: number, projectId?: number }>();

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'authenticate':
            // Verify JWT token and associate user with connection
            jwt.verify(message.token, JWT_SECRET, (err: any, decoded: any) => {
              if (!err && decoded) {
                clients.set(ws, { userId: decoded.id, projectId: message.projectId });
                ws.send(JSON.stringify({ type: 'authenticated', success: true }));
              }
            });
            break;
            
          case 'chat_message':
            const clientInfo = clients.get(ws);
            if (clientInfo) {
              const newMessage = await storage.createMessage({
                content: message.content,
                senderId: clientInfo.userId,
                projectId: message.projectId || null
              });
              
              // Broadcast message to all clients in the same project
              const messageWithSender = {
                ...newMessage,
                sender: await storage.getUser(clientInfo.userId)
              };
              
              clients.forEach((info, client) => {
                if (client.readyState === WebSocket.OPEN && 
                    (!message.projectId || info.projectId === message.projectId)) {
                  client.send(JSON.stringify({
                    type: 'new_message',
                    message: messageWithSender
                  }));
                }
              });
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      const { password, ...userWithoutPassword } = user;
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
      
      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Protected routes
  app.get("/api/user", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Projects routes
  app.get("/api/projects", authenticateToken, async (req: any, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", authenticateToken, async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...projectData,
        managerId: req.user.id
      });
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", authenticateToken, async (req: any, res) => {
    try {
      const project = await storage.getProject(parseInt(req.params.id));
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tasks routes
  app.get("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const { project_id, today } = req.query;
      
      if (today === 'true') {
        const tasks = await storage.getTodaysTasks(req.user.id);
        res.json(tasks);
      } else if (project_id) {
        const tasks = await storage.getTasksByProject(parseInt(project_id));
        res.json(tasks);
      } else {
        const tasks = await storage.getTasksByUser(req.user.id);
        res.json(tasks);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({
        ...taskData,
        createdById: req.user.id
      });
      
      // Broadcast task update via WebSocket
      clients.forEach((info, client) => {
        if (client.readyState === WebSocket.OPEN && 
            info.projectId === task.projectId) {
          client.send(JSON.stringify({
            type: 'task_update',
            task
          }));
        }
      });
      
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const updates = req.body;
      if (updates.status === 'completed') {
        updates.completedAt = new Date();
      }
      
      const task = await storage.updateTask(parseInt(req.params.id), updates);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      // Broadcast task update via WebSocket
      clients.forEach((info, client) => {
        if (client.readyState === WebSocket.OPEN && 
            info.projectId === task.projectId) {
          client.send(JSON.stringify({
            type: 'task_update',
            task
          }));
        }
      });
      
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Messages routes
  app.get("/api/messages", authenticateToken, async (req: any, res) => {
    try {
      const { project_id } = req.query;
      
      if (project_id) {
        const messages = await storage.getMessagesByProject(parseInt(project_id));
        res.json(messages);
      } else {
        const messages = await storage.getRecentMessages(50);
        res.json(messages);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Files routes
  app.get("/api/files", authenticateToken, async (req: any, res) => {
    try {
      const { project_id, recent } = req.query;
      
      if (recent === 'true') {
        const files = await storage.getRecentFiles(10);
        res.json(files);
      } else if (project_id) {
        const files = await storage.getFilesByProject(parseInt(project_id));
        res.json(files);
      } else {
        const files = await storage.getRecentFiles();
        res.json(files);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Team routes
  app.get("/api/projects/:id/team", authenticateToken, async (req: any, res) => {
    try {
      const team = await storage.getProjectTeamMembers(parseInt(req.params.id));
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Weather route
  app.get("/api/weather", authenticateToken, async (req: any, res) => {
    try {
      const { location = "default" } = req.query;
      
      // Check for cached weather data (within last hour)
      const cached = await storage.getLatestWeather(location as string);
      if (cached && new Date().getTime() - new Date(cached.timestamp).getTime() < 3600000) {
        return res.json(cached);
      }
      
      // Fetch from OpenWeatherMap API
      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: 'Weather API key not configured' });
      }
      
      // Use default coordinates for demo (can be made dynamic)
      const lat = 40.7128;
      const lon = -74.0060;
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      
      // Determine work condition based on weather
      let workCondition = 'good';
      if (data.weather[0].main === 'Rain' || data.wind.speed > 20) {
        workCondition = 'unsafe';
      } else if (data.weather[0].main === 'Clouds' || data.wind.speed > 15) {
        workCondition = 'caution';
      }
      
      const weatherData = {
        location: location as string,
        coordinates: { lat, lon },
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        precipitation: data.rain?.['1h'] || 0,
        condition: data.weather[0].main,
        workCondition,
        timestamp: new Date()
      };
      
      const saved = await storage.saveWeatherData(weatherData);
      res.json(saved);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", authenticateToken, async (req: any, res) => {
    try {
      const projects = await storage.getProjects();
      const tasks = await storage.getTasksByUser(req.user.id);
      
      const stats = {
        activeProjects: projects.filter(p => p.status === 'active').length,
        totalProjects: projects.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        budgetUsed: projects.reduce((sum, p) => sum + parseFloat(p.budgetUsed || '0'), 0),
        totalBudget: projects.reduce((sum, p) => sum + parseFloat(p.budget || '0'), 0),
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
