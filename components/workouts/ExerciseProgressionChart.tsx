'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { calculateEpley1RM } from '@/lib/calculations/oneRepMax';
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
import { TrendingUp, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExerciseProgressionChart() {
  const { workouts, exercises } = useApp();
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ex-chest-1');

  // Extract history for selected exercise across workouts
  const chartData: { date: string; maxWeight: number; estimated1RM: number; volume: number }[] = [];

  // Sort workouts chronologically
  const chronologicalWorkouts = [...workouts].sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());

  chronologicalWorkouts.forEach((w) => {
    const sets = w.sets.filter((s) => s.exercise_id === selectedExerciseId && s.is_completed && !s.is_warmup);
    if (sets.length > 0) {
      let maxWeight = 0;
      let max1RM = 0;
      let volume = 0;

      sets.forEach((s) => {
        if (s.weight_kg > maxWeight) maxWeight = s.weight_kg;
        const e1rm = calculateEpley1RM(s.weight_kg, s.reps);
        if (e1rm > max1RM) max1RM = e1rm;
        volume += s.weight_kg * s.reps;
      });

      const dateStr = formatDateFr(w.completed_at || w.started_at);
      chartData.push({
        date: dateStr,
        maxWeight,
        estimated1RM: Math.round(max1RM * 10) / 10,
        volume: Math.round(volume),
      });
    }
  });

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId);

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Surcharge Progressive</h3>
            <p className="text-[11px] text-slate-400">Évolution de la charge et 1RM estimé</p>
          </div>
        </div>

        {/* Exercise selector dropdown */}
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400 max-w-[220px] truncate"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chart container */}
      <div className="w-full h-56 pt-2">
        {chartData.length < 1 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <Dumbbell className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">Pas encore assez de données enregistrées pour cet exercice.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
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
                dataKey="estimated1RM"
                name="1RM Estimé (kg)"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="maxWeight"
                name="Charge Max (kg)"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend & highlights */}
      {chartData.length > 0 && (
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>1RM Estimé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Charge Max Réalisée</span>
          </div>
        </div>
      )}
    </div>
  );
}
