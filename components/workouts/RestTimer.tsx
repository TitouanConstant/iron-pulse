'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '@/lib/store/app-context';
import { Timer, Plus, Play, Pause, X, ChevronDown, ChevronUp, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RestTimer() {
  const { activeRestTimer, clearRestTimer, startRestTimer } = useApp();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize timer when context timer changes
  useEffect(() => {
    if (activeRestTimer && activeRestTimer > 0) {
      setTimeLeft(activeRestTimer);
      setTotalDuration(activeRestTimer);
      setIsRunning(true);
      setIsMinimized(false);
    }
  }, [activeRestTimer]);

  // Web Audio API beep sound when timer hits 0
  const playBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) {}
  };

  // Interval ticker
  useEffect(() => {
    if (!activeRestTimer || !isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRestTimer, isRunning, timeLeft]);

  if (!activeRestTimer || timeLeft < 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  // Presets
  const presets = [30, 60, 90, 120, 180];

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto transition-all">
      {isMinimized ? (
        // Minimized floating pill
        <div className="bg-slate-900/95 border-2 border-amber-400/80 rounded-2xl p-3 shadow-2xl flex items-center justify-between backdrop-blur-md animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Timer className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Temps de repos</div>
              <div className="text-lg font-black text-amber-400 font-mono">{formattedTime}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTimeLeft((t) => t + 30)}
              className="px-2.5 py-1 bg-slate-800 text-amber-300 rounded-lg text-xs font-bold border border-slate-700 hover:bg-slate-700"
            >
              +30s
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={clearRestTimer}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        // Expanded Timer Card
        <div className="bg-slate-900/95 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl backdrop-blur-lg animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
                <Timer className="w-5 h-5" />
              </span>
              <span className="font-bold text-sm text-slate-200 uppercase tracking-wide">
                Chronomètre de Repos
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                title="Réduire"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={clearRestTimer}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Time Display */}
          <div className="text-center my-3">
            <div
              className={cn(
                'text-5xl font-black font-mono tracking-tight transition-colors',
                timeLeft === 0 ? 'text-emerald-400 animate-bounce' : 'text-amber-400'
              )}
            >
              {timeLeft === 0 ? 'Prêt !' : formattedTime}
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Pause' : 'Reprendre'}</span>
            </button>
            <button
              onClick={() => setTimeLeft((t) => t + 30)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 font-bold text-sm border border-amber-400/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+30s</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-5 gap-1.5 mt-4 pt-3 border-t border-slate-800">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => startRestTimer(p)}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-semibold transition-all',
                  totalDuration === p
                    ? 'bg-amber-400 text-black font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                )}
              >
                {p}s
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
