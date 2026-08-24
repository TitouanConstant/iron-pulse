'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import { MuscleGroup } from '@/lib/types';
import { MUSCLE_GROUPS } from '@/lib/data/exercises';
import ExerciseProgressionChart from '@/components/workouts/ExerciseProgressionChart';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Dumbbell, 
  Layers, 
  TrendingUp, 
  Filter 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExercisesPage() {
  const { exercises, addCustomExercise } = useApp();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('chest');

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesMuscle = selectedMuscle === 'all' || ex.muscle_group === selectedMuscle;
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMuscle && matchesSearch;
    });
  }, [exercises, selectedMuscle, searchQuery]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addCustomExercise(customName.trim(), customMuscle);
    setCustomName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-slide-up">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/workouts"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux séances</span>
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-bold flex items-center gap-1 hover:bg-amber-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouvel Exercice</span>
        </button>
      </div>

      <div>
        <h1 className="text-xl font-black text-white">Bibliothèque d'Exercices</h1>
        <p className="text-xs text-slate-400">
          Consultez l'historique et analysez la surcharge progressive
        </p>
      </div>

      {/* Progression Chart Anchor */}
      <div id="charts">
        <ExerciseProgressionChart />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher par nom d'exercice..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
        />
      </div>

      {/* Muscle Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedMuscle('all')}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
            selectedMuscle === 'all'
              ? 'bg-amber-400 text-black'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          )}
        >
          Tous ({exercises.length})
        </button>
        {MUSCLE_GROUPS.map((m) => {
          const count = exercises.filter((e) => e.muscle_group === m.id).length;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
                selectedMuscle === m.id
                  ? 'bg-amber-400 text-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              )}
            >
              {m.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Exercise Cards */}
      <div className="grid gap-2">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="glass-card rounded-2xl p-3.5 border border-slate-800 flex items-center justify-between hover:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{ex.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">
                  {ex.muscle_group} &bull; {ex.equipment || 'Poids du corps'}
                  {ex.is_custom && <span className="text-amber-400 ml-1 font-semibold">&bull; Custom</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal create custom */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Ajouter un Exercice Personnalisé</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nom</label>
                <input
                  type="text"
                  placeholder="Ex: Hip Thrust barre libre..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-amber-400"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Groupe Musculaire</label>
                <select
                  value={customMuscle}
                  onChange={(e) => setCustomMuscle(e.target.value as MuscleGroup)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                >
                  {MUSCLE_GROUPS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
