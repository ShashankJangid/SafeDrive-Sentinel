import React from 'react';
import {
  X,
  FileDown,
  Navigation,
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Code2
} from 'lucide-react';
import { OptimizedRoute, AppSettings } from '../types';
import { RouteExportService } from '../services/exportService';
import { translations } from '../i18n/translations';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: OptimizedRoute | null;
  settings: AppSettings;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  route,
  settings
}) => {
  const t = translations[settings.language] || translations.en;

  if (!isOpen || !route) return null;

  const handleDownloadGPX = () => {
    RouteExportService.downloadGPX(route, settings);
  };

  const handleDownloadGeoJSON = () => {
    RouteExportService.downloadGeoJSON(route, settings);
  };

  const handleDownloadJSON = () => {
    RouteExportService.downloadJSON(route, settings);
  };

  const handlePrintManifest = () => {
    RouteExportService.printDriverSafetyManifest(route, settings);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {t.downloadRoute}
              </h3>
              <p className="text-xs text-slate-500">
                {t.exportDesc}
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

        {/* Route Summary Pill */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div>
            Route: <strong className="text-slate-900">{route.name}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 font-semibold">{route.totalDistanceKm} km</span>
            <span>•</span>
            <span className="text-sky-700 font-semibold">{route.estimatedDurationMin} mins</span>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-5 space-y-3">
          
          {/* GPX Format */}
          <button
            onClick={handleDownloadGPX}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition group text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {t.downloadGpx}
                </div>
                <div className="text-xs text-slate-500">
                  Universal GPS eXchange format for Garmin, vehicle in-dash navigators, and handhelds.
                </div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition shrink-0 ml-2" />
          </button>

          {/* GeoJSON Format */}
          <button
            onClick={handleDownloadGeoJSON}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition group text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 group-hover:scale-105 transition">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {t.downloadGeoJson}
                </div>
                <div className="text-xs text-slate-500">
                  Standard GIS vector geometry with stop properties, police haven coordinates, and safety metrics.
                </div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition shrink-0 ml-2" />
          </button>

          {/* Printable / PDF Safety Manifest */}
          <button
            onClick={handlePrintManifest}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition group text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 group-hover:scale-105 transition">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {t.downloadManifest}
                </div>
                <div className="text-xs text-slate-500">
                  Physical / PDF driver itinerary with printed police station list, emergency numbers, and check-in plan.
                </div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition shrink-0 ml-2" />
          </button>

          {/* Fleet JSON Package */}
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition group text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 group-hover:scale-105 transition">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {t.downloadJson}
                </div>
                <div className="text-xs text-slate-500">
                  Complete fleet telematics package with driver heartbeat intervals and emergency parameters.
                </div>
              </div>
            </div>
            <FileDown className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition shrink-0 ml-2" />
          </button>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
