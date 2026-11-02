import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { DrivingHud } from './components/DrivingHud';
import { RouteManager } from './components/RouteManager';
import { SafetyCheckModal } from './components/SafetyCheckModal';
import { EmergencyModal } from './components/EmergencyModal';
import { DownloadModal } from './components/DownloadModal';
import { OfflineMapModal } from './components/OfflineMapModal';
import { SettingsModal } from './components/SettingsModal';
import { DispatchLogModal } from './components/DispatchLogModal';
import { OfflineMapService } from './services/offlineMapService';
import {
  AppSettings,
  DriverState,
  OptimizedRoute,
  PoliceStation,
  SafetyCheckRecord,
  Waypoint
} from './types';
import { PRESET_ROUTES } from './data/mockRoutes';
import {
  calculateRouteGeometry,
  optimizeWaypointsTSP,
  findNearestPoliceStation,
  calculateRouteSafetyScore,
  calculateHaversineDistanceKm,
  calculateBearing,
  calculateRemainingPathDistance,
  findNextUpcomingWaypoint
} from './services/routeOptimizer';
import { KinematicsEngine, RouteKinematics } from './services/kinematicsEngine';
import { voiceService } from './services/voiceService';
import { geocodingService } from './services/geocodingService';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  buttonSize: 'large', // default large for clear dashboard visibility
  safetyIntervalSeconds: 30, // 30s default for easy live evaluation
  promptTimeoutSeconds: 30,
  voiceEnabled: true,
  voiceSpeed: 1.0,
  sttEnabled: true,
  highContrast: false,
  soundAlerts: true,
  autoRerouteOnEmergency: true,
  driverName: 'Captain Rajesh Sharma',
  vehicleId: 'DPS-BUS-42 (Delhi Public School)',
  emergencyContact: '+91 11 4355 6000 / 112'
};

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('safedrive_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activePresetId, setActivePresetId] = useState<string>(PRESET_ROUTES[0].id);
  const [currentRoute, setCurrentRoute] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Modals state
  const [isSafetyCheckModalOpen, setIsSafetyCheckModalOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isDispatchLogOpen, setIsDispatchLogOpen] = useState<boolean>(false);

  // Check if offline map is downloaded
  const [isOfflineAvailable, setIsOfflineAvailable] = useState<boolean>(() => {
    return !!OfflineMapService.getActiveOfflineRegion();
  });

  // Active Police Station Target
  const [activePoliceTarget, setActivePoliceTarget] = useState<PoliceStation | null>(null);

  // Dispatch Log Records
  const [checkInRecords, setCheckInRecords] = useState<SafetyCheckRecord[]>([]);

  // Precomputed Route Kinematics (Distances, Times, Waypoints)
  const routeKinematicsRef = useRef<RouteKinematics | null>(null);

  // Driver Telemetry State
  const [driverState, setDriverState] = useState<DriverState>({
    currentLat: PRESET_ROUTES[0].waypoints[0].lat,
    currentLng: PRESET_ROUTES[0].waypoints[0].lng,
    currentLocationTag: PRESET_ROUTES[0].waypoints[0].name,
    currentCoordinateFormatted: '40.7580° N, 73.9855° W',
    currentSpeedKmh: 48,
    heading: 0,
    routeProgressIndex: 0,
    isDriving: true, // auto start simulated navigation
    status: 'safe',
    lastCheckInTime: null,
    secondsUntilNextPrompt: DEFAULT_SETTINGS.safetyIntervalSeconds,
    promptCountdownSeconds: DEFAULT_SETTINGS.promptTimeoutSeconds,
    activePoliceStationTarget: null,
    remainingDistanceKm: 18.5,
    remainingDurationMin: 23,
    traveledDistanceKm: 0,
    etaClockTime: new Date(Date.now() + 23 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    elapsedTripSeconds: 0,
    nextWaypointName: PRESET_ROUTES[0].waypoints[1]?.name || 'Next Checkpoint',
    nextWaypointDistanceKm: 3.2,
    nextWaypointEtaMin: 4
  });

  // Keep voiceService language in sync
  useEffect(() => {
    voiceService.setLanguage(settings.language);
    localStorage.setItem('safedrive_settings', JSON.stringify(settings));
  }, [settings.language]);

  // Load Preset Route on Mount or Preset Change
  useEffect(() => {
    const preset = PRESET_ROUTES.find(p => p.id === activePresetId) || PRESET_ROUTES[0];
    buildRoute(preset.waypoints, preset.policeStations, preset.name);
  }, [activePresetId]);

  const buildRoute = async (waypoints: Waypoint[], policeStations: PoliceStation[], name: string) => {
    setIsOptimizing(true);
    try {
      const geoData = await calculateRouteGeometry(waypoints);
      const safetyScore = calculateRouteSafetyScore(geoData.coordinates, policeStations);

      const optimized: OptimizedRoute = {
        id: `route-${Date.now()}`,
        name,
        waypoints,
        geometry: geoData.coordinates,
        totalDistanceKm: geoData.distanceKm,
        estimatedDurationMin: geoData.durationMin,
        safetyScore,
        policeStationsAlongRoute: policeStations,
        hazardsAvoidedCount: 4,
        mode: 'safest'
      };

      setCurrentRoute(optimized);

      // Precompute exact cumulative route kinematics
      const kinematics = KinematicsEngine.precomputeRoute(geoData.coordinates, waypoints);
      routeKinematicsRef.current = kinematics;

      // Reset driver position to start of route with practical initial state
      if (geoData.coordinates.length > 0) {
        const initialProgress = KinematicsEngine.calculateProgress(0, kinematics, geoData.coordinates, 48);
        const startLat = geoData.coordinates[0][0];
        const startLng = geoData.coordinates[0][1];
        const startTag = waypoints[0]?.name || name;

        setDriverState(prev => ({
          ...prev,
          currentLat: startLat,
          currentLng: startLng,
          currentLocationTag: startTag,
          currentCoordinateFormatted: geocodingService.formatCoordinateString(startLat, startLng),
          routeProgressIndex: 0,
          heading: initialProgress.bearing,
          currentSpeedKmh: 48,
          remainingDistanceKm: kinematics.totalDistanceKm,
          remainingDurationMin: initialProgress.remainingMin,
          traveledDistanceKm: 0,
          etaClockTime: initialProgress.etaClock,
          elapsedTripSeconds: 0,
          nextWaypointName: initialProgress.nextWaypointName,
          nextWaypointDistanceKm: initialProgress.nextWaypointDistanceKm,
          nextWaypointEtaMin: initialProgress.nextWaypointEtaMin,
          secondsUntilNextPrompt: settings.safetyIntervalSeconds
        }));
      }
    } catch (e) {
      console.error("Failed to build route:", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Run user around any location worldwide
  const handleSelectCustomLocation = async (lat: number, lng: number, placeName: string) => {
    setIsOptimizing(true);
    try {
      const template = geocodingService.generateCorridorAroundLocation(lat, lng, placeName);
      await buildRoute(template.waypoints, template.policeStations, template.name);
    } catch (e) {
      console.error("Failed to generate custom corridor:", e);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Keep live street location tag updated as vehicle drives
  useEffect(() => {
    if (!driverState.isDriving) return;

    const locTimer = setInterval(async () => {
      try {
        const address = await geocodingService.getStreetAddress(driverState.currentLat, driverState.currentLng);
        const coords = geocodingService.formatCoordinateString(driverState.currentLat, driverState.currentLng);
        setDriverState(prev => {
          if (prev.currentLocationTag === address && prev.currentCoordinateFormatted === coords) return prev;
          return {
            ...prev,
            currentLocationTag: address,
            currentCoordinateFormatted: coords
          };
        });
      } catch {
        // Fallback already handled
      }
    }, 2800);

    return () => clearInterval(locTimer);
  }, [driverState.isDriving, driverState.currentLat, driverState.currentLng]);

  // Re-optimize route using 2-Opt TSP
  const handleOptimizeRoute = async () => {
    if (!currentRoute) return;
    setIsOptimizing(true);
    const optimizedWaypoints = optimizeWaypointsTSP(currentRoute.waypoints);
    await buildRoute(optimizedWaypoints, currentRoute.policeStationsAlongRoute, `${currentRoute.name} (Optimized)`);
  };

  // Add custom stop
  const handleAddWaypoint = (name: string, address: string, lat: number, lng: number) => {
    if (!currentRoute) return;
    const newWp: Waypoint = {
      id: `wp-${Date.now()}`,
      name,
      address,
      lat,
      lng,
      type: 'delivery',
      priority: 'normal'
    };
    const updated = [...currentRoute.waypoints, newWp];
    buildRoute(updated, currentRoute.policeStationsAlongRoute, currentRoute.name);
  };

  // Remove stop
  const handleRemoveWaypoint = (id: string) => {
    if (!currentRoute) return;
    const updated = currentRoute.waypoints.filter(w => w.id !== id);
    buildRoute(updated, currentRoute.policeStationsAlongRoute, currentRoute.name);
  };

  // MAIN WELFARE TIMER: Driver Heartbeat Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setDriverState(prev => {
        // If welfare modal is already open, tick down the grace period
        if (isSafetyCheckModalOpen) {
          if (prev.promptCountdownSeconds <= 1) {
            // TIMEOUT! Driver did not respond within grace period!
            handleTriggerEmergency('timeout');
            return {
              ...prev,
              promptCountdownSeconds: settings.promptTimeoutSeconds
            };
          }
          return {
            ...prev,
            promptCountdownSeconds: prev.promptCountdownSeconds - 1
          };
        }

        // If driving and in safe status, countdown until next prompt
        if (prev.status === 'safe') {
          if (prev.secondsUntilNextPrompt <= 1) {
            // Trigger Welfare Check Modal!
            setIsSafetyCheckModalOpen(true);
            return {
              ...prev,
              status: 'prompting',
              secondsUntilNextPrompt: settings.safetyIntervalSeconds,
              promptCountdownSeconds: settings.promptTimeoutSeconds
            };
          }
          return {
            ...prev,
            secondsUntilNextPrompt: prev.secondsUntilNextPrompt - 1
          };
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSafetyCheckModalOpen, settings.safetyIntervalSeconds, settings.promptTimeoutSeconds]);

  // PRACTICAL REAL-TIME DRIVER VEHICLE KINEMATICS SIMULATOR
  useEffect(() => {
    if (!driverState.isDriving || !currentRoute || currentRoute.geometry.length < 2) return;

    // Tick every 400ms for continuous, fluid motion along real road curves
    const moveInterval = setInterval(() => {
      setDriverState(prev => {
        if (!prev.isDriving) return prev;

        const kinematics = routeKinematicsRef.current;
        if (!kinematics || kinematics.totalDistanceKm === 0) return prev;

        // Realistic vehicle kinematics:
        // Speed fluctuates naturally between 46 and 56 km/h
        const simulatedSpeed = 50 + Math.floor(Math.sin(Date.now() / 2000) * 6);

        // In 400ms (0.4s), at speed v km/h, distance in km = v * (0.4 / 3600)
        // We apply a smooth demonstration scale factor of 12x so a 15km route completes smoothly in ~2.5 mins
        const dtHours = 0.4 / 3600;
        const simMultiplier = 12;
        const deltaKm = (simulatedSpeed * dtHours) * simMultiplier;

        let nextTraveledKm = prev.traveledDistanceKm + deltaKm;
        if (nextTraveledKm >= kinematics.totalDistanceKm) {
          nextTraveledKm = 0; // seamless route loop
        }

        const progress = KinematicsEngine.calculateProgress(
          nextTraveledKm,
          kinematics,
          currentRoute.geometry,
          simulatedSpeed
        );

        return {
          ...prev,
          currentLat: progress.lat,
          currentLng: progress.lng,
          heading: progress.bearing,
          currentSpeedKmh: simulatedSpeed,
          routeProgressIndex: progress.segmentIndex,
          traveledDistanceKm: progress.traveledKm,
          remainingDistanceKm: progress.remainingKm,
          remainingDurationMin: progress.remainingMin,
          etaClockTime: progress.etaClock,
          elapsedTripSeconds: prev.elapsedTripSeconds + 1,
          nextWaypointName: progress.nextWaypointName,
          nextWaypointDistanceKm: progress.nextWaypointDistanceKm,
          nextWaypointEtaMin: progress.nextWaypointEtaMin
        };
      });
    }, 400);

    return () => clearInterval(moveInterval);
  }, [driverState.isDriving, currentRoute]);

  // 1. DRIVER RESPONDS: "YES, I AM SAFE"
  const handleConfirmSafe = (source: 'button' | 'voice') => {
    setIsSafetyCheckModalOpen(false);

    // Record check in
    const record: SafetyCheckRecord = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      response: source === 'voice' ? 'voice_safe' : 'yes_safe',
      lat: driverState.currentLat,
      lng: driverState.currentLng,
      speedKmh: driverState.currentSpeedKmh,
      notes: "Routine check-in passed successfully."
    };

    setCheckInRecords(prev => [record, ...prev]);

    // Reset driver state back to safe; message won't go again until the next full interval duration!
    setDriverState(prev => ({
      ...prev,
      status: 'safe',
      lastCheckInTime: new Date(),
      secondsUntilNextPrompt: settings.safetyIntervalSeconds,
      promptCountdownSeconds: settings.promptTimeoutSeconds
    }));
  };

  // 2. DRIVER RESPONDS: "NO, NEED ASSISTANCE" OR TIMEOUT OCCURS
  const handleTriggerEmergency = (source: 'button' | 'voice' | 'timeout') => {
    setIsSafetyCheckModalOpen(false);

    // Find closest police station to current location
    const stations = currentRoute?.policeStationsAlongRoute || PRESET_ROUTES[0].policeStations;
    const nearest = findNearestPoliceStation(driverState.currentLat, driverState.currentLng, stations);

    if (nearest) {
      setActivePoliceTarget(nearest.station);
    }

    // Record check in failure
    const record: SafetyCheckRecord = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      response: source === 'timeout'
        ? 'timeout_escalation'
        : source === 'voice'
        ? 'voice_emergency'
        : 'no_emergency',
      lat: driverState.currentLat,
      lng: driverState.currentLng,
      speedKmh: driverState.currentSpeedKmh,
      notes: `EMERGENCY ALERT: ${source.toUpperCase()} trigger. Diverting to police station.`
    };

    setCheckInRecords(prev => [record, ...prev]);

    setDriverState(prev => ({
      ...prev,
      status: 'emergency_alert',
      activePoliceStationTarget: nearest ? nearest.station : null
    }));

    // Show Emergency Modal
    setIsEmergencyModalOpen(true);
  };

  // Confirm Reroute to Police Station
  const handleConfirmRerouteToPolice = (station: PoliceStation) => {
    setIsEmergencyModalOpen(false);
    setActivePoliceTarget(station);

    setDriverState(prev => ({
      ...prev,
      status: 'diverting_to_police',
      activePoliceStationTarget: station
    }));
  };

  // Dismiss Emergency (False Alarm / Driver Safe)
  const handleDismissEmergency = () => {
    setIsEmergencyModalOpen(false);
    setActivePoliceTarget(null);

    setDriverState(prev => ({
      ...prev,
      status: 'safe',
      secondsUntilNextPrompt: settings.safetyIntervalSeconds
    }));
  };

  // Direct divert to station from RouteManager
  const handleDirectDivert = (station: PoliceStation) => {
    setActivePoliceTarget(station);
    setIsEmergencyModalOpen(true);
  };

  // Instant Welfare Check Simulation
  const handleTriggerInstantWelfareCheck = () => {
    setIsSafetyCheckModalOpen(true);
    setDriverState(prev => ({
      ...prev,
      status: 'prompting',
      promptCountdownSeconds: settings.promptTimeoutSeconds
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Industrial Navigation Header */}
      <Navbar
        settings={settings}
        onUpdateSettings={(newVals) => setSettings(prev => ({ ...prev, ...newVals }))}
        safetyStatus={driverState.status}
        isOfflineAvailable={isOfflineAvailable}
        onTriggerWelfareCheck={handleTriggerInstantWelfareCheck}
        onTriggerEmergencySOS={() => handleTriggerEmergency('button')}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenDispatchLog={() => setIsDispatchLogOpen(true)}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col space-y-4">
        
        {/* Driving Telemetry HUD */}
        <DrivingHud
          driverState={driverState}
          route={currentRoute}
          settings={settings}
          onToggleDriving={() => setDriverState(prev => ({ ...prev, isDriving: !prev.isDriving }))}
          onTriggerInstantPrompt={handleTriggerInstantWelfareCheck}
        />

        {/* Map & Route Manager Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          
          {/* Interactive Leaflet Map (2 Cols) */}
          <div className="lg:col-span-2 min-h-[480px] relative">
            <MapView
              route={currentRoute}
              driverState={driverState}
              activePoliceTarget={activePoliceTarget}
              onSelectPoliceStation={(station) => handleDirectDivert(station)}
            />
          </div>

          {/* Route Optimization & Safe Corridors (1 Col) */}
          <div className="lg:col-span-1">
            <RouteManager
              route={currentRoute}
              settings={settings}
              isOptimizing={isOptimizing}
              onSelectPresetRoute={(id) => setActivePresetId(id)}
              onSelectCustomLocation={handleSelectCustomLocation}
              onOptimizeRoute={handleOptimizeRoute}
              onAddWaypoint={handleAddWaypoint}
              onRemoveWaypoint={handleRemoveWaypoint}
              onDirectDivertToStation={handleDirectDivert}
            />
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
        SafeDrive Sentinel AI &bull; Active Driver Guardian Protocol &bull; Industrial Route Optimization &amp; Police Safe Haven Telematics
      </footer>

      {/* MODALS */}
      {/* 1. Core Driver Safety Welfare Prompt Modal (YES / NO Buttons + STT + Voice) */}
      <SafetyCheckModal
        isOpen={isSafetyCheckModalOpen}
        settings={settings}
        remainingCountdown={driverState.promptCountdownSeconds}
        onConfirmSafe={handleConfirmSafe}
        onTriggerEmergency={handleTriggerEmergency}
      />

      {/* 2. Emergency Police Safe Haven Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        station={activePoliceTarget || (currentRoute?.policeStationsAlongRoute[0] ?? null)}
        settings={settings}
        onConfirmRerouteToPolice={handleConfirmRerouteToPolice}
        onDismissEmergency={handleDismissEmergency}
      />

      {/* 3. Download Route Modal (GPX, GeoJSON, PDF Driver Manifest, JSON) */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        route={currentRoute}
        settings={settings}
      />

      {/* 4. Offline Map Download Modal */}
      <OfflineMapModal
        isOpen={isOfflineModalOpen}
        onClose={() => {
          setIsOfflineModalOpen(false);
          setIsOfflineAvailable(!!OfflineMapService.getActiveOfflineRegion());
        }}
        route={currentRoute}
      />

      {/* 5. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings(prev => ({ ...prev, ...newVals }))}
      />

      {/* 6. Dispatch Log Modal */}
      <DispatchLogModal
        isOpen={isDispatchLogOpen}
        onClose={() => setIsDispatchLogOpen(false)}
        records={checkInRecords}
        settings={settings}
      />

    </div>
  );
};

export default App;
