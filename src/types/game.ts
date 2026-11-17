export type VerbPattern = 'AAA' | 'ABB' | 'ABC' | 'ABA' | 'MIXED';

export type VerbDifficulty = 1 | 2 | 3;

export type DifficultyLevel = 'easy' | 'normal' | 'master';

export type PracticeMode = 'choice' | 'typing' | 'context';

export type PoolMode = 'all' | 'custom';

export type ScreenName = 'menu' | 'game' | 'end';

export type MasteryStatus = 'unseen' | 'learning' | 'mastered';

export interface VerbSentence {
  text: string;
  target: 'past' | 'part';
  answer: string;
  accepted: string[];
  distractors: [string, string];
  clue: string;
}

export interface VerbItem {
  base: string;
  past: string;
  part: string;
  cat: string;
  acceptedPast: string[];
  acceptedPart: string[];
  distractors: [string, string];
  difficulty: VerbDifficulty;
  pattern: VerbPattern;
  sentence: VerbSentence;
}

export interface VerbMastery {
  attempts: number;
  correct: number;
  streak: number;
  lastMissed: boolean;
  lastPracticedAt: number;
}

export interface HighScoreEntry {
  name: string;
  score: number;
  accuracy: number;
  mode: PracticeMode;
  date: string;
}

export type HighScoreBoard = Record<DifficultyLevel, HighScoreEntry[]>;

export interface MissionMistake {
  verb: VerbItem;
  userAnswer: string;
  expectedAnswer: string;
  mode: PracticeMode;
}

export interface DifficultyConfig {
  label: string;
  subtitle: string;
  time: number;
  maxLives: number;
  points: number;
  tiers: VerbDifficulty[];
}
