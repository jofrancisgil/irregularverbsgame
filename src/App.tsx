import { useCallback, useEffect, useRef, useState } from 'react';
import { CodexModal } from './components/CodexModal';
import { ConfettiCanvas, ConfettiHandle } from './components/ConfettiCanvas';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Footer } from './components/Footer';
import { GameScreen } from './components/GameScreen';
import { Header } from './components/Header';
import { LeaderboardModal } from './components/LeaderboardModal';
import { MenuScreen } from './components/MenuScreen';
import { OnlineSyncStatus, ReportScreen } from './components/ReportScreen';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { VerbSelectorModal } from './components/VerbSelectorModal';
import { DIFFICULTY_CONFIGS, VERB_DATABASE } from './data/verbs';
import {
  DifficultyLevel,
  MissionMistake,
  PoolMode,
  PracticeMode,
  ScreenName,
  VerbItem,
  VerbMastery,
} from './types/game';
import { sanitizeExplorerName, submitOnlineScore } from './utils/leaderboardService';
import { soundManager } from './utils/sound';
import { stopSpeaking } from './utils/speech';
import {
  getWeakVerbBases,
  loadCustomVerbs,
  loadMasteryMap,
  loadPlayerName,
  loadPoolMode,
  loadSoundEnabled,
  recordVerbAttempt,
  saveCustomVerbs,
  saveHighScoreEntry,
  savePlayerName,
  savePoolMode,
  saveSoundEnabled,
} from './utils/storage';

function shuffleVerbs(list: VerbItem[]): VerbItem[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const confettiRef = useRef<ConfettiHandle | null>(null);
  const advanceTimeoutRef = useRef<number | null>(null);

  // Persistent user settings & stats
  const [playerName, setPlayerName] = useState<string>(() => loadPlayerName());
  const [poolMode, setPoolMode] = useState<PoolMode>(() => loadPoolMode());
  const [customSelectedBases, setCustomSelectedBases] = useState<string[]>(() => loadCustomVerbs());
  const [masteryMap, setMasteryMap] = useState<Record<string, VerbMastery>>(() => loadMasteryMap());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const enabled = loadSoundEnabled();
    soundManager.enabled = enabled;
    return enabled;
  });

  // Mission configuration
  const [screen, setScreen] = useState<ScreenName>('menu');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('choice');
  const [untimed, setUntimed] = useState<boolean>(false);

  // Active game state
  const [gameVerbs, setGameVerbs] = useState<VerbItem[]>([]);
  const [activePoolLabel, setActivePoolLabel] = useState<string>('Voyager Pool');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [mistakes, setMistakes] = useState<MissionMistake[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [isVictory, setIsVictory] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [onlineSyncStatus, setOnlineSyncStatus] = useState<OnlineSyncStatus>('idle');

  // Modals & confirmation dialogs
  const [codexOpen, setCodexOpen] = useState(false);
  const [verbSelectorOpen, setVerbSelectorOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  const maxTime = DIFFICULTY_CONFIGS[difficulty].time;
  const anyModalOpen = codexOpen || verbSelectorOpen || leaderboardOpen || confirmState.open;

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAdvanceTimer();
      stopSpeaking();
    };
  }, [clearAdvanceTimer]);

  const handlePlayerNameChange = (name: string) => {
    setPlayerName(name);
    savePlayerName(name);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundManager.enabled = next;
    setSoundEnabled(next);
    saveSoundEnabled(next);
    if (next) soundManager.playClick();
  };

  const handlePoolModeChange = (mode: PoolMode) => {
    soundManager.playClick();
    setPoolMode(mode);
    savePoolMode(mode);
  };

  const launchMission = useCallback(
    (overrideVerbs?: VerbItem[], overrideLabel?: string) => {
      clearAdvanceTimer();
      stopSpeaking();
      soundManager.playClick();

      const cfg = DIFFICULTY_CONFIGS[difficulty];
      let deck: VerbItem[];
      let label: string;

      if (overrideVerbs && overrideVerbs.length > 0) {
        deck = shuffleVerbs(overrideVerbs).slice(0, 15);
        label = overrideLabel || 'Targeted Review';
      } else if (poolMode === 'custom') {
        const selectedSet = new Set(customSelectedBases);
        const filtered = VERB_DATABASE.filter((v) => selectedSet.has(v.base));
        if (filtered.length < 5) {
          setVerbSelectorOpen(true);
          return;
        }
        deck = shuffleVerbs(filtered).slice(0, Math.min(15, filtered.length));
        label = `Custom (${filtered.length})`;
      } else {
        const tierVerbs = VERB_DATABASE.filter((v) => cfg.tiers.includes(v.difficulty));
        deck = shuffleVerbs(tierVerbs).slice(0, 15);
        label = `${cfg.label} (${tierVerbs.length})`;
      }

      setGameVerbs(deck);
      setActivePoolLabel(label);
      setCurrentIndex(0);
      setScore(0);
      setLives(cfg.maxLives);
      setStreak(0);
      setMaxStreak(0);
      setCorrectCount(0);
      setAnsweredCount(0);
      setMistakes([]);
      setIsLocked(false);
      setTimeLeft(cfg.time);
      setIsVictory(false);
      setIsNewRecord(false);
      setOnlineSyncStatus('idle');
      setScreen('game');
    },
    [clearAdvanceTimer, difficulty, poolMode, customSelectedBases]
  );

  const finishMission = useCallback(
    (victory: boolean, finalScore: number, finalCorrect: number, finalAnswered: number) => {
      clearAdvanceTimer();
      stopSpeaking();
      const accuracy = Math.round((finalCorrect / Math.max(1, finalAnswered)) * 100);
      const cleanName = sanitizeExplorerName(playerName);

      // Log personal local record & submit to global Firestore leaderboard for standard timed runs
      let newRecord = false;
      if (!untimed && gameVerbs.length >= 5 && finalScore > 0) {
        const res = saveHighScoreEntry(difficulty, {
          name: cleanName,
          score: finalScore,
          accuracy,
          mode: practiceMode,
        });
        newRecord = res.isNewRecord;

        setOnlineSyncStatus('saving');
        void submitOnlineScore({
          name: cleanName,
          score: finalScore,
          accuracy,
          difficulty,
          mode: practiceMode,
        })
          .then(() => {
            setOnlineSyncStatus('saved');
          })
          .catch(() => {
            setOnlineSyncStatus('error');
          });
      } else {
        setOnlineSyncStatus('idle');
      }

      setIsVictory(victory);
      setIsNewRecord(newRecord);
      setScreen('end');

      if (victory) {
        soundManager.playVictory();
        confettiRef.current?.burst(window.innerWidth / 2, window.innerHeight * 0.35, 70);
      } else {
        soundManager.playGameOver();
      }
    },
    [clearAdvanceTimer, difficulty, gameVerbs.length, playerName, practiceMode, untimed]
  );

  const advanceOrEnd = useCallback(
    (nextLives: number, nextScore: number, nextCorrect: number, nextAnswered: number, delayMs: number) => {
      clearAdvanceTimer();
      advanceTimeoutRef.current = window.setTimeout(() => {
        if (nextLives <= 0) {
          finishMission(false, nextScore, nextCorrect, nextAnswered);
        } else if (currentIndex + 1 >= gameVerbs.length) {
          finishMission(true, nextScore, nextCorrect, nextAnswered);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setTimeLeft(maxTime);
          setIsLocked(false);
        }
      }, delayMs);
    },
    [clearAdvanceTimer, currentIndex, finishMission, gameVerbs.length, maxTime]
  );

  const processOutcome = useCallback(
    (
      isCorrect: boolean,
      userAnswer: string,
      expectedAnswer: string,
      anchorEl?: HTMLElement | null
    ) => {
      if (isLocked || !gameVerbs[currentIndex]) return;
      setIsLocked(true);

      const verb = gameVerbs[currentIndex];
      setMasteryMap((prev) => recordVerbAttempt(prev, verb.base, isCorrect));
      const nextAnswered = answeredCount + 1;
      setAnsweredCount(nextAnswered);

      if (isCorrect) {
        const nextStreak = streak + 1;
        const nextMaxStreak = Math.max(maxStreak, nextStreak);
        const nextCorrect = correctCount + 1;
        const streakMultiplier = Math.min(3.0, 1 + (nextStreak - 1) * 0.25);
        const modeBonus = practiceMode === 'typing' ? 1.35 : practiceMode === 'context' ? 1.15 : 1;
        const timeBonus = untimed ? 25 : Math.floor(timeLeft * 10);
        const earned = Math.round(
          (DIFFICULTY_CONFIGS[difficulty].points + timeBonus) * streakMultiplier * modeBonus
        );
        const nextScore = score + earned;

        setStreak(nextStreak);
        setMaxStreak(nextMaxStreak);
        setCorrectCount(nextCorrect);
        setScore(nextScore);
        soundManager.playCorrect(nextStreak);

        if (anchorEl) {
          const rect = anchorEl.getBoundingClientRect();
          confettiRef.current?.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 28);
        }

        advanceOrEnd(lives, nextScore, nextCorrect, nextAnswered, 1050);
      } else {
        const nextLives = lives - 1;
        setStreak(0);
        setLives(nextLives);
        setMistakes((prev) => [
          ...prev,
          { verb, userAnswer, expectedAnswer, mode: practiceMode },
        ]);
        soundManager.playWrong();

        advanceOrEnd(nextLives, score, correctCount, nextAnswered, 1750);
      }
    },
    [
      advanceOrEnd,
      answeredCount,
      correctCount,
      currentIndex,
      difficulty,
      gameVerbs,
      isLocked,
      lives,
      maxStreak,
      practiceMode,
      score,
      streak,
      timeLeft,
      untimed,
    ]
  );

  // Timeout ref to avoid stale interval closure
  const timeoutHandlerRef = useRef<() => void>(() => {});
  useEffect(() => {
    timeoutHandlerRef.current = () => {
      const verb = gameVerbs[currentIndex];
      if (!verb) return;
      const expected =
        practiceMode === 'context' ? verb.sentence.answer : `${verb.past} / ${verb.part}`;
      processOutcome(false, 'Time expired', expected);
    };
  }, [currentIndex, gameVerbs, practiceMode, processOutcome]);

  // Countdown loop (automatically pauses when modal is open or untimed)
  useEffect(() => {
    if (screen !== 'game' || untimed || isLocked || anyModalOpen) return;

    let tickCounter = 0;
    const id = window.setInterval(() => {
      tickCounter++;
      setTimeLeft((prev) => {
        const next = prev - 0.05;
        if (next <= 3 && next > 0.08 && tickCounter % 20 === 0) {
          soundManager.playTick();
        }
        if (next <= 0) {
          window.clearInterval(id);
          window.setTimeout(() => timeoutHandlerRef.current(), 0);
          return 0;
        }
        return next;
      });
    }, 50);

    return () => window.clearInterval(id);
  }, [screen, untimed, isLocked, anyModalOpen, currentIndex]);

  const handleGoHomeRequest = () => {
    if (screen === 'game') {
      setConfirmState({
        open: true,
        title: 'Abort Current Mission?',
        message: 'Returning to the menu will end this run and discard your current streak.',
        confirmLabel: 'Abort Mission',
        onConfirm: () => {
          clearAdvanceTimer();
          stopSpeaking();
          setConfirmState((s) => ({ ...s, open: false }));
          setScreen('menu');
        },
      });
      return;
    }
    soundManager.playClick();
    setScreen('menu');
  };

  const handleStartWeakPractice = () => {
    const weakSet = new Set(getWeakVerbBases(masteryMap));
    const weakVerbs = VERB_DATABASE.filter((v) => weakSet.has(v.base));
    if (weakVerbs.length > 0) {
      launchMission(weakVerbs, `Weak Verbs (${weakVerbs.length})`);
    }
  };

  const handleRetryMistakes = () => {
    const uniqueBases = Array.from(new Set(mistakes.map((m) => m.verb.base)));
    const retryVerbs = VERB_DATABASE.filter((v) => uniqueBases.includes(v.base));
    if (retryVerbs.length > 0) {
      launchMission(retryVerbs, `Missed Review (${retryVerbs.length})`);
    }
  };

  const headerPoolLabel =
    poolMode === 'custom'
      ? String(customSelectedBases.length)
      : String(VERB_DATABASE.filter((v) => DIFFICULTY_CONFIGS[difficulty].tiers.includes(v.difficulty)).length);

  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <StarfieldCanvas />
      <ConfettiCanvas ref={confettiRef} />

      <Header
        onGoHome={handleGoHomeRequest}
        onOpenCodex={() => {
          soundManager.playClick();
          setCodexOpen(true);
        }}
        onOpenVerbSelector={() => {
          soundManager.playClick();
          setVerbSelectorOpen(true);
        }}
        onOpenLeaderboard={() => {
          soundManager.playClick();
          setLeaderboardOpen(true);
        }}
        poolCountLabel={headerPoolLabel}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="relative z-10 flex-1 flex items-center justify-center w-full">
        {screen === 'menu' && (
          <MenuScreen
            playerName={playerName}
            onPlayerNameChange={handlePlayerNameChange}
            difficulty={difficulty}
            onDifficultyChange={(d) => {
              soundManager.playClick();
              setDifficulty(d);
            }}
            practiceMode={practiceMode}
            onPracticeModeChange={(m) => {
              soundManager.playClick();
              setPracticeMode(m);
            }}
            untimed={untimed}
            onToggleUntimed={(val) => {
              soundManager.playClick();
              setUntimed(val);
            }}
            poolMode={poolMode}
            onPoolModeChange={handlePoolModeChange}
            customSelectedCount={customSelectedBases.length}
            masteryMap={masteryMap}
            onStartGame={() => launchMission()}
            onStartWeakPractice={handleStartWeakPractice}
            onOpenVerbSelector={() => {
              soundManager.playClick();
              setVerbSelectorOpen(true);
            }}
            onOpenCodex={() => {
              soundManager.playClick();
              setCodexOpen(true);
            }}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            verbs={gameVerbs}
            currentIndex={currentIndex}
            difficulty={difficulty}
            practiceMode={practiceMode}
            untimed={untimed}
            lives={lives}
            score={score}
            streak={streak}
            timeLeft={timeLeft}
            maxTime={maxTime}
            poolLabel={activePoolLabel}
            isLocked={isLocked}
            onSelectChoice={(isCorrect, chosen, expected, el) =>
              processOutcome(isCorrect, chosen, expected, el)
            }
            onSubmitTyping={(pastIn, partIn, pastOk, partOk, el) => {
              const verb = gameVerbs[currentIndex];
              if (!verb) return;
              processOutcome(
                pastOk && partOk,
                `${pastIn} / ${partIn}`,
                `${verb.past} / ${verb.part}`,
                el
              );
            }}
            onOpenCodex={() => {
              soundManager.playClick();
              setCodexOpen(true);
            }}
            onAbortMission={handleGoHomeRequest}
          />
        )}

        {screen === 'end' && (
          <ReportScreen
            isVictory={isVictory}
            score={score}
            correctCount={correctCount}
            totalQuestions={gameVerbs.length}
            maxStreak={maxStreak}
            isNewRecord={isNewRecord}
            onlineSyncStatus={onlineSyncStatus}
            practiceMode={practiceMode}
            poolLabel={activePoolLabel}
            mistakes={mistakes}
            onPlayAgain={() => launchMission()}
            onRetryMistakes={handleRetryMistakes}
            onOpenLeaderboard={() => {
              soundManager.playClick();
              setLeaderboardOpen(true);
            }}
            onGoMenu={() => {
              soundManager.playClick();
              setScreen('menu');
            }}
          />
        )}
      </main>

      <Footer />

      {/* Overlays */}
      <CodexModal
        open={codexOpen}
        masteryMap={masteryMap}
        onClose={() => {
          soundManager.playClick();
          stopSpeaking();
          setCodexOpen(false);
        }}
      />

      <VerbSelectorModal
        open={verbSelectorOpen}
        selectedBases={customSelectedBases}
        masteryMap={masteryMap}
        onSave={(bases) => {
          soundManager.playClick();
          setCustomSelectedBases(bases);
          saveCustomVerbs(bases);
          setPoolMode('custom');
          savePoolMode('custom');
          setVerbSelectorOpen(false);
        }}
        onClose={() => {
          soundManager.playClick();
          setVerbSelectorOpen(false);
        }}
      />

      <LeaderboardModal
        open={leaderboardOpen}
        initialTab={difficulty}
        onClose={() => {
          soundManager.playClick();
          setLeaderboardOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
