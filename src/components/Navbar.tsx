import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Languages,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sliders,
  AlertOctagon,
  FileDown,
  Activity,
  Maximize2,
  WifiOff
} from 'lucide-react';
import { AppSettings, ButtonSize, LanguageCode, SafetyStatus } from '../types';
import { translations } from '../i18n/translations';
import { getDynamicButtonClasses } from '../utils/buttonStyles';

interface NavbarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  safetyStatus: SafetyStatus;
  isOfflineAvailable: boolean;
  onTriggerWelfareCheck: () => void;
  onTriggerEmergencySOS: () => void;
  onOpenDownloadModal: () => void;
  onOpenOfflineModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDispatchLog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onUpdateSettings,
  safetyStatus,
  isOfflineAvailable,
  onTriggerWelfareCheck,
  onTriggerEmergencySOS,
  onOpenDownloadModal,
  onOpenOfflineModal,
  onOpenSettingsModal,
  onOpenDispatchLog
}) => {
  const t = translations[settings.language] || translations.en;
  const btnClasses = getDynamicButtonClasses(settings.buttonSize);

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 select-none shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Brand Logo & Title with Delhi Public School Crest */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-emerald-300 p-1 shadow-sm overflow-hidden shrink-0">
            <img src="/school-logo.png" alt="Delhi Public School" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg">
                DPS <span className="text-emerald-600">SafeDrive</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                Delhi Public School Fleet Guardian
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-[280px]">
              Student Transit Safety &bull; Driver Welfare &bull; Safe Havens
            </p>
          </div>
        </div>

        {/* Safety Status Pill */}
        <div className="flex items-center gap-2">
          {safetyStatus === 'safe' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{t.statusSafe}</span>
            </div>
          )}
          {safetyStatus === 'prompting' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-300 text-amber-800 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{t.statusPrompting}</span>
            </div>
          )}
          {safetyStatus === 'emergency_alert' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-rose-100 border border-rose-300 text-rose-800 rounded-full text-xs font-black">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.statusEmergency}</span>
            </div>
          )}
        </div>

        {/* Action Controls & Fast Toggles */}
        <div className="flex items-center space-x-2 flex-wrap">

          {/* Offline Map Manager Button */}
          <button
            onClick={onOpenOfflineModal}
            title="Offline Map & Tile Manager"
            className={`flex items-center ${btnClasses.navBtn} border rounded-lg transition ${
              isOfflineAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Offline Map</span>
            {isOfflineAvailable && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {/* Quick Welfare Check Trigger Button */}
          <button
            onClick={onTriggerWelfareCheck}
            title={t.triggerDemoPromptNow}
            className={`flex items-center ${btnClasses.navBtn} bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">{t.triggerDemoPromptNow}</span>
            <span className="lg:hidden">Test Check</span>
          </button>

          {/* Download Route Button */}
          <button
            onClick={onOpenDownloadModal}
            className={`flex items-center ${btnClasses.navBtn} bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.downloadRoute}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ language: e.target.value as LanguageCode })}
              className={`bg-white border border-slate-200 hover:border-slate-300 text-slate-800 ${btnClasses.navBtn} rounded-lg pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none font-medium`}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
            <Languages className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* Variable Button Size Segmented Selector (Standard / Large / Glove) */}
          <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
            {(['standard', 'large', 'glove'] as ButtonSize[]).map((sizeKey) => {
              const active = settings.buttonSize === sizeKey;
              return (
                <button
                  key={sizeKey}
                  onClick={() => onUpdateSettings({ buttonSize: sizeKey })}
                  title={`Switch button size to ${sizeKey.toUpperCase()}`}
                  className={`px-2 py-1 text-[11px] font-bold rounded-md transition uppercase tracking-wider ${
                    active
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sizeKey === 'glove' ? '🧤 Glove' : sizeKey}
                </button>
              );
            })}
          </div>

          {/* Master Voice & Sound Mute Toggle */}
          <button
            onClick={() => {
              const nextState = !(settings.voiceEnabled || settings.soundAlerts);
              onUpdateSettings({ voiceEnabled: nextState, soundAlerts: nextState });
            }}
            title={settings.voiceEnabled || settings.soundAlerts ? "Voice & Sound Active - Click to Mute" : "Muted (Silent Mode) - Click to Enable Voices"}
            className={`flex items-center ${btnClasses.navBtn} border rounded-lg transition font-bold ${
              settings.voiceEnabled || settings.soundAlerts
                ? "bg-emerald-100 text-emerald-900 border-emerald-400 shadow-sm"
                : "bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200"
            }`}
          >
            {settings.voiceEnabled || settings.soundAlerts ? (
              <>
                <Volume2 className={btnClasses.navIconSize} />
                <span className="hidden md:inline">Voice: ON</span>
              </>
            ) : (
              <>
                <VolumeX className={btnClasses.navIconSize} />
                <span className="hidden md:inline text-rose-600">Voice: Muted</span>
              </>
            )}
          </button>

          {/* Speech-to-Text (STT) Toggle */}
          <button
            onClick={() => onUpdateSettings({ sttEnabled: !settings.sttEnabled })}
            title={settings.sttEnabled ? "STT Voice Recognition Active" : "STT Muted"}
            className={`p-1.5 rounded-lg border text-xs transition ${
              settings.sttEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {settings.sttEnabled ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Dispatch Log */}
          <button
            onClick={onOpenDispatchLog}
            title="Dispatch Welfare Audit Log"
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs transition"
          >
            <Activity className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettingsModal}
            title={t.settings}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs transition"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Emergency SOS Panic Button */}
          <button
            onClick={onTriggerEmergencySOS}
            title="EMERGENCY SOS"
            className={`flex items-center ${btnClasses.navBtn} bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black transition`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span className="tracking-wider">SOS</span>
          </button>
        </div>

      </div>
    </header>
  );
};
