'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { formatSecondsToTime } from '@/lib/calculations/hyrox';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Flame, 
  Footprints, 
  ChevronRight, 
  Trophy, 
  Flag 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface SimulationStep {
  name: string;
  type: 'RUN' | 'STATION';
  distance: string;
  targetSeconds: number;
}

const HYROX_SIMULATION_STEPS: SimulationStep[] = [
  { name: '1. Run 1', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '2. SkiErg', type: 'STATION', distance: '1 000 m', targetSeconds: 240 },
  { name: '3. Run 2', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '4. Sled Push', type: 'STATION', distance: '50 m', targetSeconds: 150 },
  { name: '5. Run 3', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '6. Sled Pull', type: 'STATION', distance: '50 m', targetSeconds: 210 },
  { name: '7. Run 4', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '8. Burpee Broad Jumps', type: 'STATION', distance: '80 m', targetSeconds: 240 },
  { name: '9. Run 5', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '10. Rowing', type: 'STATION', distance: '1 000 m', targetSeconds: 240 },
  { name: '11. Run 6', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '12. Farmers Carry', type: 'STATION', distance: '200 m', targetSeconds: 120 },
  { name: '13. Run 7', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '14. Sandbag Lunges', type: 'STATION', distance: '100 m', targetSeconds: 240 },
  { name: '15. Run 8', type: 'RUN', distance: '1 000 m', targetSeconds: 270 },
  { name: '16. Wall Balls', type: 'STATION', distance: '100 reps', targetSeconds: 270 },
];

export default function HyroxSimulationPage() {
  const router = useRouter();
  const { addHyroxLog } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [currentLapElapsed, setCurrentLapElapsed] = useState(0);
  const [laps, setLaps] = useState<{ stepName: string; lapSeconds: number; cumulativeSeconds: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && !isFinished) {
      interval = setInterval(() => {
        setTotalElapsed((t) => t + 1);
        setCurrentLapElapsed((l) => l + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFinished]);

  const currentStep = HYROX_SIMULATION_STEPS[currentStepIndex];

  const handleNextStep = () => {
    const currentStepName = currentStep.name;
    const newLap = {
      stepName: currentStepName,
      lapSeconds: currentLapElapsed,
      cumulativeSeconds: totalElapsed,
    };
    const updatedLaps = [...laps, newLap];
    setLaps(updatedLaps);
    setCurrentLapElapsed(0);

    if (currentStepIndex + 1 < HYROX_SIMULATION_STEPS.length) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsRunning(false);
      setIsFinished(true);
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#FFE600', '#FF5500', '#38BDF8'],
        });
      } catch (_) {}
    }
  };

  const handleSaveSimulation = async () => {
    await addHyroxLog({
      logged_date: new Date().toISOString().split('T')[0],
      station_type: 'FULL_SIMULATION',
      time_seconds: totalElapsed,
      notes: `Simulation Complète Hyrox (16 blocs validés)`,
    });
    router.push('/hyrox');
  };

  return (
    <div className="space-y-4 pb-12 animate-slide-up">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/hyrox"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard Hyrox</span>
        </Link>

        <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
          Chrono Live
        </span>
      </div>

      <div>
        <h1 className="text-xl font-black text-white">Chronomètre de Course Hyrox</h1>
        <p className="text-xs text-slate-400">
          Enchaînement direct des 8 blocs de course et 8 stations officielles
        </p>
      </div>

      {/* Main Stopwatch Banner */}
      <div className="glass-card rounded-3xl p-6 border-2 border-amber-400/80 text-center shadow-2xl relative overflow-hidden">
        <div className="text-xs font-black uppercase text-amber-400 tracking-widest mb-1">
          {isFinished ? 'SIMULATION TERMINÉE !' : `BLOC ACTUEL : ${currentStep.name}`}
        </div>
        <div className="text-5xl xs:text-6xl font-black text-white font-mono tracking-tight my-2">
          {formatSecondsToTime(totalElapsed)}
        </div>
        <div className="text-xs text-slate-400">
          Temps sur l'étape : <span className="text-amber-300 font-mono font-bold text-sm">{formatSecondsToTime(currentLapElapsed)}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStepIndex + (isFinished ? 1 : 0)) / HYROX_SIMULATION_STEPS.length) * 100}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          Étape {currentStepIndex + 1} / {HYROX_SIMULATION_STEPS.length} ({currentStep.distance})
        </div>
      </div>

      {/* Controls */}
      {!isFinished ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={cn(
              'py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95',
              isRunning
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-emerald-400 text-black shadow-emerald-500/20'
            )}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-black" />}
            <span>{isRunning ? 'Mettre en Pause' : 'Démarrer'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={!isRunning && totalElapsed === 0}
            className="py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>Étape Suivante</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleSaveSimulation}
          className="w-full py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>Enregistrer le chrono de simulation</span>
        </button>
      )}

      {/* Laps List */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Temps de passage ({laps.length} / 16)
        </h3>

        {laps.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">
            Lancez le chrono et validez chaque étape pour enregistrer vos splits.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {laps.map((lap, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs"
              >
                <span className="font-bold text-white">{lap.stepName}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-amber-400 font-bold">
                    {formatSecondsToTime(lap.lapSeconds)}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    ({formatSecondsToTime(lap.cumulativeSeconds)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
