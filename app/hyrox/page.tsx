'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import HyroxCountdownCard from '@/components/dashboard/HyroxCountdownCard';
import StationCard from '@/components/hyrox/StationCard';
import SimulationCalculator from '@/components/hyrox/SimulationCalculator';
import HyroxLogModal from '@/components/hyrox/HyroxLogModal';
import { HYROX_DIVISIONS, HYROX_STATIONS_DATA, formatSecondsToTime } from '@/lib/calculations/hyrox';
import { HyroxDivision, HyroxStationType } from '@/lib/types';
import { formatDateFr } from '@/lib/utils';
import { 
  Flame, 
  Trophy, 
  Timer, 
  Footprints, 
  Plus, 
  Trash2, 
  Award, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HyroxPage() {
  const { profile, updateProfile, hyroxLogs, deleteHyroxLog, getHyroxPersonalRecord } = useApp();
  const [selectedStationToLog, setSelectedStationToLog] = useState<HyroxStationType | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const runPR = getHyroxPersonalRecord('RUN_1KM');

  const handleOpenLog = (stationId: HyroxStationType) => {
    setSelectedStationToLog(stationId);
    setIsLogModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-12 animate-slide-up">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Objectif Avril 2027</span>
          </span>
          <h1 className="text-xl font-black text-white">Préparation Hyrox</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hyrox/simulation"
            className="px-3.5 py-2 rounded-2xl bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Simulation Live</span>
          </Link>

          <button
            onClick={() => {
              setSelectedStationToLog('RUN_1KM');
              setIsLogModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-amber-400 text-black font-black text-xs flex items-center gap-1 hover:bg-amber-300 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Logger</span>
          </button>
        </div>
      </div>

      {/* Dynamic Countdown */}
      <HyroxCountdownCard />

      {/* Division Selector */}
      <div className="glass-card rounded-3xl p-4 border border-slate-800 space-y-2.5">
        <label className="block text-xs font-bold text-slate-300 uppercase">
          Catégorie & Division Choisie
        </label>
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5">
          {(Object.keys(HYROX_DIVISIONS) as HyroxDivision[]).map((divKey) => {
            const divInfo = HYROX_DIVISIONS[divKey];
            const isSelected = profile.hyrox_division === divKey;
            return (
              <button
                key={divKey}
                type="button"
                onClick={() => updateProfile({ hyrox_division: divKey })}
                className={cn(
                  'py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate',
                  isSelected
                    ? 'bg-amber-400 text-black border-amber-400 font-black shadow-md'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700'
                )}
              >
                {divInfo.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1 KM Running Interval Card */}
      <div className="glass-card rounded-3xl p-5 border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Course 1 000 m (8 Blocs)</h3>
              <p className="text-xs text-slate-400">Allure cible au 1 km entre chaque station</p>
            </div>
          </div>

          <button
            onClick={() => handleOpenLog('RUN_1KM')}
            className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300 text-xs font-bold border border-cyan-400/30"
          >
            Logger Run
          </button>
        </div>

        {/* PR & Pace */}
        <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Meilleure Allure 1 km</div>
            {runPR ? (
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {formatSecondsToTime(runPR.time_seconds)} <span className="text-xs text-cyan-400">/ km</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">4:30/km recommandé</div>
            )}
          </div>

          <div className="text-right text-xs text-slate-400">
            <span className="text-slate-200 font-bold">Total 8 km : </span>
            <span className="font-mono text-cyan-400 font-bold">
              {formatSecondsToTime((runPR?.time_seconds || 270) * 8)}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Official Stations Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Les 8 Stations Hyrox
          </h2>
          <span className="text-xs text-slate-400 font-mono">1 000m &bull; 50m &bull; 100m</span>
        </div>

        {HYROX_STATIONS_DATA.map((st) => (
          <StationCard
            key={st.id}
            station={st}
            onOpenLogModal={() => handleOpenLog(st.id)}
          />
        ))}
      </div>

      {/* Global Hyrox Race Simulation Calculator */}
      <div className="pt-2">
        <SimulationCalculator />
      </div>

      {/* Chronological Hyrox Logs History */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Historique des Chronos Hyrox</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">{hyroxLogs.length} logs</span>
        </div>

        {hyroxLogs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            Aucun temps enregistré. Cliquez sur "Logger" pour débuter.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {hyroxLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{log.station_type.replace(/_/g, ' ')}</span>
                    {log.is_personal_record && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-400/20 text-amber-300 font-black border border-amber-400/30">
                        PR
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatDateFr(log.logged_date)} {log.notes ? `&bull; ${log.notes}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-amber-400 font-mono">
                    {formatSecondsToTime(log.time_seconds)}
                  </span>
                  <button
                    onClick={() => deleteHyroxLog(log.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Modal */}
      <HyroxLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        defaultStation={selectedStationToLog || 'SKIERG_1000M'}
      />
    </div>
  );
}
