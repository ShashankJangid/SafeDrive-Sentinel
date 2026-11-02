import { CARTO_CONFIG } from '../config/mapConfig';

export interface OfflineRegion {
  id: string;
  name: string;
  downloadDate: string;
  tileCount: number;
  sizeBytes: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export interface OfflineDownloadProgress {
  status: 'idle' | 'calculating' | 'downloading' | 'completed' | 'error';
  totalTiles: number;
  downloadedTiles: number;
  failedTiles: number;
  percent: number;
  estimatedSizeMB: number;
  currentTileUrl?: string;
}

const CACHE_NAME = 'safedrive-offline-map-v1';

// Convert lat/lng to Slippy tile numbers
function lon2tile(lon: number, zoom: number): number {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat: number, zoom: number): number {
  return Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
}

export class OfflineMapService {
  // Estimate tiles for a bounding box across zoom levels
  public static calculateTilesForBounds(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    minZoom = 12,
    maxZoom = 14
  ): { x: number; y: number; z: number; url: string }[] {
    const tiles: { x: number; y: number; z: number; url: string }[] = [];
    const template = CARTO_CONFIG.styles.voyager.url;

    for (let z = minZoom; z <= maxZoom; z++) {
      const xMin = lon2tile(minLng, z);
      const xMax = lon2tile(maxLng, z);
      const yMin = lat2tile(maxLat, z);
      const yMax = lat2tile(minLat, z);

      for (let x = Math.min(xMin, xMax); x <= Math.max(xMin, xMax); x++) {
        for (let y = Math.min(yMin, yMax); y <= Math.max(yMin, yMax); y++) {
          const url = template
            .replace('{z}', z.toString())
            .replace('{x}', x.toString())
            .replace('{y}', y.toString());
          tiles.push({ x, y, z, url });
        }
      }
    }

    return tiles;
  }

  // Download and cache tiles into CacheStorage API
  public static async downloadRouteTiles(
    coordinates: [number, number][],
    onProgress: (progress: OfflineDownloadProgress) => void
  ): Promise<boolean> {
    if (!('caches' in window) || coordinates.length === 0) {
      onProgress({
        status: 'error',
        totalTiles: 0,
        downloadedTiles: 0,
        failedTiles: 0,
        percent: 0,
        estimatedSizeMB: 0
      });
      return false;
    }

    onProgress({
      status: 'calculating',
      totalTiles: 0,
      downloadedTiles: 0,
      failedTiles: 0,
      percent: 0,
      estimatedSizeMB: 0
    });

    // Compute bounding box with 0.03 degree padding (~3km)
    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;

    coordinates.forEach(([lat, lng]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    const pad = 0.03;
    minLat -= pad;
    maxLat += pad;
    minLng -= pad;
    maxLng += pad;

    const tiles = this.calculateTilesForBounds(minLat, minLng, maxLat, maxLng, 12, 14);
    const totalTiles = Math.min(tiles.length, 350); // Cap at 350 tiles to prevent excessive bandwidth
    const estimatedSizeMB = Math.round((totalTiles * 0.02) * 10) / 10;

    onProgress({
      status: 'downloading',
      totalTiles,
      downloadedTiles: 0,
      failedTiles: 0,
      percent: 0,
      estimatedSizeMB
    });

    try {
      const cache = await caches.open(CACHE_NAME);
      let downloaded = 0;
      let failed = 0;

      // Download in batches of 4 concurrent requests to be lightweight on battery
      const batchSize = 4;
      for (let i = 0; i < totalTiles; i += batchSize) {
        const batch = tiles.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (tile) => {
            try {
              const req = new Request(tile.url, { mode: 'cors' });
              const existing = await cache.match(req);
              if (!existing) {
                const response = await fetch(req);
                if (response.ok) {
                  await cache.put(req, response);
                }
              }
              downloaded++;
            } catch (err) {
              failed++;
            }
          })
        );

        const currentPercent = Math.min(100, Math.round(((downloaded + failed) / totalTiles) * 100));
        onProgress({
          status: 'downloading',
          totalTiles,
          downloadedTiles: downloaded,
          failedTiles: failed,
          percent: currentPercent,
          estimatedSizeMB,
          currentTileUrl: tiles[i]?.url
        });
      }

      // Record offline metadata in localStorage
      const offlineMeta: OfflineRegion = {
        id: `offline-region-${Date.now()}`,
        name: 'Active Route Corridor Offline Pack',
        downloadDate: new Date().toISOString(),
        tileCount: downloaded,
        sizeBytes: downloaded * 20480, // ~20KB per tile
        bounds: { minLat, maxLat, minLng, maxLng }
      };
      localStorage.setItem('safedrive_offline_active', JSON.stringify(offlineMeta));

      onProgress({
        status: 'completed',
        totalTiles,
        downloadedTiles: downloaded,
        failedTiles: failed,
        percent: 100,
        estimatedSizeMB
      });

      return true;
    } catch (e) {
      console.error('Offline map download failed:', e);
      onProgress({
        status: 'error',
        totalTiles,
        downloadedTiles: 0,
        failedTiles: totalTiles,
        percent: 0,
        estimatedSizeMB
      });
      return false;
    }
  }

  // Check if active offline pack exists
  public static getActiveOfflineRegion(): OfflineRegion | null {
    try {
      const item = localStorage.getItem('safedrive_offline_active');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  // Clear offline tile cache
  public static async clearOfflineCache(): Promise<void> {
    if ('caches' in window) {
      await caches.delete(CACHE_NAME);
    }
    localStorage.removeItem('safedrive_offline_active');
  }
}
