import { ActivityLevel, BMRFormula, BMRResult, FitnessGoal, Gender, MacroSplit } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Peu ou pas d'exercice
  light: 1.375,        // Exercice léger 1-3 fois/semaine
  moderate: 1.55,      // Exercice modéré 3-5 fois/semaine
  very_active: 1.725,  // Entraînement intense 6-7 fois/semaine
  extra_active: 1.9,   // Entraînement 2x/jour + travail physique
};

export const ACTIVITY_LABELS: Record<ActivityLevel, { title: string; desc: string }> = {
  sedentary: { title: 'Sédentaire', desc: 'Bureau, peu de déplacements' },
  light: { title: 'Légèrement actif', desc: '1 à 3 séances de sport / sem.' },
  moderate: { title: 'Modérément actif', desc: '3 à 5 séances intenses / sem.' },
  very_active: { title: 'Très actif', desc: '6 à 7 séances intenses / sem.' },
  extra_active: { title: 'Athlète / Extrême', desc: 'Prépa Hyrox bi-quotidienne' },
};

export const GOAL_LABELS: Record<FitnessGoal, { title: string; desc: string; delta: number }> = {
  cut: { title: 'Sèche', desc: 'Perte de gras avec maintien musculaire (-400 kcal)', delta: -400 },
  maintenance: { title: 'Maintien', desc: 'Stabilisation du poids et performance (0 kcal)', delta: 0 },
  bulk: { title: 'Prise de masse', desc: 'Surplus contrôlé pour bâtir du muscle (+350 kcal)', delta: 350 },
  recomp: { title: 'Recomposition', desc: 'Perte de gras & gain musculaire simultané', delta: -100 },
};

/**
 * Calcul du BMR selon Mifflin-St Jeor
 */
export function calculateMifflin(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'female' ? Math.round(base - 161) : Math.round(base + 5);
}

/**
 * Calcul du BMR selon Harris-Benedict (révisée par Roza and Shizgal)
 */
export function calculateHarrisBenedict(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  if (gender === 'female') {
    return Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age);
  }
  return Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age);
}

/**
 * Calcul complet BMR et TDEE
 */
export function calculateMetabolism(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel,
  formula: BMRFormula = 'mifflin'
): BMRResult {
  const mifflin = calculateMifflin(weightKg, heightCm, age, gender);
  const harris = calculateHarrisBenedict(weightKg, heightCm, age, gender);
  const selectedFormulaBMR = formula === 'harris_benedict' ? harris : mifflin;
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.55;
  const tdee = Math.round(selectedFormulaBMR * multiplier);

  return {
    mifflin,
    harris_benedict: harris,
    selectedFormulaBMR,
    tdee,
    activityMultiplier: multiplier,
  };
}

/**
 * Calcul des macronutriments recommandés
 * Protéines : 2.0 à 2.2g/kg
 * Lipides : 0.9 à 1.0g/kg
 * Glucides : reste des calories
 */
export function calculateMacroSplit(
  targetCalories: number,
  weightKg: number,
  goal: FitnessGoal
): MacroSplit {
  if (targetCalories <= 0 || weightKg <= 0) {
    return {
      calories: targetCalories,
      protein_g: 150,
      carbs_g: 250,
      fat_g: 70,
      protein_pct: 25,
      carbs_pct: 50,
      fat_pct: 25,
    };
  }

  let proteinPerKg = 2.0;
  let fatPerKg = 0.9;

  switch (goal) {
    case 'cut':
      proteinPerKg = 2.3; // Protéger la masse maigre en déficit
      fatPerKg = 0.8;
      break;
    case 'recomp':
      proteinPerKg = 2.2;
      fatPerKg = 0.9;
      break;
    case 'bulk':
      proteinPerKg = 2.0;
      fatPerKg = 1.0;
      break;
    case 'maintenance':
    default:
      proteinPerKg = 2.0;
      fatPerKg = 0.9;
      break;
  }

  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round(weightKg * fatPerKg);

  const proteinCalories = proteinG * 4;
  const fatCalories = fatG * 9;
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbsG = Math.round(remainingCalories / 4);

  const totalCal = proteinCalories + fatCalories + (carbsG * 4);
  const proteinPct = Math.round((proteinCalories / totalCal) * 100);
  const fatPct = Math.round((fatCalories / totalCal) * 100);
  const carbsPct = Math.max(0, 100 - (proteinPct + fatPct));

  return {
    calories: targetCalories,
    protein_g: proteinG,
    carbs_g: carbsG,
    fat_g: fatG,
    protein_pct: proteinPct,
    carbs_pct: carbsPct,
    fat_pct: fatPct,
  };
}
