import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMoodSchema, insertSleepSchema, insertCommunityPostSchema, insertChatHistorySchema } from "@shared/schema";
import { ZodError } from "zod";

// Helper function to handle validation errors
function handleValidationErrors(err: any, res: express.Response) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.errors });
  }
  return res.status(500).json({ message: "Internal Server Error" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();

  // User routes
  router.post("/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (err) {
      return handleValidationErrors(err, res);
    }
  });

  router.get("/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.json(user);
  });

  // Mood routes
  router.post("/moods", async (req, res) => {
    try {
      const moodData = insertMoodSchema.parse(req.body);
      const user = await storage.getUser(moodData.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const mood = await storage.createMood(moodData);
      return res.status(201).json(mood);
    } catch (err) {
      return handleValidationErrors(err, res);
    }
  });

  router.get("/users/:userId/moods", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const moods = await storage.getMoods(userId, limit);
    return res.json(moods);
  });

  // Sleep routes
  router.post("/sleep", async (req, res) => {
    try {
      const sleepData = insertSleepSchema.parse(req.body);
      const user = await storage.getUser(sleepData.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const sleep = await storage.createSleep(sleepData);
      return res.status(201).json(sleep);
    } catch (err) {
      return handleValidationErrors(err, res);
    }
  });

  router.get("/users/:userId/sleep", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const sleepData = await storage.getSleep(userId, limit);
    return res.json(sleepData);
  });

  // Meditation routes
  router.get("/meditations", async (_req, res) => {
    const meditations = await storage.getMeditations();
    return res.json(meditations);
  });

  router.get("/meditations/:id", async (req, res) => {
    const meditationId = parseInt(req.params.id);
    
    if (isNaN(meditationId)) {
      return res.status(400).json({ message: "Invalid meditation ID" });
    }
    
    const meditation = await storage.getMeditation(meditationId);
    
    if (!meditation) {
      return res.status(404).json({ message: "Meditation not found" });
    }
    
    return res.json(meditation);
  });

  // Community routes
  router.post("/community/posts", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const user = await storage.getUser(postData.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const post = await storage.createCommunityPost(postData);
      return res.status(201).json(post);
    } catch (err) {
      return handleValidationErrors(err, res);
    }
  });

  router.get("/community/posts", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const posts = await storage.getCommunityPosts(limit);
    return res.json(posts);
  });

  // Calming sounds routes
  router.get("/calming-sounds", async (_req, res) => {
    const sounds = await storage.getCalmingSounds();
    return res.json(sounds);
  });

  router.get("/calming-sounds/:id", async (req, res) => {
    const soundId = parseInt(req.params.id);
    
    if (isNaN(soundId)) {
      return res.status(400).json({ message: "Invalid sound ID" });
    }
    
    const sound = await storage.getCalmingSound(soundId);
    
    if (!sound) {
      return res.status(404).json({ message: "Sound not found" });
    }
    
    return res.json(sound);
  });

  // Chat history routes
  router.get("/users/:userId/chat-history", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const chatHistory = await storage.getChatHistory(userId);
    
    if (!chatHistory) {
      return res.status(404).json({ message: "No chat history found" });
    }
    
    return res.json(chatHistory);
  });

  router.post("/users/:userId/chat-history", async (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const chatData = insertChatHistorySchema.parse({
        ...req.body,
        userId
      });
      
      const user = await storage.getUser(chatData.userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const chatHistory = await storage.createOrUpdateChatHistory(chatData);
      return res.status(201).json(chatHistory);
    } catch (err) {
      return handleValidationErrors(err, res);
    }
  });

  // AI chat endpoint - integration with Google Gemini API
  router.post("/ai-chat", async (req, res) => {
    const { message, userId } = req.body;
    
    if (!message || !userId) {
      return res.status(400).json({ message: "Message and userId are required" });
    }
    
    // In a real implementation, we would call the Gemini API here
    // For now, we'll return a mock response
    const aiResponse = "I understand you might be feeling overwhelmed. Let's work through this together. Would you like to try a breathing exercise or talk more about what's on your mind?";
    
    // Update chat history
    const chatHistory = await storage.getChatHistory(userId);
    const messages = chatHistory ? [...chatHistory.messages] : [];
    
    messages.push({ role: "user", content: message });
    messages.push({ role: "system", content: aiResponse });
    
    await storage.createOrUpdateChatHistory({
      userId,
      messages
    });
    
    return res.json({ 
      response: aiResponse
    });
  });

  // Register the API routes
  app.use("/api", router);

  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
