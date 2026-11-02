import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  Trash2,
  HardDrive,
  BatteryCharging,
  WifiOff,
  RefreshCw,
  Layers
} from 'lucide-react';
import { OptimizedRoute } from '../types';
import {
  OfflineMapService,
  OfflineRegion,
  OfflineDownloadProgress
} from '../services/offlineMapService';

interface OfflineMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: OptimizedRoute | null;
}

export const OfflineMapModal: React.FC<OfflineMapModalProps> = ({
  isOpen,
  onClose,
  route
}) => {
  const [offlineMeta, setOfflineMeta] = useState<OfflineRegion | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<OfflineDownloadProgress>({
    status: 'idle',
    totalTiles: 0,
    downloadedTiles: 0,
    failedTiles: 0,
    percent: 0,
    estimatedSizeMB: 0
  });

  useEffect(() => {
    if (isOpen) {
      const active = OfflineMapService.getActiveOfflineRegion();
      setOfflineMeta(active);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    if (!route || route.geometry.length === 0) return;

    await OfflineMapService.downloadRouteTiles(route.geometry, (progress) => {
      setDownloadProgress(progress);
      if (progress.status === 'completed') {
        const active = OfflineMapService.getActiveOfflineRegion();
        setOfflineMeta(active);
      }
    });
  };

  const handleClearCache = async () => {
    await OfflineMapService.clearOfflineCache();
    setOfflineMeta(null);
    setDownloadProgress({
      status: 'idle',
      totalTiles: 0,
      downloadedTiles: 0,
      failedTiles: 0,
      percent: 0,
      estimatedSizeMB: 0
    });
  };

  const isDownloading = downloadProgress.status === 'downloading' || downloadProgress.status === 'calculating';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Offline Map Package
              </h3>
              <p className="text-xs text-slate-500">
                Cache map tiles locally for zero-data and low-battery navigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Status Card */}
          {offlineMeta ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-900">
                    Offline Map Ready &amp; Cached
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    {offlineMeta.tileCount} high-res tiles stored &bull; ~{(offlineMeta.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1">
                    Cached on {new Date(offlineMeta.downloadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <button
                onClick={handleClearCache}
                title="Clear cached tiles"
                className="p-2 text-rose-600 hover:bg-rose-100/60 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-3">
              <HardDrive className="w-5 h-5 text-slate-400 shrink-0" />
              <div className="text-xs text-slate-600">
                No offline map downloaded yet for this corridor.
              </div>
            </div>
          )}

          {/* Low Battery & Data Benefit Note */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center space-x-2.5 text-xs text-amber-900">
            <BatteryCharging className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Battery Saver:</strong> Serving map tiles from device memory eliminates 4G/5G radio transmission, reducing battery drain by up to 35%.
            </span>
          </div>

          {/* Download Progress Bar */}
          {isDownloading && (
            <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>
                    {downloadProgress.status === 'calculating'
                      ? 'Analyzing route corridor tiles...'
                      : `Caching tiles (${downloadProgress.downloadedTiles} / ${downloadProgress.totalTiles})`}
                  </span>
                </span>
                <span className="font-mono text-emerald-700">{downloadProgress.percent}%</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-200"
                  style={{ width: `${downloadProgress.percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div>
            <button
              onClick={handleStartDownload}
              disabled={isDownloading || !route}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>
                {offlineMeta ? 'Update / Re-download Corridor Tiles' : 'Download Route Map for Offline Use'}
              </span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/50 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
