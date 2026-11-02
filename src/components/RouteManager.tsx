import React, { useState, useEffect, useRef } from 'react';
import {
  Route as RouteIcon,
  Sparkles,
  Plus,
  Trash2,
  ShieldAlert,
  Search,
  Navigation,
  Globe,
  Crosshair,
  Loader2,
  MapPin
} from 'lucide-react';
import { OptimizedRoute, PoliceStation, AppSettings } from '../types';
import { PRESET_ROUTES } from '../data/mockRoutes';
import { translations } from '../i18n/translations';
import { getDynamicButtonClasses } from '../utils/buttonStyles';
import { geocodingService, GeocodingResult } from '../services/geocodingService';

interface RouteManagerProps {
  route: OptimizedRoute | null;
  settings: AppSettings;
  isOptimizing: boolean;
  onSelectPresetRoute: (presetId: string) => void;
  onSelectCustomLocation: (lat: number, lng: number, placeName: string) => void;
  onOptimizeRoute: () => void;
  onAddWaypoint: (name: string, address: string, lat: number, lng: number) => void;
  onRemoveWaypoint: (id: string) => void;
  onDirectDivertToStation: (station: PoliceStation) => void;
}

export const RouteManager: React.FC<RouteManagerProps> = ({
  route,
  settings,
  isOptimizing,
  onSelectPresetRoute,
  onSelectCustomLocation,
  onOptimizeRoute,
  onAddWaypoint,
  onRemoveWaypoint,
  onDirectDivertToStation
}) => {
  const t = translations[settings.language] || translations.en;
  const btnClasses = getDynamicButtonClasses(settings.buttonSize);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResultsDropdown, setShowResultsDropdown] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Custom Stop Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStopName, setNewStopName] = useState('');
  const [newStopAddress, setNewStopAddress] = useState('');

  const searchDebounceRef = useRef<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle Search Input Change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setShowResultsDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = window.setTimeout(async () => {
      try {
        const results = await geocodingService.searchLocation(query);
        setSearchResults(results);
        setShowResultsDropdown(results.length > 0);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 450);
  };

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResultsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Select Search Result
  const handleSelectPlace = (place: GeocodingResult) => {
    const cleanName = place.displayName.split(',')[0].trim();
    onSelectCustomLocation(place.lat, place.lng, cleanName);
    setSearchQuery(cleanName);
    setShowResultsDropdown(false);
  };

  // Locate User's Device GPS Worldwide
  const handleUseDeviceLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingGps(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const streetAddress = await geocodingService.getStreetAddress(lat, lng);
          const shortName = streetAddress.split(',')[0] || 'My GPS Location';
          onSelectCustomLocation(lat, lng, shortName);
          setSearchQuery(shortName);
        } catch {
          onSelectCustomLocation(lat, lng, 'My GPS Location');
        } finally {
          setIsLocatingGps(false);
        }
      },
      (err) => {
        setIsLocatingGps(false);
        setGpsError(`GPS Access: ${err.message}. Using default route.`);
        setTimeout(() => setGpsError(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopName.trim()) return;

    const baseLat = route?.waypoints[0]?.lat ?? 40.73;
    const baseLng = route?.waypoints[0]?.lng ?? -73.99;
    const offsetLat = baseLat + (Math.random() - 0.5) * 0.04;
    const offsetLng = baseLng + (Math.random() - 0.5) * 0.04;

    onAddWaypoint(newStopName, newStopAddress || 'Industrial Delivery Hub', offsetLat, offsetLng);
    setNewStopName('');
    setNewStopAddress('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col space-y-4">
      
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <RouteIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              {t.routeOptimization}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Safe corridor with verified police safe havens
          </p>
        </div>

        {/* Global Preset Corridors */}
        <select
          onChange={(e) => onSelectPresetRoute(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 cursor-pointer focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium"
        >
          {PRESET_ROUTES.map(preset => (
            <option key={preset.id} value={preset.id}>
              📍 {preset.city} ({preset.waypoints.length} stops)
            </option>
          ))}
        </select>
      </div>

      {/* Global Location Search & Live Device GPS Bar */}
      <div ref={searchContainerRef} className="relative space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Run User Around Any Location Worldwide</span>
          </span>
          {gpsError && (
            <span className="text-[10px] text-rose-600 font-medium">{gpsError}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Global Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowResultsDropdown(true);
              }}
              placeholder="Search any city, landmark, or street (e.g. Paris, Tokyo, Mumbai, Berlin)..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs rounded-xl pl-9 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            
            {isSearching && (
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {/* 1-Tap "Use My GPS" Button */}
          <button
            onClick={handleUseDeviceLocation}
            disabled={isLocatingGps}
            title="Locate my real device GPS and build safe route here"
            className="flex items-center space-x-1.5 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition shrink-0 disabled:opacity-50"
          >
            {isLocatingGps ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
            ) : (
              <Crosshair className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span className="hidden sm:inline">Use My GPS</span>
          </button>
        </div>

        {/* Global Search Results Dropdown */}
        {showResultsDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((place) => (
              <button
                key={place.placeId}
                type="button"
                onClick={() => handleSelectPlace(place)}
                className="w-full px-3 py-2.5 text-left hover:bg-emerald-50/70 transition flex items-start space-x-2.5 group"
              >
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {place.displayName.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {place.displayName}
                  </div>
                  <div className="text-[9.5px] font-mono text-slate-400">
                    {place.lat.toFixed(4)}°, {place.lng.toFixed(4)}°
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Route Actions (Scaled by Global Button Size!) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={onOptimizeRoute}
          disabled={isOptimizing}
          className={`flex items-center justify-center ${btnClasses.actionBtn} bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition disabled:opacity-50`}
        >
          <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Optimizing...' : t.optimizeRoute}</span>
        </button>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center justify-center ${btnClasses.actionBtn} bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition`}
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>{t.addStop}</span>
        </button>
      </div>

      {/* Add Custom Stop Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <div className="text-xs font-bold text-slate-800">Add Delivery Checkpoint</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Stop Name (e.g. Harbor Warehouse #4)"
              value={newStopName}
              onChange={(e) => setNewStopName(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="text"
              placeholder="Address / Location"
              value={newStopAddress}
              onChange={(e) => setNewStopAddress(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold"
            >
              Add Stop
            </button>
          </div>
        </form>
      )}

      {/* Waypoints List */}
      <div className="space-y-2">
        <div className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between">
          <span>{t.routeStops} ({route?.waypoints.length ?? 0})</span>
          <span className="text-emerald-700 text-[11px] font-mono">2-Opt TSP</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {route?.waypoints.map((wp, idx) => (
            <div
              key={wp.id}
              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs"
            >
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 text-white ${
                  wp.type === 'depot' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {wp.type === 'depot' ? '★' : idx + 1}
                </span>
                <div className="truncate">
                  <div className="font-bold text-slate-800 truncate">{wp.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{wp.address}</div>
                </div>
              </div>

              {wp.type !== 'depot' && (
                <button
                  onClick={() => onRemoveWaypoint(wp.id)}
                  title="Remove Stop"
                  className="p-1 text-slate-400 hover:text-rose-600 transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Police Stations Along Corridor */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="text-xs uppercase font-bold tracking-wider text-rose-700 flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>24/7 Police Safe Havens ({route?.policeStationsAlongRoute.length ?? 0})</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {route?.policeStationsAlongRoute.map(station => (
            <div
              key={station.id}
              className="p-2.5 bg-rose-50/60 border border-rose-200/80 rounded-xl flex items-center justify-between gap-2"
            >
              <div className="truncate">
                <div className="font-bold text-rose-900 text-xs truncate">{station.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{station.phone}</div>
              </div>
              <button
                onClick={() => onDirectDivertToStation(station)}
                title="Divert to this police station"
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shrink-0 transition"
              >
                Safe Haven
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};