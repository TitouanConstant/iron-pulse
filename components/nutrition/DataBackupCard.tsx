'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '@/lib/store/app-context';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Database, 
  Check, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';

export default function DataBackupCard() {
  const { exportDataJSON, importDataJSON, exportWorkoutsCSV } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownloadJSON = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ironpulse_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Sauvegarde JSON téléchargée avec succès !');
  };

  const handleDownloadCSV = () => {
    const csvStr = exportWorkoutsCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ironpulse_workouts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Export CSV des séances généré !');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          showSuccess('Données restaurées avec succès !');
        } else {
          alert('Le fichier JSON est invalide ou corrompu.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-white">Sauvegarde & Export des Données</h3>
          <p className="text-xs text-slate-400">Exportez vos historiques ou restaurez un backup</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-slide-up">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Export JSON */}
        <button
          type="button"
          onClick={handleDownloadJSON}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center gap-3 transition-all"
        >
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Exporter Backup JSON</div>
            <div className="text-[10px] text-slate-400">Profil, séances, Hyrox, poids</div>
          </div>
        </button>

        {/* Export CSV */}
        <button
          type="button"
          onClick={handleDownloadCSV}
          className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left flex items-center gap-3 transition-all"
        >
          <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-400">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Exporter Séances (CSV)</div>
            <div className="text-[10px] text-slate-400">Format Excel & Tableurs</div>
          </div>
        </button>
      </div>

      {/* Restore JSON Backup */}
      <div className="pt-2 border-t border-slate-800">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-2xl border border-dashed border-slate-700 hover:border-amber-400/60 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Restaurer une sauvegarde JSON locale</span>
        </button>
      </div>
    </div>
  );
}
