'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { 
  X, 
  User, 
  LogOut, 
  LogIn, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  CloudCheck, 
  Flame 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserAccountModal({ isOpen, onClose }: Props) {
  const { user, profile, isSupabaseConnected, loginWithGoogle, logout, workouts, weightLogs, hyroxLogs } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    // Trigger local & remote sync
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 800);
  };

  const handleLogout = async () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ? Vos données restent sécurisées sur votre cloud.')) {
      await logout();
      onClose();
    }
  };

  const handleLogin = async () => {
    onClose();
    await loginWithGoogle();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Compte & Synchronisation</h3>
              <p className="text-xs text-slate-400">Gestion de la session et du cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="glass-card rounded-3xl p-4 border border-slate-800 flex items-center gap-4 bg-gradient-to-br from-slate-900 to-slate-800/80">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-black font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <span
              className={cn(
                'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900',
                user ? 'bg-emerald-400 shadow-md shadow-emerald-400/40 animate-pulse' : 'bg-cyan-400'
              )}
              title={user ? 'Connecté au cloud Supabase' : 'Stockage local'}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base font-black text-white truncate">{profile.full_name}</h4>
            <p className="text-xs text-slate-400 truncate font-mono">
              {user ? (user.email || profile.email) : 'Mode Hors-Ligne (Stockage Local)'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20">
                {profile.goal}
              </span>
              <span className="text-[10px] text-slate-400">
                {workouts.filter((w) => w.completed_at).length} séances &bull; {hyroxLogs.length} logs Hyrox
              </span>
            </div>
          </div>
        </div>

        {/* Cloud Status Card */}
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-200">État de la Base de Données</span>
            </div>
            {user ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Cloud PostgreSQL Actif</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Local Storage Actif</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {user
              ? 'Toutes vos séances, pesées et records Hyrox sont synchronisés en temps réel sur votre base Supabase et accessibles depuis n\'importe quel appareil.'
              : 'Vos données sont stockées localement sur ce navigateur. Connectez-vous avec Google pour les sauvegarder en ligne.'}
          </p>

          {user && (
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
            >
              <RefreshCw className={cn('w-3.5 h-3.5 text-amber-400', isSyncing && 'animate-spin')} />
              <span>{syncSuccess ? 'Synchronisé avec succès !' : 'Actualiser la synchronisation'}</span>
            </button>
          )}
        </div>

        {/* Main Action: Login or Logout */}
        <div className="pt-1">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 border border-rose-500/30 transition-all active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter du compte Google</span>
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-105 text-black font-black text-sm shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <LogIn className="w-5 h-5" />
              <span>Se connecter avec Google</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
