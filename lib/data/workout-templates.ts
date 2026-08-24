import { SplitType } from '../types';

export interface WorkoutTemplate {
  id: string;
  name: string;
  split_type: SplitType;
  description: string;
  badge: string;
  color: string;
  exerciseIds: string[];
}

export const PRESET_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'tpl-push-a',
    name: 'Push A - Focus Pectoraux & Triceps',
    split_type: 'push',
    description: 'Développé couché lourd, incliné haltères, écartés poulie, dips & extensions triceps',
    badge: 'Pectoraux & Triceps',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40',
    exerciseIds: [
      'ex-chest-1', // Développé Couché (Barre)
      'ex-chest-2', // Développé Incliné (Haltères)
      'ex-chest-3', // Écarté Poulie Vis-à-vis
      'ex-sho-2',   // Élévations Latérales Haltères
      'ex-tri-1',   // Extension Triceps Poulie Haute
      'ex-tri-2',   // Barre au Front (Skullcrushers)
    ],
  },
  {
    id: 'tpl-pull-a',
    name: 'Pull A - Épaisseur Dos & Biceps',
    split_type: 'pull',
    description: 'Tractions, rowing barre lourd, tirage horizontal poulie, oiseau & curl biceps',
    badge: 'Dos & Biceps',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40',
    exerciseIds: [
      'ex-back-1', // Tractions Pronation
      'ex-back-2', // Rowing Barre Buste Penché
      'ex-back-6', // Tirage Horizontal Poulie Basse
      'ex-sho-5',  // Oiseau Buste Penché Haltères
      'ex-bic-1',  // Curl Biceps Barre EZ
      'ex-bic-3',  // Curl Marteau Haltères
    ],
  },
  {
    id: 'tpl-legs-a',
    name: 'Legs A - Focus Quadriceps & Fessiers',
    split_type: 'legs',
    description: 'Back Squat, presse à cuisses, fentes marchées, leg extension & mollets',
    badge: 'Cuisses & Mollets',
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/40',
    exerciseIds: [
      'ex-legs-1', // Squat Arrière (Back Squat)
      'ex-legs-3', // Presse à Cuisses
      'ex-legs-4', // Fentes Marchées (Haltères)
      'ex-legs-5', // Leg Extension
      'ex-legs-6', // Leg Curl Ischios
      'ex-legs-8', // Mollets Debout Machine
    ],
  },
  {
    id: 'tpl-upper-body',
    name: 'Upper Body - Hypertrophie Haut du Corps',
    split_type: 'upper',
    description: 'Séance condensée pecs, dos, épaules et bras pour prise de masse globale',
    badge: 'Haut du Corps',
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/40',
    exerciseIds: [
      'ex-chest-1', // Développé Couché
      'ex-back-3',  // Tirage Vertical Poulie Haute
      'ex-sho-1',   // Développé Militaire
      'ex-back-4',  // Rowing Haltère Unilatéral
      'ex-sho-3',   // Élévations Latérales Poulie
      'ex-bic-2',   // Curl Incliné Haltères
    ],
  },
  {
    id: 'tpl-hyrox-strength',
    name: 'Hyrox Strength & Power Circuit',
    split_type: 'hyrox_strength',
    description: 'Kettlebell swings, fentes haltères, thrusters, burpees et renforcement grip',
    badge: 'Prépa Hyrox',
    color: 'from-amber-400/30 to-amber-600/30 text-amber-300 border-amber-400/60',
    exerciseIds: [
      'ex-fb-1',   // Kettlebell Swing
      'ex-legs-4',  // Fentes Marchées (Haltères)
      'ex-fb-2',   // Thrusters (Barre)
      'ex-fb-5',   // Burpees Target Jump
      'ex-abs-3',  // Roue Abdominale
      'ex-abs-4',  // Gainage Planche Lestée
    ],
  },
];
