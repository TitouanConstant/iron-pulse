'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  Exercise, 
  FitnessGoal, 
  Gender, 
  HyroxDivision, 
  HyroxLog, 
  HyroxStationType, 
  SplitType, 
  UserProfile, 
  WeightLog, 
  Workout, 
  WorkoutSet 
} from '../types';
import { DEFAULT_EXERCISES } from '../data/exercises';
import { PRESET_WORKOUT_TEMPLATES } from '../data/workout-templates';
import { calculateMetabolism, calculateMacroSplit } from '../calculations/bmr';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '../supabase/client';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: any | null;
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // Workouts
  workouts: Workout[];
  activeWorkout: Workout | null;
  startWorkout: (splitType: SplitType, name?: string) => void;
  startWorkoutFromTemplate: (templateId: string) => void;
  updateActiveWorkoutNotes: (notes: string) => void;
  addExerciseToActiveWorkout: (exercise: Exercise) => void;
  removeExerciseFromActiveWorkout: (exerciseId: string) => void;
  addSetToExercise: (exerciseId: string) => void;
  updateSet: (setId: string, data: Partial<WorkoutSet>) => void;
  removeSet: (setId: string) => void;
  finishActiveWorkout: (rating?: number) => void;
  cancelActiveWorkout: () => void;
  deleteWorkout: (id: string) => void;
  getPreviousExercisePerformance: (exerciseId: string) => { weight_kg: number; reps: number; rpe?: number } | null;

  // Exercises
  exercises: Exercise[];
  addCustomExercise: (name: string, muscle_group: any, equipment?: any) => void;

  // Nutrition & Weights
  weightLogs: WeightLog[];
  addWeightLog: (weightKg: number, bodyFatPct?: number, notes?: string, dateStr?: string) => Promise<void>;
  deleteWeightLog: (id: string) => Promise<void>;

  // Hyrox
  hyroxLogs: HyroxLog[];
  addHyroxLog: (log: Omit<HyroxLog, 'id' | 'user_id' | 'is_personal_record'>) => Promise<boolean>;
  deleteHyroxLog: (id: string) => Promise<void>;
  getHyroxPersonalRecord: (station: HyroxStationType) => HyroxLog | null;

  // Data Backup & Export
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  exportWorkoutsCSV: () => string;

  // Auth & Status
  isSupabaseConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  activeRestTimer: number | null; // seconds
  startRestTimer: (seconds: number) => void;
  clearRestTimer: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'local-user-1',
  full_name: 'Titouan Athlete',
  email: 'athlete@hyrox.com',
  gender: 'male',
  age: 26,
  height_cm: 180,
  current_weight_kg: 82.5,
  activity_level: 'very_active',
  goal: 'recomp',
  formula: 'mifflin',
  target_calories: 2750,
  target_protein_g: 175,
  target_carbs_g: 310,
  target_fat_g: 75,
  hyrox_division: 'open_men',
  hyrox_target_date: '2027-04-17',
};

// Realistic initial pre-filled sample data for instantaneous smooth experience
const INITIAL_WEIGHT_LOGS: WeightLog[] = [
  { id: 'w-1', user_id: 'local-user-1', logged_date: '2026-08-01', weight_kg: 84.2, body_fat_pct: 15.2, notes: 'Pesée à jeun' },
  { id: 'w-2', user_id: 'local-user-1', logged_date: '2026-08-08', weight_kg: 83.7, body_fat_pct: 14.9, notes: 'Bonne hydratation' },
  { id: 'w-3', user_id: 'local-user-1', logged_date: '2026-08-15', weight_kg: 83.1, body_fat_pct: 14.6, notes: 'Fin de cycle force' },
  { id: 'w-4', user_id: 'local-user-1', logged_date: '2026-08-22', weight_kg: 82.5, body_fat_pct: 14.2, notes: 'Affûtage régulier' },
];

const INITIAL_HYROX_LOGS: HyroxLog[] = [
  { id: 'h-1', user_id: 'local-user-1', logged_date: '2026-08-10', station_type: 'RUN_1KM', time_seconds: 245, average_pace: '4:05/km', notes: 'Fractionné piste', is_personal_record: true },
  { id: 'h-2', user_id: 'local-user-1', logged_date: '2026-08-12', station_type: 'SKIERG_1000M', time_seconds: 228, average_pace: '1:54/500m', notes: 'Damper 6', is_personal_record: true },
  { id: 'h-3', user_id: 'local-user-1', logged_date: '2026-08-14', station_type: 'SLED_PUSH', time_seconds: 142, weight_kg: 152, notes: '4x12.5m enchaînés', is_personal_record: true },
  { id: 'h-4', user_id: 'local-user-1', logged_date: '2026-08-16', station_type: 'ROW_1000M', time_seconds: 220, average_pace: '1:50/500m', is_personal_record: true },
  { id: 'h-5', user_id: 'local-user-1', logged_date: '2026-08-18', station_type: 'FARMERS_CARRY_200M', time_seconds: 105, weight_kg: 48, notes: '2x24kg sans pause', is_personal_record: true },
  { id: 'h-6', user_id: 'local-user-1', logged_date: '2026-08-20', station_type: 'WALL_BALLS', time_seconds: 245, reps: 100, weight_kg: 6, notes: 'Séries 4x25 reps', is_personal_record: true },
];

const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'wk-past-1',
    user_id: 'local-user-1',
    name: 'Push A - Hypertrophie Pectoraux / Épaules',
    split_type: 'push',
    started_at: '2026-08-22T10:00:00Z',
    completed_at: '2026-08-22T11:15:00Z',
    duration_seconds: 4500,
    notes: 'Excellentes sensations sur le développé couché, progression sur la 3ème série.',
    rating: 5,
    total_volume_kg: 6850,
    sets: [
      { id: 's-1', workout_id: 'wk-past-1', exercise_id: 'ex-chest-1', exercise_name: 'Développé Couché (Barre)', muscle_group: 'chest', set_order: 1, weight_kg: 80, reps: 10, rpe: 7.5, is_completed: true },
      { id: 's-2', workout_id: 'wk-past-1', exercise_id: 'ex-chest-1', exercise_name: 'Développé Couché (Barre)', muscle_group: 'chest', set_order: 2, weight_kg: 85, reps: 8, rpe: 8.5, is_completed: true },
      { id: 's-3', workout_id: 'wk-past-1', exercise_id: 'ex-chest-1', exercise_name: 'Développé Couché (Barre)', muscle_group: 'chest', set_order: 3, weight_kg: 90, reps: 6, rpe: 9.0, is_completed: true },
      { id: 's-4', workout_id: 'wk-past-1', exercise_id: 'ex-sho-1', exercise_name: 'Développé Militaire (Overhead Press)', muscle_group: 'shoulders', set_order: 1, weight_kg: 50, reps: 8, rpe: 8.0, is_completed: true },
      { id: 's-5', workout_id: 'wk-past-1', exercise_id: 'ex-sho-1', exercise_name: 'Développé Militaire (Overhead Press)', muscle_group: 'shoulders', set_order: 2, weight_kg: 52.5, reps: 7, rpe: 9.0, is_completed: true },
      { id: 's-6', workout_id: 'wk-past-1', exercise_id: 'ex-tri-1', exercise_name: 'Extension Triceps Poulie Haute', muscle_group: 'triceps', set_order: 1, weight_kg: 35, reps: 12, rpe: 8.0, is_completed: true },
    ],
  },
  {
    id: 'wk-past-2',
    user_id: 'local-user-1',
    name: 'Pull - Force Dos & Biceps',
    split_type: 'pull',
    started_at: '2026-08-20T17:30:00Z',
    completed_at: '2026-08-20T18:40:00Z',
    duration_seconds: 4200,
    notes: 'Rowing barre lourd + tractions propres.',
    rating: 4,
    total_volume_kg: 7420,
    sets: [
      { id: 's-7', workout_id: 'wk-past-2', exercise_id: 'ex-back-1', exercise_name: 'Tractions Pronation', muscle_group: 'back', set_order: 1, weight_kg: 82.5, reps: 10, rpe: 8.0, is_completed: true },
      { id: 's-8', workout_id: 'wk-past-2', exercise_id: 'ex-back-1', exercise_name: 'Tractions Pronation', muscle_group: 'back', set_order: 2, weight_kg: 82.5, reps: 9, rpe: 8.5, is_completed: true },
      { id: 's-9', workout_id: 'wk-past-2', exercise_id: 'ex-back-2', exercise_name: 'Rowing Barre Buste Penché', muscle_group: 'back', set_order: 1, weight_kg: 80, reps: 8, rpe: 8.0, is_completed: true },
      { id: 's-10', workout_id: 'wk-past-2', exercise_id: 'ex-back-2', exercise_name: 'Rowing Barre Buste Penché', muscle_group: 'back', set_order: 2, weight_kg: 85, reps: 8, rpe: 8.5, is_completed: true },
      { id: 's-11', workout_id: 'wk-past-2', exercise_id: 'ex-bic-1', exercise_name: 'Curl Biceps Barre EZ', muscle_group: 'biceps', set_order: 1, weight_kg: 35, reps: 10, rpe: 8.5, is_completed: true },
    ],
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [workouts, setWorkouts] = useState<Workout[]>(INITIAL_WORKOUTS);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(INITIAL_WEIGHT_LOGS);
  const [hyroxLogs, setHyroxLogs] = useState<HyroxLog[]>(INITIAL_HYROX_LOGS);
  const [activeRestTimer, setActiveRestTimer] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load stored state from localStorage on first client render
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('ironpulse_profile');
      if (storedProfile) setProfile(JSON.parse(storedProfile));

      const storedWorkouts = localStorage.getItem('ironpulse_workouts');
      if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));

      const storedActiveWorkout = localStorage.getItem('ironpulse_active_workout');
      if (storedActiveWorkout) setActiveWorkout(JSON.parse(storedActiveWorkout));

      const storedExercises = localStorage.getItem('ironpulse_exercises');
      if (storedExercises) setExercises(JSON.parse(storedExercises));

      const storedWeights = localStorage.getItem('ironpulse_weights');
      if (storedWeights) setWeightLogs(JSON.parse(storedWeights));

      const storedHyrox = localStorage.getItem('ironpulse_hyrox');
      if (storedHyrox) setHyroxLogs(JSON.parse(storedHyrox));
    } catch (e) {
      console.error('Error loading localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Full bi-directional Supabase synchronization
  const syncAllFromSupabase = async (activeUser: any, client: any) => {
    if (!activeUser || !client) return;

    try {
      // 1. Profile
      const { data: dbProfile } = await client.from('profiles').select('*').eq('id', activeUser.id).single();
      if (dbProfile) {
        setProfile((prev) => ({ ...prev, ...dbProfile, email: activeUser.email || prev.email }));
      }

      // 2. Workouts & Sets
      const { data: dbWorkouts } = await client
        .from('workouts')
        .select('*, workout_sets(*)')
        .eq('user_id', activeUser.id)
        .order('started_at', { ascending: false });

      if (dbWorkouts && dbWorkouts.length > 0) {
        const parsedWorkouts: Workout[] = dbWorkouts.map((w: any) => ({
          id: w.id,
          user_id: w.user_id,
          name: w.name,
          split_type: w.split_type,
          started_at: w.started_at,
          completed_at: w.completed_at,
          duration_seconds: w.duration_seconds || 0,
          notes: w.notes,
          rating: w.rating,
          total_volume_kg: Number(w.total_volume_kg) || 0,
          sets: (w.workout_sets || []).map((s: any) => ({
            id: s.id,
            workout_id: s.workout_id,
            exercise_id: s.exercise_id,
            exercise_name: s.exercise_name || 'Exercice',
            set_order: s.set_order,
            weight_kg: Number(s.weight_kg),
            reps: s.reps,
            rpe: s.rpe ? Number(s.rpe) : undefined,
            rest_seconds: s.rest_seconds,
            is_warmup: s.is_warmup,
            is_completed: s.is_completed,
            notes: s.notes,
          })),
        }));
        setWorkouts(parsedWorkouts);
      }

      // 3. Weight Logs
      const { data: dbWeights } = await client
        .from('weight_logs')
        .select('*')
        .eq('user_id', activeUser.id)
        .order('logged_date', { ascending: false });

      if (dbWeights && dbWeights.length > 0) {
        setWeightLogs(dbWeights.map((w: any) => ({
          id: w.id,
          user_id: w.user_id,
          logged_date: w.logged_date,
          weight_kg: Number(w.weight_kg),
          body_fat_pct: w.body_fat_pct ? Number(w.body_fat_pct) : undefined,
          notes: w.notes,
        })));
      }

      // 4. Hyrox Logs
      const { data: dbHyrox } = await client
        .from('hyrox_logs')
        .select('*')
        .eq('user_id', activeUser.id)
        .order('logged_date', { ascending: false });

      if (dbHyrox && dbHyrox.length > 0) {
        setHyroxLogs(dbHyrox.map((h: any) => ({
          id: h.id,
          user_id: h.user_id,
          logged_date: h.logged_date,
          station_type: h.station_type,
          time_seconds: h.time_seconds,
          distance_meters: h.distance_meters,
          weight_kg: h.weight_kg ? Number(h.weight_kg) : undefined,
          reps: h.reps,
          average_pace: h.average_pace,
          heart_rate_avg: h.heart_rate_avg,
          rpe: h.rpe ? Number(h.rpe) : undefined,
          notes: h.notes,
          is_personal_record: h.is_personal_record,
        })));
      }

      // 5. Exercises
      const { data: dbExercises } = await client.from('exercises').select('*').or(`user_id.is.null,user_id.eq.${activeUser.id}`);
      if (dbExercises && dbExercises.length > 0) {
        setExercises(dbExercises.map((e: any) => ({
          id: e.id,
          user_id: e.user_id,
          name: e.name,
          muscle_group: e.muscle_group,
          equipment: e.equipment,
          description: e.description,
          is_custom: e.is_custom,
        })));
      }
    } catch (err) {
      console.error('Error syncing Supabase data:', err);
    }
  };

  // Supabase Auth listener
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        syncAllFromSupabase(data.user, supabase);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        syncAllFromSupabase(session.user, supabase);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('ironpulse_profile', JSON.stringify(profile));
      localStorage.setItem('ironpulse_workouts', JSON.stringify(workouts));
      localStorage.setItem('ironpulse_exercises', JSON.stringify(exercises));
      localStorage.setItem('ironpulse_weights', JSON.stringify(weightLogs));
      localStorage.setItem('ironpulse_hyrox', JSON.stringify(hyroxLogs));
      if (activeWorkout) {
        localStorage.setItem('ironpulse_active_workout', JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem('ironpulse_active_workout');
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [profile, workouts, activeWorkout, exercises, weightLogs, hyroxLogs, isInitialized]);

  // Recalculate TDEE and targets when profile measurements change
  const updateProfile = async (data: Partial<UserProfile>) => {
    const updated = { ...profile, ...data, updated_at: new Date().toISOString() };

    // Auto update BMR and target macros
    const meta = calculateMetabolism(
      updated.current_weight_kg || 80,
      updated.height_cm || 178,
      updated.age || 25,
      updated.gender || 'male',
      updated.activity_level || 'moderate',
      updated.formula || 'mifflin'
    );

    const goalDelta = updated.goal === 'cut' ? -400 : updated.goal === 'bulk' ? 350 : updated.goal === 'recomp' ? -100 : 0;
    const computedCalories = Math.round(meta.tdee + goalDelta);
    const macroSplit = calculateMacroSplit(computedCalories, updated.current_weight_kg || 80, updated.goal);

    const finalProfile: UserProfile = {
      ...updated,
      target_calories: data.target_calories ?? computedCalories,
      target_protein_g: data.target_protein_g ?? macroSplit.protein_g,
      target_carbs_g: data.target_carbs_g ?? macroSplit.carbs_g,
      target_fat_g: data.target_fat_g ?? macroSplit.fat_g,
    };

    setProfile(finalProfile);

    // Sync to Supabase if connected
    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      await supabase.from('profiles').upsert({
        ...finalProfile,
        id: user.id,
      });
    }
  };

  // Rest Timer
  const startRestTimer = (seconds: number) => {
    setActiveRestTimer(seconds);
  };
  const clearRestTimer = () => {
    setActiveRestTimer(null);
  };

  // Workout Actions
  const startWorkout = (splitType: SplitType, name?: string) => {
    const splitNames: Record<SplitType, string> = {
      push: 'Push (Pectoraux, Épaules, Triceps)',
      pull: 'Pull (Dos, Biceps, Arrière d\'épaules)',
      legs: 'Legs (Quadriceps, Ischios, Mollets)',
      upper: 'Upper Body (Haut du corps)',
      lower: 'Lower Body (Bas du corps & Abdos)',
      full_body: 'Full Body Complet',
      hyrox_strength: 'Hyrox Prépa Force & Puissance',
      custom: 'Séance Personnalisée',
    };

    const newWorkout: Workout = {
      id: 'wk-' + Date.now(),
      user_id: user?.id || profile.id,
      name: name || splitNames[splitType],
      split_type: splitType,
      started_at: new Date().toISOString(),
      completed_at: null,
      duration_seconds: 0,
      notes: '',
      rating: 5,
      total_volume_kg: 0,
      sets: [],
    };

    setActiveWorkout(newWorkout);
  };

  const startWorkoutFromTemplate = (templateId: string) => {
    const tpl = PRESET_WORKOUT_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;

    const initialSets: WorkoutSet[] = [];
    tpl.exerciseIds.forEach((exId) => {
      const ex = exercises.find((e) => e.id === exId) || DEFAULT_EXERCISES.find((e) => e.id === exId);
      if (!ex) return;

      const prevPerf = getPreviousExercisePerformance(ex.id);
      const baseWeight = prevPerf ? prevPerf.weight_kg : (ex.muscle_group === 'legs' ? 60 : ex.muscle_group === 'chest' || ex.muscle_group === 'back' ? 40 : 20);
      const baseReps = prevPerf ? prevPerf.reps : 10;

      // Add 3 standard sets
      for (let s = 1; s <= 3; s++) {
        initialSets.push({
          id: 'set-' + Date.now() + '-' + exId + '-' + s,
          workout_id: 'wk-tpl-' + Date.now(),
          exercise_id: ex.id,
          exercise_name: ex.name,
          muscle_group: ex.muscle_group,
          set_order: s,
          weight_kg: baseWeight,
          reps: baseReps,
          rpe: s === 3 ? 9 : 8,
          rest_seconds: 90,
          is_warmup: false,
          is_completed: false,
          previous_weight_kg: prevPerf?.weight_kg,
          previous_reps: prevPerf?.reps,
          previous_rpe: prevPerf?.rpe,
        });
      }
    });

    const newWorkout: Workout = {
      id: 'wk-' + Date.now(),
      user_id: user?.id || profile.id,
      name: tpl.name,
      split_type: tpl.split_type,
      started_at: new Date().toISOString(),
      completed_at: null,
      duration_seconds: 0,
      notes: tpl.description,
      rating: 5,
      total_volume_kg: 0,
      sets: initialSets,
    };

    setActiveWorkout(newWorkout);
  };

  const updateActiveWorkoutNotes = (notes: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({ ...activeWorkout, notes });
  };

  const getPreviousExercisePerformance = (exerciseId: string) => {
    for (const w of workouts) {
      const matchedSets = w.sets.filter((s) => s.exercise_id === exerciseId && s.is_completed && !s.is_warmup);
      if (matchedSets.length > 0) {
        // Pick best set or last working set
        const bestSet = [...matchedSets].sort((a, b) => (b.weight_kg * b.reps) - (a.weight_kg * a.reps))[0];
        return {
          weight_kg: bestSet.weight_kg,
          reps: bestSet.reps,
          rpe: bestSet.rpe,
        };
      }
    }
    return null;
  };

  const addExerciseToActiveWorkout = (exercise: Exercise) => {
    if (!activeWorkout) return;
    const prevPerf = getPreviousExercisePerformance(exercise.id);

    const initialSet: WorkoutSet = {
      id: 'set-' + Date.now() + '-1',
      workout_id: activeWorkout.id,
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      muscle_group: exercise.muscle_group,
      set_order: 1,
      weight_kg: prevPerf ? prevPerf.weight_kg : 20,
      reps: prevPerf ? prevPerf.reps : 10,
      rpe: 8,
      rest_seconds: 90,
      is_warmup: false,
      is_completed: false,
      previous_weight_kg: prevPerf?.weight_kg,
      previous_reps: prevPerf?.reps,
      previous_rpe: prevPerf?.rpe,
    };

    setActiveWorkout({
      ...activeWorkout,
      sets: [...activeWorkout.sets, initialSet],
    });
  };

  const removeExerciseFromActiveWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      sets: activeWorkout.sets.filter((s) => s.exercise_id !== exerciseId),
    });
  };

  const addSetToExercise = (exerciseId: string) => {
    if (!activeWorkout) return;
    const exerciseSets = activeWorkout.sets.filter((s) => s.exercise_id === exerciseId);
    const lastSet = exerciseSets[exerciseSets.length - 1];

    const newSet: WorkoutSet = {
      id: 'set-' + Date.now() + '-' + (exerciseSets.length + 1),
      workout_id: activeWorkout.id,
      exercise_id: exerciseId,
      exercise_name: lastSet?.exercise_name || '',
      muscle_group: lastSet?.muscle_group,
      set_order: exerciseSets.length + 1,
      weight_kg: lastSet ? lastSet.weight_kg : 20,
      reps: lastSet ? lastSet.reps : 10,
      rpe: lastSet ? lastSet.rpe : 8,
      rest_seconds: lastSet ? lastSet.rest_seconds : 90,
      is_warmup: false,
      is_completed: false,
      previous_weight_kg: lastSet?.previous_weight_kg,
      previous_reps: lastSet?.previous_reps,
    };

    setActiveWorkout({
      ...activeWorkout,
      sets: [...activeWorkout.sets, newSet],
    });
  };

  const updateSet = (setId: string, data: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      sets: activeWorkout.sets.map((s) => (s.id === setId ? { ...s, ...data } : s)),
    });
  };

  const removeSet = (setId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      sets: activeWorkout.sets.filter((s) => s.id !== setId),
    });
  };

  const finishActiveWorkout = (rating: number = 5) => {
    if (!activeWorkout) return;
    const completedAt = new Date().toISOString();
    const startTime = new Date(activeWorkout.started_at).getTime();
    const durationSeconds = Math.max(60, Math.round((new Date(completedAt).getTime() - startTime) / 1000));

    // Calculate total volume (tonnage)
    let totalVolume = 0;
    activeWorkout.sets.forEach((s) => {
      if (s.is_completed && !s.is_warmup) {
        totalVolume += s.weight_kg * s.reps;
      }
    });

    const finishedWorkout: Workout = {
      ...activeWorkout,
      completed_at: completedAt,
      duration_seconds: durationSeconds,
      rating,
      total_volume_kg: totalVolume,
    };

    setWorkouts([finishedWorkout, ...workouts]);
    setActiveWorkout(null);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#FF5500', '#38BDF8'],
      });
    } catch (_) {}

    // Sync to Supabase
    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      (async () => {
        try {
          const { data: insertedWorkout, error: wError } = await supabase
            .from('workouts')
            .insert({
              user_id: user.id,
              name: finishedWorkout.name,
              split_type: finishedWorkout.split_type,
              started_at: finishedWorkout.started_at,
              completed_at: finishedWorkout.completed_at,
              duration_seconds: finishedWorkout.duration_seconds,
              notes: finishedWorkout.notes,
              rating: finishedWorkout.rating,
              total_volume_kg: finishedWorkout.total_volume_kg,
            })
            .select()
            .single();

          if (insertedWorkout) {
            const dbWorkoutId = insertedWorkout.id;
            // Insert workout sets
            for (const s of finishedWorkout.sets) {
              if (s.is_completed) {
                // Ensure exercise exists in DB or get matching id
                let dbExerciseId = s.exercise_id;
                if (s.exercise_id.startsWith('ex-')) {
                  const { data: foundEx } = await supabase
                    .from('exercises')
                    .select('id')
                    .eq('name', s.exercise_name)
                    .maybeSingle();

                  if (foundEx) {
                    dbExerciseId = foundEx.id;
                  } else {
                    const { data: createdEx } = await supabase
                      .from('exercises')
                      .insert({
                        name: s.exercise_name || 'Exercice',
                        muscle_group: s.muscle_group || 'full_body',
                        is_custom: false,
                      })
                      .select('id')
                      .single();
                    if (createdEx) dbExerciseId = createdEx.id;
                  }
                }

                await supabase.from('workout_sets').insert({
                  workout_id: dbWorkoutId,
                  exercise_id: dbExerciseId,
                  user_id: user.id,
                  set_order: s.set_order,
                  weight_kg: s.weight_kg,
                  reps: s.reps,
                  rpe: s.rpe,
                  rest_seconds: s.rest_seconds,
                  is_warmup: s.is_warmup,
                  is_completed: s.is_completed,
                  notes: s.notes,
                });
              }
            }
          }
        } catch (err) {
          console.error('Error saving workout to Supabase:', err);
        }
      })();
    }
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      supabase.from('workouts').delete().eq('id', id);
    }
  };

  // Custom Exercise
  const addCustomExercise = (name: string, muscle_group: any, equipment: any = 'other') => {
    const newEx: Exercise = {
      id: 'ex-custom-' + Date.now(),
      name,
      muscle_group,
      equipment,
      is_custom: true,
      user_id: user?.id || profile.id,
    };
    setExercises([...exercises, newEx]);

    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      supabase.from('exercises').insert({
        name,
        muscle_group,
        equipment,
        is_custom: true,
        user_id: user.id,
      });
    }
  };

  // Weight Logging
  const addWeightLog = async (weightKg: number, bodyFatPct?: number, notes?: string, dateStr?: string) => {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const newLog: WeightLog = {
      id: 'w-' + Date.now(),
      user_id: user?.id || profile.id,
      logged_date: today,
      weight_kg: weightKg,
      body_fat_pct: bodyFatPct,
      notes,
    };

    // Filter out existing log for same date if any
    const filtered = weightLogs.filter((w) => w.logged_date !== today);
    const updated = [newLog, ...filtered].sort((a, b) => b.logged_date.localeCompare(a.logged_date));
    setWeightLogs(updated);

    // Update profile current weight
    await updateProfile({ current_weight_kg: weightKg });

    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      await supabase.from('weight_logs').upsert({
        user_id: user.id,
        logged_date: today,
        weight_kg: weightKg,
        body_fat_pct: bodyFatPct,
        notes,
      });
    }
  };

  const deleteWeightLog = async (id: string) => {
    setWeightLogs(weightLogs.filter((w) => w.id !== id));
    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      await supabase.from('weight_logs').delete().eq('id', id);
    }
  };

  // Hyrox Logging
  const getHyroxPersonalRecord = (station: HyroxStationType): HyroxLog | null => {
    const stationLogs = hyroxLogs.filter((h) => h.station_type === station);
    if (stationLogs.length === 0) return null;
    // Lower time is better
    return [...stationLogs].sort((a, b) => a.time_seconds - b.time_seconds)[0];
  };

  const addHyroxLog = async (logData: Omit<HyroxLog, 'id' | 'user_id' | 'is_personal_record'>): Promise<boolean> => {
    const currentPR = getHyroxPersonalRecord(logData.station_type);
    const isNewPR = !currentPR || logData.time_seconds < currentPR.time_seconds;

    const newLog: HyroxLog = {
      ...logData,
      id: 'hyrox-' + Date.now(),
      user_id: user?.id || profile.id,
      is_personal_record: isNewPR,
    };

    if (isNewPR) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FFE600', '#FF5500', '#10B981'],
        });
      } catch (_) {}
    }

    setHyroxLogs([newLog, ...hyroxLogs]);

    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      await supabase.from('hyrox_logs').insert({
        user_id: user.id,
        logged_date: newLog.logged_date,
        station_type: newLog.station_type,
        time_seconds: newLog.time_seconds,
        distance_meters: newLog.distance_meters,
        weight_kg: newLog.weight_kg,
        reps: newLog.reps,
        average_pace: newLog.average_pace,
        heart_rate_avg: newLog.heart_rate_avg,
        rpe: newLog.rpe,
        notes: newLog.notes,
        is_personal_record: isNewPR,
      });
    }

    return isNewPR;
  };

  const deleteHyroxLog = async (id: string) => {
    setHyroxLogs(hyroxLogs.filter((h) => h.id !== id));
    const supabase = getSupabaseBrowserClient();
    if (supabase && user) {
      await supabase.from('hyrox_logs').delete().eq('id', id);
    }
  };

  // Google OAuth
  const loginWithGoogle = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      alert("Supabase n'est pas encore configuré dans .env.local. L'application fonctionne en mode Démo Local fluide.");
      return;
    }
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
  };

  const logout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  // Data Export & Import Backup Helpers
  const exportDataJSON = (): string => {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      workouts,
      weightLogs,
      hyroxLogs,
      exercises: exercises.filter((e) => e.is_custom),
    };
    return JSON.stringify(payload, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.workouts)) setWorkouts(data.workouts);
      if (Array.isArray(data.weightLogs)) setWeightLogs(data.weightLogs);
      if (Array.isArray(data.hyroxLogs)) setHyroxLogs(data.hyroxLogs);
      if (Array.isArray(data.exercises)) {
        const customOnly = data.exercises.filter((e: any) => e.is_custom);
        setExercises([...DEFAULT_EXERCISES, ...customOnly]);
      }
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  };

  const exportWorkoutsCSV = (): string => {
    const headers = ['Date', 'Nom Séance', 'Split', 'Durée (sec)', 'Tonnage Total (kg)', 'Exercice', 'Série', 'Poids (kg)', 'Reps', 'RPE', 'Complété'];
    const rows: string[] = [headers.join(',')];

    workouts.forEach((w) => {
      const date = w.completed_at || w.started_at;
      w.sets.forEach((s) => {
        rows.push([
          `"${date}"`,
          `"${w.name.replace(/"/g, '""')}"`,
          `"${w.split_type}"`,
          w.duration_seconds || 0,
          w.total_volume_kg || 0,
          `"${(s.exercise_name || '').replace(/"/g, '""')}"`,
          s.set_order,
          s.weight_kg,
          s.reps,
          s.rpe || '',
          s.is_completed ? '1' : '0',
        ].join(','));
      });
    });

    return rows.join('\n');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        updateProfile,
        workouts,
        activeWorkout,
        startWorkout,
        updateActiveWorkoutNotes,
        addExerciseToActiveWorkout,
        removeExerciseFromActiveWorkout,
        addSetToExercise,
        updateSet,
        removeSet,
        finishActiveWorkout,
        cancelActiveWorkout,
        deleteWorkout,
        getPreviousExercisePerformance,
        exercises,
        addCustomExercise,
        weightLogs,
        addWeightLog,
        deleteWeightLog,
        hyroxLogs,
        addHyroxLog,
        deleteHyroxLog,
        getHyroxPersonalRecord,
        startWorkoutFromTemplate,
        exportDataJSON,
        importDataJSON,
        exportWorkoutsCSV,
        isSupabaseConnected: isSupabaseConfigured,
        loginWithGoogle,
        logout,
        activeRestTimer,
        startRestTimer,
        clearRestTimer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
