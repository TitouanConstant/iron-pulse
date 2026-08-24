'use client';

import React, { useState } from 'react';
import { HyroxStationInfo } from '@/lib/types';
import { useApp } from '@/lib/store/app-context';
import { formatSecondsToTime } from '@/lib/calculations/hyrox';
import { formatDateFr } from '@/lib/utils';
import { 
  Trophy, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Timer, 
  Plus 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  station: HyroxStationInfo;
  onOpenLogModal: () => void;
}

export default function StationCard({ station, onOpenLogModal }: Props) {
  const { profile, getHyroxPersonalRecord } = useApp();
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);

  const pr = getHyroxPersonalRecord(station.id);
  const divisionWeight = station.equipmentWeight[profile.hyrox_division] || station.equipmentWeight.open_men;

  // Comparison with benchmarks
  let benchmarkRating = null;
  if (pr) {
    if (pr.time_seconds <= station.targetBenchmarks.elite) {
      benchmarkRating = { label: 'Élite', color: 'bg-amber-400 text-black font-bold' };
    } else if (pr.time_seconds <= station.targetBenchmarks.intermediate) {
      benchmarkRating = { label: 'Intermédiaire +', color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' };
    } else {
      benchmarkRating = { label: 'Objectif Débutant', color: 'bg-slate-800 text-slate-300' };
    }
  }

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3.5 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white">{station.name}</h3>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-amber-400 border border-slate-700">
              {station.subtitle}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard {profile.hyrox_division.replace('_', ' ')} : <span className="text-slate-200 font-semibold">{divisionWeight}</span>
          </p>
        </div>

        <button
          onClick={onOpenLogModal}
          className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-xs font-bold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Logger</span>
        </button>
      </div>

      {/* PR / Best Performance Display */}
      <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center font-black',
            pr ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20' : 'bg-slate-800 text-slate-500'
          )}>
            <Trophy className="w-5 h-5" />
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Record Personnel (PR)</div>
            {pr ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-white font-mono">
                  {formatSecondsToTime(pr.time_seconds)}
                </span>
                <span className="text-[10px] text-slate-400">
                  le {formatDateFr(pr.logged_date)}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">Aucun chrono enregistré</span>
            )}
          </div>
        </div>

        {benchmarkRating && (
          <span className={cn('text-[11px] px-2.5 py-1 rounded-lg', benchmarkRating.color)}>
            {benchmarkRating.label}
          </span>
        )}
      </div>

      {/* Target Benchmarks */}
      <div className="grid grid-cols-3 gap-1.5 text-center pt-1">
        <div className="bg-slate-900/50 rounded-xl py-1.5 px-1 border border-slate-800/60">
          <div className="text-[9px] uppercase font-bold text-amber-400">Élite</div>
          <div className="text-xs font-black text-slate-200 font-mono">
            {formatSecondsToTime(station.targetBenchmarks.elite)}
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-xl py-1.5 px-1 border border-slate-800/60">
          <div className="text-[9px] uppercase font-bold text-cyan-400">Intermédiaire</div>
          <div className="text-xs font-black text-slate-200 font-mono">
            {formatSecondsToTime(station.targetBenchmarks.intermediate)}
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-xl py-1.5 px-1 border border-slate-800/60">
          <div className="text-[9px] uppercase font-bold text-slate-400">Finisher</div>
          <div className="text-xs font-black text-slate-200 font-mono">
            {formatSecondsToTime(station.targetBenchmarks.beginner)}
          </div>
        </div>
      </div>

      {/* Expandable Pro-Tips */}
      <div className="pt-2 border-t border-slate-800/70">
        <button
          type="button"
          onClick={() => setIsTipsExpanded(!isTipsExpanded)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
        >
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Conseils tactiques & exécution</span>
          </div>
          {isTipsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isTipsExpanded && (
          <ul className="mt-2 space-y-1.5 pl-5 list-disc text-xs text-slate-300 animate-slide-up">
            {station.tips.map((tip, idx) => (
              <li key={idx} className="leading-relaxed">
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
