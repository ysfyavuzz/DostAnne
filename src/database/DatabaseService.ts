import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BabyProfile {
  id?: number;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  bloodType?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRecord {
  id?: number;
  type: 'feeding' | 'sleep' | 'diaper' | 'play' | 'medical';
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  babyId: number;
  createdAt: string;
}

export interface HealthRecord {
  id?: number;
  type: 'vaccine' | 'checkup' | 'medication' | 'emergency';
  title: string;
  date: string;
  doctor?: string;
  notes?: string;
  babyId: number;
  createdAt: string;
}

export interface GrowthRecord {
  id?: number;
  date: string;
  weight?: number;
  height?: number;
  headCircumference?: number;
  notes?: string;
  babyId: number;
  createdAt: string;
}

export interface UserPreferences {
  id?: number;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface SleepSession {
  id?: number;
  babyId: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  createdAt: string;
}

export interface FeedingSession {
  id?: number;
  babyId: number;
  type: 'breast' | 'bottle' | 'solid';
  startTime: string;
  endTime?: string;
  duration?: number;
  amount?: number;
  notes?: string;
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('dostanne.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Baby profiles table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS baby_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birthDate TEXT NOT NULL,
        gender TEXT NOT NULL CHECK(gender IN ('male', 'female')),
        weight REAL NOT NULL,
        height REAL NOT NULL,
        bloodType TEXT,
        photo TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Activity records table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS activity_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('feeding', 'sleep', 'diaper', 'play', 'medical')),
        startTime TEXT NOT NULL,
        endTime TEXT,
        duration INTEGER,
        notes TEXT,
        babyId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (babyId) REFERENCES baby_profiles(id) ON DELETE CASCADE
      );
    `);

    // Health records table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS health_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL CHECK(type IN ('vaccine', 'checkup', 'medication', 'emergency')),
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        doctor TEXT,
        notes TEXT,
        babyId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (babyId) REFERENCES baby_profiles(id) ON DELETE CASCADE
      );
    `);

    // Growth records table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS growth_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        weight REAL,
        height REAL,
        headCircumference REAL,
        notes TEXT,
        babyId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (babyId) REFERENCES baby_profiles(id) ON DELETE CASCADE
      );
    `);

    // Sleep sessions table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sleep_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        babyId INTEGER NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        duration INTEGER,
        quality TEXT NOT NULL CHECK(quality IN ('excellent', 'good', 'fair', 'poor')),
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (babyId) REFERENCES baby_profiles(id) ON DELETE CASCADE
      );
    `);

    // Feeding sessions table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS feeding_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        babyId INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('breast', 'bottle', 'solid')),
        startTime TEXT NOT NULL,
        endTime TEXT,
        duration INTEGER,
        amount REAL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (babyId) REFERENCES baby_profiles(id) ON DELETE CASCADE
      );
    `);

    // User preferences table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_activity_babyId ON activity_records(babyId);
      CREATE INDEX IF NOT EXISTS idx_activity_startTime ON activity_records(startTime);
      CREATE INDEX IF NOT EXISTS idx_health_babyId ON health_records(babyId);
      CREATE INDEX IF NOT EXISTS idx_growth_babyId ON growth_records(babyId);
      CREATE INDEX IF NOT EXISTS idx_sleep_babyId ON sleep_sessions(babyId);
      CREATE INDEX IF NOT EXISTS idx_sleep_startTime ON sleep_sessions(startTime);
      CREATE INDEX IF NOT EXISTS idx_feeding_babyId ON feeding_sessions(babyId);
      CREATE INDEX IF NOT EXISTS idx_feeding_startTime ON feeding_sessions(startTime);
    `);
  }

  // Baby Profile Methods
  async createBabyProfile(baby: Omit<BabyProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO baby_profiles (name, birthDate, gender, weight, height, bloodType, photo, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [baby.name, baby.birthDate, baby.gender, baby.weight, baby.height, baby.bloodType, baby.photo, now, now]
    );

    if (result.changes > 0) {
      // Store current baby ID in AsyncStorage
      await AsyncStorage.setItem('currentBabyId', result.lastInsertRowId.toString());
      return result.lastInsertRowId;
    }
    throw new Error('Failed to create baby profile');
  }

  async getBabyProfiles(): Promise<BabyProfile[]> {
    if (!this.db) throw new Error('Database not initialized');

    const profiles = await this.db.getAllAsync<BabyProfile>(
      'SELECT * FROM baby_profiles ORDER BY createdAt DESC'
    );
    return profiles;
  }

  async getCurrentBabyProfile(): Promise<BabyProfile | null> {
    if (!this.db) throw new Error('Database not initialized');

    const currentBabyId = await AsyncStorage.getItem('currentBabyId');
    if (!currentBabyId) return null;

    const profile = await this.db.getFirstAsync<BabyProfile>(
      'SELECT * FROM baby_profiles WHERE id = ?',
      [parseInt(currentBabyId)]
    );
    return profile || null;
  }

  async updateBabyProfile(id: number, updates: Partial<BabyProfile>): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const updatedAt = new Date().toISOString();
    const fields = Object.keys(updates).filter(key => key !== 'id').join(', ');
    const values = Object.values(updates).filter((_, index) => index < Object.keys(updates).length - 2);

    if (fields.length === 0) return false;

    const result = await this.db.runAsync(
      `UPDATE baby_profiles SET ${fields}, updatedAt = ? WHERE id = ?`,
      [...values, updatedAt, id]
    );

    return result.changes > 0;
  }

  // Activity Methods
  async createActivity(activity: Omit<ActivityRecord, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO activity_records (type, startTime, endTime, duration, notes, babyId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [activity.type, activity.startTime, activity.endTime, activity.duration, activity.notes, activity.babyId, now]
    );

    if (result.changes > 0) {
      return result.lastInsertRowId;
    }
    throw new Error('Failed to create activity record');
  }

  async getActivities(babyId: number, limit?: number): Promise<ActivityRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = limit 
      ? 'SELECT * FROM activity_records WHERE babyId = ? ORDER BY startTime DESC LIMIT ?'
      : 'SELECT * FROM activity_records WHERE babyId = ? ORDER BY startTime DESC';
    
    const params = limit ? [babyId, limit] : [babyId];
    const activities = await this.db.getAllAsync<ActivityRecord>(query, params);
    return activities;
  }

  // Health Methods
  async createHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO health_records (type, title, date, doctor, notes, babyId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [record.type, record.title, record.date, record.doctor, record.notes, record.babyId, now]
    );

    if (result.changes > 0) {
      return result.lastInsertRowId;
    }
    throw new Error('Failed to create health record');
  }

  async getHealthRecords(babyId: number): Promise<HealthRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    const records = await this.db.getAllAsync<HealthRecord>(
      'SELECT * FROM health_records WHERE babyId = ? ORDER BY date DESC',
      [babyId]
    );
    return records;
  }

  // Growth Methods
  async createGrowthRecord(record: Omit<GrowthRecord, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO growth_records (date, weight, height, headCircumference, notes, babyId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [record.date, record.weight, record.height, record.headCircumference, record.notes, record.babyId, now]
    );

    if (result.changes > 0) {
      return result.lastInsertRowId;
    }
    throw new Error('Failed to create growth record');
  }

  async getGrowthRecords(babyId: number): Promise<GrowthRecord[]> {
    if (!this.db) throw new Error('Database not initialized');

    const records = await this.db.getAllAsync<GrowthRecord>(
      'SELECT * FROM growth_records WHERE babyId = ? ORDER BY date DESC',
      [babyId]
    );
    return records;
  }

  // Sleep Methods
  async createSleepSession(session: Omit<SleepSession, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO sleep_sessions (babyId, startTime, endTime, duration, quality, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [session.babyId, session.startTime, session.endTime, session.duration, session.quality, session.notes, now]
    );

    if (result.changes > 0) {
      return result.lastInsertRowId;
    }
    throw new Error('Failed to create sleep session');
  }

  async updateSleepSession(id: number, updates: Partial<SleepSession>): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).filter(key => key !== 'id').join(', ');
    const values = Object.values(updates).filter((_, index) => index < Object.keys(updates).length);

    if (fields.length === 0) return false;

    const result = await this.db.runAsync(
      `UPDATE sleep_sessions SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    return result.changes > 0;
  }

  async getSleepSessions(babyId: number, limit?: number): Promise<SleepSession[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = limit 
      ? 'SELECT * FROM sleep_sessions WHERE babyId = ? ORDER BY startTime DESC LIMIT ?'
      : 'SELECT * FROM sleep_sessions WHERE babyId = ? ORDER BY startTime DESC';
    
    const params = limit ? [babyId, limit] : [babyId];
    const sessions = await this.db.getAllAsync<SleepSession>(query, params);
    return sessions;
  }

  // Feeding Methods
  async createFeedingSession(session: Omit<FeedingSession, 'id' | 'createdAt'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const result = await this.db.runAsync(
      `INSERT INTO feeding_sessions (babyId, type, startTime, endTime, duration, amount, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [session.babyId, session.type, session.startTime, session.endTime, session.duration, session.amount, session.notes, now]
    );

    if (result.changes > 0) {
      return result.lastInsertRowId;
    }
    throw new Error('Failed to create feeding session');
  }

  async updateFeedingSession(id: number, updates: Partial<FeedingSession>): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = Object.keys(updates).filter(key => key !== 'id').join(', ');
    const values = Object.values(updates).filter((_, index) => index < Object.keys(updates).length);

    if (fields.length === 0) return false;

    const result = await this.db.runAsync(
      `UPDATE feeding_sessions SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    return result.changes > 0;
  }

  async getFeedingSessions(babyId: number, limit?: number): Promise<FeedingSession[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = limit 
      ? 'SELECT * FROM feeding_sessions WHERE babyId = ? ORDER BY startTime DESC LIMIT ?'
      : 'SELECT * FROM feeding_sessions WHERE babyId = ? ORDER BY startTime DESC';
    
    const params = limit ? [babyId, limit] : [babyId];
    const sessions = await this.db.getAllAsync<FeedingSession>(query, params);
    return sessions;
  }

  // User Preferences Methods
  async setPreference(key: string, value: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT OR REPLACE INTO user_preferences (key, value, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)`,
      [key, value, now, now]
    );
  }

  async getPreference(key: string): Promise<string | null> {
    if (!this.db) throw new Error('Database not initialized');

    const pref = await this.db.getFirstAsync<{ value: string }>(
      'SELECT value FROM user_preferences WHERE key = ?',
      [key]
    );
    return pref?.value || null;
  }

  // Statistics Methods
  async getTodayStats(babyId: number): Promise<{
    feedingCount: number;
    sleepDuration: number;
    diaperChanges: number;
    playTime: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    
    const feedingCount = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM feeding_sessions 
       WHERE babyId = ? AND DATE(startTime) = ?`,
      [babyId, today]
    );

    const sleepResult = await this.db.getFirstAsync<{ total: number }>(
      `SELECT SUM(duration) as total FROM sleep_sessions 
       WHERE babyId = ? AND DATE(startTime) = ? AND endTime IS NOT NULL`,
      [babyId, today]
    );

    const diaperChanges = await this.db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM activity_records 
       WHERE babyId = ? AND type = 'diaper' AND DATE(startTime) = ?`,
      [babyId, today]
    );

    const playTime = await this.db.getFirstAsync<{ total: number }>(
      `SELECT SUM(duration) as total FROM activity_records 
       WHERE babyId = ? AND type = 'play' AND DATE(startTime) = ?`,
      [babyId, today]
    );

    return {
      feedingCount: feedingCount?.count || 0,
      sleepDuration: sleepResult?.total || 0,
      diaperChanges: diaperChanges?.count || 0,
      playTime: playTime?.total || 0,
    };
  }

  // Utility Methods
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      DELETE FROM activity_records;
      DELETE FROM health_records;
      DELETE FROM growth_records;
      DELETE FROM sleep_sessions;
      DELETE FROM feeding_sessions;
      DELETE FROM baby_profiles;
      DELETE FROM user_preferences;
    `);

    await AsyncStorage.removeItem('currentBabyId');
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export const databaseService = new DatabaseService();
export default databaseService;