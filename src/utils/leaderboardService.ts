import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { buildFirestoreErrorInfo, db, handleFirestoreError, OperationType } from '../firebase';
import { DifficultyLevel, HighScoreEntry, PracticeMode } from '../types/game';

const VALID_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _\-.]{1,20}$/;

export function getLeaderboardCollection(difficulty: DifficultyLevel): string {
  return `leaderboard_${difficulty}`;
}

export function sanitizeExplorerName(rawName: string): string {
  const cleaned = rawName
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9 _\-.]/g, '')
    .trim()
    .slice(0, 20);
  if (!cleaned || !VALID_NAME_REGEX.test(cleaned)) {
    return 'TimeCadet';
  }
  return cleaned;
}

export async function submitOnlineScore(params: {
  name: string;
  score: number;
  accuracy: number;
  difficulty: DifficultyLevel;
  mode: PracticeMode;
}): Promise<void> {
  const colName = getLeaderboardCollection(params.difficulty);
  const safeScore = Math.max(1, Math.min(50000, Math.round(params.score)));
  const safeAccuracy = Math.max(0, Math.min(100, Math.round(params.accuracy)));
  const safeName = sanitizeExplorerName(params.name);
  const dateStr = new Date()
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    .slice(0, 20);

  const newRef = doc(collection(db, colName));
  try {
    await setDoc(newRef, {
      name: safeName,
      score: safeScore,
      accuracy: safeAccuracy,
      difficulty: params.difficulty,
      mode: params.mode,
      date: dateStr,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${colName}/${newRef.id}`);
  }
}

export function subscribeLeaderboard(
  difficulty: DifficultyLevel,
  onEntries: (entries: HighScoreEntry[]) => void,
  onError: (friendlyMessage: string) => void
): Unsubscribe {
  const colName = getLeaderboardCollection(difficulty);
  const q = query(collection(db, colName), orderBy('score', 'desc'), limit(20));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: HighScoreEntry[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          name: typeof data.name === 'string' ? data.name : 'Explorer',
          score: typeof data.score === 'number' ? data.score : 0,
          accuracy: typeof data.accuracy === 'number' ? data.accuracy : 0,
          mode:
            data.mode === 'typing' || data.mode === 'context' || data.mode === 'choice'
              ? data.mode
              : 'choice',
          date: typeof data.date === 'string' ? data.date : '',
        };
      });
      onEntries(items);
    },
    (error) => {
      const info = buildFirestoreErrorInfo(error, OperationType.LIST, colName);
      console.error('Firestore Error: ', JSON.stringify(info));
      if (info.error.includes('Quota exceeded')) {
        onError('Daily Firebase free-tier quota exceeded. Rankings will resume tomorrow.');
      } else {
        onError('Unable to load online leaderboard right now.');
      }
    }
  );
}
