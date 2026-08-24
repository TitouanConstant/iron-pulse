'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import BMRCalculatorCard from '@/components/nutrition/BMRCalculatorCard';
import MacroGoalCard from '@/components/nutrition/MacroGoalCard';
import WeightTrackerCard from '@/components/nutrition/WeightTrackerCard';
import DataBackupCard from '@/components/nutrition/DataBackupCard';
import UserAccountModal from '@/components/navigation/UserAccountModal';
import { 
  User, 
  UtensilsCrossed, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  Check, 
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NutritionPage() {
  const { profile, updateProfile, user, isSupabaseConnected, loginWithGoogle, logout } = useApp();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.full_name);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateProfile({ full_name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <>
      <div className="space-y-4 pb-12 animate-slide-up">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Métabolisme & Nutrition
            </span>
            <h1 className="text-xl font-black text-white">Profil & Objectifs</h1>
          </div>

          <button
            onClick={() => setIsAccountModalOpen(true)}
            className={cn(
              'px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 border transition-all active:scale-95 shadow-sm',
              user
                ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-300'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black border-transparent shadow-amber-400/20'
            )}
          >
            {user ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Connecté</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Se Connecter</span>
              </>
            )}
          </button>
        </div>

        {/* Athlete Profile Card */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 flex items-center justify-between bg-gradient-to-br from-slate-900 to-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900',
                  user ? 'bg-emerald-400' : 'bg-cyan-400'
                )}
              />
            </div>

            <div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-white outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-black text-white">{profile.full_name}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-slate-200"
                    title="Modifier le nom"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.age} ans &bull; {profile.height_cm} cm &bull; {profile.current_weight_kg || 80} kg
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Objectif</span>
            <span className="text-xs font-black text-slate-200 capitalize">{profile.goal}</span>
          </div>
        </div>

        {/* BMR & TDEE Calculator Module */}
        <BMRCalculatorCard />

        {/* Macronutrients & Goal Strategy */}
        <MacroGoalCard />

        {/* Weight Log & Trend Curve */}
        <WeightTrackerCard />

        {/* Data Backup & Export */}
        <DataBackupCard />
      </div>

      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}
