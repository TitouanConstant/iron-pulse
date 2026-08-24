'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Exercise, MuscleGroup } from '@/lib/types';
import { MUSCLE_GROUPS } from '@/lib/data/exercises';
import { 
  X, 
  Search, 
  Plus, 
  Dumbbell, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export default function ExerciseSelectorModal({ isOpen, onClose, onSelectExercise }: Props) {
  const { exercises, addCustomExercise } = useApp();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState<MuscleGroup>('chest');

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesMuscle = selectedMuscle === 'all' || ex.muscle_group === selectedMuscle;
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMuscle && matchesSearch;
    });
  }, [exercises, selectedMuscle, searchQuery]);

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addCustomExercise(customName.trim(), customMuscle);
    setCustomName('');
    setIsCreatingCustom(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-base font-black text-white">Bibliothèque d'Exercices</h3>
            <p className="text-xs text-slate-400">Sélectionnez un exercice pour votre séance</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative my-3 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher (ex: Développé couché, Squat...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
          />
        </div>

        {/* Muscle group horizontal tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 shrink-0 no-scrollbar">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all',
              selectedMuscle === 'all'
                ? 'bg-amber-400 text-black'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            )}
          >
            Tous
          </button>
          {MUSCLE_GROUPS.map((m) => (
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
              {m.label}
            </button>
          ))}
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto my-2 space-y-1.5 pr-1">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Aucun exercice trouvé.</p>
              <button
                onClick={() => setIsCreatingCustom(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30"
              >
                <Plus className="w-3.5 h-3.5" />
                Créer cet exercice
              </button>
            </div>
          ) : (
            filteredExercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  onSelectExercise(ex);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 group-hover:border-amber-400/40">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {ex.name}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {ex.muscle_group} &bull; {ex.equipment || 'Libre'}
                    </div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:bg-amber-400/10">
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Custom exercise creation footer */}
        <div className="pt-3 border-t border-slate-800 shrink-0">
          {isCreatingCustom ? (
            <form onSubmit={handleCreateCustom} className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nom de l'exercice personnalisé..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  autoFocus
                  required
                />
                <select
                  value={customMuscle}
                  onChange={(e) => setCustomMuscle(e.target.value as MuscleGroup)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-2 text-xs text-white outline-none"
                >
                  {MUSCLE_GROUPS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold"
                >
                  Ajouter à la bibliothèque
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreatingCustom(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700/60"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Créer un exercice personnalisé</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
