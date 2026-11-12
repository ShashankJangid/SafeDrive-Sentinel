import React from 'react';
import {
  Play,
  Pause,
  Gauge,
  Clock,
  ShieldCheck,
  HeartHandshake,
  Activity,
  MapPin,
  HelpCircle,
  Zap
} from 'lucide-react';
import { DriverState, OptimizedRoute, AppSettings } from '../types';
import { translations } from '../i18n/translations';
import { getDynamicButtonClasses } from '../utils/buttonStyles';

interface DrivingHudProps {
  driverState: DriverState;
  route: OptimizedRoute | null;
  settings: AppSettings;
  onToggleDriving: () => void;
  onTriggerInstantPrompt: () => void;
}

export const DrivingHud: React.FC<DrivingHudProps> = ({
  driverState,
  route,
  settings,
  onToggleDriving,
  onTriggerInstantPrompt
}) => {
  const t = translations[settings.language] || translations.en;
  const btnClasses = getDynamicButtonClasses(settings.buttonSize);

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = route && route.totalDistanceKm > 0
    ? Math.min(100, Math.round((driverState.traveledDistanceKm / route.totalDistanceKm) * 100))
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col space-y-4 transition-colors">
      
      {/* Live Location Tag Bar with simplified quick indicators */}
      <div className="bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center space-x-2 truncate min-w-0">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider block leading-none">
              Live Vehicle Position (GPS)
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate">
              {driverState.currentLocationTag || 'En Route corridor'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {settings.batterySaver && (
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-500" />
              Eco Saver Active
            </span>
          )}
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            {driverState.currentCoordinateFormatted || `${driverState.currentLat.toFixed(4)}°, ${driverState.currentLng.toFixed(4)}°`}
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            Heading: {driverState.heading}°
          </span>
        </div>
      </div>

      {/* Top Telemetry Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Speed & Trip Elapsed Card */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {t.speed} &bull; Trip Time
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {driverState.isDriving ? driverState.currentSpeedKmh : 0}{' '}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">km/h</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
              Elapsed: {formatSeconds(driverState.elapsedTripSeconds || 0)}
            </div>
          </div>
        </div>

        {/* Practical Arrival Clock & Remaining Distance */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-sky-100/70 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-700 dark:text-sky-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              ETA: <strong className="text-slate-800 dark:text-slate-100">{driverState.etaClockTime || '11:30 AM'}</strong>
            </div>
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
              {driverState.remainingDurationMin}m &bull; {driverState.remainingDistanceKm} km
            </div>
            {driverState.nextWaypointName && (
              <div className="text-[10px] text-sky-700 dark:text-sky-300 truncate max-w-[140px] font-medium" title={driverState.nextWaypointName}>
                Next: {driverState.nextWaypointName} ({driverState.nextWaypointDistanceKm} km)
              </div>
            )}
          </div>
        </div>

        {/* Safety Score Rating */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {t.safetyScore}
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
              {route?.safetyScore ?? 96}
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
              Verified Safe Haven Corridor
            </div>
          </div>
        </div>

        {/* Next Safety Welfare Check Countdown */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100/70 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              Next Check-In
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-400 font-mono">
              {formatSeconds(driverState.secondsUntilNextPrompt)}
            </div>
            <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium truncate">
              Interval: {settings.safetyIntervalSeconds >= 60 ? `${Math.round(settings.safetyIntervalSeconds / 60)}m` : `${settings.safetyIntervalSeconds}s`}
            </div>
          </div>
        </div>

      </div>

      {/* Route Journey Progress Bar with Practical Cumulative Distance Metrics */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold">
          <span>
            Traveled: <strong className="text-slate-800 dark:text-slate-100">{driverState.traveledDistanceKm} km</strong> of {route?.totalDistanceKm ?? 0} km ({progressPercent}%)
          </span>
          <span>
            Remaining: <strong className="text-emerald-700 dark:text-emerald-400">{driverState.remainingDistanceKm} km</strong> (~{driverState.remainingDurationMin} min)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom Control Bar - Responsive to Global Button Size Setting! */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Start / Pause Drive Button (Scales with ButtonSize!) */}
          <button
            onClick={onToggleDriving}
            className={`flex items-center justify-center ${btnClasses.primaryBtn} rounded-xl transition ${
              driverState.isDriving
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {driverState.isDriving ? (
              <>
                <Pause className={`${btnClasses.iconSize} shrink-0`} />
                <span>{t.pauseNavigation}</span>
              </>
            ) : (
              <>
                <Play className={`${btnClasses.iconSize} shrink-0`} />
                <span>{t.startNavigation}</span>
              </>
            )}
          </button>

          {/* Instant Safety Test Trigger Button (Scales with ButtonSize!) */}
          <button
            onClick={onTriggerInstantPrompt}
            className={`flex items-center justify-center ${btnClasses.actionBtn} bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl transition`}
          >
            <Activity className={`${btnClasses.iconSize} text-amber-600 dark:text-amber-400 shrink-0`} />
            <span>Simulate Check-In Now</span>
          </button>
        </div>

        {/* Telemetry info */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-3 flex-wrap">
          <span className="flex items-center space-x-1.5">
            <img src="/school-logo.png" alt="DPS" className="w-4 h-4 object-contain inline-block" />
            <span>School Fleet: <strong className="text-slate-800 dark:text-slate-100">DPS Express</strong></span>
          </span>
          <span>Driver: <strong className="text-slate-800 dark:text-slate-100">{settings.driverName}</strong></span>
          <span>Bus: <strong className="text-slate-800 dark:text-slate-100">{settings.vehicleId}</strong></span>
          <span className="hidden md:inline">Mode: <strong className="uppercase text-emerald-700 dark:text-emerald-400 font-bold">{settings.buttonSize}</strong></span>
        </div>
      </div>

    </div>
  );
};
