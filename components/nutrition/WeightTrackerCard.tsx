'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { formatDateFr } from '@/lib/utils';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Scale, Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import WeightLogModal from './WeightLogModal';

export default function WeightTrackerCard() {
  const { weightLogs, deleteWeightLog, profile } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Chronological data for Recharts
  const chartData = [...weightLogs]
    .sort((a, b) => a.logged_date.localeCompare(b.logged_date))
    .map((w) => ({
      date: formatDateFr(w.logged_date),
      weight: w.weight_kg,
      fat: w.body_fat_pct,
    }));

  const latestWeight = weightLogs[0]?.weight_kg || profile.current_weight_kg || 80;
  const previousWeight = weightLogs[1]?.weight_kg || latestWeight;
  const diff = Math.round((latestWeight - previousWeight) * 10) / 10;

  return (
    <>
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Suivi du Poids Corporel</h3>
              <p className="text-xs text-slate-400">Évolution hebdomadaire & composition</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Pesée</span>
          </button>
        </div>

        {/* Current Weight Highlight */}
        <div className="flex items-center justify-between bg-slate-900/80 rounded-2xl p-4 border border-slate-800">
          <div>
            <div className="text-xs text-slate-400 font-medium">Dernier Poids Enregistré</div>
            <div className="text-3xl font-black text-white font-mono mt-0.5">
              {latestWeight} <span className="text-sm font-bold text-cyan-400">kg</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Évolution</div>
            <div className="flex items-center gap-1 text-sm font-black font-mono mt-0.5">
              {diff < 0 ? (
                <span className="text-emerald-400 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-0.5" />
                  {diff} kg
                </span>
              ) : diff > 0 ? (
                <span className="text-amber-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-0.5" />
                  +{diff} kg
                </span>
              ) : (
                <span className="text-slate-400">Stable</span>
              )}
            </div>
          </div>
        </div>

        {/* Recharts Curve */}
        <div className="w-full h-52 pt-2">
          {chartData.length < 1 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <Scale className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">Aucune pesée enregistrée pour l'instant.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Poids (kg)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ fill: '#38bdf8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Log History list */}
        {weightLogs.length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase mb-2">Historique Récent</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {weightLogs.slice(0, 5).map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                >
                  <div>
                    <span className="font-bold text-white font-mono">{w.weight_kg} kg</span>
                    {w.body_fat_pct && (
                      <span className="text-slate-400 text-[10px] ml-2">
                        ({w.body_fat_pct}% MG)
                      </span>
                    )}
                    {w.notes && <div className="text-[10px] text-slate-400 italic">{w.notes}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{formatDateFr(w.logged_date)}</span>
                    <button
                      onClick={() => deleteWeightLog(w.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <WeightLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
