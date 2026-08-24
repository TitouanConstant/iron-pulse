'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { HYROX_STATIONS_DATA, calculateHyroxTotalSimulation, formatSecondsToTime } from '@/lib/calculations/hyrox';
import { HyroxStationType } from '@/lib/types';
import { Calculator, Trophy, Timer, Footprints, ShieldCheck, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SimulationCalculator() {
  const { getHyroxPersonalRecord } = useApp();

  // Run pace in seconds (e.g. 270s = 4:30/km)
  const [runPaceSec, setRunPaceSec] = useState<number>(270);
  const [roxzoneMin, setRoxzoneMin] = useState<number>(6); // 6 mins total Roxzone

  // Initialize station times with user's PR or intermediate benchmark
  const [stationTimes, setStationTimes] = useState<Record<HyroxStationType, number>>(() => {
    const initial: any = {};
    HYROX_STATIONS_DATA.forEach((st) => {
      const pr = getHyroxPersonalRecord(st.id);
      initial[st.id] = pr ? pr.time_seconds : st.targetBenchmarks.intermediate;
    });
    return initial;
  });

  const simulation = calculateHyroxTotalSimulation({
    runPacePerKmSeconds: runPaceSec,
    stationTimesSeconds: stationTimes,
    roxzoneSeconds: roxzoneMin * 60,
  });

  const runMinutes = Math.floor(runPaceSec / 60);
  const runSeconds = runPaceSec % 60;

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-white">Simulateur de Chrono Global</h3>
          <p className="text-xs text-slate-400">Projection 8 km Course + 8 Stations + Roxzone</p>
        </div>
      </div>

      {/* Hero Simulation Result Card */}
      <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-950/30 border-2 border-amber-400 rounded-3xl p-5 text-center shadow-xl">
        <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest">
          Chrono Global Projeté
        </span>
        <div className="text-4xl xs:text-5xl font-black text-white font-mono my-2 tracking-tight">
          {simulation.formattedTotalTime}
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black shadow-md shadow-amber-400/20">
          {simulation.tier}
        </div>

        {/* Breakdown bar */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800 text-center">
          <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-cyan-400">8 km Course</div>
            <div className="text-base font-black text-white font-mono">{simulation.formattedRunTime}</div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-amber-400">8 Stations</div>
            <div className="text-base font-black text-white font-mono">{simulation.formattedStationsTime}</div>
          </div>
          <div className="bg-slate-900/80 rounded-2xl p-2.5 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-rose-400">Roxzone</div>
            <div className="text-base font-black text-white font-mono">{roxzoneMin}:00</div>
          </div>
        </div>
      </div>

      {/* Sliders & Inputs */}
      <div className="space-y-4 pt-1">
        {/* Run Pace Selector */}
        <div className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">Allure Course (moyenne au 1 km)</span>
            </div>
            <span className="text-sm font-black text-cyan-400 font-mono">
              {runMinutes}:{runSeconds.toString().padStart(2, '0')} / km
            </span>
          </div>

          <input
            type="range"
            min={210} // 3:30/km
            max={390} // 6:30/km
            step={5}
            value={runPaceSec}
            onChange={(e) => setRunPaceSec(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>3:30/km (Élite)</span>
            <span>4:30/km (Avancé)</span>
            <span>6:00/km (Finisher)</span>
          </div>
        </div>

        {/* Roxzone Buffer Slider */}
        <div className="bg-slate-900/70 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-slate-200">Transitions Roxzone (Total 8 zones)</span>
            </div>
            <span className="text-sm font-black text-rose-400 font-mono">
              {roxzoneMin} min
            </span>
          </div>

          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={roxzoneMin}
            onChange={(e) => setRoxzoneMin(Number(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>3 min (Rapide)</span>
            <span>6 min (Moyen)</span>
            <span>10 min (Large)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
