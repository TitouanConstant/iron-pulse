import { RivalAthlete } from '@/lib/types';

export const DEFAULT_RIVALS: RivalAthlete[] = [
  {
    id: 'rival-alexandre',
    athlete_code: 'HYROX-ALEX',
    full_name: 'Alexandre Morel',
    division: 'pro_men',
    weight_kg: 84.0,
    height_cm: 183,
    goal: 'recomp',
    bio: 'Objectif Hyrox Pro Paris & Sub-1h08 ⚡',
    added_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    stats: {
      weekly_tonnage_kg: 26500,
      workouts_this_month: 16,
      estimated_hyrox_time_seconds: 4120, // 1h08m40s
      hyrox_prs: {
        RUN_1KM: 235, // 3:55
        SKIERG_1000M: 215, // 3:35
        SLED_PUSH: 125, // 2:05
        SLED_PULL: 185, // 3:05
        BURPEE_BROAD_JUMP_80M: 200, // 3:20
        ROW_1000M: 210, // 3:30
        FARMERS_CARRY_200M: 95, // 1:35
        SANDBAG_LUNGES_100M: 230, // 3:50
        WALL_BALLS: 220, // 3:40
      },
      strength_1rm: {
        bench_press_kg: 115,
        back_squat_kg: 150,
        deadlift_kg: 190,
        overhead_press_kg: 72.5,
        pull_ups_reps: 22,
      },
    },
  },
  {
    id: 'rival-lucas',
    athlete_code: 'IRON-LUCAS',
    full_name: 'Lucas Bernard',
    division: 'open_men',
    weight_kg: 81.5,
    height_cm: 177,
    goal: 'bulk',
    bio: 'Powerbuilder • Gros focus 1RM & Surcharge progressive 💪',
    added_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    stats: {
      weekly_tonnage_kg: 32400,
      workouts_this_month: 18,
      estimated_hyrox_time_seconds: 4560, // 1h16m00s
      hyrox_prs: {
        RUN_1KM: 260, // 4:20
        SKIERG_1000M: 230, // 3:50
        SLED_PUSH: 105, // 1:45 (Trunk strength)
        SLED_PULL: 160, // 2:40
        BURPEE_BROAD_JUMP_80M: 245, // 4:05
        ROW_1000M: 218, // 3:38
        FARMERS_CARRY_200M: 88, // 1:28
        SANDBAG_LUNGES_100M: 250, // 4:10
        WALL_BALLS: 240, // 4:00
      },
      strength_1rm: {
        bench_press_kg: 132.5,
        back_squat_kg: 175,
        deadlift_kg: 215,
        overhead_press_kg: 82.5,
        pull_ups_reps: 18,
      },
    },
  },
  {
    id: 'rival-sarah',
    athlete_code: 'HYROX-SARAH',
    full_name: 'Sarah Dumont',
    division: 'open_women',
    weight_kg: 63.0,
    height_cm: 168,
    goal: 'cut',
    bio: 'Crossfit & Hyrox Doubles • Endurance explosive 🏃‍♀️',
    added_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    stats: {
      weekly_tonnage_kg: 18200,
      workouts_this_month: 20,
      estimated_hyrox_time_seconds: 4380, // 1h13m00s
      hyrox_prs: {
        RUN_1KM: 245, // 4:05
        SKIERG_1000M: 240, // 4:00
        SLED_PUSH: 135, // 2:15
        SLED_PULL: 175, // 2:55
        BURPEE_BROAD_JUMP_80M: 190, // 3:10
        ROW_1000M: 225, // 3:45
        FARMERS_CARRY_200M: 105, // 1:45
        SANDBAG_LUNGES_100M: 215, // 3:35
        WALL_BALLS: 195, // 3:15
      },
      strength_1rm: {
        bench_press_kg: 72.5,
        back_squat_kg: 110,
        deadlift_kg: 135,
        overhead_press_kg: 47.5,
        pull_ups_reps: 15,
      },
    },
  },
];

export function generateAthleteCode(name: string, seed?: string): string {
  const cleanName = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 4) || 'ATHL';

  let hash = 0;
  const str = seed || (name + (typeof window !== 'undefined' ? window.location.host : 'ironpulse'));
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const digits = (Math.abs(hash) % 9000) + 1000;
  return `PULSE-${cleanName}${digits}`;
}
