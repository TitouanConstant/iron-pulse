'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { SplitType } from '@/lib/types';
import { PRESET_WORKOUT_TEMPLATES } from '@/lib/data/workout-templates';
import { 
  X, 
  Dumbbell, 
  Flame, 
  ArrowUpRight, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  BookmarkCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SPLIT_OPTIONS: { id: SplitType; title: string; subtitle: string; icon: any; color: string }[] = [
  {
    id: 'push',
    title: 'Push (Pectoraux / Épaules / Triceps)',
    subtitle: 'Créer une séance libre Push',
    icon: Dumbbell,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/40',
  },
  {
    id: 'pull',
    title: 'Pull (Dos / Biceps / Arrière d\'épaules)',
    subtitle: 'Créer une séance libre Pull',
    icon: Layers,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40',
  },
  {
    id: 'legs',
    title: 'Legs Day (Cuisses & Mollets)',
    subtitle: 'Créer une séance libre Jambes',
    icon: Flame,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/40',
  },
  {
    id: 'upper',
    title: 'Upper Body (Haut du corps)',
    subtitle: 'Pectoraux, dos et bras condensés',
    icon: Sparkles,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/40',
  },
  {
    id: 'lower',
    title: 'Lower Body & Core',
    subtitle: 'Bas du corps + Sangle abdominale',
    icon: ShieldCheck,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40',
  },
  {
    id: 'hyrox_strength',
    title: 'Hyrox Force Spécifique',
    subtitle: 'Kettlebells, Traîneau, Fentes, Burpees',
    icon: Flame,
    color: 'from-amber-400/30 to-amber-600/30 text-amber-300 border-amber-400/60',
  },
];

export default function StartWorkoutModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { startWorkout, startWorkoutFromTemplate, activeWorkout } = useApp();
  const [activeTab, setActiveTab] = useState<'templates' | 'splits'>('templates');

  if (!isOpen) return null;

  const handleSelectTemplate = (templateId: string) => {
    if (activeWorkout) {
      if (confirm('Une séance est déjà en cours. Voulez-vous la remplacer par ce template ?')) {
        startWorkoutFromTemplate(templateId);
        onClose();
        router.push('/workouts/active');
      }
    } else {
      startWorkoutFromTemplate(templateId);
      onClose();
      router.push('/workouts/active');
    }
  };

  const handleSelectSplit = (splitId: SplitType, defaultTitle: string) => {
    if (activeWorkout) {
      if (confirm('Une séance est déjà en cours. Voulez-vous la remplacer ?')) {
        startWorkout(splitId, defaultTitle);
        onClose();
        router.push('/workouts/active');
      }
    } else {
      startWorkout(splitId, defaultTitle);
      onClose();
      router.push('/workouts/active');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-base font-black text-white">Démarrer une Séance</h3>
            <p className="text-xs text-slate-400">Templates pré-remplis ou séance libre</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs switcher: Templates vs Splits */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl my-3 border border-slate-700/60 shrink-0">
          <button
            onClick={() => setActiveTab('templates')}
            className={cn(
              'flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
              activeTab === 'templates'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Programmes Pré-remplis ({PRESET_WORKOUT_TEMPLATES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('splits')}
            className={cn(
              'flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5',
              activeTab === 'splits'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Zap className="w-4 h-4" />
            <span>Séance Libre</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {activeTab === 'templates' ? (
            PRESET_WORKOUT_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl.id)}
                className={cn(
                  'w-full flex flex-col p-4 rounded-2xl border transition-all text-left bg-gradient-to-r hover:scale-[1.01] active:scale-[0.99] space-y-2',
                  tpl.color
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{tpl.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span className="font-semibold">{tpl.exerciseIds.length} exercices pré-chargés</span>
                  <span className="text-white font-black flex items-center gap-1">
                    Lancer &bull; 3 séries/exo <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            ))
          ) : (
            SPLIT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectSplit(opt.id, opt.title)}
                  className={cn(
                    'w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left bg-gradient-to-r hover:scale-[1.01] active:scale-[0.99]',
                    opt.color
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">{opt.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{opt.subtitle}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
