import React from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mic,
  MapPin
} from 'lucide-react';
import { SafetyCheckRecord, AppSettings } from '../types';
import { translations } from '../i18n/translations';

interface DispatchLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: SafetyCheckRecord[];
  settings: AppSettings;
}

export const DispatchLogModal: React.FC<DispatchLogModalProps> = ({
  isOpen,
  onClose,
  records,
  settings
}) => {
  const t = translations[settings.language] || translations.en;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.checkInHistory}
              </h3>
              <p className="text-xs text-slate-500">
                Driver safety check-in heartbeat audit log
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

        {/* Records List */}
        <div className="p-5 overflow-y-auto space-y-2.5">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
              {t.noCheckInsYet}
            </div>
          ) : (
            records.map((rec) => {
              const isSafe = rec.response.includes('safe');
              return (
                <div
                  key={rec.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                    isSafe
                      ? 'bg-slate-50 border-emerald-200 text-slate-800'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSafe ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}>
                      {isSafe ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="font-bold flex items-center space-x-2">
                        <span className={isSafe ? 'text-emerald-800' : 'text-rose-800'}>
                          {rec.response.toUpperCase().replace('_', ' ')}
                        </span>
                        {rec.response.includes('voice') && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[10px] font-mono">
                            <Mic className="w-3 h-3" />
                            <span>Voice STT</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span>{new Date(rec.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{rec.lat.toFixed(4)}, {rec.lng.toFixed(4)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[11px] text-slate-500">
                    {rec.speedKmh} km/h
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <span>Logged Total: <strong className="text-slate-800">{records.length}</strong> events</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
