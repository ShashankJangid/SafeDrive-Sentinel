import React from 'react';
import {
  X,
  Sliders,
  Clock,
  Maximize2,
  Volume2,
  Mic,
  Shield,
  User,
  Truck,
  PhoneCall
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.settings}
              </h3>
              <p className="text-xs text-slate-500">
                Configure safety intervals, ergonomics, voice &amp; speech parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Safety Check Interval Slider & Presets */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{t.safetyCheckInterval}</span>
              </div>
              <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-mono text-xs font-bold">
                {settings.safetyIntervalSeconds >= 60
                  ? `${Math.round(settings.safetyIntervalSeconds / 60)} min (${settings.safetyIntervalSeconds}s)`
                  : `${settings.safetyIntervalSeconds} sec`}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              The duration after which the app prompts the driver asking if they are okay or safe.
            </p>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { label: '15s Demo', val: 15 },
                { label: '30s Demo', val: 30 },
                { label: '15 Min', val: 900 },
                { label: '30 Min', val: 1800 }
              ].map(preset => (
                <button
                  key={preset.val}
                  onClick={() => onUpdateSettings({ safetyIntervalSeconds: preset.val })}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition border ${
                    settings.safetyIntervalSeconds === preset.val
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variable Button Size Ergonomics */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Maximize2 className="w-4 h-4 text-emerald-600" />
              <span>{t.buttonSize}</span>
            </div>
            
            <p className="text-xs text-slate-500">
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
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Voice & Speech Recognition Settings */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Audio &amp; Voice Assistance</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-slate-800">{t.voiceAssistance}</div>
                  <div className="text-[11px] text-slate-500">Spoken prompt audio when safety check interval triggers</div>
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
                  <div className="text-xs font-bold text-slate-800">{t.speechToTextSTT}</div>
                  <div className="text-[11px] text-slate-500">Hands-free speech answering: Speak "Yes" or "No"</div>
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
                  <div className="text-xs font-bold text-slate-800">{t.soundAlerts}</div>
                  <div className="text-[11px] text-slate-500">Emergency sirens and confirmation chimes</div>
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
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Driver &amp; Dispatch Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Driver Name</label>
                <input
                  type="text"
                  value={settings.driverName}
                  onChange={(e) => onUpdateSettings({ driverName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Vehicle Plate ID</label>
                <input
                  type="text"
                  value={settings.vehicleId}
                  onChange={(e) => onUpdateSettings({ vehicleId: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">Dispatch Emergency Contact</label>
                <input
                  type="text"
                  value={settings.emergencyContact}
                  onChange={(e) => onUpdateSettings({ emergencyContact: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Save &amp; Apply
          </button>
        </div>

      </div>
    </div>
  );
};
