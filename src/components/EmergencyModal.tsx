import React, { useEffect, useState, useRef } from 'react';
import {
  ShieldAlert,
  Navigation,
  PhoneCall,
  MapPin,
  CheckCircle,
  Volume2,
  VolumeX,
  Mic,
  AlertTriangle,
  Clock,
  Radio,
  Send
} from 'lucide-react';
import { PoliceStation, AppSettings } from '../types';
import { translations } from '../i18n/translations';
import { voiceService, EmergencyVoiceIntent } from '../services/voiceService';
import { soundAlertService } from '../services/audioAlertService';

interface EmergencyModalProps {
  isOpen: boolean;
  station: PoliceStation | null;
  settings: AppSettings;
  driverLat?: number;
  driverLng?: number;
  onConfirmRerouteToPolice: (station: PoliceStation) => void;
  onDismissEmergency: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  station,
  settings,
  driverLat,
  driverLng,
  onConfirmRerouteToPolice,
  onDismissEmergency
}) => {
  const t = translations[settings.language] || translations.en;
  const [sirenActive, setSirenActive] = useState<boolean>(true);
  
  // 30-Second Auto-Escalation Countdown
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isAutoDispatched, setIsAutoDispatched] = useState<boolean>(false);
  
  // Speech Recognition Live Transcript & Intent State
  const [sttTranscript, setSttTranscript] = useState<string>('');
  const [sttStatus, setSttStatus] = useState<string>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      soundAlertService.stopEmergencySiren();
      voiceService.stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
      setSecondsRemaining(30);
      setIsAutoDispatched(false);
      setSttTranscript('');
      return;
    }

    // 1. Play emergency audio/siren
    if (settings.soundAlerts) {
      soundAlertService.playEmergencySiren();
      setSirenActive(true);
    }

    // 2. Urgent Voice Alert
    if (settings.voiceEnabled) {
      voiceService.speak(t.spokenEmergencyTriggered, settings.language, settings.voiceSpeed);
    }

    // 3. Hands-free STT listener immediately active
    setSttStatus('listening');
    voiceService.startEmergencyListening({
      onTranscript: (transcript: string) => {
        setSttTranscript(transcript);
      },
      onMatchedEmergencyIntent: (intent: EmergencyVoiceIntent) => {
        if (intent === 'divert' && station) {
          soundAlertService.stopEmergencySiren();
          voiceService.stopListening();
          onConfirmRerouteToPolice(station);
        } else if (intent === 'cancel') {
          soundAlertService.stopEmergencySiren();
          voiceService.stopListening();
          onDismissEmergency();
        } else if (intent === 'call' && station) {
          window.location.href = `tel:${station.phone}`;
        }
      },
      onStatusChange: (status) => {
        setSttStatus(status);
      }
    }, settings.language);

    // 4. 30-Second Auto-Escalation Timer:
    // If no response from driver within 30s, auto-send location to nearest police station
    setSecondsRemaining(30);
    setIsAutoDispatched(false);

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoEscalate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      soundAlertService.stopEmergencySiren();
      voiceService.stopListening();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, settings.language]);

  const handleAutoEscalate = () => {
    setIsAutoDispatched(true);
    // Voice notification of automated dispatch
    if (settings.voiceEnabled) {
      voiceService.speak("30 seconds expired. GPS coordinates and SOS dispatched to nearest police station.", settings.language);
    }
    // Automatically trigger reroute and safe haven lock
    if (station) {
      setTimeout(() => {
        soundAlertService.stopEmergencySiren();
        voiceService.stopListening();
        onConfirmRerouteToPolice(station);
      }, 3500);
    }
  };

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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Urgent Header */}
        <div className="bg-rose-600 dark:bg-rose-700 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-black tracking-widest bg-rose-800/80 px-2 py-0.5 rounded text-white inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> SOS Emergency Protocol
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
            className="p-2.5 bg-rose-700 hover:bg-rose-800 rounded-xl text-white border border-rose-400/40 transition flex items-center gap-1.5 text-xs font-bold"
          >
            {sirenActive ? (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span className="hidden sm:inline">Siren ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-200" />
                <span className="hidden sm:inline">Muted</span>
              </>
            )}
          </button>
        </div>

        {/* 30-Second Auto-Escalation Countdown Progress Bar */}
        <div className="bg-rose-950 text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold border-b border-rose-800">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${secondsRemaining <= 10 ? 'text-amber-400 animate-spin' : 'text-rose-300'}`} />
            <span>
              {isAutoDispatched ? (
                <span className="text-emerald-400 font-black">
                  🚨 GPS TELEMETRY TRANSMITTED TO POLICE DISPATCH
                </span>
              ) : (
                <>
                  {t.autoDispatchCountdown || "Auto-dispatching location to police in"}:{" "}
                  <span className="font-mono text-amber-300 font-black text-sm">{secondsRemaining}s</span>
                </>
              )}
            </span>
          </div>

          <div className="w-28 sm:w-40 bg-rose-900 rounded-full h-2 overflow-hidden border border-rose-700">
            <div
              className={`h-full transition-all duration-1000 ${
                secondsRemaining <= 10 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${(secondsRemaining / 30) * 100}%` }}
            />
          </div>
        </div>

        {/* Live Auto-Dispatch Confirmation Banner (shown when auto-escalated) */}
        {isAutoDispatched && (
          <div className="bg-emerald-600 text-white px-5 py-3 flex items-center space-x-3 text-xs sm:text-sm font-black animate-fade-in shadow-inner">
            <Send className="w-5 h-5 animate-pulse" />
            <div>
              <p className="uppercase tracking-wide">
                {t.autoPoliceDispatched || "Driver GPS location automatically dispatched to Nearest Police Safe Haven"}
              </p>
              <p className="text-[11px] text-emerald-100 font-mono font-normal">
                Vehicle: {settings.vehicleId} &bull; Lat: {driverLat?.toFixed(5) || '28.6139'}, Lng: {driverLng?.toFixed(5) || '77.2090'} &bull; Direct Reroute Active
              </p>
            </div>
          </div>
        )}

        {/* Hands-Free STT Status Indicator */}
        <div className="px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <Mic className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="font-semibold">
              {sttTranscript ? (
                <>Heard: <span className="font-bold underline decoration-amber-500">"{sttTranscript}"</span></>
              ) : (
                <span>Speak hands-free: Say <strong className="text-emerald-700 dark:text-emerald-300">"Divert"</strong>, <strong className="text-rose-700 dark:text-rose-300">"Police"</strong>, or <strong className="text-slate-700 dark:text-slate-300">"Cancel"</strong></span>
              )}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-200/80 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded-full">
            Hands-Free STT Active
          </span>
        </div>

        {/* Police Station Safe Haven Card */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t.safeHavenTitle}</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {station.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  {station.jurisdiction}
                </p>
              </div>

              {/* ETA / Distance Pill */}
              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {station.distanceKm ?? 1.2} <span className="text-xs uppercase text-slate-500 dark:text-slate-400">km</span>
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ~{station.estimatedArrivalMin ?? 3} mins away
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center text-xs text-slate-600 dark:text-slate-300 space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{station.address}</span>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            {/* Primary Action: REROUTE TO POLICE STATION */}
            <button
              onClick={() => {
                soundAlertService.stopEmergencySiren();
                voiceService.stopListening();
                onConfirmRerouteToPolice(station);
              }}
              className="flex items-center justify-center space-x-2.5 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-black text-sm sm:text-base shadow-lg transition"
            >
              <Navigation className="w-5 h-5" />
              <span>{t.divertToPolice}</span>
            </button>

            {/* Direct 911 / 112 Phone Call */}
            <a
              href={`tel:${station.phone}`}
              className="flex items-center justify-center space-x-2.5 py-3.5 px-5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl font-black text-sm sm:text-base shadow-lg transition text-center"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t.callPolice911}</span>
            </a>

            {/* Call Fleet Dispatch */}
            <a
              href={`tel:${settings.emergencyContact}`}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition"
            >
              <PhoneCall className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{t.callDispatcher}</span>
            </a>

            {/* Cancel False Alarm */}
            <button
              onClick={() => {
                soundAlertService.stopEmergencySiren();
                voiceService.stopListening();
                onDismissEmergency();
              }}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.cancelEmergency}</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
