/**
 * Calcul du 1RM estimé (One Rep Max)
 */

// Formule de Epley: 1RM = Poids * (1 + Reps / 30)
export function calculateEpley1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round((weightKg * (1 + reps / 30)) * 10) / 10;
}

// Formule de Brzycki: 1RM = Poids / (1.0278 - 0.0278 * Reps)
export function calculateBrzycki1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps >= 37) return weightKg;
  if (reps === 1) return weightKg;
  return Math.round((weightKg / (1.0278 - 0.0278 * reps)) * 10) / 10;
}

/**
 * Calcul du volume total pour une série (Poids * Reps)
 */
export function calculateSetVolume(weightKg: number, reps: number): number {
  return Math.round(weightKg * reps * 100) / 100;
}

/**
 * Pourcentage du 1RM pour un nombre de reps cible
 */
export function calculateWeightForReps(oneRmKg: number, targetReps: number): number {
  if (oneRmKg <= 0 || targetReps <= 0) return 0;
  if (targetReps === 1) return oneRmKg;
  const factor = 1 - (targetReps * 0.025);
  return Math.round((oneRmKg * factor) * 2) / 2; // Arrondi aux 0.5kg
}
