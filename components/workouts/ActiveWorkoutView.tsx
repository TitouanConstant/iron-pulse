'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { Exercise, WorkoutSet } from '@/lib/types';
import SetRow from './SetRow';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import { 
  Play, 
  Pause, 
  Plus, 
  Dumbbell, 
  Trash2, 
  Check, 
  Trophy, 
  Flame, 
  Clock, 
  MessageSquare, 
  Star, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ActiveWorkoutView() {
  const router = useRouter();
  const { 
    activeWorkout, 
    addExerciseToActiveWorkout, 
    removeExerciseFromActiveWorkout, 
    addSetToExercise, 
    updateSet, 
    removeSet, 
    finishActiveWorkout, 
    cancelActiveWorkout,
    updateActiveWorkoutNotes 
  } = useApp();

  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState(activeWorkout?.notes || '');

  // Active workout stopwatch
  useEffect(() => {
    if (!activeWorkout) return;
    const startMs = new Date(activeWorkout.started_at).getTime();

    const updateTimer = () => {
      const diffSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      setElapsedSeconds(diffSec);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <Dumbbell className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Aucune séance en cours</h3>
        <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
          Sélectionnez un split d'entraînement pour démarrer votre séance en direct.
        </p>
        <button
          onClick={() => router.push('/workouts')}
          className="px-6 py-3 rounded-2xl bg-amber-400 text-black font-black text-xs hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
        >
          Voir les entraînements
        </button>
      </div>
    );
  }

  // Format elapsed time MM:SS or HH:MM:SS
  const formatElapsed = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Group sets by exercise_id
  const exerciseMap: Record<string, { exercise_id: string; exercise_name: string; muscle_group?: any; sets: WorkoutSet[] }> = {};
  activeWorkout.sets.forEach((s) => {
    if (!exerciseMap[s.exercise_id]) {
      exerciseMap[s.exercise_id] = {
        exercise_id: s.exercise_id,
        exercise_name: s.exercise_name || 'Exercice',
        muscle_group: s.muscle_group,
        sets: [],
      };
    }
    exerciseMap[s.exercise_id].sets.push(s);
  });

  const exercisesList = Object.values(exerciseMap);

  // Compute live completed stats
  const completedSets = activeWorkout.sets.filter((s) => s.is_completed);
  const liveTonnage = completedSets.reduce((sum, s) => sum + (s.is_warmup ? 0 : s.weight_kg * s.reps), 0);

  const handleFinish = () => {
    updateActiveWorkoutNotes(notes);
    finishActiveWorkout(rating);
    setShowFinishModal(false);
    router.push('/workouts');
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Sticky Top Status Bar */}
      <div className="glass-card rounded-3xl p-4 border border-amber-500/30 sticky top-16 z-30 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>SÉANCE EN DIRECT</span>
            </span>
            <h2 className="text-base font-black text-white line-clamp-1">{activeWorkout.name}</h2>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl font-mono text-sm font-black text-amber-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatElapsed(elapsedSeconds)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800">
          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Séries Validées</span>
            <div className="text-sm font-black text-white font-mono">
              {completedSets.length} <span className="text-slate-400 text-xs font-normal">/ {activeWorkout.sets.length}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-2 border border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tonnage Levée</span>
            <div className="text-sm font-black text-amber-400 font-mono">
              {liveTonnage.toLocaleString('fr-FR')} <span className="text-xs text-slate-400">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {exercisesList.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center border border-slate-800">
            <Dumbbell className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-80" />
            <h4 className="text-sm font-bold text-white mb-1">Aucun exercice ajouté</h4>
            <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
              Sélectionnez vos exercices pour commencer à enregistrer vos charges et répétitions.
            </p>
            <button
              onClick={() => setIsExerciseSelectorOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un exercice</span>
            </button>
          </div>
        ) : (
          exercisesList.map((item) => (
            <div
              key={item.exercise_id}
              className="glass-card rounded-3xl p-4 border border-slate-800 space-y-3"
            >
              {/* Exercise Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.exercise_name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {item.muscle_group}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeExerciseFromActiveWorkout(item.exercise_id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                  title="Retirer cet exercice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Set headers guide for mobile */}
              <div className="flex items-center gap-2 px-3 text-[10px] font-bold text-slate-400 uppercase">
                <span className="w-8 text-center">Set</span>
                <span className="hidden xs:block min-w-[70px]">Précédent</span>
                <span className="flex-1 text-center min-w-[72px]">Poids</span>
                <span className="flex-1 text-center min-w-[62px]">Reps</span>
                <span className="w-10 text-center">RPE</span>
                <span className="w-10 text-center">OK</span>
                <span className="w-6"></span>
              </div>

              {/* Sets Rows */}
              <div className="space-y-2">
                {item.sets.map((set, idx) => (
                  <SetRow
                    key={set.id}
                    set={set}
                    index={idx}
                    onUpdate={(data) => updateSet(set.id, data)}
                    onDelete={() => removeSet(set.id)}
                  />
                ))}
              </div>

              {/* Add Set Button */}
              <button
                type="button"
                onClick={() => addSetToExercise(item.exercise_id)}
                className="w-full py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Ajouter une série</span>
              </button>
            </div>
          ))
        )}

        {/* Global Add Exercise Button */}
        {exercisesList.length > 0 && (
          <button
            onClick={() => setIsExerciseSelectorOpen(true)}
            className="w-full py-3.5 rounded-3xl border-2 border-dashed border-slate-700 hover:border-amber-400/60 bg-slate-900/40 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Ajouter un autre exercice</span>
          </button>
        )}
      </div>

      {/* Action Footer: Terminer / Annuler */}
      <div className="glass-panel rounded-3xl p-4 border border-slate-800 space-y-2.5">
        <button
          onClick={() => setShowFinishModal(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 hover:brightness-105 active:scale-98 transition-all"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Terminer & Enregistrer la Séance</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Voulez-vous vraiment annuler cette séance ? Les données non validées seront perdues.')) {
              cancelActiveWorkout();
              router.push('/workouts');
            }
          }}
          className="w-full py-2.5 text-center text-xs text-rose-400 hover:text-rose-300 font-semibold"
        >
          Annuler la séance
        </button>
      </div>

      {/* Exercise Selector Modal */}
      <ExerciseSelectorModal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        onSelectExercise={(ex) => addExerciseToActiveWorkout(ex)}
      />

      {/* Finish Workout Summary Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Séance Complétée !</h3>
                  <p className="text-xs text-slate-400">Récapitulatif de votre performance</p>
                </div>
              </div>
              <button
                onClick={() => setShowFinishModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Durée</div>
                <div className="text-lg font-black text-white font-mono">
                  {formatElapsed(elapsedSeconds)}
                </div>
              </div>

              <div className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Tonnage Total</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {liveTonnage.toLocaleString('fr-FR')} kg
                </div>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 text-center">
                Sensations / Ressenti général
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      className={cn(
                        'w-8 h-8 transition-colors',
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Notes de séance (points forts, fatigue, charges à monter)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Super congestion sur le développé couché, monter à 92.5kg la semaine prochaine..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Validate */}
            <button
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Valider & Enregistrer dans l'historique</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
