import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Navigation,
  PhoneCall,
  MapPin,
  CheckCircle,
  Volume2,
  VolumeX,
  ExternalLink,
  Car
} from 'lucide-react';
import { PoliceStation, AppSettings } from '../types';
import { translations } from '../i18n/translations';
import { voiceService } from '../services/voiceService';
import { soundAlertService } from '../services/audioAlertService';

interface EmergencyModalProps {
  isOpen: boolean;
  station: PoliceStation | null;
  settings: AppSettings;
  onConfirmRerouteToPolice: (station: PoliceStation) => void;
  onDismissEmergency: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  station,
  settings,
  onConfirmRerouteToPolice,
  onDismissEmergency
}) => {
  const t = translations[settings.language] || translations.en;
  const [sirenActive, setSirenActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      soundAlertService.stopEmergencySiren();
      return;
    }

    // Play siren sound if enabled
    if (settings.soundAlerts) {
      soundAlertService.playEmergencySiren();
      setSirenActive(true);
    }

    // Voice alert
    if (settings.voiceEnabled) {
      voiceService.speak(t.spokenEmergencyTriggered, settings.language, settings.voiceSpeed);
    }

    return () => {
      soundAlertService.stopEmergencySiren();
    };
  }, [isOpen, settings.language]);

  const toggleSiren = () => {
    if (sirenActive) {
      soundAlertService.stopEmergencySiren();
      setSirenActive(false);
    } else {
      soundAlertService.playEmergencySiren();
      setSirenActive(true);
    }
  };

  if (!isOpen || !station) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-rose-300 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Urgent Header */}
        <div className="bg-rose-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest bg-rose-800/60 px-2 py-0.5 rounded text-white">
                SOS Emergency Protocol
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {t.emergencyAlertTitle}
              </h2>
            </div>
          </div>

          {/* Siren Mute Toggle */}
          <button
            onClick={toggleSiren}
            title={sirenActive ? "Mute Siren" : "Play Siren"}
            className="p-2.5 bg-rose-700 hover:bg-rose-800 rounded-xl text-white border border-rose-400/40 transition"
          >
            {sirenActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-200" />}
          </button>
        </div>

        {/* Warning Banner */}
        <div className="px-5 py-3 bg-rose-50 border-b border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold">
          {t.emergencyActiveWarning}
        </div>

        {/* Police Station Safe Haven Card */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-slate-50 border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t.safeHavenTitle}</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {station.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {station.jurisdiction}
                </p>
              </div>

              {/* ETA / Distance Pill */}
              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                  {station.distanceKm ?? 1.2} <span className="text-xs uppercase text-slate-500">km</span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  ~{station.estimatedArrivalMin ?? 3} mins away
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center text-xs text-slate-600 space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{station.address}</span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Primary Action: REROUTE TO POLICE STATION */}
            <button
              onClick={() => {
                soundAlertService.stopEmergencySiren();
                onConfirmRerouteToPolice(station);
              }}
              className="flex items-center justify-center space-x-2.5 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm sm:text-base shadow-sm transition"
            >
              <Navigation className="w-5 h-5" />
              <span>{t.divertToPolice}</span>
            </button>

            {/* Direct 911 / 112 Phone Call */}
            <a
              href={`tel:${station.phone}`}
              className="flex items-center justify-center space-x-2.5 py-3.5 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm sm:text-base shadow-sm transition text-center"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t.callPolice911}</span>
            </a>

            {/* Call Fleet Dispatch */}
            <a
              href={`tel:${settings.emergencyContact}`}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition"
            >
              <PhoneCall className="w-4 h-4 text-sky-600" />
              <span>{t.callDispatcher}</span>
            </a>

            {/* Cancel False Alarm */}
            <button
              onClick={() => {
                soundAlertService.stopEmergencySiren();
                onDismissEmergency();
              }}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 transition"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{t.cancelEmergency}</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
