import { supabase } from './supabase';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  action: string;
  message: string;
  details?: any;
  user_agent?: string;
}

const STORAGE_KEY = 'app_system_logs';
const MAX_LOCAL_LOGS = 100;

const inMemoryLogs: LogEntry[] = [];

export async function logEvent(
  level: LogLevel,
  action: string,
  message: string,
  details?: any
): Promise<void> {
  const timestamp = new Date().toISOString();
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server/Node';

  const entry: LogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    level,
    action,
    message,
    details: details ? JSON.parse(JSON.stringify(details)) : null,
    user_agent: userAgent,
  };

  inMemoryLogs.unshift(entry);
  if (inMemoryLogs.length > MAX_LOCAL_LOGS) {
    inMemoryLogs.pop();
  }

  // 1. Console Output with visual styling
  const colorMap: Record<LogLevel, string> = {
    INFO: '\x1b[36m', // Cyan
    WARN: '\x1b[33m', // Yellow
    ERROR: '\x1b[31m', // Red
    SUCCESS: '\x1b[32m', // Green
  };
  const reset = '\x1b[0m';
  console.log(
    `${colorMap[level]}[${level}] [${new Date().toLocaleTimeString('uk-UA')}] [${action}]${reset} ${message}`,
    details || ''
  );

  // 2. Client-side LocalStorage Buffer
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      stored.unshift(entry);
      if (stored.length > MAX_LOCAL_LOGS) {
        stored.pop();
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (e) {
      console.error('Failed to save log to localStorage', e);
    }
  }

  // 3. Supabase audit_logs persistence (if configured)
  if (supabase) {
    try {
      await supabase.from('audit_logs').insert([
        {
          level,
          action,
          message,
          details: entry.details,
          created_at: timestamp,
        },
      ]);
    } catch {
      // Silently continue if audit_logs table is not created yet
    }
  }
}

export function getLocalLogs(): LogEntry[] {
  if (typeof window === 'undefined') {
    return inMemoryLogs;
  }
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return inMemoryLogs;
  }
}

export function clearLocalLogs(): void {
  inMemoryLogs.length = 0;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
