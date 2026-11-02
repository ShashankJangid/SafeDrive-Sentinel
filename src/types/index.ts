export type ButtonSize = 'standard' | 'large' | 'glove';

export type LanguageCode = 'en' | 'es' | 'hi' | 'fr' | 'de' | 'zh' | 'ar' | 'pt';

export type WaypointType = 'depot' | 'delivery' | 'pickup' | 'police' | 'hospital' | 'rest_stop';

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: WaypointType;
  address: string;
  notes?: string;
  priority?: 'normal' | 'high' | 'critical';
  phone?: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  jurisdiction: string;
  distanceKm?: number;
  estimatedArrivalMin?: number;
  open24_7: boolean;
  emergencyType: 'police' | 'hospital' | 'safe_haven';
}

export interface RouteGeometry {
  coordinates: [number, number][]; // [lat, lng]
}

export interface OptimizedRoute {
  id: string;
  name: string;
  waypoints: Waypoint[];
  geometry: [number, number][];
  totalDistanceKm: number;
  estimatedDurationMin: number;
  safetyScore: number; // 0 - 100
  policeStationsAlongRoute: PoliceStation[];
  hazardsAvoidedCount: number;
  mode: 'safest' | 'fastest' | 'balanced';
}

export type SafetyStatus = 'safe' | 'prompting' | 'emergency_alert' | 'diverting_to_police';

export interface SafetyCheckRecord {
  id: string;
  timestamp: string;
  response: 'yes_safe' | 'no_emergency' | 'timeout_escalation' | 'voice_safe' | 'voice_emergency';
  lat: number;
  lng: number;
  speedKmh: number;
  notes?: string;
}

export interface PresetRouteTemplate {
  id: string;
  name: string;
  city: string;
  description: string;
  waypoints: Waypoint[];
  policeStations: PoliceStation[];
}

export interface DriverState {
  currentLat: number;
  currentLng: number;
  currentSpeedKmh: number;
  heading: number;
  routeProgressIndex: number;
  isDriving: boolean;
  status: SafetyStatus;
  lastCheckInTime: Date | null;
  secondsUntilNextPrompt: number;
  promptCountdownSeconds: number; // grace period when prompt is active
  activePoliceStationTarget: PoliceStation | null;
  remainingDistanceKm: number;
  remainingDurationMin: number;
  traveledDistanceKm: number;
  etaClockTime: string;
  elapsedTripSeconds: number;
  currentLocationTag: string;
  currentCoordinateFormatted: string;
  nextWaypointName?: string;
  nextWaypointDistanceKm?: number;
  nextWaypointEtaMin?: number;
}

export interface AppSettings {
  language: LanguageCode;
  buttonSize: ButtonSize;
  safetyIntervalSeconds: number; // e.g. 60 for fast testing, 900 for 15min
  promptTimeoutSeconds: number; // grace period to respond before escalation
  voiceEnabled: boolean;
  voiceSpeed: number; // 0.8 - 1.2
  sttEnabled: boolean;
  highContrast: boolean;
  soundAlerts: boolean;
  autoRerouteOnEmergency: boolean;
  driverName: string;
  vehicleId: string;
  emergencyContact: string;
}
