import React from 'react';
import {
  X,
  Sliders,
  Clock,
  Maximize2,
  Volume2,
  Mic,
  Shield,
  Zap,
  Moon
} from 'lucide-react';
import { AppSettings, ButtonSize, LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const t = translations[settings.language] || translations.en;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.settings}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure safety intervals, battery saver, night mode &amp; speech parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200">
          
          {/* Battery Saver Mode Toggle */}
          <div className="bg-amber-50/80 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-center justify-between">
            <div className="pr-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{t.batterySaver || 'Battery Saver'}</span>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                Extends device battery life on long transit shifts. Slows GPS animation interval and disables heavy UI radar pings.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ batterySaver: !settings.batterySaver })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                settings.batterySaver ? 'bg-amber-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Night Driving Mode Toggle */}
          <div className="bg-indigo-50/80 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 flex items-center justify-between">
            <div className="pr-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>{t.nightMode || 'Night Driving Mode'}</span>
              </div>
              <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 mt-1">
                Deep dark mode theme designed to protect driver night vision and reduce windshield glare during late-night routes.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ nightMode: !settings.nightMode })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                settings.nightMode ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Driver Welfare Prompt Interval */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{t.safetyCheckInterval}</span>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                {settings.safetyIntervalSeconds >= 60
                  ? `${Math.round(settings.safetyIntervalSeconds / 60)} minutes`
                  : `${settings.safetyIntervalSeconds} seconds`}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Frequency of periodic welfare heartbeat confirmation dialogs.
            </p>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { label: '30s (Demo)', val: 30 },
                { label: '5 min', val: 300 },
                { label: '15 min', val: 900 },
                { label: '30 min (Default)', val: 1800 }
              ].map(preset => (
                <button
                  key={preset.val}
                  onClick={() => onUpdateSettings({ safetyIntervalSeconds: preset.val })}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition ${
                    settings.safetyIntervalSeconds === preset.val
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variable Button Size Ergonomics */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Maximize2 className="w-4 h-4 text-emerald-600" />
              <span>{t.buttonSize}</span>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adapt touch targets for vehicle dashboard mounts or heavy commercial work gloves.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'standard' as ButtonSize, label: 'Standard', desc: 'Compact tablet/phone' },
                { key: 'large' as ButtonSize, label: 'Large', desc: 'In-cab dashboard mount' },
                { key: 'glove' as ButtonSize, label: 'Glove Mode', desc: 'Giant high-vibration targets' }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => onUpdateSettings({ buttonSize: opt.key })}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    settings.buttonSize === opt.key
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice & Speech Recognition Settings */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Audio &amp; Voice Assistance</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.voiceAssistance}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Spoken prompt audio when safety check interval triggers</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => onUpdateSettings({ voiceEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.speechToTextSTT}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Hands-free speech answering: Speak "Yes", "No", "Divert", "Police"</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.sttEnabled}
                  onChange={(e) => onUpdateSettings({ sttEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.soundAlerts}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Emergency sirens and confirmation chimes</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => onUpdateSettings({ soundAlerts: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Fleet & Driver Information */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Driver &amp; Dispatch Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Driver Name</label>
                <input
                  type="text"
                  value={settings.driverName}
                  onChange={(e) => onUpdateSettings({ driverName: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Vehicle Plate ID</label>
                <input
                  type="text"
                  value={settings.vehicleId}
                  onChange={(e) => onUpdateSettings({ vehicleId: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Dispatch Emergency Contact</label>
                <input
                  type="text"
                  value={settings.emergencyContact}
                  onChange={(e) => onUpdateSettings({ emergencyContact: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
