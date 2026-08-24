import { HyroxDivision, HyroxLog, HyroxStationInfo, HyroxStationType } from '../types';

export const HYROX_DIVISIONS: Record<HyroxDivision, { name: string; tag: string }> = {
  open_men: { name: 'Men Open', tag: 'Open H' },
  open_women: { name: 'Women Open', tag: 'Open F' },
  pro_men: { name: 'Men Pro', tag: 'Pro H' },
  pro_women: { name: 'Women Pro', tag: 'Pro F' },
  doubles_men: { name: 'Doubles Men', tag: 'Duo H' },
  doubles_women: { name: 'Doubles Women', tag: 'Duo F' },
  doubles_mixed: { name: 'Doubles Mixed', tag: 'Duo Mixte' },
};

export const HYROX_STATIONS_DATA: HyroxStationInfo[] = [
  {
    id: 'SKIERG_1000M',
    order: 1,
    name: '1. SkiErg',
    subtitle: '1 000 m',
    standardDistance: '1000m',
    iconName: 'Wind',
    targetBenchmarks: { elite: 210, intermediate: 250, beginner: 310 }, // 3:30, 4:10, 5:10
    equipmentWeight: {
      open_men: 'Damper 6',
      open_women: 'Damper 5',
      pro_men: 'Damper 6',
      pro_women: 'Damper 5',
      doubles_men: 'Damper 6',
      doubles_women: 'Damper 5',
      doubles_mixed: 'Damper 5-6',
    },
    tips: [
      'Garder un rythme régulier sans s\'asphyxier sur la première station',
      'Engager les dorsaux et la sangle abdominale plutôt que tirer uniquement avec les bras',
      'Viser un split de 500m constant (+/- 2 secondes)',
    ],
  },
  {
    id: 'SLED_PUSH',
    order: 2,
    name: '2. Sled Push',
    subtitle: '4 x 12.5 m (50 m)',
    standardDistance: '50m',
    iconName: 'ChevronRight',
    targetBenchmarks: { elite: 120, intermediate: 180, beginner: 270 }, // 2:00, 3:00, 4:30
    equipmentWeight: {
      open_men: '152 kg (avec traîneau)',
      open_women: '102 kg (avec traîneau)',
      pro_men: '202 kg (avec traîneau)',
      pro_women: '152 kg (avec traîneau)',
      doubles_men: '152 kg (avec traîneau)',
      doubles_women: '102 kg (avec traîneau)',
      doubles_mixed: '152 kg (avec traîneau)',
    },
    tips: [
      'Bras tendus, buste penché vers l\'avant à 45°',
      'Petits pas réguliers sur la pointe des pieds, pousser avec les quadriceps',
      'Ne pas s\'arrêter au milieu d\'un couloir',
    ],
  },
  {
    id: 'SLED_PULL',
    order: 3,
    name: '3. Sled Pull',
    subtitle: '4 x 12.5 m (50 m)',
    standardDistance: '50m',
    iconName: 'ChevronLeft',
    targetBenchmarks: { elite: 180, intermediate: 250, beginner: 360 }, // 3:00, 4:10, 6:00
    equipmentWeight: {
      open_men: '103 kg (avec traîneau)',
      open_women: '78 kg (avec traîneau)',
      pro_men: '153 kg (avec traîneau)',
      pro_women: '103 kg (avec traîneau)',
      doubles_men: '103 kg (avec traîneau)',
      doubles_women: '78 kg (avec traîneau)',
      doubles_mixed: '103 kg (avec traîneau)',
    },
    tips: [
      'Rester dans le box carré sans franchir la ligne',
      'Utiliser le poids de son corps en tirant vers l\'arrière avec les jambes et le dos',
      'Enrouler la corde de manière fluide sans s\'emmêler',
    ],
  },
  {
    id: 'BURPEE_BROAD_JUMP_80M',
    order: 4,
    name: '4. Burpee Broad Jump',
    subtitle: '80 m',
    standardDistance: '80m',
    iconName: 'Flame',
    targetBenchmarks: { elite: 180, intermediate: 250, beginner: 360 }, // 3:00, 4:10, 6:00
    equipmentWeight: {
      open_men: 'Poids du corps',
      open_women: 'Poids du corps',
      pro_men: 'Poids du corps',
      pro_women: 'Poids du corps',
      doubles_men: 'Poids du corps',
      doubles_women: 'Poids du corps',
      doubles_mixed: 'Poids du corps',
    },
    tips: [
      'Sauter à une distance modérée et constante pour garder du souffle',
      'Poitrine au sol obligatoire à chaque répétition',
      'Respirer à chaque phase descendante',
    ],
  },
  {
    id: 'ROW_1000M',
    order: 5,
    name: '5. Rowing (Rameur)',
    subtitle: '1 000 m',
    standardDistance: '1000m',
    iconName: 'Waves',
    targetBenchmarks: { elite: 210, intermediate: 255, beginner: 315 }, // 3:30, 4:15, 5:15
    equipmentWeight: {
      open_men: 'Damper 6',
      open_women: 'Damper 5',
      pro_men: 'Damper 6',
      pro_women: 'Damper 5',
      doubles_men: 'Damper 6',
      doubles_women: 'Damper 5',
      doubles_mixed: 'Damper 5-6',
    },
    tips: [
      'Pousser fort avec les jambes (60%), engager le buste (20%), finir avec les bras (20%)',
      'Maintenir 24-28 coups par minute réguliers',
      'Relâcher les épaules pour éviter les tensions trapèzes',
    ],
  },
  {
    id: 'FARMERS_CARRY_200M',
    order: 6,
    name: '6. Farmers Carry',
    subtitle: '200 m',
    standardDistance: '200m',
    iconName: 'Weight',
    targetBenchmarks: { elite: 90, intermediate: 135, beginner: 195 }, // 1:30, 2:15, 3:15
    equipmentWeight: {
      open_men: '2 x 24 kg Kettlebells',
      open_women: '2 x 16 kg Kettlebells',
      pro_men: '2 x 32 kg Kettlebells',
      pro_women: '2 x 24 kg Kettlebells',
      doubles_men: '2 x 24 kg Kettlebells',
      doubles_women: '2 x 16 kg Kettlebells',
      doubles_mixed: '2 x 24 kg / 16 kg',
    },
    tips: [
      'Travailler le grip et les avant-bras à l\'entraînement',
      'Buste droit, épaules verrouillées en arrière, pas rapides et courts',
      'Éviter de poser les kettlebells au sol',
    ],
  },
  {
    id: 'SANDBAG_LUNGES_100M',
    order: 7,
    name: '7. Sandbag Lunges',
    subtitle: '100 m',
    standardDistance: '100m',
    iconName: 'Footprints',
    targetBenchmarks: { elite: 180, intermediate: 260, beginner: 390 }, // 3:00, 4:20, 6:30
    equipmentWeight: {
      open_men: '20 kg Sandbag',
      open_women: '10 kg Sandbag',
      pro_men: '30 kg Sandbag',
      pro_women: '20 kg Sandbag',
      doubles_men: '20 kg Sandbag',
      doubles_women: '10 kg Sandbag',
      doubles_mixed: '20 kg / 10 kg',
    },
    tips: [
      'Sac posé confortablement sur les deux épaules ou derrière la nuque',
      'Genou arrière touche le sol à chaque fente',
      'Extension complète de la hanche avant d\'enchaîner le pas suivant',
    ],
  },
  {
    id: 'WALL_BALLS',
    order: 8,
    name: '8. Wall Balls',
    subtitle: '75 à 100 Reps',
    standardDistance: '100 reps',
    iconName: 'Target',
    targetBenchmarks: { elite: 210, intermediate: 300, beginner: 420 }, // 3:30, 5:00, 7:00
    equipmentWeight: {
      open_men: '6 kg (Cible 3.00 m - 100 reps)',
      open_women: '4 kg (Cible 2.70 m - 75 reps)',
      pro_men: '9 kg (Cible 3.00 m - 100 reps)',
      pro_women: '6 kg (Cible 2.70 m - 100 reps)',
      doubles_men: '6 kg (100 reps partagées)',
      doubles_women: '4 kg (75 reps partagées)',
      doubles_mixed: '6 kg / 4 kg (100 reps)',
    },
    tips: [
      'Casser la parallèle en squat profond',
      'Lancer le ballon avec l\'impulsion des jambes, pas seulement les bras',
      'Découper en séries régulières (ex: 4 x 25 ou 5 x 20) avec 5s de pause',
    ],
  },
];

/**
 * Calcul du compte à rebours Hyrox Avril 2027
 */
export function getHyroxCountdown(targetDateStr: string = '2027-04-17') {
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true, totalDays: 0 };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return { days, hours, minutes, seconds, isPassed: false, totalDays: days };
}

/**
 * Formatage secondes en format MM:SS ou HH:MM:SS
 */
export function formatSecondsToTime(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Parser "MM:SS" ou "HH:MM:SS" en secondes
 */
export function parseTimeToSeconds(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  return Number(timeStr) || 0;
}

/**
 * Simulation de temps global Hyrox (8 stations + 8x1km Run + Roxzone)
 */
export interface HyroxSimulationInput {
  runPacePerKmSeconds: number; // e.g. 270 (4:30/km)
  stationTimesSeconds: Record<HyroxStationType, number>;
  roxzoneSeconds: number; // e.g. 360 (6 mins total transition)
}

export function calculateHyroxTotalSimulation(input: HyroxSimulationInput) {
  const totalRunSeconds = input.runPacePerKmSeconds * 8;
  
  let totalStationsSeconds = 0;
  HYROX_STATIONS_DATA.forEach(st => {
    totalStationsSeconds += input.stationTimesSeconds[st.id] || st.targetBenchmarks.intermediate;
  });

  const totalTimeSeconds = totalRunSeconds + totalStationsSeconds + input.roxzoneSeconds;

  let tier = 'Finisher';
  if (totalTimeSeconds < 3600) tier = 'Sub 1h (Élite Mondiale)';
  else if (totalTimeSeconds < 4200) tier = 'Sub 1h10 (Top 5%)';
  else if (totalTimeSeconds < 4800) tier = 'Sub 1h20 (Avancé)';
  else if (totalTimeSeconds < 5400) tier = 'Sub 1h30 (Intermédiaire +)';
  else tier = 'Finisher Objectif';

  return {
    totalRunSeconds,
    totalStationsSeconds,
    roxzoneSeconds: input.roxzoneSeconds,
    totalTimeSeconds,
    formattedTotalTime: formatSecondsToTime(totalTimeSeconds),
    formattedRunTime: formatSecondsToTime(totalRunSeconds),
    formattedStationsTime: formatSecondsToTime(totalStationsSeconds),
    tier,
  };
}
