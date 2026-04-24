import { Tractor, RefreshCw } from "lucide-react";

export default function EmptyState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center gap-4">
      <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        <Tractor size={36} className="text-emerald-300" strokeWidth={1.5} />
      </div>
      <div>
        <h4 className="text-base font-black text-slate-700 tracking-tight">No listings yet</h4>
        <p className="text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
          This dealer hasn't posted any equipment for sale or rent.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors duration-150"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      )}
    </div>
  );
}