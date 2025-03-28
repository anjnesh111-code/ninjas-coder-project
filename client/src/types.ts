// User types
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

// Mood types
export type MoodType = 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad';

export interface Mood {
  id: number;
  userId: number;
  mood: MoodType;
  value: number;
  note?: string;
  createdAt: Date | string;
}

// Sleep types
export type SleepQuality = 'good' | 'fair' | 'poor';

export interface Sleep {
  id: number;
  userId: number;
  hours: number;
  quality?: SleepQuality;
  note?: string;
  createdAt: Date | string;
}

// Meditation types
export type MeditationType = 'breathing' | 'guided' | 'silent';

export interface Meditation {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  type: MeditationType;
}

// Community types
export interface CommunityPost {
  id: number;
  content: string;
  userId: number;
  likes: number;
  comments: number;
  createdAt: Date | string;
}

// Calming sound types
export type SoundCategory = 'nature' | 'ambient' | 'music';

export interface CalmingSound {
  id: number;
  title: string;
  description: string;
  category: SoundCategory;
  duration: number; // in seconds
  audioUrl: string;
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'system';
  content: string;
}

export interface ChatHistory {
  id: number;
  userId: number;
  messages: ChatMessage[];
  createdAt: Date | string;
}

// For React state management
export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface MoodState {
  moods: Mood[];
  isLoading: boolean;
  error: string | null;
}

export interface SleepState {
  sleepData: Sleep[];
  isLoading: boolean;
  error: string | null;
}

export interface CommunityState {
  posts: CommunityPost[];
  isLoading: boolean;
  error: string | null;
}

export interface MeditationState {
  meditations: Meditation[];
  isLoading: boolean;
  error: string | null;
}

export interface SoundState {
  sounds: CalmingSound[];
  currentSound: CalmingSound | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
