import { MoodType } from "../types";

// API Endpoints
export const API_ENDPOINTS = {
  USERS: "/api/users",
  MOODS: "/api/moods",
  SLEEP: "/api/sleep",
  MEDITATIONS: "/api/meditations",
  COMMUNITY: "/api/community/posts",
  CALMING_SOUNDS: "/api/calming-sounds",
  CHAT_HISTORY: "/api/users/:userId/chat-history",
  AI_CHAT: "/api/ai-chat"
};

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: "MindfulMe",
  DEFAULT_USER_ID: 1 // For demo purposes
};

// Color mapping for moods
export const MOOD_COLORS: Record<MoodType, { bg: string; text: string }> = {
  happy: { bg: "bg-success", text: "text-success" },
  calm: { bg: "bg-primary-light", text: "text-primary-light" },
  neutral: { bg: "bg-warning", text: "text-warning" },
  anxious: { bg: "bg-warning", text: "text-warning" },
  sad: { bg: "bg-error", text: "text-error" }
};

// Days of the week abbreviations
export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAYS_OF_WEEK_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

// Default meditation durations
export const MEDITATION_DURATIONS = [1, 3, 5, 10, 15, 20, 30];

// Breathing exercise settings
export const BREATHING_SETTINGS = {
  INHALE_DURATION: 4, // seconds
  HOLD_DURATION: 4, // seconds
  EXHALE_DURATION: 6, // seconds
  CYCLES: 5
};

// Default sound categories
export const SOUND_CATEGORIES = ["Nature", "Ambient", "Music", "All"];

// Sample emoji for moods
export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  anxious: "😟",
  sad: "😔"
};

// Greeting message based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
