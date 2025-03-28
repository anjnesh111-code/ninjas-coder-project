import { 
  users, type User, type InsertUser,
  moods, type Mood, type InsertMood,
  sleep, type Sleep, type InsertSleep,
  meditations, type Meditation,
  communityPosts, type CommunityPost, type InsertCommunityPost,
  calmingSounds, type CalmingSound,
  chatHistory, type ChatHistory, type InsertChatHistory
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood methods
  getMoods(userId: number, limit?: number): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  
  // Sleep methods
  getSleep(userId: number, limit?: number): Promise<Sleep[]>;
  createSleep(sleep: InsertSleep): Promise<Sleep>;
  
  // Meditation methods
  getMeditations(): Promise<Meditation[]>;
  getMeditation(id: number): Promise<Meditation | undefined>;
  
  // Community methods
  getCommunityPosts(limit?: number): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  
  // Calming sounds methods
  getCalmingSounds(): Promise<CalmingSound[]>;
  getCalmingSound(id: number): Promise<CalmingSound | undefined>;
  
  // Chat history methods
  getChatHistory(userId: number): Promise<ChatHistory | undefined>;
  createOrUpdateChatHistory(chatHistory: InsertChatHistory): Promise<ChatHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moods: Map<number, Mood>;
  private sleepRecords: Map<number, Sleep>;
  private meditations: Map<number, Meditation>;
  private communityPosts: Map<number, CommunityPost>;
  private calmingSounds: Map<number, CalmingSound>;
  private chatHistories: Map<number, ChatHistory>;
  
  private currentUserId: number;
  private currentMoodId: number;
  private currentSleepId: number;
  private currentMeditationId: number;
  private currentPostId: number;
  private currentSoundId: number;
  private currentChatHistoryId: number;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.sleepRecords = new Map();
    this.meditations = new Map();
    this.communityPosts = new Map();
    this.calmingSounds = new Map();
    this.chatHistories = new Map();
    
    this.currentUserId = 1;
    this.currentMoodId = 1;
    this.currentSleepId = 1;
    this.currentMeditationId = 1;
    this.currentPostId = 1;
    this.currentSoundId = 1;
    this.currentChatHistoryId = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Mood methods
  async getMoods(userId: number, limit?: number): Promise<Mood[]> {
    const userMoods = Array.from(this.moods.values())
      .filter(mood => mood.userId === userId)
      .sort((a, b) => (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date().getTime()) - 
                      (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date().getTime()));
    
    return limit ? userMoods.slice(0, limit) : userMoods;
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = this.currentMoodId++;
    const now = new Date();
    // Create a properly typed object
    const mood: Mood = { 
      id, 
      userId: insertMood.userId,
      mood: insertMood.mood,
      value: insertMood.value,
      createdAt: now,
      note: insertMood.note || null 
    };
    this.moods.set(id, mood);
    return mood;
  }

  // Sleep methods
  async getSleep(userId: number, limit?: number): Promise<Sleep[]> {
    const userSleep = Array.from(this.sleepRecords.values())
      .filter(sleep => sleep.userId === userId)
      .sort((a, b) => (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date().getTime()) -
                      (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date().getTime()));
    
    return limit ? userSleep.slice(0, limit) : userSleep;
  }

  async createSleep(insertSleep: InsertSleep): Promise<Sleep> {
    const id = this.currentSleepId++;
    const now = new Date();
    // Create a properly typed object without spreading
    const sleep: Sleep = { 
      id,
      userId: insertSleep.userId,
      hours: insertSleep.hours, 
      createdAt: now,
      note: insertSleep.note || null,
      quality: insertSleep.quality || null
    };
    this.sleepRecords.set(id, sleep);
    return sleep;
  }

  // Meditation methods
  async getMeditations(): Promise<Meditation[]> {
    return Array.from(this.meditations.values());
  }

  async getMeditation(id: number): Promise<Meditation | undefined> {
    return this.meditations.get(id);
  }

  // Community methods
  async getCommunityPosts(limit?: number): Promise<CommunityPost[]> {
    const posts = Array.from(this.communityPosts.values())
      .sort((a, b) => (b.createdAt instanceof Date ? b.createdAt.getTime() : new Date().getTime()) -
                      (a.createdAt instanceof Date ? a.createdAt.getTime() : new Date().getTime()));
    
    return limit ? posts.slice(0, limit) : posts;
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = this.currentPostId++;
    const now = new Date();
    const post: CommunityPost = { 
      id,
      content: insertPost.content,
      userId: insertPost.userId,
      likes: 0, 
      comments: 0, 
      createdAt: now 
    };
    this.communityPosts.set(id, post);
    return post;
  }

  // Calming sounds methods
  async getCalmingSounds(): Promise<CalmingSound[]> {
    return Array.from(this.calmingSounds.values());
  }

  async getCalmingSound(id: number): Promise<CalmingSound | undefined> {
    return this.calmingSounds.get(id);
  }

  // Chat history methods
  async getChatHistory(userId: number): Promise<ChatHistory | undefined> {
    return Array.from(this.chatHistories.values()).find(
      (history) => history.userId === userId
    );
  }

  async createOrUpdateChatHistory(insertChatHistory: InsertChatHistory): Promise<ChatHistory> {
    // Check if chat history exists for the user
    const existingHistory = await this.getChatHistory(insertChatHistory.userId);
    
    if (existingHistory) {
      // Update existing history with proper typing
      const updatedHistory: ChatHistory = {
        id: existingHistory.id,
        userId: existingHistory.userId,
        createdAt: existingHistory.createdAt,
        messages: Array.isArray(insertChatHistory.messages) 
          ? [...insertChatHistory.messages] as { role: string; content: string }[]
          : []
      };
      this.chatHistories.set(existingHistory.id, updatedHistory);
      return updatedHistory;
    } else {
      // Create new history with proper typing
      const id = this.currentChatHistoryId++;
      const now = new Date();
      const chatHistory: ChatHistory = { 
        id, 
        userId: insertChatHistory.userId,
        createdAt: now,
        messages: Array.isArray(insertChatHistory.messages) 
          ? [...insertChatHistory.messages] as { role: string; content: string }[]
          : []
      };
      this.chatHistories.set(id, chatHistory);
      return chatHistory;
    }
  }

  // Initialize sample data
  private initializeSampleData() {
    // Demo user
    const user: User = {
      id: this.currentUserId++,
      username: 'alex',
      password: 'password123',
      name: 'Alex Morgan',
      email: 'alex@example.com',
      createdAt: new Date()
    };
    this.users.set(user.id, user);

    // Demo meditations
    const meditation1: Meditation = {
      id: this.currentMeditationId++,
      title: 'Stress Relief',
      description: 'Calm your mind with deep breathing and guided visualization.',
      duration: 10,
      type: 'guided'
    };
    this.meditations.set(meditation1.id, meditation1);

    const meditation2: Meditation = {
      id: this.currentMeditationId++,
      title: 'Deep Breathing',
      description: 'Simple breathing exercise to center yourself.',
      duration: 5,
      type: 'breathing'
    };
    this.meditations.set(meditation2.id, meditation2);

    const meditation3: Meditation = {
      id: this.currentMeditationId++,
      title: 'Daily Meditation',
      description: 'Focus on the present moment.',
      duration: 10,
      type: 'guided'
    };
    this.meditations.set(meditation3.id, meditation3);

    // Demo calming sounds
    const sound1: CalmingSound = {
      id: this.currentSoundId++,
      title: 'Ocean Waves',
      description: 'Soothing water sounds',
      category: 'nature',
      duration: 900,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0b9fbac55.mp3'
    };
    this.calmingSounds.set(sound1.id, sound1);

    const sound2: CalmingSound = {
      id: this.currentSoundId++,
      title: 'Rain',
      description: 'Gentle rainfall',
      category: 'nature',
      duration: 900,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_1b1616d358.mp3'
    };
    this.calmingSounds.set(sound2.id, sound2);

    const sound3: CalmingSound = {
      id: this.currentSoundId++,
      title: 'Fireplace',
      description: 'Crackling fire',
      category: 'ambient',
      duration: 900,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/01/27/audio_c4a49a08cc.mp3'
    };
    this.calmingSounds.set(sound3.id, sound3);

    const sound4: CalmingSound = {
      id: this.currentSoundId++,
      title: 'Forest',
      description: 'Birds and nature',
      category: 'nature',
      duration: 900,
      audioUrl: 'https://cdn.pixabay.com/audio/2022/10/30/audio_946bc812c9.mp3'
    };
    this.calmingSounds.set(sound4.id, sound4);

    // Demo community posts
    const post1: CommunityPost = {
      id: this.currentPostId++,
      content: "Taking five minutes to meditate before work has changed my entire day. I'm much more focused and less stressed.",
      userId: user.id,
      likes: 24,
      comments: 3,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    };
    this.communityPosts.set(post1.id, post1);

    const post2: CommunityPost = {
      id: this.currentPostId++,
      content: "I've struggled with insomnia for years. The sleep sounds have been helping me fall asleep faster. Thank you.",
      userId: user.id,
      likes: 18,
      comments: 2,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
    };
    this.communityPosts.set(post2.id, post2);

    // Demo mood data for past 7 days
    const today = new Date();
    const moodTypes = ['happy', 'calm', 'neutral', 'anxious', 'sad'];
    const moodValues = [70, 60, 45, 50, 30, 65, 75];
    const statuses = ['good', 'good', 'neutral', 'neutral', 'bad', 'good', 'good'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      
      const mood: Mood = {
        id: this.currentMoodId++,
        userId: user.id,
        mood: moodTypes[i % 5],
        value: moodValues[i],
        note: `Feeling ${statuses[i]} today`,
        createdAt: date
      };
      
      this.moods.set(mood.id, mood);
    }

    // Demo sleep data for past 7 days
    const sleepHours = [6.5, 7.5, 7.0, 6.0, 5.0, 8.0, 8.5];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      
      const sleepEntry: Sleep = {
        id: this.currentSleepId++,
        userId: user.id,
        hours: sleepHours[i],
        quality: sleepHours[i] >= 7 ? 'good' : (sleepHours[i] >= 6 ? 'fair' : 'poor'),
        note: "",
        createdAt: date
      };
      
      this.sleepRecords.set(sleepEntry.id, sleepEntry);
    }

    // Demo chat history
    const chatHistory: ChatHistory = {
      id: this.currentChatHistoryId++,
      userId: user.id,
      messages: [
        { role: "system", content: "I am your AI mental health companion. How can I help you today?" },
        { role: "user", content: "I've been feeling stressed at work lately." },
        { role: "system", content: "I'm sorry to hear that you're experiencing stress at work. Would you like to try a 5-minute breathing exercise to help manage your stress?" }
      ],
      createdAt: new Date()
    };
    this.chatHistories.set(chatHistory.id, chatHistory);
  }
}

export const storage = new MemStorage();
