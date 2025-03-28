import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mood entries
export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: text("mood").notNull(), // happy, calm, neutral, anxious, sad
  value: integer("value").notNull(), // 0-100 value representing mood intensity
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sleep entries
export const sleep = pgTable("sleep", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  hours: integer("hours").notNull(),
  quality: text("quality"), // good, fair, poor
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Meditation sessions
export const meditations = pgTable("meditations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  type: text("type").notNull(), // breathing, guided, silent
});

// Community posts
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Calming sounds
export const calmingSounds = pgTable("calming_sounds", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // nature, ambient, music
  duration: integer("duration").notNull(), // in seconds
  audioUrl: text("audio_url").notNull(),
});

// AI chat history
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  messages: json("messages").notNull().$type<Array<{ role: string; content: string }>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertMoodSchema = createInsertSchema(moods).pick({
  userId: true,
  mood: true,
  value: true,
  note: true,
});

export const insertSleepSchema = createInsertSchema(sleep).pick({
  userId: true,
  hours: true,
  quality: true,
  note: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).pick({
  content: true,
  userId: true,
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  userId: true,
  messages: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;

export type InsertSleep = z.infer<typeof insertSleepSchema>;
export type Sleep = typeof sleep.$inferSelect;

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

export type Meditation = typeof meditations.$inferSelect;
export type CalmingSound = typeof calmingSounds.$inferSelect;

export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;
export type ChatHistory = typeof chatHistory.$inferSelect;
