export function Footer() {
  return (
    <footer className="relative z-20 border-t border-indigo-300/15 bg-[#19213b]/85 backdrop-blur-md px-4 sm:px-6 py-3.5 text-xs text-slate-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span>Created with love by</span>
          <span className="font-display font-bold text-amber-300">&ldquo;JFG&rdquo;</span>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span className="text-slate-400">6th Grade English Mastery</span>
        </div>

        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-300 hover:text-sky-300 transition-colors underline decoration-dotted underline-offset-4"
        >
          Licensed under CC BY-NC-SA 4.0
        </a>
      </div>
    </footer>
  );
}
