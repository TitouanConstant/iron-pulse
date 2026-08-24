'use client';

import React, { useState } from 'react';
import { WorkoutSet } from '@/lib/types';
import { useApp } from '@/lib/store/app-context';
import { Check, Trash2, Zap, Flame, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  set: WorkoutSet;
  index: number;
  onUpdate: (data: Partial<WorkoutSet>) => void;
  onDelete: () => void;
}

export default function SetRow({ set, index, onUpdate, onDelete }: Props) {
  const { startRestTimer } = useApp();
  const [showRpePicker, setShowRpePicker] = useState(false);

  const handleToggleComplete = () => {
    const nextState = !set.is_completed;
    onUpdate({ is_completed: nextState });

    // When marking set as complete, automatically launch rest timer if configured
    if (nextState) {
      startRestTimer(set.rest_seconds || 90);
    }
  };

  const rpeValues = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

  return (
    <div
      className={cn(
        'relative rounded-2xl p-2.5 transition-all border',
        set.is_completed
          ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
          : set.is_warmup
          ? 'bg-slate-900/60 border-amber-500/30'
          : 'bg-slate-800/60 border-slate-700/60'
      )}
    >
      <div className="flex items-center gap-2">
        {/* Set number / Warmup toggle button */}
        <button
          type="button"
          onClick={() => onUpdate({ is_warmup: !set.is_warmup })}
          className={cn(
            'w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors',
            set.is_warmup
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'bg-slate-700 text-slate-200'
          )}
          title={set.is_warmup ? 'Échauffement (cliquer pour série de travail)' : 'Série de travail (cliquer pour échauffement)'}
        >
          {set.is_warmup ? 'É' : index + 1}
        </button>

        {/* Previous performance reference tag */}
        <div className="hidden xs:block text-[11px] font-mono text-slate-400 min-w-[70px]">
          {set.previous_weight_kg ? (
            <span className="text-slate-400">
              {set.previous_weight_kg}k &times; {set.previous_reps}
            </span>
          ) : (
            <span className="text-slate-400">&mdash;</span>
          )}
        </div>

        {/* Weight input (kg) */}
        <div className="flex-1 min-w-[72px]">
          <div className="relative">
            <input
              type="number"
              step="0.5"
              inputMode="decimal"
              value={set.weight_kg === 0 ? '' : set.weight_kg}
              onChange={(e) => onUpdate({ weight_kg: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className={cn(
                'w-full text-center font-black font-mono text-base py-2 px-1 rounded-xl outline-none border transition-colors',
                set.is_completed
                  ? 'bg-slate-900/80 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-white border-slate-700 focus:border-amber-400'
              )}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
              kg
            </span>
          </div>
        </div>

        {/* Reps input */}
        <div className="flex-1 min-w-[62px]">
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              value={set.reps === 0 ? '' : set.reps}
              onChange={(e) => onUpdate({ reps: parseInt(e.target.value, 10) || 0 })}
              placeholder="0"
              className={cn(
                'w-full text-center font-black font-mono text-base py-2 px-1 rounded-xl outline-none border transition-colors',
                set.is_completed
                  ? 'bg-slate-900/80 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-white border-slate-700 focus:border-amber-400'
              )}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
              reps
            </span>
          </div>
        </div>

        {/* RPE Selector trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRpePicker(!showRpePicker)}
            className={cn(
              'px-2 py-2 rounded-xl text-xs font-bold font-mono border transition-colors',
              set.rpe
                ? 'bg-slate-900 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            )}
            title="Effort perçu (RPE 1-10)"
          >
            {set.rpe ? `@${set.rpe}` : 'RPE'}
          </button>

          {/* RPE Popover */}
          {showRpePicker && (
            <div className="absolute right-0 bottom-full mb-2 z-50 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl flex flex-wrap gap-1 w-44 animate-slide-up">
              <div className="w-full text-[10px] font-bold text-slate-400 px-1 mb-1">
                Intensité RPE
              </div>
              {rpeValues.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onUpdate({ rpe: val });
                    setShowRpePicker(false);
                  }}
                  className={cn(
                    'flex-1 py-1 px-2 rounded-lg text-xs font-bold',
                    set.rpe === val
                      ? 'bg-amber-400 text-black'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  )}
                >
                  {val}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Big Complete Toggle Checkmark */}
        <button
          type="button"
          onClick={handleToggleComplete}
          className={cn(
            'w-10 h-10 rounded-xl font-bold flex items-center justify-center shrink-0 transition-all active:scale-90',
            set.is_completed
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
          )}
          title="Valider la série (lance le timer de repos)"
        >
          <Check className={cn('w-5 h-5 stroke-[3]', set.is_completed && 'text-black')} />
        </button>

        {/* Delete set */}
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-rose-400 rounded-lg shrink-0 transition-colors"
          title="Supprimer la série"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
