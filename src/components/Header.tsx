import { Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  onGoHome: () => void;
  onOpenCodex: () => void;
  onOpenVerbSelector: () => void;
  onOpenLeaderboard: () => void;
  poolCountLabel: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({
  onGoHome,
  onOpenCodex,
  onOpenVerbSelector,
  onOpenLeaderboard,
  poolCountLabel,
  soundEnabled,
  onToggleSound,
}: HeaderProps) {
  return (
    <header className="relative z-20 w-full border-b border-indigo-300/15 bg-[#1c2541]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-50 hover:text-sky-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md px-1"
        >
          Time Explorer
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="flex items-center gap-4 sm:gap-7 text-sm font-medium text-slate-300" aria-label="Primary">
          <button
            type="button"
            onClick={onOpenCodex}
            className="hover:text-sky-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md"
          >
            Codex
          </button>
          <button
            type="button"
            onClick={onOpenVerbSelector}
            className="hover:text-sky-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md"
          >
            Verb Pool ({poolCountLabel})
          </button>
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="hover:text-sky-300 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md"
          >
            Leaderboard
          </button>
        </nav>

        {/* Zone 3: Single primary audio control */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#273259] hover:bg-[#313f6e] border border-indigo-300/20 text-xs sm:text-sm font-semibold text-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
