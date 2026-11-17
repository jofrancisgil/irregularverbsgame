import { Globe, Loader2, Trophy, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DIFFICULTY_CONFIGS } from '../data/verbs';
import { DifficultyLevel, HighScoreEntry } from '../types/game';
import { subscribeLeaderboard } from '../utils/leaderboardService';
import { formatModeLabel } from '../utils/storage';

interface LeaderboardModalProps {
  open: boolean;
  initialTab: DifficultyLevel;
  onClose: () => void;
}

export function LeaderboardModal({
  open,
  initialTab,
  onClose,
}: LeaderboardModalProps) {
  const [tab, setTab] = useState<DifficultyLevel>(initialTab);
  const [entries, setEntries] = useState<HighScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setErrorMsg(null);

    const unsubscribe = subscribeLeaderboard(
      tab,
      (items) => {
        setEntries(items);
        setLoading(false);
        setErrorMsg(null);
      },
      (msg) => {
        setErrorMsg(msg);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [open, tab]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <div className="w-full max-w-lg bg-[#273259] border border-indigo-200/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-indigo-200/15">
          <div>
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-300" />
              <h3 id="leaderboard-title" className="font-display text-xl font-extrabold text-slate-50">
                Global Classroom Leaderboard
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>Live rankings shared with everyone · No login required</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Leaderboard"
            className="w-9 h-9 rounded-xl bg-[#1c2541] hover:bg-[#313f6e] text-slate-300 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#1b233d] rounded-xl my-4">
          {(['easy', 'normal', 'master'] as DifficultyLevel[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setTab(d)}
              className={`py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                tab === d ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              {DIFFICULTY_CONFIGS[d].label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-indigo-200/10 rounded-2xl bg-[#1b233d]/80 border border-indigo-200/15">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-slate-300">
              <Loader2 className="w-5 h-5 animate-spin text-sky-300" />
              <span>Loading online rankings...</span>
            </div>
          ) : errorMsg ? (
            <div className="py-10 px-4 text-center text-sm text-rose-300">
              {errorMsg}
            </div>
          ) : entries.length === 0 ? (
            <div className="py-10 px-4 text-center text-sm text-slate-300">
              No scores submitted yet for {DIFFICULTY_CONFIGS[tab].label}. Complete a timed mission to claim #1!
            </div>
          ) : (
            entries.map((entry, idx) => (
              <div
                key={`${entry.name}-${entry.score}-${idx}`}
                className="px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono-tabular font-bold text-sm w-7 text-center ${
                      idx === 0 ? 'text-amber-300' : idx < 3 ? 'text-sky-300' : 'text-slate-400'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-sm text-slate-50 truncate">
                      {entry.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {entry.accuracy}% accuracy · {formatModeLabel(entry.mode)} · {entry.date}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono-tabular font-bold text-base text-amber-300">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">pts</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 flex items-center justify-between text-xs text-slate-300">
          <span>Top 20 timed missions</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#313f6e] hover:bg-[#3c4d85] text-slate-100 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
