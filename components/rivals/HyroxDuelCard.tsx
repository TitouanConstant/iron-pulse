'use client';

import React from 'react';
import { RivalAthlete, UserProfile, HyroxStationType } from '@/lib/types';
import { HYROX_STATIONS_DATA, formatSecondsToTime } from '@/lib/calculations/hyrox';
import { Trophy, Crown, Flame, Footprints, Zap, ArrowRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  userProfile: UserProfile;
  rival: RivalAthlete;
  getUserPR: (station: HyroxStationType) => { time_seconds: number } | null;
  userEstimatedTime: number;
}

export default function HyroxDuelCard({
  userProfile,
  rival,
  getUserPR,
  userEstimatedTime,
}: Props) {
  const rivalEstimatedTime = rival.stats.estimated_hyrox_time_seconds;
  const isUserLeadingGlobal = userEstimatedTime <= rivalEstimatedTime;
  const globalDeltaSeconds = Math.abs(userEstimatedTime - rivalEstimatedTime);

  // Stations to compare (RUN_1KM + 8 Official stations)
  const stationsToCompare: Array<{ id: HyroxStationType; name: string; icon: string }> = [
    { id: 'RUN_1KM', name: 'Course 1 000 m (Pace)', icon: '🏃' },
    ...HYROX_STATIONS_DATA.map((s) => ({ id: s.id, name: s.name, icon: '⚡' })),
  ];

  let userWinsCount = 0;
  let rivalWinsCount = 0;

  stationsToCompare.forEach((st) => {
    const userTime = getUserPR(st.id)?.time_seconds || 240;
    const rivalTime = rival.stats.hyrox_prs[st.id] || 240;
    if (userTime < rivalTime) userWinsCount++;
    else if (rivalTime < userTime) rivalWinsCount++;
  });

  return (
    <div className="space-y-4">
      {/* Global Duel Leaderboard Card */}
      <div className="glass-card rounded-3xl p-5 border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Chrono Global Estimé Hyrox 2027</span>
          </span>
          <span className="text-xs font-bold text-slate-300">
            Score : <strong className="text-amber-400">{userWinsCount}</strong> - <strong className="text-cyan-400">{rivalWinsCount}</strong>
          </span>
        </div>

        {/* Head to Head Times */}
        <div className="grid grid-cols-2 gap-3 relative">
          {/* User Side */}
          <div
            className={cn(
              'rounded-2xl p-4 border relative text-center',
              isUserLeadingGlobal
                ? 'bg-amber-500/10 border-amber-400/60 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 border-slate-800'
            )}
          >
            {isUserLeadingGlobal && (
              <Crown className="w-5 h-5 text-amber-400 absolute -top-2.5 left-1/2 -translate-x-1/2 drop-shadow-md animate-bounce" />
            )}
            <span className="text-[11px] font-bold text-slate-400 block truncate">
              {userProfile.full_name.split(' ')[0]} (Vous)
            </span>
            <span className="text-xl font-black text-amber-300 tracking-tight block mt-1">
              {formatSecondsToTime(userEstimatedTime)}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {isUserLeadingGlobal ? `👑 En avance de ${formatSecondsToTime(globalDeltaSeconds)}` : 'Rattrapage'}
            </span>
          </div>

          {/* Rival Side */}
          <div
            className={cn(
              'rounded-2xl p-4 border relative text-center',
              !isUserLeadingGlobal
                ? 'bg-cyan-500/10 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800'
            )}
          >
            {!isUserLeadingGlobal && (
              <Crown className="w-5 h-5 text-cyan-400 absolute -top-2.5 left-1/2 -translate-x-1/2 drop-shadow-md animate-bounce" />
            )}
            <span className="text-[11px] font-bold text-slate-400 block truncate">
              {rival.full_name.split(' ')[0]}
            </span>
            <span className="text-xl font-black text-cyan-300 tracking-tight block mt-1">
              {formatSecondsToTime(rivalEstimatedTime)}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {!isUserLeadingGlobal ? `👑 En avance de ${formatSecondsToTime(globalDeltaSeconds)}` : 'Challenger'}
            </span>
          </div>
        </div>
      </div>

      {/* Station by Station Comparison */}
      <div className="glass-card rounded-3xl p-4 border border-slate-800 bg-slate-900/80 space-y-3">
        <h4 className="text-xs font-black text-white uppercase tracking-wider px-1">
          Détail Station par Station
        </h4>

        <div className="space-y-2.5">
          {stationsToCompare.map((st) => {
            const userPR = getUserPR(st.id)?.time_seconds || 240;
            const rivalPR = rival.stats.hyrox_prs[st.id] || 240;
            const isUserFaster = userPR < rivalPR;
            const isTie = userPR === rivalPR;
            const diffSeconds = Math.abs(userPR - rivalPR);

            // Progress percentage relative to 6 minutes (360s)
            const userPercent = Math.min(100, (userPR / 360) * 100);
            const rivalPercent = Math.min(100, (rivalPR / 360) * 100);

            return (
              <div
                key={st.id}
                className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{st.icon}</span>
                    <span className="text-xs font-bold text-white">{st.name}</span>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1',
                      isTie
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : isUserFaster
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                        : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'
                    )}
                  >
                    {isTie ? (
                      'Égalité'
                    ) : (
                      <>
                        <Crown className="w-3 h-3" />
                        <span>
                          {isUserFaster ? userProfile.full_name.split(' ')[0] : rival.full_name.split(' ')[0]} -{diffSeconds}s
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {/* Split Times Bar */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* User Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Vous</span>
                      <span className={cn('font-black font-mono', isUserFaster ? 'text-amber-300' : 'text-slate-300')}>
                        {formatSecondsToTime(userPR)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', isUserFaster ? 'bg-amber-400' : 'bg-slate-500')}
                        style={{ width: `${Math.max(15, 100 - userPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Rival Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{rival.full_name.split(' ')[0]}</span>
                      <span className={cn('font-black font-mono', !isUserFaster && !isTie ? 'text-cyan-300' : 'text-slate-300')}>
                        {formatSecondsToTime(rivalPR)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', !isUserFaster && !isTie ? 'bg-cyan-400' : 'bg-slate-500')}
                        style={{ width: `${Math.max(15, 100 - rivalPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
