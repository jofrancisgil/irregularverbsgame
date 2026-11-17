import { VERB_DATABASE } from '../data/verbs';
import {
  DifficultyLevel,
  HighScoreBoard,
  HighScoreEntry,
  MasteryStatus,
  PoolMode,
  PracticeMode,
  VerbMastery,
} from '../types/game';

const KEYS = {
  PLAYER_NAME: 'chrono_player_name',
  POOL_MODE: 'chrono_pool_mode',
  CUSTOM_VERBS: 'chrono_custom_verbs',
  HIGHSCORES: 'chrono_highscores_v2',
  MASTERY: 'chrono_verb_mastery_v1',
  SOUND_ENABLED: 'chrono_sound_enabled',
};

const DEFAULT_HIGHSCORES: HighScoreBoard = {
  easy: [
    { name: 'Captain Chrono', score: 2100, accuracy: 100, mode: 'choice', date: 'Nov 02' },
    { name: 'Nova Scout', score: 1850, accuracy: 93, mode: 'choice', date: 'Nov 04' },
    { name: 'Lexi Ranger', score: 1500, accuracy: 86, mode: 'context', date: 'Nov 05' },
  ],
  normal: [
    { name: 'Doctor Time', score: 2950, accuracy: 100, mode: 'choice', date: 'Nov 03' },
    { name: 'Echo Pilot', score: 2400, accuracy: 93, mode: 'typing', date: 'Nov 05' },
    { name: 'Star Voyager', score: 1900, accuracy: 80, mode: 'context', date: 'Nov 06' },
  ],
  master: [
    { name: 'Master Paradox', score: 3800, accuracy: 100, mode: 'typing', date: 'Nov 01' },
    { name: 'Quantum Speed', score: 3100, accuracy: 86, mode: 'choice', date: 'Nov 03' },
  ],
};

export function loadPlayerName(): string {
  try {
    return localStorage.getItem(KEYS.PLAYER_NAME) || 'TimeCadet';
  } catch {
    return 'TimeCadet';
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(KEYS.PLAYER_NAME, name);
  } catch {
    // Ignore storage failures
  }
}

export function loadPoolMode(): PoolMode {
  try {
    const val = localStorage.getItem(KEYS.POOL_MODE);
    return val === 'custom' ? 'custom' : 'all';
  } catch {
    return 'all';
  }
}

export function savePoolMode(mode: PoolMode): void {
  try {
    localStorage.setItem(KEYS.POOL_MODE, mode);
  } catch {
    // Ignore
  }
}

export function loadCustomVerbs(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOM_VERBS);
    if (!raw) return VERB_DATABASE.map((v) => v.base);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const validSet = new Set(VERB_DATABASE.map((v) => v.base));
      const filtered = parsed.filter((b): b is string => typeof b === 'string' && validSet.has(b));
      if (filtered.length > 0) return filtered;
    }
  } catch {
    // Fallback
  }
  return VERB_DATABASE.map((v) => v.base);
}

export function saveCustomVerbs(bases: string[]): void {
  try {
    localStorage.setItem(KEYS.CUSTOM_VERBS, JSON.stringify(bases));
  } catch {
    // Ignore
  }
}

export function loadHighScores(): HighScoreBoard {
  try {
    const raw = localStorage.getItem(KEYS.HIGHSCORES);
    if (!raw) {
      localStorage.setItem(KEYS.HIGHSCORES, JSON.stringify(DEFAULT_HIGHSCORES));
      return structuredClone(DEFAULT_HIGHSCORES);
    }
    const parsed = JSON.parse(raw) as Partial<HighScoreBoard>;
    return {
      easy: Array.isArray(parsed.easy) ? parsed.easy : [],
      normal: Array.isArray(parsed.normal) ? parsed.normal : [],
      master: Array.isArray(parsed.master) ? parsed.master : [],
    };
  } catch {
    return structuredClone(DEFAULT_HIGHSCORES);
  }
}

export function saveHighScoreEntry(
  difficulty: DifficultyLevel,
  entry: Omit<HighScoreEntry, 'date'>
): { board: HighScoreBoard; isNewRecord: boolean } {
  const board = loadHighScores();
  if (entry.score <= 0) return { board, isNewRecord: false };

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const fullEntry: HighScoreEntry = { ...entry, date: dateStr };

  const list = [...(board[difficulty] || []), fullEntry];
  list.sort((a, b) => b.score - a.score);
  const isNewRecord = list[0] === fullEntry;
  board[difficulty] = list.slice(0, 6);

  try {
    localStorage.setItem(KEYS.HIGHSCORES, JSON.stringify(board));
  } catch {
    // Ignore
  }

  return { board, isNewRecord };
}

export function resetHighScores(): HighScoreBoard {
  const fresh = structuredClone(DEFAULT_HIGHSCORES);
  try {
    localStorage.setItem(KEYS.HIGHSCORES, JSON.stringify(fresh));
  } catch {
    // Ignore
  }
  return fresh;
}

export function loadMasteryMap(): Record<string, VerbMastery> {
  try {
    const raw = localStorage.getItem(KEYS.MASTERY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveMasteryMap(map: Record<string, VerbMastery>): void {
  try {
    localStorage.setItem(KEYS.MASTERY, JSON.stringify(map));
  } catch {
    // Ignore
  }
}

export function recordVerbAttempt(
  currentMap: Record<string, VerbMastery>,
  base: string,
  isCorrect: boolean
): Record<string, VerbMastery> {
  const prev = currentMap[base] || {
    attempts: 0,
    correct: 0,
    streak: 0,
    lastMissed: false,
    lastPracticedAt: 0,
  };

  const next: VerbMastery = {
    attempts: prev.attempts + 1,
    correct: prev.correct + (isCorrect ? 1 : 0),
    streak: isCorrect ? prev.streak + 1 : 0,
    lastMissed: !isCorrect,
    lastPracticedAt: Date.now(),
  };

  const updated = { ...currentMap, [base]: next };
  saveMasteryMap(updated);
  return updated;
}

export function getMasteryStatus(record?: VerbMastery): MasteryStatus {
  if (!record || record.attempts === 0) return 'unseen';
  if (record.streak >= 2 && !record.lastMissed) return 'mastered';
  return 'learning';
}

export function getWeakVerbBases(map: Record<string, VerbMastery>): string[] {
  return VERB_DATABASE.filter((v) => {
    const rec = map[v.base];
    return rec && (rec.lastMissed || (rec.attempts > 0 && rec.streak < 2));
  }).map((v) => v.base);
}

export function loadSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem(KEYS.SOUND_ENABLED);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function saveSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(KEYS.SOUND_ENABLED, String(enabled));
  } catch {
    // Ignore
  }
}

export function formatModeLabel(mode: PracticeMode): string {
  if (mode === 'choice') return 'Quick Choice';
  if (mode === 'typing') return 'Type Forms';
  return 'Sentence Context';
}
