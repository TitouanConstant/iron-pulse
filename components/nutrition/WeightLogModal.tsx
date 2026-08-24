'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { X, Scale, Check, Calendar } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeightLogModal({ isOpen, onClose }: Props) {
  const { profile, addWeightLog } = useApp();
  const [weight, setWeight] = useState<string>(profile.current_weight_kg ? profile.current_weight_kg.toString() : '82.0');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight.replace(',', '.'));
    if (isNaN(weightNum) || weightNum <= 30 || weightNum >= 300) {
      alert('Veuillez entrer un poids valide en kg.');
      return;
    }

    setIsSubmitting(true);
    const fatNum = bodyFat ? parseFloat(bodyFat.replace(',', '.')) : undefined;
    await addWeightLog(weightNum, fatNum, notes, date);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pesée & Composition</h3>
              <p className="text-xs text-slate-400">Enregistrer votre poids du jour</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Main Weight Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Poids Corporel (kg) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 82.5"
                className="w-full text-3xl font-black text-white bg-slate-800/90 border-2 border-slate-700 focus:border-cyan-400 rounded-2xl py-3 px-4 outline-none transition-colors"
                required
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                kg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Body Fat % */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Masse Grasse % (optionnel)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="Ex: 14.5"
                className="w-full text-base font-bold text-white bg-slate-800/80 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 outline-none"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Date de pesée
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-bold text-white bg-slate-800/80 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Remarques / Conditions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pesée à jeun après 8h de sommeil"
              className="w-full text-xs text-white bg-slate-800/80 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 px-3 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Check className="w-4 h-4" />
            <span>Valider la pesée</span>
          </button>
        </form>
      </div>
    </div>
  );
}
