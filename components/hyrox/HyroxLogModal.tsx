'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { HyroxStationType } from '@/lib/types';
import { HYROX_STATIONS_DATA, parseTimeToSeconds } from '@/lib/calculations/hyrox';
import { X, Flame, Check, Timer } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultStation?: HyroxStationType;
}

export default function HyroxLogModal({ isOpen, onClose, defaultStation = 'SKIERG_1000M' }: Props) {
  const { addHyroxLog, profile } = useApp();
  const [stationType, setStationType] = useState<HyroxStationType>(defaultStation);
  const [minutes, setMinutes] = useState<string>('03');
  const [seconds, setSeconds] = useState<string>('45');
  const [weightKg, setWeightKg] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const stationInfo = HYROX_STATIONS_DATA.find((s) => s.id === stationType) || HYROX_STATIONS_DATA[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = parseInt(minutes, 10) || 0;
    const secVal = parseInt(seconds, 10) || 0;
    const totalSeconds = minVal * 60 + secVal;

    if (totalSeconds <= 0) {
      alert('Veuillez renseigner un chrono valide.');
      return;
    }

    setIsSubmitting(true);
    await addHyroxLog({
      logged_date: date,
      station_type: stationType,
      time_seconds: totalSeconds,
      weight_kg: weightKg ? parseFloat(weightKg) : undefined,
      reps: reps ? parseInt(reps, 10) : undefined,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Logger une Station Hyrox</h3>
              <p className="text-xs text-slate-400">Chrono, charge et ressenti</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Station Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Station / Épreuve
            </label>
            <select
              value={stationType}
              onChange={(e) => setStationType(e.target.value as HyroxStationType)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 px-3 text-sm font-bold text-white outline-none focus:border-amber-400"
            >
              <option value="RUN_1KM">🏃 Course 1 km (Bloc de fractionné)</option>
              {HYROX_STATIONS_DATA.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Time Input (MM : SS) with large touch pads */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Temps Réalisé (Minutes : Secondes) *
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="99"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="00"
                  className="w-full text-center text-3xl font-black font-mono text-white bg-slate-800/90 border-2 border-slate-700 focus:border-amber-400 rounded-2xl py-3 outline-none"
                  required
                />
                <span className="block text-[10px] text-center font-bold text-slate-400 mt-1 uppercase">
                  Minutes
                </span>
              </div>

              <span className="text-3xl font-black text-slate-500 font-mono -mt-4">:</span>

              <div className="flex-1 relative">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  placeholder="00"
                  className="w-full text-center text-3xl font-black font-mono text-amber-400 bg-slate-800/90 border-2 border-slate-700 focus:border-amber-400 rounded-2xl py-3 outline-none"
                  required
                />
                <span className="block text-[10px] text-center font-bold text-slate-400 mt-1 uppercase">
                  Secondes
                </span>
              </div>
            </div>
          </div>

          {/* Optional Weight & Reps */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Charge utilisée (kg)
              </label>
              <input
                type="number"
                step="0.5"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="Ex: 152"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Date de réalisation
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Notes / Rythme (ex: split 1:55/500m, sans pause...)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Rythme régulier, bonne relance"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-sm shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Enregistrer le chrono</span>
          </button>
        </form>
      </div>
    </div>
  );
}
