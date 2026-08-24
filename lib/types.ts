// ==============================================================================
// IRONPULSE - TYPE DEFINITIONS
// ==============================================================================

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type FitnessGoal = 'cut' | 'maintenance' | 'bulk' | 'recomp';
export type BMRFormula = 'mifflin' | 'harris_benedict';

export type HyroxDivision = 
  | 'open_men' 
  | 'open_women' 
  | 'pro_men' 
  | 'pro_women' 
  | 'doubles_men' 
  | 'doubles_women' 
  | 'doubles_mixed';

export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'legs' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'abs' 
  | 'full_body' 
  | 'cardio';

export type EquipmentType = 
  | 'barbell' 
  | 'dumbbell' 
  | 'cable' 
  | 'machine' 
  | 'bodyweight' 
  | 'kettlebell' 
  | 'other';

export type SplitType = 
  | 'push' 
  | 'pull' 
  | 'legs' 
  | 'upper' 
  | 'lower' 
  | 'full_body' 
  | 'hyrox_strength' 
  | 'custom';

export type HyroxStationType = 
  | 'RUN_1KM'
  | 'SKIERG_1000M'
  | 'SLED_PUSH'
  | 'SLED_PULL'
  | 'BURPEE_BROAD_JUMP_80M'
  | 'ROW_1000M'
  | 'FARMERS_CARRY_200M'
  | 'SANDBAG_LUNGES_100M'
  | 'WALL_BALLS'
  | 'FULL_SIMULATION'
  | 'HALF_SIMULATION';

export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  athlete_code?: string; // Shareable friend code (e.g. "PULSE-8X92")
  avatar_url?: string;
  gender: Gender;
  birth_date?: string;
  age: number;
  height_cm: number;
  current_weight_kg?: number;
  target_weight_kg?: number;
  activity_level: ActivityLevel;
  goal: FitnessGoal;
  formula: BMRFormula;
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
  hyrox_division: HyroxDivision;
  hyrox_target_date: string; // "2027-04-17"
  created_at: string;
  updated_at: string;
}

export interface RivalAthlete {
  id: string;
  athlete_code: string;
  full_name: string;
  avatar_url?: string;
  division: HyroxDivision;
  weight_kg: number;
  height_cm: number;
  goal: FitnessGoal;
  bio?: string;
  added_at: string;
  stats: {
    weekly_tonnage_kg: number;
    workouts_this_month: number;
    estimated_hyrox_time_seconds: number;
    hyrox_prs: Partial<Record<HyroxStationType, number>>; // Station -> PR in seconds
    strength_1rm: {
      bench_press_kg: number;
      back_squat_kg: number;
      deadlift_kg: number;
      overhead_press_kg: number;
      pull_ups_reps: number;
    };
  };
}

export interface Exercise {
  id: string;
  user_id?: string | null;
  name: string;
  muscle_group: MuscleGroup;
  equipment?: EquipmentType;
  description?: string;
  is_custom?: boolean;
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_name?: string;
  muscle_group?: MuscleGroup;
  set_order: number;
  weight_kg: number;
  reps: number;
  rpe?: number;
  rest_seconds?: number;
  is_warmup?: boolean;
  is_completed: boolean;
  notes?: string;
  previous_weight_kg?: number;
  previous_reps?: number;
  previous_rpe?: number;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  split_type: SplitType;
  started_at: string;
  completed_at?: string | null;
  duration_seconds: number;
  notes?: string;
  rating?: number;
  total_volume_kg: number;
  sets: WorkoutSet[];
}

export interface WeightLog {
  id: string;
  user_id: string;
  logged_date: string; // YYYY-MM-DD
  weight_kg: number;
  body_fat_pct?: number;
  notes?: string;
}

export interface HyroxLog {
  id: string;
  user_id: string;
  logged_date: string; // YYYY-MM-DD
  station_type: HyroxStationType;
  time_seconds: number; // in seconds
  distance_meters?: number;
  weight_kg?: number;
  reps?: number;
  average_pace?: string; // e.g. "4:15/km"
  heart_rate_avg?: number;
  rpe?: number;
  notes?: string;
  is_personal_record?: boolean;
}

export interface HyroxStationInfo {
  id: HyroxStationType;
  order: number;
  name: string;
  subtitle: string;
  standardDistance: string;
  iconName: string;
  targetBenchmarks: {
    elite: number; // seconds
    intermediate: number; // seconds
    beginner: number; // seconds
  };
  equipmentWeight: {
    open_men: string;
    open_women: string;
    pro_men: string;
    pro_women: string;
    doubles_men: string;
    doubles_women: string;
    doubles_mixed: string;
  };
  tips: string[];
}

export interface MacroSplit {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
}

export interface BMRResult {
  mifflin: number;
  harris_benedict: number;
  selectedFormulaBMR: number;
  tdee: number;
  activityMultiplier: number;
}
