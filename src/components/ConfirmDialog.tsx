import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm bg-[#273259] border border-indigo-200/20 rounded-3xl p-6 text-center shadow-2xl">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 id="confirm-dialog-title" className="font-display text-lg font-extrabold text-slate-50 mb-1.5">
          {title}
        </h4>
        <p className="text-sm text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-[#1b233d] hover:bg-[#313f6e] text-slate-200 text-sm font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-sm font-bold cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
