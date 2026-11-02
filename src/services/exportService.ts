import { OptimizedRoute, PoliceStation, AppSettings } from '../types';

export class RouteExportService {
  // Download standard GPX (GPS Exchange Format) file
  public static downloadGPX(route: OptimizedRoute, settings: AppSettings): void {
    const timestamp = new Date().toISOString();
    
    // Build GPX 1.1 XML
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="SafeDrive Sentinel AI - Driver Safety Route Optimizer"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${this.escapeXml(route.name)}</name>
    <desc>Safe commercial delivery corridor with verified police stations. Driver: ${this.escapeXml(settings.driverName)}. Vehicle: ${this.escapeXml(settings.vehicleId)}. Safety Score: ${route.safetyScore}/100.</desc>
    <time>${timestamp}</time>
  </metadata>
`;

    // Add Waypoints
    route.waypoints.forEach((wp, idx) => {
      gpx += `  <wpt lat="${wp.lat}" lon="${wp.lng}">
    <name>[${idx + 1}] ${this.escapeXml(wp.name)}</name>
    <desc>${this.escapeXml(wp.address || '')}</desc>
    <type>${wp.type}</type>
  </wpt>\n`;
    });

    // Add Police Stations as Emergency Safe Haven POIs
    route.policeStationsAlongRoute.forEach(ps => {
      gpx += `  <wpt lat="${ps.lat}" lon="${ps.lng}">
    <name>[POLICE] ${this.escapeXml(ps.name)}</name>
    <desc>24/7 Police Safe Haven. Phone: ${this.escapeXml(ps.phone)}. Address: ${this.escapeXml(ps.address)}</desc>
    <type>police_emergency_haven</type>
  </wpt>\n`;
    });

    // Add Track Geometry
    gpx += `  <trk>
    <name>${this.escapeXml(route.name)}</name>
    <trkseg>\n`;

    route.geometry.forEach(([lat, lng]) => {
      gpx += `      <trkpt lat="${lat}" lon="${lng}"><ele>0</ele></trkpt>\n`;
    });

    gpx += `    </trkseg>
  </trk>
</gpx>`;

    this.triggerBrowserDownload(gpx, `${this.sanitizeFilename(route.name)}_SafeDrive.gpx`, 'application/gpx+xml');
  }

  // Download RFC 7946 GeoJSON
  public static downloadGeoJSON(route: OptimizedRoute, settings: AppSettings): void {
    const geojson = {
      type: "FeatureCollection",
      metadata: {
        title: route.name,
        generatedAt: new Date().toISOString(),
        driverName: settings.driverName,
        vehicleId: settings.vehicleId,
        totalDistanceKm: route.totalDistanceKm,
        estimatedDurationMin: route.estimatedDurationMin,
        safetyScore: route.safetyScore,
        safetyCheckIntervalSeconds: settings.safetyIntervalSeconds
      },
      features: [
        // Route LineString
        {
          type: "Feature",
          properties: {
            name: route.name,
            type: "route_corridor",
            distanceKm: route.totalDistanceKm,
            durationMin: route.estimatedDurationMin,
            safetyScore: route.safetyScore,
            stroke: "#10b981",
            "stroke-width": 5
          },
          geometry: {
            type: "LineString",
            // GeoJSON coordinates are [lon, lat]
            coordinates: route.geometry.map(([lat, lng]) => [lng, lat])
          }
        },
        // Waypoint stops
        ...route.waypoints.map((wp, i) => ({
          type: "Feature",
          properties: {
            index: i + 1,
            name: wp.name,
            address: wp.address,
            type: wp.type,
            priority: wp.priority || 'normal',
            "marker-color": wp.type === 'depot' ? '#3b82f6' : '#10b981'
          },
          geometry: {
            type: "Point",
            coordinates: [wp.lng, wp.lat]
          }
        })),
        // Police Stations Safe Havens
        ...route.policeStationsAlongRoute.map(ps => ({
          type: "Feature",
          properties: {
            name: ps.name,
            address: ps.address,
            phone: ps.phone,
            jurisdiction: ps.jurisdiction,
            open24_7: ps.open24_7,
            type: "emergency_police_station",
            "marker-color": "#ef4444",
            "marker-symbol": "police"
          },
          geometry: {
            type: "Point",
            coordinates: [ps.lng, ps.lat]
          }
        }))
      ]
    };

    const content = JSON.stringify(geojson, null, 2);
    this.triggerBrowserDownload(content, `${this.sanitizeFilename(route.name)}_Route.geojson`, 'application/geo+json');
  }

  // Download complete Fleet Telematics JSON
  public static downloadJSON(route: OptimizedRoute, settings: AppSettings): void {
    const data = {
      app: "SafeDrive Sentinel Enterprise",
      version: "2.0.0",
      exportTime: new Date().toISOString(),
      route,
      settings: {
        safetyIntervalSeconds: settings.safetyIntervalSeconds,
        promptTimeoutSeconds: settings.promptTimeoutSeconds,
        driverName: settings.driverName,
        vehicleId: settings.vehicleId,
        emergencyContact: settings.emergencyContact
      }
    };
    const content = JSON.stringify(data, null, 2);
    this.triggerBrowserDownload(content, `${this.sanitizeFilename(route.name)}_FleetPackage.json`, 'application/json');
  }

  // Open a clean printable safety manifest window with print dialog
  public static printDriverSafetyManifest(route: OptimizedRoute, settings: AppSettings): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to open the Driver Safety Manifest.");
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Driver Safety & Route Manifest - ${this.escapeXml(route.name)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 40px; color: #1e293b; }
    .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 25px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
    .badge-safe { background: #dcfce7; color: #15803d; }
    .badge-police { background: #fee2e2; color: #b91c1c; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { text-align: left; background: #0f172a; color: white; padding: 10px 12px; font-size: 13px; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
    .police-box { background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 18px; margin-top: 30px; }
    .footer { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 15px; }
    @media print {
      body { margin: 15mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background:#0f172a; color:white; border:none; padding:10px 20px; font-size:14px; border-radius:6px; cursor:pointer; font-weight:bold;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
      <div>
        <h1 style="margin:0 0 6px 0; font-size: 24px;">SAFEDRIVE SENTINEL &trade; COMMERCIAL MANIFEST</h1>
        <div style="font-size: 15px; color:#475569;">Route: <strong>${this.escapeXml(route.name)}</strong></div>
      </div>
      <div>
        <span class="badge badge-safe">Safety Score: ${route.safetyScore}/100</span>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h3 style="margin:0 0 10px 0; font-size: 14px; text-transform:uppercase; color:#64748b;">Driver & Vehicle Telemetry</h3>
      <div><strong>Driver Name:</strong> ${this.escapeXml(settings.driverName)}</div>
      <div><strong>Vehicle / Truck ID:</strong> ${this.escapeXml(settings.vehicleId)}</div>
      <div><strong>Emergency Contact:</strong> ${this.escapeXml(settings.emergencyContact)}</div>
      <div><strong>Welfare Interval:</strong> Every ${Math.round(settings.safetyIntervalSeconds / 60)} minutes</div>
    </div>
    <div class="card">
      <h3 style="margin:0 0 10px 0; font-size: 14px; text-transform:uppercase; color:#64748b;">Route Efficiency Metrics</h3>
      <div><strong>Total Distance:</strong> ${route.totalDistanceKm} km</div>
      <div><strong>Estimated Transit Time:</strong> ${route.estimatedDurationMin} minutes</div>
      <div><strong>Waypoints & Stops:</strong> ${route.waypoints.length} locations</div>
      <div><strong>Safe Havens Along Route:</strong> ${route.policeStationsAlongRoute.length} 24/7 Police Hubs</div>
    </div>
  </div>

  <h3 style="margin: 25px 0 8px 0; font-size: 16px;">Itinerary & Delivery Sequence</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>Stop Name</th>
        <th>Type</th>
        <th>Address</th>
        <th>Priority</th>
      </tr>
    </thead>
    <tbody>
      ${route.waypoints.map((wp, i) => `
        <tr>
          <td><strong>${i + 1}</strong></td>
          <td><strong>${this.escapeXml(wp.name)}</strong></td>
          <td><span style="text-transform: capitalize;">${wp.type}</span></td>
          <td>${this.escapeXml(wp.address)}</td>
          <td><strong>${(wp.priority || 'normal').toUpperCase()}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="police-box">
    <h3 style="margin: 0 0 8px 0; color: #991b1b; display: flex; align-items:center;">
      <span style="margin-right: 8px;">🚨</span> Verified 24/7 Police Stations & Emergency Safe Havens Along Route
    </h3>
    <p style="margin:0 0 12px 0; font-size: 13px; color: #7f1d1d;">
      In case of hijack threat, medical emergency, or vehicular accident, divert immediately to the nearest safe haven listed below.
    </p>
    <table>
      <thead>
        <tr style="background: #991b1b;">
          <th>Station Name</th>
          <th>Jurisdiction</th>
          <th>Address</th>
          <th>Emergency Contact Phone</th>
        </tr>
      </thead>
      <tbody>
        ${route.policeStationsAlongRoute.map(ps => `
          <tr style="background: white;">
            <td><strong>${this.escapeXml(ps.name)}</strong></td>
            <td>${this.escapeXml(ps.jurisdiction)}</td>
            <td>${this.escapeXml(ps.address)}</td>
            <td style="color:#b91c1c; font-weight:bold;">${this.escapeXml(ps.phone)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <div class="footer">
    Generated automatically by SafeDrive Sentinel Enterprise V2 on ${new Date().toLocaleString()}. All routes monitored with active driver heartbeat welfare system.
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  private static triggerBrowserDownload(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static escapeXml(unsafe: string): string {
    return (unsafe || '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  private static sanitizeFilename(name: string): string {
    return (name || 'Route').replace(/[^a-zA-Z0-9_-]/g, '_');
  }
}
