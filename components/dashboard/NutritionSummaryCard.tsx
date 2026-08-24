'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import { UtensilsCrossed, ArrowRight, Activity, Flame, Shield } from 'lucide-react';
import { GOAL_LABELS } from '@/lib/calculations/bmr';

export default function NutritionSummaryCard() {
  const { profile } = useApp();

  const goalInfo = GOAL_LABELS[profile.goal] || GOAL_LABELS.recomp;

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Métabolisme & Cible</h4>
            <p className="text-[11px] text-slate-400">
              {profile.current_weight_kg ? `${profile.current_weight_kg} kg` : '80 kg'} &bull; Objectif {goalInfo.title}
            </p>
          </div>
        </div>

        <Link
          href="/nutrition"
          className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
        >
          <span>Ajuster</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Target Calories Display */}
      <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 font-medium">Budget Calorique Journalier</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            {profile.target_calories} <span className="text-xs font-bold text-amber-400">kcal / jour</span>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            {goalInfo.title}
          </span>
        </div>
      </div>

      {/* Macros distribution pills */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
          <div className="text-[10px] font-bold text-rose-400 uppercase">Protéines</div>
          <div className="text-base font-black text-white font-mono">{profile.target_protein_g ?? 160}g</div>
          <div className="text-[10px] text-slate-400">
            {profile.current_weight_kg && profile.target_protein_g ? `${(profile.target_protein_g / profile.current_weight_kg).toFixed(1)}g/kg` : '2.1g/kg'}
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
          <div className="text-[10px] font-bold text-amber-400 uppercase">Glucides</div>
          <div className="text-base font-black text-white font-mono">{profile.target_carbs_g ?? 260}g</div>
          <div className="text-[10px] text-slate-400">Énergie & Glycogène</div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800 text-center">
          <div className="text-[10px] font-bold text-cyan-400 uppercase">Lipides</div>
          <div className="text-base font-black text-white font-mono">{profile.target_fat_g}g</div>
          <div className="text-[10px] text-slate-400">Hormones & Santé</div>
        </div>
      </div>
    </div>
  );
}
