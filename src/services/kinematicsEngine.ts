import { calculateHaversineDistanceKm, calculateBearing } from './routeOptimizer';
import { Waypoint } from '../types';

export interface RouteKinematics {
  cumulativeDistances: number[]; // distance in km from start to each vertex
  totalDistanceKm: number;
  waypointPositionsKm: { waypoint: Waypoint; cumulativeKm: number }[];
}

export interface ProgressState {
  lat: number;
  lng: number;
  bearing: number;
  segmentIndex: number;
  traveledKm: number;
  remainingKm: number;
  remainingMin: number;
  etaClock: string;
  nextWaypointName: string;
  nextWaypointDistanceKm: number;
  nextWaypointEtaMin: number;
}

export class KinematicsEngine {
  // Precompute cumulative distances along the route geometry
  public static precomputeRoute(
    geometry: [number, number][],
    waypoints: Waypoint[]
  ): RouteKinematics {
    if (!geometry || geometry.length < 2) {
      return {
        cumulativeDistances: [0],
        totalDistanceKm: 0,
        waypointPositionsKm: []
      };
    }

    const cumulativeDistances: number[] = [0];
    let total = 0;

    for (let i = 0; i < geometry.length - 1; i++) {
      const segDist = calculateHaversineDistanceKm(
        geometry[i][0],
        geometry[i][1],
        geometry[i + 1][0],
        geometry[i + 1][1]
      );
      total += segDist;
      cumulativeDistances.push(total);
    }

    // Map each delivery waypoint to its closest cumulative distance along geometry
    const waypointPositionsKm = waypoints.map((wp, idx) => {
      if (idx === 0) return { waypoint: wp, cumulativeKm: 0 };
      if (idx === waypoints.length - 1) return { waypoint: wp, cumulativeKm: total };

      let closestIdx = 0;
      let minD = Infinity;

      for (let g = 0; g < geometry.length; g++) {
        const d = calculateHaversineDistanceKm(wp.lat, wp.lng, geometry[g][0], geometry[g][1]);
        if (d < minD) {
          minD = d;
          closestIdx = g;
        }
      }

      return {
        waypoint: wp,
        cumulativeKm: cumulativeDistances[closestIdx]
      };
    });

    return {
      cumulativeDistances,
      totalDistanceKm: Math.round(total * 100) / 100,
      waypointPositionsKm
    };
  }

  // Calculate practical position, bearing, ETA clock, and next stop given distance traveled
  public static calculateProgress(
    traveledKm: number,
    kinematics: RouteKinematics,
    geometry: [number, number][],
    currentSpeedKmh: number
  ): ProgressState {
    const totalKm = kinematics.totalDistanceKm || 1;
    const clampedTraveled = Math.min(totalKm, Math.max(0, traveledKm));
    const remainingKm = Math.max(0, Math.round((totalKm - clampedTraveled) * 100) / 100);

    // Find active segment [i, i+1]
    let segIdx = 0;
    const cum = kinematics.cumulativeDistances;

    for (let i = 0; i < cum.length - 1; i++) {
      if (clampedTraveled >= cum[i] && clampedTraveled <= cum[i + 1]) {
        segIdx = i;
        break;
      }
      if (i === cum.length - 2) {
        segIdx = i;
      }
    }

    const segStartKm = cum[segIdx];
    const segEndKm = cum[segIdx + 1] || segStartKm + 0.0001;
    const segSpan = segEndKm - segStartKm;

    const ratio = segSpan > 0 ? (clampedTraveled - segStartKm) / segSpan : 0;
    const clampedRatio = Math.max(0, Math.min(1, ratio));

    const p1 = geometry[segIdx];
    const p2 = geometry[segIdx + 1] || p1;

    // Linear interpolation along the road segment
    const lat = p1[0] + (p2[0] - p1[0]) * clampedRatio;
    const lng = p1[1] + (p2[1] - p1[1]) * clampedRatio;

    // True compass bearing
    const bearing = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

    // Practical ETA calculation: Time = Distance / Speed
    const effectiveSpeed = Math.max(20, currentSpeedKmh);
    const remainingMin = Math.max(1, Math.round((remainingKm / effectiveSpeed) * 60));

    // Clock arrival time
    const now = new Date();
    const etaDate = new Date(now.getTime() + remainingMin * 60 * 1000);
    const etaClock = etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Locate next upcoming delivery stop
    let nextWpName = 'Final Destination';
    let nextWpDistKm = remainingKm;
    let nextWpEtaMin = remainingMin;

    for (const wpPos of kinematics.waypointPositionsKm) {
      if (wpPos.cumulativeKm > clampedTraveled + 0.05) {
        nextWpName = wpPos.waypoint.name;
        nextWpDistKm = Math.max(0.1, Math.round((wpPos.cumulativeKm - clampedTraveled) * 10) / 10);
        nextWpEtaMin = Math.max(1, Math.round((nextWpDistKm / effectiveSpeed) * 60));
        break;
      }
    }

    return {
      lat,
      lng,
      bearing,
      segmentIndex: segIdx,
      traveledKm: Math.round(clampedTraveled * 100) / 100,
      remainingKm,
      remainingMin,
      etaClock,
      nextWaypointName: nextWpName,
      nextWaypointDistanceKm: nextWpDistKm,
      nextWaypointEtaMin: nextWpEtaMin
    };
  }
}
