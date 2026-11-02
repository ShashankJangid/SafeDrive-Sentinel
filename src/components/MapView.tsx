import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { OptimizedRoute, PoliceStation, DriverState } from '../types';
import { CARTO_CONFIG } from '../config/mapConfig';

interface MapViewProps {
  route: OptimizedRoute | null;
  driverState: DriverState;
  activePoliceTarget: PoliceStation | null;
  onSelectPoliceStation: (station: PoliceStation) => void;
  onMapClickAddWaypoint?: (lat: number, lng: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  route,
  driverState,
  activePoliceTarget,
  onSelectPoliceStation,
  onMapClickAddWaypoint
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const traveledLayerRef = useRef<L.Polyline | null>(null);
  const diversionLayerRef = useRef<L.Polyline | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);

  const [currentStyleKey, setCurrentStyleKey] = useState<keyof typeof CARTO_CONFIG.styles>('voyager');
  const [autoFollow, setAutoFollow] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = route?.waypoints[0]?.lat ?? 40.7580;
    const initialLng = route?.waypoints[0]?.lng ?? -73.9855;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false
    });

    // Helper to create an offline-cache-aware TileLayer
    const currentStyle = CARTO_CONFIG.styles[currentStyleKey];
    
    // Custom TileLayer checking CacheStorage for offline downloaded tiles
    const OfflineTileLayer = L.TileLayer.extend({
      createTile: function(coords: any, done: (error: any, tile: HTMLImageElement) => void) {
        const tile = document.createElement('img');
        const tileUrl = this.getTileUrl(coords);

        if ('caches' in window) {
          caches.open('safedrive-offline-map-v1').then(cache => {
            cache.match(tileUrl).then(response => {
              if (response) {
                response.blob().then(blob => {
                  tile.src = URL.createObjectURL(blob);
                  done(null, tile);
                });
              } else {
                tile.src = tileUrl;
                L.DomEvent.on(tile, 'load', () => done(null, tile));
                L.DomEvent.on(tile, 'error', (err) => done(err, tile));
              }
            }).catch(() => {
              tile.src = tileUrl;
              L.DomEvent.on(tile, 'load', () => done(null, tile));
              L.DomEvent.on(tile, 'error', (err) => done(err, tile));
            });
          }).catch(() => {
            tile.src = tileUrl;
            L.DomEvent.on(tile, 'load', () => done(null, tile));
            L.DomEvent.on(tile, 'error', (err) => done(err, tile));
          });
        } else {
          tile.src = tileUrl;
          L.DomEvent.on(tile, 'load', () => done(null, tile));
          L.DomEvent.on(tile, 'error', (err) => done(err, tile));
        }

        return tile;
      }
    });

    const tileLayer = new (OfflineTileLayer as any)(currentStyle.url, {
      attribution: currentStyle.attribution,
      maxZoom: currentStyle.maxZoom,
      subdomains: 'abcd'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onMapClickAddWaypoint) {
        onMapClickAddWaypoint(e.latlng.lat, e.latlng.lng);
      }
    });

    mapInstanceRef.current = map;

    // Force size recalculation to prevent partial tiles
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleWindowResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Dynamic Map Style Switching (Voyager / Dark Night / Positron)
  const changeMapStyle = (key: keyof typeof CARTO_CONFIG.styles) => {
    setCurrentStyleKey(key);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newStyle = CARTO_CONFIG.styles[key];
    const newTileLayer = L.tileLayer(newStyle.url, {
      attribution: newStyle.attribution,
      maxZoom: newStyle.maxZoom,
      subdomains: 'abcd'
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  };

  // Update Route Polyline & Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer || !route) return;

    // Clear existing markers
    markersLayer.clearLayers();

    // 1. Draw Route Polylines (Remaining & Traveled)
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (traveledLayerRef.current) {
      map.removeLayer(traveledLayerRef.current);
      traveledLayerRef.current = null;
    }

    if (route.geometry && route.geometry.length > 0) {
      // Traveled segment
      const progressIdx = Math.min(route.geometry.length - 1, driverState.routeProgressIndex);
      const traveledCoords = route.geometry.slice(0, progressIdx + 1);
      const remainingCoords = route.geometry.slice(progressIdx);

      if (traveledCoords.length > 1) {
        traveledLayerRef.current = L.polyline(traveledCoords, {
          color: '#64748B',
          weight: 5,
          opacity: 0.7,
          dashArray: '4, 6',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      const polyline = L.polyline(remainingCoords.length > 1 ? remainingCoords : route.geometry, {
        color: '#059669',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routeLayerRef.current = polyline;

      // Fit bounds initially
      const fullBounds = L.polyline(route.geometry).getBounds();
      map.fitBounds(fullBounds, { padding: [50, 50], maxZoom: 15 });
    }

    // 2. Add Waypoint Markers
    route.waypoints.forEach((wp, index) => {
      const isDepot = wp.type === 'depot';
      const markerHtml = `
        <div style="
          background: ${isDepot ? '#2563EB' : '#059669'};
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
          border: 2px solid white;
        ">
          ${isDepot ? '★' : index + 1}
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-wp-pin',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([wp.lat, wp.lng], { icon })
        .bindPopup(`
          <div style="font-family: inherit; font-size: 13px;">
            <strong style="font-size: 14px; color:#0f172a;">${wp.name}</strong><br/>
            <span style="color:#64748b; font-size:11px;">${wp.address}</span><br/>
            <span style="font-weight:bold; color:${isDepot ? '#2563eb' : '#059669'}; text-transform:uppercase; font-size:11px;">
              ${wp.type}
            </span>
          </div>
        `);

      markersLayer.addLayer(marker);
    });

    // 3. Add Police Station & Safe Haven Markers with Red Alert Badge
    route.policeStationsAlongRoute.forEach(ps => {
      const isTarget = activePoliceTarget?.id === ps.id;
      const policeHtml = `
        <div style="
          background: ${isTarget ? '#dc2626' : '#b91c1c'};
          color: white;
          width: ${isTarget ? '38px' : '32px'};
          height: ${isTarget ? '38px' : '32px'};
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.6);
          border: 2px solid #fecaca;
          cursor: pointer;
          ${isTarget ? 'animation: pulse 1s infinite;' : ''}
        ">
          🚨
        </div>
      `;

      const icon = L.divIcon({
        html: policeHtml,
        className: 'police-station-pin',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([ps.lat, ps.lng], { icon });

      marker.on('click', () => {
        onSelectPoliceStation(ps);
      });

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <div style="background:#fee2e2; color:#991b1b; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:10px; display:inline-block; margin-bottom:4px;">
            VERIFIED 24/7 POLICE SAFE HAVEN
          </div><br/>
          <strong style="font-size: 14px; color:#0f172a;">${ps.name}</strong><br/>
          <span style="color:#475569; font-size:12px;">${ps.address}</span><br/>
          <div style="margin-top:6px; font-weight:bold; color:#dc2626;">
            📞 ${ps.phone}
          </div>
        </div>
      `);

      markersLayer.addLayer(marker);
    });
  }, [route, activePoliceTarget]);

  // Update Diversion Route to Police Station
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (diversionLayerRef.current) {
      map.removeLayer(diversionLayerRef.current);
      diversionLayerRef.current = null;
    }

    if (activePoliceTarget && driverState) {
      const diversionLine = L.polyline(
        [
          [driverState.currentLat, driverState.currentLng],
          [activePoliceTarget.lat, activePoliceTarget.lng]
        ],
        {
          color: '#DC2626',
          weight: 6,
          dashArray: '8, 8',
          opacity: 0.95
        }
      ).addTo(map);

      diversionLayerRef.current = diversionLine;

      map.fitBounds(diversionLine.getBounds(), { padding: [60, 60] });
    }
  }, [activePoliceTarget, driverState.currentLat, driverState.currentLng]);

  // Update Driver Vehicle Location Marker & Dynamic Path Trail
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Dynamic Route Polyline Splitting: Traveled Trail vs. Remaining Route
    if (route && route.geometry && route.geometry.length > 0) {
      const progressIdx = Math.min(route.geometry.length - 1, driverState.routeProgressIndex);
      const traveledCoords = route.geometry.slice(0, progressIdx + 1);
      const remainingCoords = route.geometry.slice(progressIdx);

      if (traveledLayerRef.current) {
        if (traveledCoords.length > 1) {
          traveledLayerRef.current.setLatLngs(traveledCoords);
        }
      } else if (traveledCoords.length > 1) {
        traveledLayerRef.current = L.polyline(traveledCoords, {
          color: '#64748B',
          weight: 5,
          opacity: 0.7,
          dashArray: '4, 6',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      if (routeLayerRef.current) {
        routeLayerRef.current.setLatLngs(remainingCoords.length > 1 ? remainingCoords : route.geometry);
      }
    }

    // 2. High-Visibility Directional Navigation Puck with SafeDrive Logo & Pinned Location Tag
    const isEmergency = driverState.status === 'emergency_alert' || driverState.status === 'diverting_to_police';

    const locationName = driverState.currentLocationTag || (route ? route.waypoints[0]?.name : 'Navigating Corridor');

    const driverHtml = `
      <div style="position:relative; width:56px; height:56px; display:flex; align-items:center; justify-content:center;">
        <!-- Pulsing radar wave ring -->
        <span class="radar-ping" style="
          position:absolute;
          width:44px;
          height:44px;
          border-radius:50%;
          background: ${isEmergency ? 'rgba(239, 68, 68, 0.45)' : 'rgba(16, 185, 129, 0.35)'};
          pointer-events: none;
        "></span>

        <!-- Pinned Location Tag Callout with Directional Pointer directly over the centroid -->
        <div style="
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: #ffffff;
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 5px 11px;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.16), 0 1px 3px rgba(15, 23, 42, 0.08);
          border: 1.5px solid ${isEmergency ? '#fca5a5' : '#e2e8f0'};
          pointer-events: none;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        ">
          <!-- Top Row: Live Exact Location Tag Name -->
          <div style="display:flex; align-items:center; gap: 5px;">
            <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:${isEmergency ? '#ef4444' : '#10b981'}; box-shadow: 0 0 6px ${isEmergency ? '#ef4444' : '#10b981'};"></span>
            <span style="font-weight: 800; font-size: 11px; color: ${isEmergency ? '#b91c1c' : '#0f172a'}; letter-spacing: -0.2px;">
              📍 ${locationName}
            </span>
          </div>

          <!-- Bottom Row: Telemetry, Speed & Heading -->
          <div style="display:flex; align-items:center; gap: 5px; font-size: 9.5px; font-weight: 700; color: #64748b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <span style="color: ${isEmergency ? '#dc2626' : '#047857'}; font-weight: 800; display:flex; align-items:center; gap:3px;">
              <img src="/school-logo.png" style="width:12px; height:12px; object-fit:contain; border-radius:2px;" alt="DPS" />
              ${isEmergency ? '🚨 SOS EMERGENCY' : 'DPS SCHOOL BUS'}
            </span>
            <span style="color:#cbd5e1">•</span>
            <span style="font-mono">${driverState.currentSpeedKmh || 48} km/h</span>
            <span style="color:#cbd5e1">•</span>
            <span style="font-mono">${driverState.heading}°</span>
          </div>

          <!-- Downward Pointer Arrow pointing directly to the center hub -->
          <div style="
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid ${isEmergency ? '#fca5a5' : '#ffffff'};
          "></div>
        </div>

        <!-- Center Hub with School Logo and Rotating Heading Pointer -->
        <div style="
          position:relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${isEmergency ? '#dc2626' : '#ffffff'};
          border: 2.5px solid ${isEmergency ? '#fee2e2' : '#047857'};
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Official Delhi Public School Crest Emblem -->
          <img src="/school-logo.png" alt="DPS School Logo" style="
            width: 32px;
            height: 32px;
            object-fit: contain;
            border-radius: 50%;
            background: #ffffff;
            padding: 1px;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
            pointer-events: none;
          " />

          <!-- True Compass Heading Needle rotating around the School Logo -->
          <div style="
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            transform: rotate(${driverState.heading}deg);
            transform-origin: center center;
            transition: transform 0.4s ease-out;
            pointer-events: none;
          ">
            <div style="
              position: absolute;
              top: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 9px solid ${isEmergency ? '#dc2626' : '#047857'};
              filter: drop-shadow(0 -1px 2px rgba(0,0,0,0.35));
            "></div>
          </div>
        </div>
      </div>
    `;

    const icon = L.divIcon({
      html: driverHtml,
      className: 'driver-car-pin',
      iconSize: [56, 56],
      iconAnchor: [28, 28]
    });

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker([driverState.currentLat, driverState.currentLng], { icon, zIndexOffset: 1000 }).addTo(map);
    } else {
      driverMarkerRef.current.setLatLng([driverState.currentLat, driverState.currentLng]);
      driverMarkerRef.current.setIcon(icon);
    }

    // 3. Smooth Auto-Follow camera tracking
    if (autoFollow && driverState.isDriving) {
      map.panTo([driverState.currentLat, driverState.currentLng], { animate: true, duration: 0.6 });
    }
  }, [
    driverState.currentLat,
    driverState.currentLng,
    driverState.heading,
    driverState.currentSpeedKmh,
    driverState.routeProgressIndex,
    driverState.currentLocationTag,
    driverState.status,
    autoFollow,
    route
  ]);

  const handleRecenter = () => {
    if (mapInstanceRef.current && driverState) {
      mapInstanceRef.current.setView([driverState.currentLat, driverState.currentLng], 15, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm isolate z-0">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '460px' }} />

      {/* Map Floating Badges & Recenter Control */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-2 text-xs text-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
          <span className="font-semibold">Live GPS Moving: {driverState.currentSpeedKmh || 48} km/h</span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-xl shadow-sm flex items-center space-x-1.5 text-[10px] text-slate-600">
          <span className="text-emerald-700 font-bold">CARTO® Map</span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-500">Bearing: {driverState.heading}°</span>
        </div>

        {activePoliceTarget && (
          <div className="bg-rose-50 border border-rose-300 px-3 py-2 rounded-xl shadow-sm flex items-center space-x-2 text-xs text-rose-800">
            <span className="text-sm">🚨</span>
            <div>
              <div className="font-bold text-rose-900">POLICE SAFE HAVEN LOCKED</div>
              <div className="text-[10px] text-rose-700">{activePoliceTarget.name}</div>
            </div>
          </div>
        )}
      </div>

      {/* Map Style Selector (Top Right) */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto flex items-center space-x-1 bg-white/95 backdrop-blur-sm border border-slate-200 p-1 rounded-xl shadow-sm text-xs">
        <button
          onClick={() => changeMapStyle('voyager')}
          className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
            currentStyleKey === 'voyager'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Voyager
        </button>
        <button
          onClick={() => changeMapStyle('positron')}
          className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
            currentStyleKey === 'positron'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Minimal Light
        </button>
        <button
          onClick={() => changeMapStyle('darkMatter')}
          className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
            currentStyleKey === 'darkMatter'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Night
        </button>
      </div>

      {/* Bottom Controls: Recenter & Auto-Follow Camera Toggle */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto flex items-center space-x-2">
        <button
          onClick={handleRecenter}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm transition"
        >
          <span>🎯</span>
          <span>Center Vehicle</span>
        </button>

        <button
          onClick={() => setAutoFollow(!autoFollow)}
          title="Toggle camera following moving vehicle"
          className={`flex items-center space-x-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold shadow-sm transition ${
            autoFollow
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <span>📍</span>
          <span>Auto-Follow: {autoFollow ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Legend Badge: Traveled Trail vs Safe Route */}
      <div className="absolute bottom-4 right-14 z-10 hidden sm:flex items-center space-x-3 bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] text-slate-600 shadow-sm">
        <span className="flex items-center space-x-1">
          <span className="w-3 h-1 bg-slate-500 rounded"></span>
          <span>Traveled Trail</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-3 h-1 bg-emerald-600 rounded"></span>
          <span>Remaining Route</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          <span>Police Haven</span>
        </span>
      </div>
    </div>
  );
};
