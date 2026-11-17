import { Check, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { COMMON_25_BASES, VERB_DATABASE } from '../data/verbs';
import { VerbMastery } from '../types/game';
import { getWeakVerbBases } from '../utils/storage';

interface VerbSelectorModalProps {
  open: boolean;
  selectedBases: string[];
  masteryMap: Record<string, VerbMastery>;
  onSave: (bases: string[]) => void;
  onClose: () => void;
}

export function VerbSelectorModal({
  open,
  selectedBases,
  masteryMap,
  onSave,
  onClose,
}: VerbSelectorModalProps) {
  const [draftSet, setDraftSet] = useState<Set<string>>(() => new Set(selectedBases));
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      setDraftSet(new Set(selectedBases));
      setSearch('');
      setErrorMsg('');
    }
  }, [open, selectedBases]);

  const weakBases = useMemo(() => getWeakVerbBases(masteryMap), [masteryMap]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return VERB_DATABASE.filter((v) => {
      if (!q) return true;
      return (
        v.base.toLowerCase().includes(q) ||
        v.past.toLowerCase().includes(q) ||
        v.part.toLowerCase().includes(q) ||
        v.cat.toLowerCase().includes(q)
      );
    });
  }, [search]);

  if (!open) return null;

  const toggleVerb = (base: string) => {
    setErrorMsg('');
    setDraftSet((prev) => {
      const next = new Set(prev);
      if (next.has(base)) next.delete(base);
      else next.add(base);
      return next;
    });
  };

  const applyPreset = (preset: 'all' | 'none' | 'cadet' | 'common25' | 'weak') => {
    setErrorMsg('');
    if (preset === 'all') {
      setDraftSet(new Set(VERB_DATABASE.map((v) => v.base)));
    } else if (preset === 'none') {
      setDraftSet(new Set());
    } else if (preset === 'cadet') {
      setDraftSet(new Set(VERB_DATABASE.filter((v) => v.difficulty === 1).map((v) => v.base)));
    } else if (preset === 'common25') {
      setDraftSet(new Set(COMMON_25_BASES));
    } else if (preset === 'weak') {
      if (weakBases.length === 0) {
        setErrorMsg('No weak or missed verbs recorded yet — complete a round first.');
        return;
      }
      setDraftSet(new Set(weakBases));
    }
  };

  const handleConfirm = () => {
    if (draftSet.size < 5) {
      setErrorMsg(`Select at least 5 verbs (${5 - draftSet.size} more needed).`);
      return;
    }
    onSave(Array.from(draftSet));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verb-selector-title"
    >
      <div className="w-full max-w-4xl bg-[#273259] border border-indigo-200/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-indigo-200/15">
          <div>
            <h3 id="verb-selector-title" className="font-display text-xl sm:text-2xl font-extrabold text-slate-50">
              Custom Verb Pool
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Choose at least 5 verbs for targeted classroom or home practice.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Verb Selector"
            className="w-10 h-10 rounded-xl bg-[#1c2541] hover:bg-[#313f6e] text-slate-300 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets & Search */}
        <div className="py-3.5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className="px-3 py-1.5 rounded-lg bg-[#1b233d] hover:bg-[#313f6e] text-sky-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => applyPreset('none')}
                className="px-3 py-1.5 rounded-lg bg-[#1b233d] hover:bg-[#313f6e] text-rose-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => applyPreset('cadet')}
                className="px-3 py-1.5 rounded-lg bg-[#1b233d] hover:bg-[#313f6e] text-emerald-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Cadet Core
              </button>
              <button
                type="button"
                onClick={() => applyPreset('common25')}
                className="px-3 py-1.5 rounded-lg bg-[#1b233d] hover:bg-[#313f6e] text-amber-300 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Common 25
              </button>
              <button
                type="button"
                onClick={() => applyPreset('weak')}
                className="px-3 py-1.5 rounded-lg bg-[#1b233d] hover:bg-[#313f6e] text-amber-200 border border-amber-300/30 text-xs font-semibold cursor-pointer whitespace-nowrap"
              >
                Weak Verbs ({weakBases.length})
              </button>
            </div>

            <span className="font-mono-tabular text-xs font-bold text-slate-200">
              Selected: {draftSet.size} / {VERB_DATABASE.length}
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter verbs by English or Catalan..."
              className="w-full h-11 bg-[#1b233d] border border-indigo-200/20 focus:border-sky-400 rounded-xl pl-10 pr-4 text-sm text-slate-50 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2.5 rounded-2xl border border-indigo-200/15 bg-[#1b233d]/80 max-h-[45vh]">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-8 text-slate-400 text-sm">
              No verbs match your filter.
            </div>
          ) : (
            filtered.map((v) => {
              const checked = draftSet.has(v.base);
              return (
                <button
                  key={v.base}
                  type="button"
                  onClick={() => toggleVerb(v.base)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    checked
                      ? 'bg-[#273259] border-sky-400/80 text-slate-50'
                      : 'bg-[#1e2747]/50 border-indigo-200/10 text-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        checked
                          ? 'bg-sky-400 border-sky-400 text-slate-950'
                          : 'border-slate-500 bg-transparent'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-sm truncate">{v.base}</div>
                      <div className="text-xs text-slate-300 truncate">
                        {v.past} · {v.part}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 italic truncate max-w-[90px] shrink-0">
                    {v.cat}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className={`text-xs font-semibold ${errorMsg ? 'text-rose-300' : 'text-slate-300'}`}>
            {errorMsg || 'Recommended selection: 10–25 verbs per focused session.'}
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1b233d] hover:bg-[#313f6e] text-slate-200 text-sm font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-sm cursor-pointer whitespace-nowrap"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
