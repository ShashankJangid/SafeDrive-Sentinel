import { Waypoint, PoliceStation, OptimizedRoute } from '../types';

// Haversine distance formula between two lat/lng coordinates in kilometers
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 2-Opt TSP optimization for intermediate waypoints
export function optimizeWaypointsTSP(waypoints: Waypoint[]): Waypoint[] {
  if (waypoints.length <= 3) return [...waypoints];

  // Keep first waypoint as Depot/Start
  const start = waypoints[0];
  const stops = waypoints.slice(1);

  // Greedy Nearest Neighbor initialization
  const visited: Waypoint[] = [];
  const remaining = [...stops];
  let current = start;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = calculateHaversineDistanceKm(
        current.lat,
        current.lng,
        remaining[i].lat,
        remaining[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        bestIdx = i;
      }
    }

    const nextStop = remaining.splice(bestIdx, 1)[0];
    visited.push(nextStop);
    current = nextStop;
  }

  // 2-Opt local search improvement
  let improved = true;
  let tour = [...visited];

  const totalDist = (route: Waypoint[]) => {
    let d = calculateHaversineDistanceKm(start.lat, start.lng, route[0].lat, route[0].lng);
    for (let i = 0; i < route.length - 1; i++) {
      d += calculateHaversineDistanceKm(route[i].lat, route[i].lng, route[i + 1].lat, route[i + 1].lng);
    }
    return d;
  };

  let maxIterations = 20;
  while (improved && maxIterations-- > 0) {
    improved = false;
    for (let i = 0; i < tour.length - 1; i++) {
      for (let k = i + 1; k < tour.length; k++) {
        const newTour = [...tour.slice(0, i), ...tour.slice(i, k + 1).reverse(), ...tour.slice(k + 1)];
        if (totalDist(newTour) < totalDist(tour) - 0.05) {
          tour = newTour;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  return [start, ...tour];
}

// Fetch real road geometry from OpenStreetMap OSRM routing API with robust fallback
export async function calculateRouteGeometry(
  waypoints: Waypoint[]
): Promise<{ coordinates: [number, number][]; distanceKm: number; durationMin: number }> {
  if (waypoints.length < 2) {
    return {
      coordinates: waypoints.map(w => [w.lat, w.lng]),
      distanceKm: 0,
      durationMin: 0
    };
  }

  try {
    // Format: lng,lat;lng,lat
    const coordsString = waypoints.map(w => `${w.lng},${w.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM returns coordinates as [lng, lat], convert to [lat, lng] for Leaflet
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );
        const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
        const durationMin = Math.round(route.duration / 60);

        return { coordinates, distanceKm, durationMin };
      }
    }
  } catch (e) {
    console.warn("OSRM routing API unavailable, applying geodesic curvature model:", e);
  }

  // Fallback: Geodesic interpolation with natural road-like curvature
  const coordinates: [number, number][] = [];
  let totalKm = 0;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const segmentDist = calculateHaversineDistanceKm(from.lat, from.lng, to.lat, to.lng);
    totalKm += segmentDist;

    // Generate smooth curve steps between waypoints
    const steps = Math.max(12, Math.min(30, Math.floor(segmentDist * 3)));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      // Slight perpendicular curve offset to simulate real roads rather than straight line
      const curveMagnitude = Math.sin(t * Math.PI) * 0.003;
      const lat = from.lat + (to.lat - from.lat) * t + (i % 2 === 0 ? curveMagnitude : -curveMagnitude);
      const lng = from.lng + (to.lng - from.lng) * t + (i % 2 === 1 ? curveMagnitude : -curveMagnitude);
      coordinates.push([lat, lng]);
    }
  }

  // Assuming average urban/suburban speed of 48 km/h
  const durationMin = Math.round((totalKm / 48) * 60);

  return {
    coordinates,
    distanceKm: Math.round(totalKm * 10) / 10,
    durationMin
  };
}

// Locate nearest police station from any arbitrary lat/lng
export function findNearestPoliceStation(
  lat: number,
  lng: number,
  stations: PoliceStation[]
): { station: PoliceStation; distanceKm: number; estimatedArrivalMin: number } | null {
  if (!stations || stations.length === 0) return null;

  let closest = stations[0];
  let minDistance = calculateHaversineDistanceKm(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < stations.length; i++) {
    const dist = calculateHaversineDistanceKm(lat, lng, stations[i].lat, stations[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = stations[i];
    }
  }

  // Estimate arrival time at 50 km/h emergency speed
  const estimatedArrivalMin = Math.max(1, Math.round((minDistance / 50) * 60));

  return {
    station: {
      ...closest,
      distanceKm: Math.round(minDistance * 10) / 10,
      estimatedArrivalMin
    },
    distanceKm: Math.round(minDistance * 10) / 10,
    estimatedArrivalMin
  };
}

// Calculate accurate compass bearing from (lat1, lon1) to (lat2, lon2)
// Returns 0° = North, 90° = East, 180° = South, 270° = West
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = Math.PI / 180;
  const toDeg = 180 / Math.PI;

  const φ1 = lat1 * toRad;
  const φ2 = lat2 * toRad;
  const Δλ = (lon2 - lon1) * toRad;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  const bearing = (θ * toDeg + 360) % 360;
  return Math.round(bearing);
}

// Calculate remaining path distance in km along coordinates from a given index
export function calculateRemainingPathDistance(
  geometry: [number, number][],
  fromIndex: number
): number {
  if (!geometry || geometry.length < 2 || fromIndex >= geometry.length - 1) return 0;
  let dist = 0;
  for (let i = fromIndex; i < geometry.length - 1; i++) {
    dist += calculateHaversineDistanceKm(
      geometry[i][0],
      geometry[i][1],
      geometry[i + 1][0],
      geometry[i + 1][1]
    );
  }
  return Math.round(dist * 10) / 10;
}

// Identify the next unreached delivery waypoint along the route
export function findNextUpcomingWaypoint(
  currentLat: number,
  currentLng: number,
  waypoints: Waypoint[],
  progressRatio: number
): { name: string; distanceKm: number } | null {
  if (!waypoints || waypoints.length === 0) return null;

  // Determine estimated index in waypoints list
  const estimatedWpIndex = Math.min(
    waypoints.length - 1,
    Math.max(1, Math.floor(progressRatio * (waypoints.length - 1)) + 1)
  );

  const nextWp = waypoints[estimatedWpIndex];
  const dist = calculateHaversineDistanceKm(currentLat, currentLng, nextWp.lat, nextWp.lng);

  return {
    name: nextWp.name,
    distanceKm: Math.round(dist * 10) / 10
  };
}

// Calculate comprehensive Safety Score (0 - 100) for a route
export function calculateRouteSafetyScore(
  geometry: [number, number][],
  policeStations: PoliceStation[]
): number {
  if (geometry.length === 0 || policeStations.length === 0) return 85;

  // Sample points along route to check average distance to safe haven
  const sampleStep = Math.max(1, Math.floor(geometry.length / 10));
  let totalMinDistToPolice = 0;
  let sampleCount = 0;

  for (let i = 0; i < geometry.length; i += sampleStep) {
    const [pLat, pLng] = geometry[i];
    let minDist = Infinity;
    for (const station of policeStations) {
      const d = calculateHaversineDistanceKm(pLat, pLng, station.lat, station.lng);
      if (d < minDist) minDist = d;
    }
    totalMinDistToPolice += minDist;
    sampleCount++;
  }

  const avgDistanceToPolice = totalMinDistToPolice / Math.max(1, sampleCount);

  // If average distance < 2km -> score 96+
  // If average distance < 5km -> score 85-95
  // If average distance > 10km -> score ~75
  let score = 98 - (avgDistanceToPolice * 2.2);
  score = Math.max(68, Math.min(99, Math.round(score)));

  return score;
}
