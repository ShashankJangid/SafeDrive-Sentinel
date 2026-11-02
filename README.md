# SafeDrive Sentinel 🛡️
## Industrial Route Optimization & Driver Safety Guardian Platform

SafeDrive Sentinel is an industrial-grade route optimization and driver telemetry software engineered specifically for freight transport, delivery fleets, and commercial logistics where **driver welfare and active safety** are paramount.

---

### 🌟 Core Capabilities & Requirements Addressed

1. **Automated Safety Welfare Check-In Interval (Driver Heartbeat)**
   - Configurable recurring interval (e.g., 15s/30s for testing, 15m/30m/60m for commercial transport).
   - Pops up an attention-grabbing driver welfare prompt: *"Are you okay?"*
   - Plays an audible attention chime and synthesizes natural speech in the driver's native language.
   - **Tactile Two-Button Interface**:
     - **"YES, I AM SAFE"**: Dismisses the alert, plays a positive confirmation chime, registers a clean heartbeat event in the dispatch audit log, and suppresses further prompts until the next full interval.
     - **"NO, NEED ASSISTANCE" (or Unresponsive Grace Period Timeout)**: Triggers the emergency escalation protocol immediately.
2. **Nearest Police Station & Safe Haven Escalation**
   - Automatically computes real-time proximity to all verified 24/7 Police Stations and Safe Havens along the corridor.
   - Highlights the closest police station with driving distance (km), estimated time of arrival (~mins), phone contact, and jurisdiction.
   - **One-Click Reroute**: Immediately re-orients navigation to guide the vehicle directly to the police station.
   - Direct 1-tap dialer for 911 / 112 / Police and fleet dispatch emergency line.
   - Procedural emergency siren with mute toggle.
3. **Multilingual Support (8 Languages)**
   - Full UI localization, Text-To-Speech (TTS), and Speech-To-Text (STT) dictionary support for:
     - 🇺🇸 English
     - 🇪🇸 Spanish (Español)
     - 🇮🇳 Hindi (हिन्दी)
     - 🇫🇷 French (Français)
     - 🇩🇪 German (Deutsch)
     - 🇨🇳 Chinese (中文)
     - 🇸🇦 Arabic (العربية)
     - 🇧🇷 Portuguese (Português)
4. **Variable Button Ergonomics (Driving Modes)**
   - **Standard Mode**: Compact interface for tablets and dispatchers.
   - **Large Mode**: High-visibility touch targets for dashboard smartphone mounts.
   - **Glove Mode (Extra Large)**: Oversized targets designed for heavy vehicle cabs, rough vibration, and thick work gloves.
5. **Hands-Free Speech-To-Text (STT) & Voice (TTS)**
   - Web Speech Synthesis (TTS) speaks all safety inquiries and navigational warnings.
   - Continuous Web Speech Recognition (STT) listens when the prompt appears. The driver can simply say **"Yes" / "I am safe"** or **"No" / "Help" / "Police"** without taking hands off the steering wheel.
6. **Multi-Format Route Downloads**
   - **GPX Download**: Compatible with Garmin, in-dash truck navigators, and handheld GPS units (includes waypoints and emergency police station safe havens as POIs).
   - **GeoJSON**: RFC 7946 vector geometry for GIS and fleet mapping.
   - **Driver Safety Manifest (Printable / PDF)**: Formatted commercial trip manifest complete with waypoint schedule, 24/7 police station directory, emergency contacts, and dispatch sign-off sheet.
   - **Fleet Telematics JSON**: Full payload package for server ingestion.
7. **2-Opt TSP Route Optimization Engine**
   - Traveling Salesperson (TSP) heuristic optimizer with 2-Opt local search improvement.
   - Queries OpenStreetMap OSRM routing engine for real-world driving geometries and road turns, with geodesic curvature fallback.
   - Computes comprehensive Route Safety Scores (0-100) based on proximity to emergency infrastructure.

---

### 🚀 Running the Web Application

The dev server is live on:
- **Local**: `http://localhost:5173/`

To run locally in any terminal:
```bash
npm run dev
# or build for production
npm run build
```
