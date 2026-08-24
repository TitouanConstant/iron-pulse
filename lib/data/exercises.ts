import { Exercise, MuscleGroup } from '../types';

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string; icon: string }[] = [
  { id: 'chest', label: 'Pectoraux', icon: 'Shield' },
  { id: 'back', label: 'Dos', icon: 'Layers' },
  { id: 'legs', label: 'Jambes', icon: 'Footprints' },
  { id: 'shoulders', label: 'Épaules', icon: 'Crosshair' },
  { id: 'biceps', label: 'Biceps', icon: 'Zap' },
  { id: 'triceps', label: 'Triceps', icon: 'Activity' },
  { id: 'abs', label: 'Abdos / Core', icon: 'Maximize2' },
  { id: 'full_body', label: 'Full Body / Cross', icon: 'Flame' },
  { id: 'cardio', label: 'Cardio / Running', icon: 'Timer' },
];

export const DEFAULT_EXERCISES: Exercise[] = [
  // CHEST
  { id: 'ex-chest-1', name: 'Développé Couché (Barre)', muscle_group: 'chest', equipment: 'barbell', is_custom: false },
  { id: 'ex-chest-2', name: 'Développé Incliné (Haltères)', muscle_group: 'chest', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-chest-3', name: 'Écarté Poulie Vis-à-vis', muscle_group: 'chest', equipment: 'cable', is_custom: false },
  { id: 'ex-chest-4', name: 'Dips Pectoraux', muscle_group: 'chest', equipment: 'bodyweight', is_custom: false },
  { id: 'ex-chest-5', name: 'Développé Couché Prise Serrée', muscle_group: 'chest', equipment: 'barbell', is_custom: false },
  { id: 'ex-chest-6', name: 'Chest Press Machine', muscle_group: 'chest', equipment: 'machine', is_custom: false },
  { id: 'ex-chest-7', name: 'Pompes Lestées', muscle_group: 'chest', equipment: 'bodyweight', is_custom: false },

  // BACK
  { id: 'ex-back-1', name: 'Tractions Pronation', muscle_group: 'back', equipment: 'bodyweight', is_custom: false },
  { id: 'ex-back-2', name: 'Rowing Barre Buste Penché', muscle_group: 'back', equipment: 'barbell', is_custom: false },
  { id: 'ex-back-3', name: 'Tirage Vertical Poulie Haute', muscle_group: 'back', equipment: 'cable', is_custom: false },
  { id: 'ex-back-4', name: 'Rowing Haltère Unilatéral', muscle_group: 'back', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-back-5', name: 'Soulevé de Terre (Deadlift)', muscle_group: 'back', equipment: 'barbell', is_custom: false },
  { id: 'ex-back-6', name: 'Tirage Horizontal Poulie Basse', muscle_group: 'back', equipment: 'cable', is_custom: false },
  { id: 'ex-back-7', name: 'Pull-over Poulie Haute', muscle_group: 'back', equipment: 'cable', is_custom: false },

  // LEGS
  { id: 'ex-legs-1', name: 'Squat Arrière (Back Squat)', muscle_group: 'legs', equipment: 'barbell', is_custom: false },
  { id: 'ex-legs-2', name: 'Front Squat', muscle_group: 'legs', equipment: 'barbell', is_custom: false },
  { id: 'ex-legs-3', name: 'Presse à Cuisses', muscle_group: 'legs', equipment: 'machine', is_custom: false },
  { id: 'ex-legs-4', name: 'Fentes Marchées (Haltères)', muscle_group: 'legs', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-legs-5', name: 'Leg Extension', muscle_group: 'legs', equipment: 'machine', is_custom: false },
  { id: 'ex-legs-6', name: 'Leg Curl Ischios', muscle_group: 'legs', equipment: 'machine', is_custom: false },
  { id: 'ex-legs-7', name: 'Soulevé de Terre Roumain (RDL)', muscle_group: 'legs', equipment: 'barbell', is_custom: false },
  { id: 'ex-legs-8', name: 'Mollets Debout Machine', muscle_group: 'legs', equipment: 'machine', is_custom: false },
  { id: 'ex-legs-9', name: 'Hip Thrust Barre', muscle_group: 'legs', equipment: 'barbell', is_custom: false },

  // SHOULDERS
  { id: 'ex-sho-1', name: 'Développé Militaire (Overhead Press)', muscle_group: 'shoulders', equipment: 'barbell', is_custom: false },
  { id: 'ex-sho-2', name: 'Élévations Latérales Haltères', muscle_group: 'shoulders', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-sho-3', name: 'Élévations Latérales Poulie', muscle_group: 'shoulders', equipment: 'cable', is_custom: false },
  { id: 'ex-sho-4', name: 'Face Pull Poulie Haute', muscle_group: 'shoulders', equipment: 'cable', is_custom: false },
  { id: 'ex-sho-5', name: 'Oiseau Buste Penché Haltères', muscle_group: 'shoulders', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-sho-6', name: 'Développé Arnold', muscle_group: 'shoulders', equipment: 'dumbbell', is_custom: false },

  // BICEPS
  { id: 'ex-bic-1', name: 'Curl Biceps Barre EZ', muscle_group: 'biceps', equipment: 'barbell', is_custom: false },
  { id: 'ex-bic-2', name: 'Curl Incliné Haltères', muscle_group: 'biceps', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-bic-3', name: 'Curl Marteau Haltères', muscle_group: 'biceps', equipment: 'dumbbell', is_custom: false },
  { id: 'ex-bic-4', name: 'Curl Spider Pupitre', muscle_group: 'biceps', equipment: 'barbell', is_custom: false },

  // TRICEPS
  { id: 'ex-tri-1', name: 'Extension Triceps Poulie Haute', muscle_group: 'triceps', equipment: 'cable', is_custom: false },
  { id: 'ex-tri-2', name: 'Barre au Front (Skullcrushers)', muscle_group: 'triceps', equipment: 'barbell', is_custom: false },
  { id: 'ex-tri-3', name: 'Dips Prise Serrée', muscle_group: 'triceps', equipment: 'bodyweight', is_custom: false },
  { id: 'ex-tri-4', name: 'Extension Triceps Nuque Corde', muscle_group: 'triceps', equipment: 'cable', is_custom: false },

  // ABS
  { id: 'ex-abs-1', name: 'Relevé de Jambes Suspendu', muscle_group: 'abs', equipment: 'bodyweight', is_custom: false },
  { id: 'ex-abs-2', name: 'Crunch Poulie Haute', muscle_group: 'abs', equipment: 'cable', is_custom: false },
  { id: 'ex-abs-3', name: 'Roue Abdominale (Ab Wheel)', muscle_group: 'abs', equipment: 'other', is_custom: false },
  { id: 'ex-abs-4', name: 'Gainage Planche Lestée', muscle_group: 'abs', equipment: 'bodyweight', is_custom: false },

  // FULL BODY / CROSS
  { id: 'ex-fb-1', name: 'Kettlebell Swing', muscle_group: 'full_body', equipment: 'kettlebell', is_custom: false },
  { id: 'ex-fb-2', name: 'Thrusters (Barre)', muscle_group: 'full_body', equipment: 'barbell', is_custom: false },
  { id: 'ex-fb-3', name: 'Clean and Jerk (Épaulé Jeté)', muscle_group: 'full_body', equipment: 'barbell', is_custom: false },
  { id: 'ex-fb-4', name: 'Snatch (Arraché)', muscle_group: 'full_body', equipment: 'barbell', is_custom: false },
  { id: 'ex-fb-5', name: 'Burpees Target Jump', muscle_group: 'full_body', equipment: 'bodyweight', is_custom: false },
];
