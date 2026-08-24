'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import AthleteCard from '@/components/rivals/AthleteCard';
import HyroxDuelCard from '@/components/rivals/HyroxDuelCard';
import StrengthDuelCard from '@/components/rivals/StrengthDuelCard';
import AddRivalModal from '@/components/rivals/AddRivalModal';
import { 
  Swords, 
  UserPlus, 
  Trophy, 
  Dumbbell, 
  Flame, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Users 
} from 'lucide-react';
import { cn } from '@/lib/utils';

function RivalsContent() {
  const searchParams = useSearchParams();
  const { 
    profile, 
    rivals, 
    removeRival, 
    athleteCode, 
    addRivalByCode, 
    getHyroxPersonalRecord, 
    getUserEstimatedHyroxTime, 
    getUserStrength1RM, 
    getUserWeeklyTonnage 
  } = useApp();

  const [selectedRivalId, setSelectedRivalId] = useState<string>(rivals[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDuelTab, setActiveDuelTab] = useState<'hyrox' | 'strength'>('hyrox');
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto handle ?add=CODE param in URL
  useEffect(() => {
    const codeFromUrl = searchParams.get('add');
    if (codeFromUrl) {
      addRivalByCode(codeFromUrl).then((res) => {
        if (res.rival) {
          setSelectedRivalId(res.rival.id);
        }
      });
    }
  }, [searchParams, addRivalByCode]);

  const selectedRival = rivals.find((r) => r.id === selectedRivalId) || rivals[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(athleteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/rivals?add=${athleteCode}` : '';
    if (navigator.share) {
      navigator.share({
        title: 'Défie-moi sur IronPulse !',
        text: `Ajoute mon Code Ami ${athleteCode} pour comparer nos perfs Hyrox et nos 1RM !`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <>
      <div className="space-y-4 pb-12 animate-slide-up">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>Face-à-Face & Compétition</span>
            </span>
            <h1 className="text-xl font-black text-white">Défis & Rivaux</h1>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" />
            <span>Ajouter Ami</span>
          </button>
        </div>

        {/* Shareable Athlete Code Banner */}
        <div className="glass-card rounded-3xl p-4 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Votre Code Ami Athlète
              </span>
              <span className="font-mono text-base font-black text-white tracking-wider">
                {athleteCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
            </button>
            <button
              onClick={handleShareLink}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Partager le lien"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rival Selector Carousel */}
        {rivals.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-400">Vos Partenaires d&apos;Entraînement ({rivals.length})</span>
              <span className="text-[10px] text-amber-400 font-medium">Sélectionnez pour comparer</span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {rivals.map((rival) => {
                const isSelected = rival.id === selectedRival?.id;
                return (
                  <button
                    key={rival.id}
                    onClick={() => setSelectedRivalId(rival.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border transition-all shrink-0 text-left',
                      isSelected
                        ? 'bg-slate-900 border-amber-400 text-white shadow-lg shadow-amber-400/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center',
                        isSelected
                          ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-black'
                          : 'bg-slate-800 text-slate-300'
                      )}
                    >
                      {rival.full_name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold block leading-tight text-white">
                        {rival.full_name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{rival.athlete_code}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6 text-center border border-dashed border-slate-800 space-y-3">
            <Users className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">Aucun rival connecté pour l&apos;instant</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Ajoutez le code ami d&apos;un ami ou essayez un sparring-partner pour lancer un duel de perfs.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 text-black font-black text-xs inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Ajouter un Rival</span>
            </button>
          </div>
        )}

        {/* Selected Rival Comparison View */}
        {selectedRival && (
          <div className="space-y-4 animate-fade-in">
            {/* Active Rival Card */}
            <AthleteCard
              athlete={selectedRival}
              onRemove={() => removeRival(selectedRival.id)}
            />

            {/* Duel Mode Tabs */}
            <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveDuelTab('hyrox')}
                className={cn(
                  'flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all',
                  activeDuelTab === 'hyrox'
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Duel Hyrox 2027</span>
              </button>

              <button
                onClick={() => setActiveDuelTab('strength')}
                className={cn(
                  'flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all',
                  activeDuelTab === 'strength'
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Duel Force & 1RM</span>
              </button>
            </div>

            {/* Duel Content */}
            {activeDuelTab === 'hyrox' ? (
              <HyroxDuelCard
                userProfile={profile}
                rival={selectedRival}
                getUserPR={getHyroxPersonalRecord}
                userEstimatedTime={getUserEstimatedHyroxTime()}
              />
            ) : (
              <StrengthDuelCard
                userProfile={profile}
                rival={selectedRival}
                userStrength1RM={getUserStrength1RM()}
                userWeeklyTonnage={getUserWeeklyTonnage()}
              />
            )}
          </div>
        )}
      </div>

      <AddRivalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}

export default function RivalsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Chargement des rivaux...</div>}>
      <RivalsContent />
    </Suspense>
  );
}
