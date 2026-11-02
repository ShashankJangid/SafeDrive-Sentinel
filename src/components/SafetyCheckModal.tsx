import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Mic,
  Volume2,
  ShieldAlert,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppSettings, ButtonSize } from '../types';
import { translations } from '../i18n/translations';
import { voiceService, STTStatus } from '../services/voiceService';
import { soundAlertService } from '../services/audioAlertService';

interface SafetyCheckModalProps {
  isOpen: boolean;
  settings: AppSettings;
  remainingCountdown: number;
  onConfirmSafe: (source: 'button' | 'voice') => void;
  onTriggerEmergency: (source: 'button' | 'voice' | 'timeout') => void;
}

export const SafetyCheckModal: React.FC<SafetyCheckModalProps> = ({
  isOpen,
  settings,
  remainingCountdown,
  onConfirmSafe,
  onTriggerEmergency
}) => {
  const t = translations[settings.language] || translations.en;
  const [sttStatus, setSttStatus] = useState<STTStatus>('inactive');
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Sizing styles based on Variable Button Size setting
  const getButtonStyles = (size: ButtonSize) => {
    switch (size) {
      case 'glove':
        // Extra Large for heavy truck drivers with thick work gloves
        return {
          containerGap: 'gap-6',
          btnHeight: 'h-36 sm:h-44',
          btnText: 'text-2xl sm:text-3xl font-black tracking-wider',
          subText: 'text-base font-semibold',
          iconSize: 'w-14 h-14',
          padding: 'p-6'
        };
      case 'large':
        // Large for in-cab dashboard smartphone mounts
        return {
          containerGap: 'gap-4',
          btnHeight: 'h-28 sm:h-32',
          btnText: 'text-xl sm:text-2xl font-extrabold',
          subText: 'text-sm font-medium',
          iconSize: 'w-10 h-10',
          padding: 'p-5'
        };
      case 'standard':
      default:
        // Standard compact view
        return {
          containerGap: 'gap-4',
          btnHeight: 'h-20 sm:h-24',
          btnText: 'text-lg sm:text-xl font-bold',
          subText: 'text-xs font-normal',
          iconSize: 'w-8 h-8',
          padding: 'p-4'
        };
    }
  };

  const btnStyle = getButtonStyles(settings.buttonSize);

  // Play audio chime and speak prompt when modal appears
  useEffect(() => {
    if (!isOpen) {
      voiceService.stopListening();
      setLiveTranscript('');
      return;
    }

    // Play attention chime
    if (settings.soundAlerts) {
      soundAlertService.playWelfarePromptAlert();
    }

    // Voice announcement
    if (settings.voiceEnabled) {
      voiceService.speak(t.spokenSafetyCheck, settings.language, settings.voiceSpeed);
    }

    // Start STT speech listening if enabled
    if (settings.sttEnabled) {
      voiceService.startListening(
        {
          onTranscript: (transcript) => {
            setLiveTranscript(transcript);
          },
          onMatchedIntent: (intent) => {
            if (intent === 'yes') {
              handleSafeClick('voice');
            } else if (intent === 'no') {
              handleEmergencyClick('voice');
            }
          },
          onStatusChange: (status) => {
            setSttStatus(status);
          }
        },
        settings.language
      );
    }

    return () => {
      voiceService.stopListening();
    };
  }, [isOpen, settings.language]);

  if (!isOpen) return null;

  const handleSafeClick = (source: 'button' | 'voice' = 'button') => {
    // Sound & Confetti feedback
    if (settings.soundAlerts) {
      soundAlertService.playSafeConfirmChime();
    }
    if (settings.voiceEnabled) {
      voiceService.speak(t.spokenSafeConfirmed, settings.language, settings.voiceSpeed);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#34D399', '#059669']
      });
    } catch {
      // Ignore
    }

    onConfirmSafe(source);
  };

  const handleEmergencyClick = (source: 'button' | 'voice' = 'button') => {
    onTriggerEmergency(source);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Bar with Countdown */}
        <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-700">
                {t.safetyPromptTitle}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {t.safetyPromptQuestion}
              </h2>
            </div>
          </div>

          {/* Grace Period Timer */}
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-amber-700 font-mono text-sm font-bold shadow-sm">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{remainingCountdown}s</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
              {t.safetyCountdownRemaining}
            </span>
          </div>
        </div>

        {/* Informative Subtitle */}
        <div className="px-6 pt-4 pb-2 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {t.safetyPromptSubtitle}
          </p>
        </div>

        {/* Core Sized Buttons (YES or NO) */}
        <div className={`p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 ${btnStyle.containerGap}`}>
          
          {/* YES Button */}
          <button
            onClick={() => handleSafeClick('button')}
            className={`group relative flex flex-col items-center justify-center ${btnStyle.btnHeight} ${btnStyle.padding} bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl shadow-md border-2 border-emerald-500 transition-all select-none`}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle2 className={`${btnStyle.iconSize} text-white`} />
              <div className="text-left">
                <div className={btnStyle.btnText}>{t.btnYesSafe}</div>
                <div className={`${btnStyle.subText} text-emerald-100`}>
                  Dismiss alert &amp; log healthy
                </div>
              </div>
            </div>
            <span className="absolute bottom-2 right-3 text-[10px] uppercase font-mono tracking-widest text-emerald-200">
              Hands-free: Say "YES"
            </span>
          </button>

          {/* NO Button (Triggers Emergency Advance to Police Station) */}
          <button
            onClick={() => handleEmergencyClick('button')}
            className={`group relative flex flex-col items-center justify-center ${btnStyle.btnHeight} ${btnStyle.padding} bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-2xl shadow-md border-2 border-rose-500 transition-all select-none`}
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`${btnStyle.iconSize} text-white`} />
              <div className="text-left">
                <div className={btnStyle.btnText}>{t.btnNoEmergency}</div>
                <div className={`${btnStyle.subText} text-rose-100`}>
                  Locate nearest police safe haven
                </div>
              </div>
            </div>
            <span className="absolute bottom-2 right-3 text-[10px] uppercase font-mono tracking-widest text-rose-200">
              Hands-free: Say "NO"
            </span>
          </button>
        </div>

        {/* Live Speech Recognition & STT Status Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs">
            {settings.sttEnabled ? (
              <span className="flex items-center space-x-2 text-emerald-700 font-semibold">
                <Mic className="w-4 h-4 text-emerald-600" />
                <span>{t.voiceListening}</span>
              </span>
            ) : (
              <span className="text-slate-500 flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4" />
                <span>Voice STT muted (Enable in settings)</span>
              </span>
            )}
            
            {liveTranscript && (
              <span className="ml-2 px-2 py-0.5 bg-white text-slate-800 rounded border border-slate-200 font-mono text-[11px] truncate max-w-[200px]">
                "{liveTranscript}"
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 text-center sm:text-right font-medium">
            {t.autoEscalationWarning}
          </div>
        </div>

      </div>
    </div>
  );
};
