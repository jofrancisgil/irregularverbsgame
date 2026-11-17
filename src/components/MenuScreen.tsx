import { BookOpen, Clock, Keyboard, Layers, MessageSquareText, Play, Sparkles, Target, Zap } from 'lucide-react';
import { DIFFICULTY_CONFIGS, VERB_DATABASE } from '../data/verbs';
import { DifficultyLevel, PoolMode, PracticeMode, VerbMastery } from '../types/game';
import { getMasteryStatus, getWeakVerbBases } from '../utils/storage';

interface MenuScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (diff: DifficultyLevel) => void;
  practiceMode: PracticeMode;
  onPracticeModeChange: (mode: PracticeMode) => void;
  untimed: boolean;
  onToggleUntimed: (untimed: boolean) => void;
  poolMode: PoolMode;
  onPoolModeChange: (mode: PoolMode) => void;
  customSelectedCount: number;
  masteryMap: Record<string, VerbMastery>;
  onStartGame: () => void;
  onStartWeakPractice: () => void;
  onOpenVerbSelector: () => void;
  onOpenCodex: () => void;
}

const MODE_OPTIONS: {
  id: PracticeMode;
  label: string;
  desc: string;
  icon: typeof Zap;
}[] = [
  {
    id: 'choice',
    label: 'Quick Choice',
    desc: 'Pick the matching Past Simple & Past Participle pair.',
    icon: Zap,
  },
  {
    id: 'typing',
    label: 'Type Forms',
    desc: 'Spell both irregular forms from memory with variant support.',
    icon: Keyboard,
  },
  {
    id: 'context',
    label: 'Sentence Context',
    desc: 'Choose the right form to complete real 6th-grade sentences.',
    icon: MessageSquareText,
  },
];

export function MenuScreen({
  playerName,
  onPlayerNameChange,
  difficulty,
  onDifficultyChange,
  practiceMode,
  onPracticeModeChange,
  untimed,
  onToggleUntimed,
  poolMode,
  onPoolModeChange,
  customSelectedCount,
  masteryMap,
  onStartGame,
  onStartWeakPractice,
  onOpenVerbSelector,
  onOpenCodex,
}: MenuScreenProps) {
  const totalVerbs = VERB_DATABASE.length;
  let masteredCount = 0;
  let learningCount = 0;

  for (const verb of VERB_DATABASE) {
    const status = getMasteryStatus(masteryMap[verb.base]);
    if (status === 'mastered') masteredCount++;
    else if (status === 'learning') learningCount++;
  }

  const unseenCount = totalVerbs - masteredCount - learningCount;
  const masteredPct = Math.round((masteredCount / totalVerbs) * 100);
  const weakBases = getWeakVerbBases(masteryMap);
  const activeTierVerbCount =
    poolMode === 'custom'
      ? customSelectedCount
      : VERB_DATABASE.filter((v) => DIFFICULTY_CONFIGS[difficulty].tiers.includes(v.difficulty)).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Mission Configuration */}
        <section className="lg:col-span-7 bg-[#273259]/92 border border-indigo-200/18 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold text-sky-300 tracking-wide mb-1.5">
                6th Grade English · Irregular Verbs Mission
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight text-balance">
                Master Irregular Verbs Across Time
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed max-w-xl">
                Train recognition, spelling, and real sentence usage across {totalVerbs} essential irregular verbs with audio pronunciation and Catalan hints.
              </p>
            </div>

            {/* Practice Mode Selector */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                Practice Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {MODE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = practiceMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onPracticeModeChange(opt.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        active
                          ? 'bg-sky-400/15 border-sky-400 text-slate-50'
                          : 'bg-[#1e2747]/70 border-indigo-200/15 text-slate-300 hover:border-indigo-200/35 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-sky-300' : 'text-slate-400'}`} />
                        <span className="font-display font-bold text-sm whitespace-nowrap">{opt.label}</span>
                      </div>
                      <p className="text-xs text-slate-300/90 leading-snug">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty & Timer Row */}
            <div className="pt-5 border-t border-indigo-200/12 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <label className="text-xs font-semibold text-slate-300">
                  Difficulty Tier
                </label>
                <button
                  type="button"
                  onClick={() => onToggleUntimed(!untimed)}
                  aria-pressed={untimed}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    untimed
                      ? 'bg-emerald-400/15 border-emerald-400 text-emerald-200'
                      : 'bg-[#1e2747]/70 border-indigo-200/15 text-slate-300 hover:text-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{untimed ? 'Untimed Study: On' : 'Untimed Study: Off'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {(['easy', 'normal', 'master'] as DifficultyLevel[]).map((key) => {
                  const cfg = DIFFICULTY_CONFIGS[key];
                  const active = difficulty === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onDifficultyChange(key)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                        active
                          ? 'bg-amber-400/15 border-amber-400 text-slate-50'
                          : 'bg-[#1e2747]/70 border-indigo-200/15 text-slate-300 hover:border-indigo-200/35'
                      }`}
                    >
                      <div className="font-display font-bold text-sm text-slate-50 whitespace-nowrap">
                        {cfg.label}
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {untimed ? `${cfg.maxLives} shields · No timer` : `${cfg.subtitle}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verb Pool & Player Name */}
            <div className="pt-5 border-t border-indigo-200/12 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Verb Pool</span>
                  <button
                    type="button"
                    onClick={onOpenVerbSelector}
                    className="text-xs font-semibold text-sky-300 hover:text-sky-200 underline underline-offset-2 cursor-pointer"
                  >
                    Customize ({customSelectedCount})
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onPoolModeChange('all')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      poolMode === 'all'
                        ? 'bg-sky-400/15 border-sky-400 text-sky-200'
                        : 'bg-[#1e2747]/70 border-indigo-200/15 text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    Tier Verbs ({activeTierVerbCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => onPoolModeChange('custom')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                      poolMode === 'custom'
                        ? 'bg-amber-400/15 border-amber-400 text-amber-200'
                        : 'bg-[#1e2747]/70 border-indigo-200/15 text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    Custom ({customSelectedCount})
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="explorer-name-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Explorer Callsign
                </label>
                <input
                  id="explorer-name-input"
                  type="text"
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => onPlayerNameChange(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full h-[42px] bg-[#1b233d] border border-indigo-200/20 focus:border-sky-400 rounded-xl px-3.5 text-sm font-semibold text-slate-50 placeholder-slate-400 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Primary Action */}
          <button
            type="button"
            onClick={onStartGame}
            className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 text-slate-950 font-display font-extrabold text-base sm:text-lg tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-amber-950/25 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Mission</span>
          </button>
        </section>

        {/* Right Column: Mastery Overview & Smart Study Tools */}
        <aside className="lg:col-span-5 bg-[#273259]/92 border border-indigo-200/18 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-slate-50">Your Verb Mastery</h2>
              <span className="font-mono-tabular text-sm font-bold text-sky-300">
                {masteredCount} / {totalVerbs}
              </span>
            </div>

            {/* Mastery Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[#1b233d] overflow-hidden flex mb-3" aria-label={`Mastery progress ${masteredPct}%`}>
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${(masteredCount / totalVerbs) * 100}%` }}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${(learningCount / totalVerbs) * 100}%` }}
              />
            </div>

            {/* Clean unboxed summary stats */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-indigo-200/12 text-center">
              <div>
                <div className="font-mono-tabular text-xl font-bold text-emerald-300">{masteredCount}</div>
                <div className="text-xs text-slate-300">Mastered</div>
              </div>
              <div>
                <div className="font-mono-tabular text-xl font-bold text-amber-300">{learningCount}</div>
                <div className="text-xs text-slate-300">In Progress</div>
              </div>
              <div>
                <div className="font-mono-tabular text-xl font-bold text-slate-300">{unseenCount}</div>
                <div className="text-xs text-slate-300">Unseen</div>
              </div>
            </div>

            {/* Weak Verbs Adaptive Action */}
            <div className="mt-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100 mb-1.5">
                <Target className="w-4 h-4 text-amber-300" />
                <span>Targeted Review</span>
              </div>
              {weakBases.length > 0 ? (
                <div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    You have <strong className="text-amber-300 font-mono-tabular">{weakBases.length}</strong> verbs that need extra practice based on recent attempts.
                  </p>
                  <button
                    type="button"
                    onClick={onStartWeakPractice}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#313f6e] hover:bg-[#3a4a80] border border-amber-300/40 text-amber-200 font-display font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Practice {weakBases.length} Weak Verbs</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Complete a mission to build your personal mastery map. Any verbs you miss will appear here for one-click review.
                </p>
              )}
            </div>
          </div>

          {/* Codex & Learning Tips */}
          <div className="pt-5 border-t border-indigo-200/12">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <Layers className="w-4 h-4 text-sky-300" />
                <span>Study by Verb Pattern</span>
              </div>
              <button
                type="button"
                onClick={onOpenCodex}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200 cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Codex</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Irregular verbs follow memorable families like <span className="text-slate-100 font-medium">cut–cut–cut</span>, <span className="text-slate-100 font-medium">buy–bought–bought</span>, and <span className="text-slate-100 font-medium">sing–sang–sung</span>. Listen to each form in the Codex before starting.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
