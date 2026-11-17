import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  Heart,
  Volume2,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { DIFFICULTY_CONFIGS } from '../data/verbs';
import { DifficultyLevel, PracticeMode, VerbItem } from '../types/game';
import { isSpeechSupported, speakCompletedSentence, speakText, speakVerbTriple } from '../utils/speech';

interface ChoiceOption {
  text: string;
  isCorrect: boolean;
}

interface GameScreenProps {
  verbs: VerbItem[];
  currentIndex: number;
  difficulty: DifficultyLevel;
  practiceMode: PracticeMode;
  untimed: boolean;
  lives: number;
  score: number;
  streak: number;
  timeLeft: number;
  maxTime: number;
  poolLabel: string;
  isLocked: boolean;
  onSelectChoice: (isCorrect: boolean, chosenLabel: string, expectedLabel: string, anchorEl?: HTMLElement | null) => void;
  onSubmitTyping: (
    pastInput: string,
    partInput: string,
    pastOk: boolean,
    partOk: boolean,
    anchorEl?: HTMLElement | null
  ) => void;
  onOpenCodex: () => void;
  onAbortMission: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeAnswer(val: string): string {
  return val
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function GameScreen({
  verbs,
  currentIndex,
  difficulty,
  practiceMode,
  untimed,
  lives,
  score,
  streak,
  timeLeft,
  maxTime,
  poolLabel,
  isLocked,
  onSelectChoice,
  onSubmitTyping,
  onOpenCodex,
  onAbortMission,
}: GameScreenProps) {
  const verb = verbs[currentIndex];
  const maxLives = DIFFICULTY_CONFIGS[difficulty].maxLives;

  const [showCatalan, setShowCatalan] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [pastInput, setPastInput] = useState('');
  const [partInput, setPartInput] = useState('');
  const [typingResult, setTypingResult] = useState<{ pastOk: boolean; partOk: boolean } | null>(null);

  const pastInputRef = useRef<HTMLInputElement | null>(null);
  const submitBtnRef = useRef<HTMLButtonElement | null>(null);

  // Reset local per-question UI state when question changes
  useEffect(() => {
    setShowCatalan(false);
    setSelectedChoiceIdx(null);
    setPastInput('');
    setPartInput('');
    setTypingResult(null);
    if (practiceMode === 'typing') {
      setTimeout(() => pastInputRef.current?.focus(), 40);
    }
  }, [currentIndex, practiceMode, verb?.base]);

  const choiceOptions: ChoiceOption[] = useMemo(() => {
    if (!verb) return [];
    if (practiceMode === 'choice') {
      const correctText = `${verb.past} / ${verb.part}`;
      return shuffleArray([
        { text: correctText, isCorrect: true },
        { text: verb.distractors[0], isCorrect: false },
        { text: verb.distractors[1], isCorrect: false },
      ]);
    }
    if (practiceMode === 'context') {
      return shuffleArray([
        { text: verb.sentence.answer, isCorrect: true },
        { text: verb.sentence.distractors[0], isCorrect: false },
        { text: verb.sentence.distractors[1], isCorrect: false },
      ]);
    }
    return [];
  }, [verb, practiceMode, currentIndex]);

  const handleChoicePick = (idx: number, el?: HTMLElement | null) => {
    if (isLocked || !verb) return;
    setSelectedChoiceIdx(idx);
    const chosen = choiceOptions[idx];
    const expectedLabel =
      practiceMode === 'context'
        ? verb.sentence.answer
        : `${verb.past} / ${verb.part}`;
    onSelectChoice(chosen.isCorrect, chosen.text, expectedLabel, el);
  };

  const handleTypingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked || !verb) return;

    const normPast = normalizeAnswer(pastInput);
    const normPart = normalizeAnswer(partInput);
    const pastOk = verb.acceptedPast.includes(normPast);
    const partOk = verb.acceptedPart.includes(normPart);

    setTypingResult({ pastOk, partOk });
    onSubmitTyping(
      pastInput.trim() || '(blank)',
      partInput.trim() || '(blank)',
      pastOk,
      partOk,
      submitBtnRef.current
    );
  };

  // Keyboard shortcuts for Choice & Context modes (1/2/3 or A/B/C, and Space to pronounce)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!verb) return;
      const targetTag = (e.target as HTMLElement)?.tagName;
      const inInput = targetTag === 'INPUT' || targetTag === 'TEXTAREA';

      if (!inInput && e.code === 'Space') {
        e.preventDefault();
        if (practiceMode === 'context' && isLocked) {
          speakCompletedSentence(verb);
        } else {
          speakText(verb.base);
        }
        return;
      }

      if (practiceMode !== 'typing' && !isLocked && !inInput) {
        const key = e.key.toLowerCase();
        if (key === '1' || key === 'a') handleChoicePick(0);
        else if (key === '2' || key === 'b') handleChoicePick(1);
        else if (key === '3' || key === 'c') handleChoicePick(2);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!verb) return null;

  const timeRatio = untimed ? 1 : Math.max(0, timeLeft / maxTime);
  const timerColor =
    untimed
      ? 'bg-emerald-400'
      : timeRatio < 0.28
        ? 'bg-rose-400'
        : timeRatio < 0.55
          ? 'bg-amber-400'
          : 'bg-sky-400';

  const sentenceParts = verb.sentence.text.split('___');
  const speechReady = isSpeechSupported();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
      {/* Top HUD Bar */}
      <div className="bg-[#273259]/92 border border-indigo-200/18 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Shields */}
        <div className="flex items-center gap-2" aria-label={`Shields remaining: ${lives} of ${maxLives}`}>
          <div className="flex items-center gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform duration-200 ${
                  i < lives
                    ? 'text-rose-400 fill-rose-400 scale-100'
                    : 'text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>
          <span className="font-mono-tabular text-xs font-semibold text-slate-300">
            {lives}/{maxLives}
          </span>
        </div>

        {/* Step & Mode Metadata */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
          <span className="font-mono-tabular font-bold text-slate-50">
            {currentIndex + 1} / {verbs.length}
          </span>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span className="text-slate-300 hidden sm:inline">{poolLabel}</span>
          {streak >= 2 && (
            <>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-display font-bold text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-amber-300" />
                <span className="font-mono-tabular">{streak}x</span>
              </span>
            </>
          )}
        </div>

        {/* Score */}
        <div className="text-right">
          <span className="text-xs text-slate-300 mr-2">Score</span>
          <span className="font-mono-tabular text-lg font-bold text-amber-300">
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full bg-[#1b233d] border border-indigo-200/15 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ease-linear ${timerColor}`}
            style={{ width: `${timeRatio * 100}%` }}
          />
        </div>
        <span className="font-mono-tabular text-xs font-bold text-slate-200 w-16 text-right shrink-0">
          {untimed ? 'Untimed' : `${timeLeft.toFixed(1)}s`}
        </span>
      </div>

      {/* Central Verb Portal Card */}
      <div className="bg-[#273259]/94 border border-indigo-200/20 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <p className="text-xs font-semibold text-sky-300 tracking-wide mb-2">
          {practiceMode === 'context'
            ? `Complete the sentence using "${verb.base}"`
            : 'Base Verb (Infinitive)'}
        </p>

        <div className="flex items-center justify-center gap-3 my-1">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-50">
            {verb.base.toUpperCase()}
          </h2>
          {speechReady && (
            <button
              type="button"
              onClick={() => (isLocked ? speakVerbTriple(verb) : speakText(verb.base))}
              title="Listen to pronunciation (Space)"
              aria-label={`Pronounce ${verb.base}`}
              className="w-11 h-11 rounded-xl bg-[#313f6e] hover:bg-[#3c4d85] border border-sky-300/30 text-sky-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sentence Display in Context Mode */}
        {practiceMode === 'context' && (
          <div className="mt-4 mb-2 px-4 py-4 rounded-2xl bg-[#1c2541]/90 border border-indigo-200/15">
            <p className="text-base sm:text-xl font-medium text-slate-100 leading-relaxed">
              {sentenceParts[0]}
              <span className="inline-block min-w-[84px] mx-1 px-2.5 py-0.5 rounded-lg border-b-2 border-sky-400 bg-sky-400/15 font-display font-bold text-sky-200">
                {isLocked ? verb.sentence.answer : '___'}
              </span>
              {sentenceParts[1]}
            </p>
          </div>
        )}

        {/* Sub-prompt & Catalan Hint Toggle */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs sm:text-sm text-slate-300">
            {practiceMode === 'choice' && 'Select the matching Past Simple & Past Participle'}
            {practiceMode === 'typing' && 'Type both Past Simple and Past Participle'}
            {practiceMode === 'context' && 'Pick the form that fits the grammar context'}
          </span>

          <button
            type="button"
            onClick={() => setShowCatalan((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2747] hover:bg-[#2a365f] border border-indigo-200/20 text-xs font-semibold text-amber-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            {showCatalan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showCatalan ? `Catalan: ${verb.cat}` : 'Show Catalan hint'}</span>
          </button>
        </div>
      </div>

      {/* Answer Zone: Quick Choice OR Context Choice */}
      {(practiceMode === 'choice' || practiceMode === 'context') && (
        <div className="flex flex-col gap-3">
          {choiceOptions.map((opt, idx) => {
            const letter = ['A', 'B', 'C'][idx];
            const isPicked = selectedChoiceIdx === idx;
            let cardClass =
              'bg-[#273259]/90 border-indigo-200/20 hover:border-sky-400 text-slate-50';
            let statusLabel = practiceMode === 'choice' ? 'Past / Participle' : `Key ${idx + 1}`;

            if (isLocked) {
              if (isPicked && opt.isCorrect) {
                cardClass = 'bg-emerald-600/35 border-emerald-400 text-emerald-50';
                statusLabel = 'Correct';
              } else if (isPicked && !opt.isCorrect) {
                cardClass = 'bg-rose-600/35 border-rose-400 text-rose-50 animate-shake';
                statusLabel = 'Incorrect';
              } else if (opt.isCorrect) {
                cardClass = 'bg-emerald-500/20 border-emerald-400/70 text-emerald-100';
                statusLabel = 'Correct Answer';
              } else {
                cardClass = 'bg-[#222c4f]/60 border-indigo-200/10 text-slate-400 opacity-70';
              }
            }

            return (
              <button
                key={`${currentIndex}-${idx}`}
                type="button"
                disabled={isLocked}
                onClick={(e) => handleChoicePick(idx, e.currentTarget)}
                className={`w-full min-h-[60px] px-5 py-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-150 cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${cardClass}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-9 h-9 rounded-xl bg-[#1b233d] border border-indigo-200/25 font-mono-tabular font-bold text-sm text-sky-300 flex items-center justify-center shrink-0">
                    {letter}
                  </span>
                  <span className="font-display font-bold text-lg sm:text-xl tracking-wide">
                    {opt.text}
                  </span>
                </div>
                <span className="text-xs font-semibold opacity-80 whitespace-nowrap ml-2">
                  {statusLabel}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Answer Zone: Active Typing Mode */}
      {practiceMode === 'typing' && (
        <form onSubmit={handleTypingSubmit} className="bg-[#273259]/92 border border-indigo-200/20 rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="past-simple-input" className="block text-xs font-semibold text-sky-300 mb-1.5">
                Past Simple
              </label>
              <input
                ref={pastInputRef}
                id="past-simple-input"
                type="text"
                disabled={isLocked}
                value={pastInput}
                onChange={(e) => setPastInput(e.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Type Past Simple..."
                className={`w-full h-12 rounded-xl px-4 font-display font-bold text-lg outline-none border-2 transition-colors ${
                  typingResult
                    ? typingResult.pastOk
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                      : 'bg-rose-500/20 border-rose-400 text-rose-100'
                    : 'bg-[#1b233d] border-indigo-200/25 focus:border-sky-400 text-slate-50 placeholder-slate-400'
                }`}
              />
              {typingResult && !typingResult.pastOk && (
                <p className="text-xs text-emerald-300 font-semibold mt-1.5">
                  Expected: {verb.past}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="past-participle-input" className="block text-xs font-semibold text-amber-300 mb-1.5">
                Past Participle
              </label>
              <input
                id="past-participle-input"
                type="text"
                disabled={isLocked}
                value={partInput}
                onChange={(e) => setPartInput(e.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="Type Past Participle..."
                className={`w-full h-12 rounded-xl px-4 font-display font-bold text-lg outline-none border-2 transition-colors ${
                  typingResult
                    ? typingResult.partOk
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100'
                      : 'bg-rose-500/20 border-rose-400 text-rose-100'
                    : 'bg-[#1b233d] border-indigo-200/25 focus:border-sky-400 text-slate-50 placeholder-slate-400'
                }`}
              />
              {typingResult && !typingResult.partOk && (
                <p className="text-xs text-emerald-300 font-semibold mt-1.5">
                  Expected: {verb.part}
                </p>
              )}
            </div>
          </div>

          <button
            ref={submitBtnRef}
            type="submit"
            disabled={isLocked}
            className="w-full min-h-[46px] py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-display font-extrabold text-base transition-colors cursor-pointer"
          >
            Check Forms (Enter)
          </button>
        </form>
      )}

      {/* Feedback Banner (explicit icon + text, never hue-only) */}
      {isLocked && (
        <div
          className={`rounded-2xl px-4 py-3 border flex flex-wrap items-center justify-between gap-2 text-sm font-medium ${
            (practiceMode === 'typing'
              ? typingResult?.pastOk && typingResult?.partOk
              : selectedChoiceIdx !== null && choiceOptions[selectedChoiceIdx]?.isCorrect)
              ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-100'
              : 'bg-rose-500/15 border-rose-400/50 text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {(practiceMode === 'typing'
              ? typingResult?.pastOk && typingResult?.partOk
              : selectedChoiceIdx !== null && choiceOptions[selectedChoiceIdx]?.isCorrect) ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
            )}
            <span>
              <strong>{verb.base}</strong> · {verb.past} · {verb.part}
              {practiceMode === 'context' ? ` — ${verb.sentence.clue}` : ` (${verb.cat})`}
            </span>
          </div>
          {speechReady && (
            <button
              type="button"
              onClick={() =>
                practiceMode === 'context' ? speakCompletedSentence(verb) : speakVerbTriple(verb)
              }
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-200 hover:text-white cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{practiceMode === 'context' ? 'Hear sentence' : 'Hear 3 forms'}</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom Auxiliary Row */}
      <div className="flex items-center justify-between px-1 pt-1 text-xs">
        <button
          type="button"
          onClick={onAbortMission}
          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-rose-300 font-semibold transition-colors cursor-pointer py-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Abort Mission</span>
        </button>

        <span className="text-slate-400 hidden sm:inline">
          {practiceMode === 'typing' ? 'Press Enter to submit' : 'Shortcuts: 1–3 or A–C · Space to listen'}
        </span>

        <button
          type="button"
          onClick={onOpenCodex}
          className="inline-flex items-center gap-1.5 text-sky-300 hover:text-sky-200 font-semibold transition-colors cursor-pointer py-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Codex</span>
        </button>
      </div>
    </div>
  );
}
