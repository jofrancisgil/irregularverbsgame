import { Search, Volume2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PATTERN_LABELS, VERB_DATABASE } from '../data/verbs';
import { MasteryStatus, VerbMastery, VerbPattern } from '../types/game';
import { isSpeechSupported, speakVerbTriple } from '../utils/speech';
import { getMasteryStatus } from '../utils/storage';

interface CodexModalProps {
  open: boolean;
  masteryMap: Record<string, VerbMastery>;
  onClose: () => void;
}

const PATTERN_FILTERS: { id: 'ALL' | VerbPattern; label: string }[] = [
  { id: 'ALL', label: 'All Patterns' },
  { id: 'AAA', label: 'A-A-A Identical' },
  { id: 'ABB', label: 'A-B-B Twin' },
  { id: 'ABC', label: 'A-B-C Three Forms' },
  { id: 'ABA', label: 'A-B-A Boomerang' },
  { id: 'MIXED', label: 'Mixed' },
];

const STATUS_FILTERS: { id: 'all' | MasteryStatus; label: string }[] = [
  { id: 'all', label: 'All Status' },
  { id: 'mastered', label: 'Mastered' },
  { id: 'learning', label: 'In Progress' },
  { id: 'unseen', label: 'Unseen' },
];

export function CodexModal({ open, masteryMap, onClose }: CodexModalProps) {
  const [search, setSearch] = useState('');
  const [patternFilter, setPatternFilter] = useState<'ALL' | VerbPattern>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | MasteryStatus>('all');
  const speechReady = isSpeechSupported();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return VERB_DATABASE.filter((v) => {
      if (patternFilter !== 'ALL' && v.pattern !== patternFilter) return false;
      const status = getMasteryStatus(masteryMap[v.base]);
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (!q) return true;
      return (
        v.base.toLowerCase().includes(q) ||
        v.past.toLowerCase().includes(q) ||
        v.part.toLowerCase().includes(q) ||
        v.cat.toLowerCase().includes(q)
      );
    });
  }, [search, patternFilter, statusFilter, masteryMap]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="codex-title"
    >
      <div className="w-full max-w-4xl bg-[#273259] border border-indigo-200/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-indigo-200/15">
          <div>
            <h3 id="codex-title" className="font-display text-xl sm:text-2xl font-extrabold text-slate-50">
              Irregular Verbs Codex
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {patternFilter === 'ALL'
                ? 'Study all 95 verbs alphabetically with pronunciation and Catalan translations.'
                : PATTERN_LABELS[patternFilter].subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Codex"
            className="w-10 h-10 rounded-xl bg-[#1c2541] hover:bg-[#313f6e] text-slate-300 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="py-3.5 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search English verb or Catalan meaning (e.g. swim, nedar, sang)..."
              className="w-full h-11 bg-[#1b233d] border border-indigo-200/20 focus:border-sky-400 rounded-xl pl-10 pr-4 text-sm text-slate-50 placeholder-slate-400 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Pattern Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {PATTERN_FILTERS.map((pf) => (
                <button
                  key={pf.id}
                  type="button"
                  onClick={() => setPatternFilter(pf.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    patternFilter === pf.id
                      ? 'bg-sky-400 text-slate-950'
                      : 'bg-[#1b233d] text-slate-300 hover:text-white'
                  }`}
                >
                  {pf.label}
                </button>
              ))}
            </div>

            {/* Mastery Filter */}
            <div className="flex items-center gap-1 bg-[#1b233d] p-1 rounded-lg">
              {STATUS_FILTERS.map((sf) => (
                <button
                  key={sf.id}
                  type="button"
                  onClick={() => setStatusFilter(sf.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === sf.id
                      ? 'bg-[#313f6e] text-slate-50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-indigo-200/15 bg-[#1b233d]/85">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-[#212b4a] text-slate-200 font-display font-bold text-xs sticky top-0 border-b border-indigo-200/15">
              <tr>
                <th className="py-3 px-3.5">Base Form</th>
                <th className="py-3 px-3.5">Past Simple</th>
                <th className="py-3 px-3.5">Past Participle</th>
                <th className="py-3 px-3.5">Català</th>
                <th className="py-3 px-3.5 hidden sm:table-cell">Pattern</th>
                <th className="py-3 px-3.5 text-right">Status</th>
                {speechReady && <th className="py-3 px-3 text-right">Audio</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-200/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={speechReady ? 7 : 6} className="py-8 text-center text-slate-400">
                    No verbs match the current search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const status = getMasteryStatus(masteryMap[v.base]);
                  const statusText =
                    status === 'mastered'
                      ? 'Mastered'
                      : status === 'learning'
                        ? 'Learning'
                        : 'Unseen';
                  const statusClass =
                    status === 'mastered'
                      ? 'text-emerald-300'
                      : status === 'learning'
                        ? 'text-amber-300'
                        : 'text-slate-400';

                  return (
                    <tr key={v.base} className="hover:bg-[#273259]/75 transition-colors">
                      <td className="py-2.5 px-3.5 font-display font-bold text-sky-300">{v.base}</td>
                      <td className="py-2.5 px-3.5 font-semibold text-amber-200">{v.past}</td>
                      <td className="py-2.5 px-3.5 font-semibold text-emerald-300">{v.part}</td>
                      <td className="py-2.5 px-3.5 text-slate-200 italic">{v.cat}</td>
                      <td className="py-2.5 px-3.5 text-slate-400 font-mono-tabular text-xs hidden sm:table-cell">
                        {v.pattern}
                      </td>
                      <td className={`py-2.5 px-3.5 text-right text-xs font-semibold ${statusClass}`}>
                        {statusText}
                      </td>
                      {speechReady && (
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => speakVerbTriple(v)}
                            aria-label={`Listen to ${v.base}, ${v.past}, ${v.part}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#273259] hover:bg-[#344376] text-sky-300 cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3.5 flex items-center justify-between text-xs text-slate-300">
          <span className="font-mono-tabular">
            Showing {filtered.length} of {VERB_DATABASE.length} verbs
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-display font-bold text-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
