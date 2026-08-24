'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { X, UserPlus, Sparkles, Check, Copy, Share2, Flame, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRivalModal({ isOpen, onClose }: Props) {
  const { athleteCode, addRivalByCode } = useApp();
  const [codeInput, setCodeInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCopyMyCode = () => {
    navigator.clipboard.writeText(athleteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/rivals?add=${athleteCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Défie-moi sur IronPulse Hyrox & Musculation !',
        text: `Ajoute mon Code Ami ${athleteCode} pour comparer nos perfs Hyrox et nos 1RM !`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setIsSubmitting(true);
    setStatusMsg(null);

    const res = await addRivalByCode(codeInput);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMsg({ text: res.message, isError: false });
      setTimeout(() => {
        setCodeInput('');
        onClose();
      }, 1200);
    } else {
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Ajouter un Partenaire</h3>
              <p className="text-xs text-slate-400">Défiez vos amis sur Hyrox & Musculation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* My Shareable Code Box */}
        <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Votre Code Ami Unique
            </span>
            <span className="text-[10px] text-slate-400">Partagez-le à vos amis</span>
          </div>

          <div className="flex items-center justify-between bg-black/50 border border-slate-700/80 rounded-xl px-3.5 py-2.5">
            <span className="font-mono text-lg font-black tracking-widest text-amber-300">
              {athleteCode}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyMyCode}
                className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
              <button
                type="button"
                onClick={handleShareLink}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Partager le lien de défi"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Form to enter a rival code */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Entrer le Code Ami d&apos;un Athlète
            </label>
            <input
              type="text"
              placeholder="Ex: HYROX-ALEX, IRON-LUCAS..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 text-white font-mono text-base tracking-wider placeholder:text-slate-500 placeholder:font-sans placeholder:text-xs outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all uppercase"
              autoFocus
            />
          </div>

          {/* Quick preset chips to test */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5">
              💡 Ou essayez un sparring-partner de démo :
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'HYROX-ALEX', label: 'Alexandre (Hyrox Pro)' },
                { code: 'IRON-LUCAS', label: 'Lucas (Powerbuilder)' },
                { code: 'HYROX-SARAH', label: 'Sarah (Doubles)' },
              ].map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setCodeInput(p.code)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[11px] text-slate-300 font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {statusMsg && (
            <div
              className={cn(
                'p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-slide-up',
                statusMsg.isError
                  ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              )}
            >
              {statusMsg.isError ? <ShieldAlert className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0 text-emerald-400" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!codeInput.trim() || isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-105 disabled:opacity-50 text-black font-black text-sm shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Connexion en cours...' : 'Ajouter le Rival & Lancer le Duel'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
