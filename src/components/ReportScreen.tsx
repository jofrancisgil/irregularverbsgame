import { Award, CheckCircle2, Globe, Home, RotateCcw, Sparkles, Trophy, Volume2 } from 'lucide-react';
import { MissionMistake, PracticeMode } from '../types/game';
import { isSpeechSupported, speakVerbTriple } from '../utils/speech';
import { formatModeLabel } from '../utils/storage';

export type OnlineSyncStatus = 'idle' | 'saving' | 'saved' | 'error';

interface ReportScreenProps {
  isVictory: boolean;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxStreak: number;
  isNewRecord: boolean;
  onlineSyncStatus: OnlineSyncStatus;
  practiceMode: PracticeMode;
  poolLabel: string;
  mistakes: MissionMistake[];
  onPlayAgain: () => void;
  onRetryMistakes: () => void;
  onOpenLeaderboard: () => void;
  onGoMenu: () => void;
}

export function ReportScreen({
  isVictory,
  score,
  correctCount,
  totalQuestions,
  maxStreak,
  isNewRecord,
  onlineSyncStatus,
  practiceMode,
  poolLabel,
  mistakes,
  onPlayAgain,
  onRetryMistakes,
  onOpenLeaderboard,
  onGoMenu,
}: ReportScreenProps) {
  const accuracy = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
  const speechReady = isSpeechSupported();

  let rankTitle = 'Chrono Cadet';
  if (isVictory && accuracy >= 90) rankTitle = 'Supreme Time Lord';
  else if (accuracy >= 80) rankTitle = 'Quantum Navigator';
  else if (accuracy >= 65) rankTitle = 'Timeline Specialist';

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-[#273259]/94 border border-indigo-200/20 rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Header Summary */}
        <div className="text-center pb-6 border-b border-indigo-200/12">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3 border ${
              isVictory
                ? 'bg-sky-400/20 border-sky-300/40 text-sky-300'
                : 'bg-rose-400/20 border-rose-300/40 text-rose-300'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
            {isVictory ? 'Timeline Preserved' : 'Shields Depleted'}
          </h2>
          <p className="text-sm text-slate-300 mt-1.5">
            {rankTitle} · {formatModeLabel(practiceMode)} · {poolLabel}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            {isNewRecord && (
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>New Personal Best</span>
              </span>
            )}
            {onlineSyncStatus === 'saving' && (
              <span className="inline-flex items-center gap-1.5 text-sky-300">
                <Globe className="w-3.5 h-3.5" />
                <span>Posting to online leaderboard...</span>
              </span>
            )}
            {onlineSyncStatus === 'saved' && (
              <button
                type="button"
                onClick={onOpenLeaderboard}
                className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 underline underline-offset-2 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Posted to Global Leaderboard · View Ranks</span>
              </button>
            )}
            {onlineSyncStatus === 'error' && (
              <span className="text-slate-400">
                Saved locally (online leaderboard unavailable)
              </span>
            )}
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-indigo-200/12 text-center">
          <div>
            <div className="text-xs text-slate-300 mb-0.5">Final Score</div>
            <div className="font-mono-tabular text-2xl font-bold text-amber-300">
              {score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-300 mb-0.5">Accuracy</div>
            <div className="font-mono-tabular text-2xl font-bold text-emerald-300">
              {accuracy}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-300 mb-0.5">Best Streak</div>
            <div className="font-mono-tabular text-2xl font-bold text-sky-300">
              {maxStreak}x
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-300 mb-0.5">Solved</div>
            <div className="font-mono-tabular text-2xl font-bold text-slate-100">
              {correctCount} / {totalQuestions}
            </div>
          </div>
        </div>

        {/* Mistake Review Section */}
        <div className="py-5">
          {mistakes.length === 0 ? (
            <div className="flex items-center justify-center gap-2.5 py-4 text-emerald-300 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Zero mistakes in this mission — every irregular verb mastered!</span>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="font-display font-bold text-base text-slate-100">
                  Review Missed Verbs ({mistakes.length})
                </h3>
                <button
                  type="button"
                  onClick={onRetryMistakes}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/50 text-amber-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Missed Verbs</span>
                </button>
              </div>

              <div className="divide-y divide-indigo-200/10 rounded-2xl bg-[#1c2541]/75 border border-indigo-200/12 max-h-60 overflow-y-auto">
                {mistakes.map((m, idx) => (
                  <div key={`${m.verb.base}-${idx}`} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-sky-300">{m.verb.base}</span>
                        <span className="text-slate-500">→</span>
                        <span className="font-semibold text-amber-200">{m.verb.past}</span>
                        <span className="text-slate-500">→</span>
                        <span className="font-semibold text-emerald-300">{m.verb.part}</span>
                        <span className="text-xs text-slate-400 italic">({m.verb.cat})</span>
                      </div>
                      <p className="text-xs text-rose-300 mt-0.5">
                        Your answer: {m.userAnswer}
                      </p>
                    </div>
                    {speechReady && (
                      <button
                        type="button"
                        onClick={() => speakVerbTriple(m.verb)}
                        aria-label={`Pronounce ${m.verb.base} forms`}
                        className="w-9 h-9 rounded-lg bg-[#273259] hover:bg-[#313f6e] border border-indigo-200/20 text-sky-300 flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 min-h-[46px] py-3 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-base transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="sm:w-auto min-h-[46px] py-3 px-5 rounded-2xl bg-[#313f6e] hover:bg-[#3a4a80] border border-indigo-200/20 text-amber-200 font-display font-bold text-base transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
          <button
            type="button"
            onClick={onGoMenu}
            className="sm:w-auto min-h-[46px] py-3 px-5 rounded-2xl bg-[#1b233d] hover:bg-[#313f6e] border border-indigo-200/20 text-slate-100 font-display font-bold text-base transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
