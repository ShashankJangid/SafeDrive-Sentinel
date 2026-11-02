import { LanguageCode } from '../types';

export interface TranslationStrings {
  appTitle: string;
  appSubtitle: string;
  driverSafetyTag: string;
  
  // Navigation & Route
  routeOptimization: string;
  optimizeRoute: string;
  downloadRoute: string;
  startNavigation: string;
  pauseNavigation: string;
  stopNavigation: string;
  speed: string;
  remainingDistance: string;
  eta: string;
  safetyScore: string;
  safestRoute: string;
  fastestRoute: string;
  routeStops: string;
  addStop: string;
  
  // Safety Check Welfare Prompt
  safetyPromptTitle: string;
  safetyPromptQuestion: string;
  safetyPromptSubtitle: string;
  btnYesSafe: string;
  btnNoEmergency: string;
  voiceListening: string;
  voiceCommandHint: string;
  safetyCountdownRemaining: string;
  autoEscalationWarning: string;
  
  // Emergency & Police Station
  emergencyAlertTitle: string;
  emergencyActiveWarning: string;
  nearestPoliceStation: string;
  policeStationFound: string;
  divertToPolice: string;
  cancelEmergency: string;
  callPolice911: string;
  callDispatcher: string;
  distanceToPolice: string;
  estimatedArrivalToPolice: string;
  safeHavenTitle: string;
  
  // Settings & Customization
  settings: string;
  language: string;
  buttonSize: string;
  buttonSizeStandard: string;
  buttonSizeLarge: string;
  buttonSizeGlove: string;
  safetyCheckInterval: string;
  seconds: string;
  minutes: string;
  voiceAssistance: string;
  speechToTextSTT: string;
  highContrastMode: string;
  soundAlerts: string;
  
  // Downloads & Exports
  downloadGpx: string;
  downloadGeoJson: string;
  downloadManifest: string;
  downloadJson: string;
  exportFormat: string;
  exportDesc: string;
  
  // Logs & Telemetry
  checkInHistory: string;
  noCheckInsYet: string;
  statusSafe: string;
  statusEmergency: string;
  statusPrompting: string;
  triggerDemoPromptNow: string;

  // Spoken Text for Voice Synthesis
  spokenSafetyCheck: string;
  spokenSafeConfirmed: string;
  spokenEmergencyTriggered: string;
  spokenPoliceDirections: string;

  // STT Keyword Lists for Recognition
  sttKeywordsYes: string[];
  sttKeywordsNo: string[];
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  en: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "Industrial Route Optimizer & Active Driver Safety Guardian",
    driverSafetyTag: "Active Driver Guardian",
    
    routeOptimization: "Route Optimization",
    optimizeRoute: "Optimize Safe Route",
    downloadRoute: "Download Route",
    startNavigation: "Start Navigation",
    pauseNavigation: "Pause Trip",
    stopNavigation: "Stop Trip",
    speed: "Speed",
    remainingDistance: "Remaining",
    eta: "ETA",
    safetyScore: "Safety Score",
    safestRoute: "Safest Well-Lit Corridor",
    fastestRoute: "Fastest Commercial Corridor",
    routeStops: "Waypoints & Deliveries",
    addStop: "Add Checkpoint",
    
    safetyPromptTitle: "DRIVER WELFARE CHECK",
    safetyPromptQuestion: "Are you okay?",
    safetyPromptSubtitle: "Scheduled driver safety verification. Please respond via touch or voice.",
    btnYesSafe: "YES, I AM SAFE",
    btnNoEmergency: "NO, NEED ASSISTANCE",
    voiceListening: "Voice recognition active... Speak 'Yes' or 'No'",
    voiceCommandHint: "Hands-free voice active. Say 'Yes' or 'I am safe' to confirm, or 'No' / 'Help' for emergency.",
    safetyCountdownRemaining: "Auto-escalation in",
    autoEscalationWarning: "If no response, emergency escalation and police beacon will trigger automatically.",
    
    emergencyAlertTitle: "EMERGENCY PROTOCOL ACTIVATED",
    emergencyActiveWarning: "Driver in distress or safety check unresponsive! Locating safe shelter...",
    nearestPoliceStation: "Nearest Police Station",
    policeStationFound: "Safe Haven Identified",
    divertToPolice: "REROUTE TO POLICE STATION",
    cancelEmergency: "False Alarm / Driver Safe",
    callPolice911: "Dial Emergency (911/112)",
    callDispatcher: "Contact Dispatch Command",
    distanceToPolice: "Distance to Station",
    estimatedArrivalToPolice: "Est. Time to Station",
    safeHavenTitle: "24/7 Verified Safe Haven Hub",
    
    settings: "System Settings",
    language: "Language",
    buttonSize: "Button Ergonomics",
    buttonSizeStandard: "Standard (Office / Tablet)",
    buttonSizeLarge: "Large (In-Cab Mount)",
    buttonSizeGlove: "Extra Large (Heavy Truck / Gloves)",
    safetyCheckInterval: "Safety Check Interval",
    seconds: "sec",
    minutes: "min",
    voiceAssistance: "Voice Prompts (TTS)",
    speechToTextSTT: "Speech-to-Text Recognition (STT)",
    highContrastMode: "High Contrast Driving Mode",
    soundAlerts: "Procedural Audio Sirens/Chimes",
    
    downloadGpx: "Download GPS Route (.GPX)",
    downloadGeoJson: "Download GIS Route (.GeoJSON)",
    downloadManifest: "Print / PDF Driver Safety Manifest",
    downloadJson: "Download Fleet JSON Package",
    exportFormat: "Select Navigation Export Format",
    exportDesc: "Compatible with Garmin, Truck Navigators, Mobile GIS, and In-Cab Telematics.",
    
    checkInHistory: "Safety Welfare Log",
    noCheckInsYet: "No safety checks performed yet.",
    statusSafe: "NORMAL / SAFE",
    statusEmergency: "EMERGENCY / SOS",
    statusPrompting: "CHECKING WELFARE...",
    triggerDemoPromptNow: "Trigger Safety Check Now (Test)",

    spokenSafetyCheck: "Safety check. Are you okay? Please tap Yes or No, or say your answer.",
    spokenSafeConfirmed: "Safe status confirmed. Drive safely. Next check in scheduled.",
    spokenEmergencyTriggered: "Emergency alert triggered! Rerouting you to the nearest police station immediately. Safe haven locked.",
    spokenPoliceDirections: "Proceed to the nearest police station highlighted on your map.",

    sttKeywordsYes: ["yes", "yeah", "yep", "safe", "ok", "okay", "fine", "good", "all good", "i am safe", "i am ok", "affirmative", "clear"],
    sttKeywordsNo: ["no", "nope", "help", "emergency", "police", "danger", "sos", "trouble", "unsafe", "attack", "accident", "not safe"]
  },

  es: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "Optimizador de Rutas y Guardián de Seguridad para Conductores",
    driverSafetyTag: "Guardián de Seguridad",
    
    routeOptimization: "Optimización de Ruta",
    optimizeRoute: "Optimizar Ruta Segura",
    downloadRoute: "Descargar Ruta",
    startNavigation: "Iniciar Navegación",
    pauseNavigation: "Pausar Viaje",
    stopNavigation: "Detener Viaje",
    speed: "Velocidad",
    remainingDistance: "Restante",
    eta: "Tiempo Estimado",
    safetyScore: "Índice de Seguridad",
    safestRoute: "Corredor Iluminado Seguro",
    fastestRoute: "Corredor Rápido",
    routeStops: "Paradas y Entregas",
    addStop: "Agregar Punto",
    
    safetyPromptTitle: "CONTROL DE BIENESTAR DEL CONDUCTOR",
    safetyPromptQuestion: "¿Está todo bien?",
    safetyPromptSubtitle: "Verificación periódica de seguridad. Responda por pantalla o por voz.",
    btnYesSafe: "SÍ, ESTOY BIEN",
    btnNoEmergency: "NO, NECESITO AYUDA",
    voiceListening: "Reconocimiento de voz activo... Diga 'Sí' o 'No'",
    voiceCommandHint: "Modo manos libres activo. Diga 'Sí' para confirmar o 'No' / 'Ayuda' para auxilio.",
    safetyCountdownRemaining: "Alerta automática en",
    autoEscalationWarning: "Sin respuesta, se activará el protocolo de emergencia con la policía.",
    
    emergencyAlertTitle: "¡PROTOCOLO DE EMERGENCIA ACTIVADO!",
    emergencyActiveWarning: "¡Conductor en peligro! Localizando estación de policía más cercana...",
    nearestPoliceStation: "Estación de Policía Cercana",
    policeStationFound: "Refugio Seguro Identificado",
    divertToPolice: "DESVIAR A COMISARÍA DE POLICÍA",
    cancelEmergency: "Falsa Alarma / Conductor Seguro",
    callPolice911: "Llamar Emergencias (911)",
    callDispatcher: "Contactar Central de Operaciones",
    distanceToPolice: "Distancia a la Estación",
    estimatedArrivalToPolice: "Tiempo Estimado",
    safeHavenTitle: "Refugio Seguro Verificado 24/7",
    
    settings: "Configuración",
    language: "Idioma",
    buttonSize: "Tamaño de Botones",
    buttonSizeStandard: "Estándar",
    buttonSizeLarge: "Grande (Soporte)",
    buttonSizeGlove: "Extra Grande (Guantes de Camión)",
    safetyCheckInterval: "Intervalo de Comprobación",
    seconds: "seg",
    minutes: "min",
    voiceAssistance: "Instrucciones de Voz (TTS)",
    speechToTextSTT: "Reconocimiento de Voz (STT)",
    highContrastMode: "Modo Alto Contraste",
    soundAlerts: "Sirenas y Sonidos de Alerta",
    
    downloadGpx: "Descargar Ruta GPS (.GPX)",
    downloadGeoJson: "Descargar Ruta GIS (.GeoJSON)",
    downloadManifest: "Manifiesto de Seguridad (Imprimir/PDF)",
    downloadJson: "Paquete JSON de Flota",
    exportFormat: "Formato de Exportación",
    exportDesc: "Compatible con GPS Garmin, navegadores de camión y sistemas de flota.",
    
    checkInHistory: "Registro de Chequeos de Seguridad",
    noCheckInsYet: "No hay chequeos registrados aún.",
    statusSafe: "NORMAL / SEGURO",
    statusEmergency: "EMERGENCIA / SOS",
    statusPrompting: "COMPROBANDO ESTADO...",
    triggerDemoPromptNow: "Probar Alerta de Seguridad Ahora",

    spokenSafetyCheck: "Control de seguridad. ¿Está usted bien? Presione Sí o No, o hable por favor.",
    spokenSafeConfirmed: "Estado seguro confirmado. Conduzca con precaución.",
    spokenEmergencyTriggered: "¡Alerta de emergencia activada! Desviando inmediatamente hacia la estación de policía más cercana.",
    spokenPoliceDirections: "Diríjase a la estación de policía marcada en su mapa.",

    sttKeywordsYes: ["sí", "si", "bien", "seguro", "ok", "todo bien", "estoy bien", "correcto", "perfecto"],
    sttKeywordsNo: ["no", "ayuda", "emergencia", "policía", "policia", "peligro", "socorro", "sos", "accidente", "auxilio"]
  },

  hi: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "स्मार्ट रूट ऑप्टिमाइज़र और चालक सुरक्षा प्रणाली",
    driverSafetyTag: "सक्रिय चालक रक्षक",
    
    routeOptimization: "रूट अनुकूलन (Optimization)",
    optimizeRoute: "सुरक्षित रूट अनुकूलित करें",
    downloadRoute: "रूट डाउनलोड करें",
    startNavigation: "नेविगेशन शुरू करें",
    pauseNavigation: "यात्रा रोकें",
    stopNavigation: "यात्रा समाप्त करें",
    speed: "गति",
    remainingDistance: "शेष दूरी",
    eta: "पहुंचने का समय",
    safetyScore: "सुरक्षा स्कोर",
    safestRoute: "सबसे सुरक्षित मार्ग (High-Safety)",
    fastestRoute: "सबसे तेज़ व्यावसायिक मार्ग",
    routeStops: "स्टॉप एवं डिलीवरी",
    addStop: "स्टॉप जोड़ें",
    
    safetyPromptTitle: "चालक सुरक्षा जाँच (Welfare Check)",
    safetyPromptQuestion: "क्या आप ठीक हैं?",
    safetyPromptSubtitle: "नियमित सुरक्षा जांच। स्क्रीन दबाएं या बोलकर उत्तर दें।",
    btnYesSafe: "हाँ, मैं सुरक्षित हूँ",
    btnNoEmergency: "नहीं, सहायता चाहिए (SOS)",
    voiceListening: "आवाज पहचान सक्रिय... 'हाँ' या 'नहीं' बोलें",
    voiceCommandHint: "हैंड्स-फ्री वॉइस सक्रिय है। पुष्टि के लिए 'हाँ' कहें, आपात स्थिति के लिए 'नहीं' या 'मदद' कहें।",
    safetyCountdownRemaining: "स्वचालित आपातकाल में",
    autoEscalationWarning: "यदि कोई उत्तर नहीं मिलता है, तो निकटतम पुलिस स्टेशन का आपातकालीन रूट स्वतः सक्रिय हो जाएगा।",
    
    emergencyAlertTitle: "आपातकालीन प्रोटोकॉल सक्रिय!",
    emergencyActiveWarning: "चालक संकट में है! निकटतम पुलिस स्टेशन खोजा जा रहा है...",
    nearestPoliceStation: "निकटतम पुलिस स्टेशन",
    policeStationFound: "सुरक्षित आश्रय मिल गया",
    divertToPolice: "पुलिस स्टेशन की ओर मुड़ें",
    cancelEmergency: "झूठी चेतावनी / चालक सुरक्षित है",
    callPolice911: "पुलिस को कॉल करें (112)",
    callDispatcher: "फ्लीट कंट्रोल को कॉल करें",
    distanceToPolice: "थाने की दूरी",
    estimatedArrivalToPolice: "अनुमानित समय",
    safeHavenTitle: "24/7 सत्यापित सुरक्षित केंद्र",
    
    settings: "सेटिंग्स",
    language: "भाषा (Language)",
    buttonSize: "बटन का आकार (Button Size)",
    buttonSizeStandard: "सामान्य (Standard)",
    buttonSizeLarge: "बड़ा (Large)",
    buttonSizeGlove: "अति विशाल (Glove Mode)",
    safetyCheckInterval: "सुरक्षा जांच अंतराल",
    seconds: "सेकंड",
    minutes: "मिनट",
    voiceAssistance: "ध्वनि निर्देश (Voice TTS)",
    speechToTextSTT: "आवाज पहचान (Speech to Text)",
    highContrastMode: "उच्च कंट्रास्ट ड्राइविंग मोड",
    soundAlerts: "सायरन और ऑडियो अलर्ट",
    
    downloadGpx: "GPS रूट डाउनलोड करें (.GPX)",
    downloadGeoJson: "GIS रूट डाउनलोड करें (.GeoJSON)",
    downloadManifest: "सुरक्षा घोषणा पत्र (Print / PDF)",
    downloadJson: "फ्लीट डेटा JSON",
    exportFormat: "एक्सपोर्ट प्रारूप चुनें",
    exportDesc: "गार्मिन, ट्रक नेविगेटर और मोबाइल जीपीएस के साथ पूरी तरह संगत।",
    
    checkInHistory: "सुरक्षा जांच इतिहास",
    noCheckInsYet: "अभी तक कोई जांच रिकॉर्ड नहीं है।",
    statusSafe: "सामान्य / सुरक्षित",
    statusEmergency: "आपातकाल / संकट",
    statusPrompting: "जांच जारी...",
    triggerDemoPromptNow: "अभी सुरक्षा जांच का परीक्षण करें",

    spokenSafetyCheck: "सुरक्षा जांच। क्या आप ठीक हैं? कृपया हाँ या नहीं दबाएं या बोलकर बताएं।",
    spokenSafeConfirmed: "सुरक्षित स्थिति दर्ज की गई। सावधानी से गाड़ी चलाएं।",
    spokenEmergencyTriggered: "आपातकालीन चेतावनी सक्रिय! आपको तुरंत नजदीकी पुलिस स्टेशन की ओर निर्देशित किया जा रहा है।",
    spokenPoliceDirections: "नक्शे पर दिखाए गए निकटतम पुलिस स्टेशन की ओर आगे बढ़ें।",

    sttKeywordsYes: ["हाँ", "हां", "ha", "haan", "theek", "thik", "safe", "ok", "yes", "sahi", "main theek hu", "koi dikkat nahi"],
    sttKeywordsNo: ["नहीं", "nahi", "nahin", "no", "madad", "help", "police", "khatra", "emergency", "bachao", "sos"]
  },

  fr: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "Optimiseur d'itinéraire et Gardien de Sécurité du Conducteur",
    driverSafetyTag: "Gardien Actif du Chauffeur",
    
    routeOptimization: "Optimisation d'Itinéraire",
    optimizeRoute: "Optimiser Itinéraire Sécurisé",
    downloadRoute: "Télécharger l'Itinéraire",
    startNavigation: "Démarrer la Navigation",
    pauseNavigation: "Mettre en Pause",
    stopNavigation: "Arrêter le Trajet",
    speed: "Vitesse",
    remainingDistance: "Restant",
    eta: "Heure d'arrivée",
    safetyScore: "Score de Sécurité",
    safestRoute: "Couloir le Plus Sûr & Éclairé",
    fastestRoute: "Couloir Commercial Rapide",
    routeStops: "Points de Passage & Livraisons",
    addStop: "Ajouter un Arrêt",
    
    safetyPromptTitle: "CONTRÔLE DE SÉCURITÉ DU CHAUFFEUR",
    safetyPromptQuestion: "Êtes-vous en sécurité ?",
    safetyPromptSubtitle: "Vérification programmée. Répondez sur l'écran ou à la voix.",
    btnYesSafe: "OUI, JE SUIS EN SÉCURITÉ",
    btnNoEmergency: "NON, J'AI BESOIN D'AIDE",
    voiceListening: "Reconnaissance vocale active... Dites 'Oui' ou 'Non'",
    voiceCommandHint: "Mains libres actif. Dites 'Oui' pour confirmer, ou 'Non' / 'Aide' en cas d'urgence.",
    safetyCountdownRemaining: "Escalade automatique dans",
    autoEscalationWarning: "Sans réponse, l'alerte d'urgence vers le commissariat sera déclenchée.",
    
    emergencyAlertTitle: "PROTOCOLE D'URGENCE DÉCLENCHÉ !",
    emergencyActiveWarning: "Chauffeur en détresse ! Localisation du commissariat de police...",
    nearestPoliceStation: "Poste de Police le Plus Proche",
    policeStationFound: "Refuge Sécurisé Trouvé",
    divertToPolice: "DÉVIER VERS LA POLICE",
    cancelEmergency: "Fausse Alerte / Chauffeur Sain et Sauf",
    callPolice911: "Appeler la Police (112)",
    callDispatcher: "Contacter le Dispatching",
    distanceToPolice: "Distance au Poste",
    estimatedArrivalToPolice: "Temps Estimé",
    safeHavenTitle: "Refuge Sécurisé 24h/24",
    
    settings: "Paramètres",
    language: "Langue",
    buttonSize: "Taille des Boutons",
    buttonSizeStandard: "Standard (Tablette)",
    buttonSizeLarge: "Grand (Support Cabine)",
    buttonSizeGlove: "Très Grand (Gants Poids Lourd)",
    safetyCheckInterval: "Intervalle de Contrôle",
    seconds: "sec",
    minutes: "min",
    voiceAssistance: "Instructions Vocales (TTS)",
    speechToTextSTT: "Reconnaissance Vocale (STT)",
    highContrastMode: "Mode Haute Visibilité",
    soundAlerts: "Sirènes & Alertes Sonores",
    
    downloadGpx: "Télécharger l'Itinéraire (.GPX)",
    downloadGeoJson: "Télécharger Données GIS (.GeoJSON)",
    downloadManifest: "Manifeste de Sécurité (Imprimer/PDF)",
    downloadJson: "Paquet Flotte JSON",
    exportFormat: "Format d'Exportation",
    exportDesc: "Compatible GPS Garmin, systèmes télématiques et navigation poids lourds.",
    
    checkInHistory: "Historique des Contrôles",
    noCheckInsYet: "Aucun contrôle effectué pour le moment.",
    statusSafe: "NORMAL / SÉCURISÉ",
    statusEmergency: "URGENCE / SOS",
    statusPrompting: "CONTRÔLE EN COURS...",
    triggerDemoPromptNow: "Tester le Contrôle Immédiatement",

    spokenSafetyCheck: "Contrôle de sécurité. Tout va bien ? Répondez par Oui ou Non.",
    spokenSafeConfirmed: "Statut sécurisé confirmé. Bonne route.",
    spokenEmergencyTriggered: "Alerte d'urgence déclenchée ! Déviation immédiate vers le poste de police le plus proche.",
    spokenPoliceDirections: "Suivez l'itinéraire vers le poste de police indiqué sur votre écran.",

    sttKeywordsYes: ["oui", "ouais", "bien", "tout va bien", "ok", "sécurité", "ca va", "ça va"],
    sttKeywordsNo: ["non", "aide", "urgence", "police", "danger", "secours", "sos", "accident", "problème"]
  },

  de: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "Routenoptimierung & Aktiver Fahrersicherheitsschutz",
    driverSafetyTag: "Fahrerschutz-System",
    
    routeOptimization: "Routenoptimierung",
    optimizeRoute: "Sichere Route Berechnen",
    downloadRoute: "Route Herunterladen",
    startNavigation: "Navigation Starten",
    pauseNavigation: "Pause",
    stopNavigation: "Fahrt Beenden",
    speed: "Geschwindigkeit",
    remainingDistance: "Reststrecke",
    eta: "Ankunft",
    safetyScore: "Sicherheitsindex",
    safestRoute: "Sicherer Beleuchteter Korridor",
    fastestRoute: "Schnellste Route",
    routeStops: "Wegpunkte & Lieferorte",
    addStop: "Wegpunkt Hinzufügen",
    
    safetyPromptTitle: "FAHRER-SICHERHEITSABFRAGE",
    safetyPromptQuestion: "Ist alles in Ordnung?",
    safetyPromptSubtitle: "Regelmäßige Sicherheitskontrolle. Antwort per Display oder Sprache.",
    btnYesSafe: "JA, ALLES IN ORDNUNG",
    btnNoEmergency: "NEIN, BRAUCHE HILFE (SOS)",
    voiceListening: "Spracherkennung aktiv... Sagen Sie 'Ja' oder 'Nein'",
    voiceCommandHint: "Freisprecheinrichtung aktiv. Sagen Sie 'Ja' zur Bestätigung oder 'Nein' / 'Hilfe' für Notruf.",
    safetyCountdownRemaining: "Automatischer Notruf in",
    autoEscalationWarning: "Ohne Rückmeldung wird automatisch die nächste Polizeistation angefahren.",
    
    emergencyAlertTitle: "NOTFALL-PROTOKOLL AKTIVIERT!",
    emergencyActiveWarning: "Fahrer in Notlage! Nächste Polizeidienststelle wird gesucht...",
    nearestPoliceStation: "Nächste Polizeistation",
    policeStationFound: "Sicherer Zufluchtsort Gefunden",
    divertToPolice: "ZUR POLIZEI UMLEITEN",
    cancelEmergency: "Fehlalarm / Fahrer Sicher",
    callPolice911: "Polizei Rufen (110 / 112)",
    callDispatcher: "Leitstelle Kontaktieren",
    distanceToPolice: "Entfernung zur Wache",
    estimatedArrivalToPolice: "Geschätzte Ankunftszeit",
    safeHavenTitle: "24/7 Verifizierte Schutzstation",
    
    settings: "Einstellungen",
    language: "Sprache",
    buttonSize: "Schaltflächen-Größe",
    buttonSizeStandard: "Standard",
    buttonSizeLarge: "Groß (Halterung)",
    buttonSizeGlove: "Extra Groß (LKW-Handschuh-Modus)",
    safetyCheckInterval: "Prüfintervall",
    seconds: "Sek",
    minutes: "Min",
    voiceAssistance: "Sprachausgabe (TTS)",
    speechToTextSTT: "Spracherkennung (STT)",
    highContrastMode: "Hoher Kontrast",
    soundAlerts: "Akustische Alarme & Sirenen",
    
    downloadGpx: "GPS-Route Herunterladen (.GPX)",
    downloadGeoJson: "GIS-Route Herunterladen (.GeoJSON)",
    downloadManifest: "Sicherheits-Manifest (Drucken/PDF)",
    downloadJson: "Flotten-JSON Herunterladen",
    exportFormat: "Exportformat Wählen",
    exportDesc: "Kompatibel mit Garmin, LKW-Navigationsgeräten und Flottensystemen.",
    
    checkInHistory: "Sicherheits-Protokoll",
    noCheckInsYet: "Bisher keine Überprüfungen protokolliert.",
    statusSafe: "NORMAL / SICHER",
    statusEmergency: "NOTFALL / SOS",
    statusPrompting: "PRÜFUNG LÄUFT...",
    triggerDemoPromptNow: "Sicherheitsabfrage Sofort Testen",

    spokenSafetyCheck: "Sicherheitsabfrage. Ist alles in Ordnung? Bitte Ja oder Nein drücken oder sprechen.",
    spokenSafeConfirmed: "Sicherheitsstatus bestätigt. Gute Weiterfahrt.",
    spokenEmergencyTriggered: "Notfallalarm ausgelöst! Sie werden unverzüglich zur nächsten Polizeistation umgeleitet.",
    spokenPoliceDirections: "Folgen Sie der hervorgehobenen Route zur Polizeistation.",

    sttKeywordsYes: ["ja", "alles gut", "sicher", "in ordnung", "ok", "gut", "bestätigen"],
    sttKeywordsNo: ["nein", "hilfe", "notfall", "polizei", "gefahr", "sos", "unfall"]
  },

  zh: {
    appTitle: "SafeDrive Sentinel 智行卫士",
    appSubtitle: "工业级路径智能优化与驾驶员主动安全守护平台",
    driverSafetyTag: "主动安全卫士",
    
    routeOptimization: "路线智能优化",
    optimizeRoute: "规划最高安全路线",
    downloadRoute: "下载路线数据",
    startNavigation: "开始导航",
    pauseNavigation: "暂停行程",
    stopNavigation: "结束行程",
    speed: "车速",
    remainingDistance: "剩余距离",
    eta: "预计到达",
    safetyScore: "安全系数",
    safestRoute: "高安全照明大道",
    fastestRoute: "最快捷干道",
    routeStops: "途经点与配送目的地",
    addStop: "添加停靠点",
    
    safetyPromptTitle: "驾驶员安全状态巡检",
    safetyPromptQuestion: "您是否一切正常？",
    safetyPromptSubtitle: "定时司机在岗与安全巡查。请轻触屏幕或语音回复。",
    btnYesSafe: "是，我安全正常",
    btnNoEmergency: "否，需要紧急求助 (SOS)",
    voiceListening: "语音识别中... 请说“是”或“否”",
    voiceCommandHint: "免提语音激活。说“正常”或“是”确认安全，说“否”或“救命”触发求助。",
    safetyCountdownRemaining: "自动报警倒计时",
    autoEscalationWarning: "如无回应，系统将自动升级报警并紧急导航至最近派出所。",
    
    emergencyAlertTitle: "紧急救援规程已启动！",
    emergencyActiveWarning: "检测到司机遇险或失联！正在搜寻最近公安派出所与安全避难所...",
    nearestPoliceStation: "最近公安派出所",
    policeStationFound: "已锁定安全庇护中心",
    divertToPolice: "立即变轨导航至派出所",
    cancelEmergency: "解除警报 / 司机安全",
    callPolice911: "呼叫报警中心 (110)",
    callDispatcher: "联系统调中心",
    distanceToPolice: "距离派出所",
    estimatedArrivalToPolice: "预计到达时间",
    safeHavenTitle: "24小时认证安全庇护站",
    
    settings: "系统参数设置",
    language: "界面语言",
    buttonSize: "驾驶触控按钮尺寸",
    buttonSizeStandard: "标准 (中控平板)",
    buttonSizeLarge: "大号 (车载支架)",
    buttonSizeGlove: "超大号 (货车驾驶戴手套模式)",
    safetyCheckInterval: "安全巡检间隔",
    seconds: "秒",
    minutes: "分钟",
    voiceAssistance: "智能语音播报 (TTS)",
    speechToTextSTT: "免提语音识别 (STT)",
    highContrastMode: "夜间高对比度护眼模式",
    soundAlerts: "警报蜂鸣器与音效",
    
    downloadGpx: "下载 GPS 导航路线 (.GPX)",
    downloadGeoJson: "下载 GIS 地理信息 (.GeoJSON)",
    downloadManifest: "打印驾驶员安全行车清单 (PDF)",
    downloadJson: "下载车队管理 JSON 报文",
    exportFormat: "选择导出数据格式",
    exportDesc: "完全兼容佳明、车载工控机、手机离线地图及车队车联网系统。",
    
    checkInHistory: "安全签到历史记录",
    noCheckInsYet: "暂无巡检记录。",
    statusSafe: "正常 / 安全",
    statusEmergency: "紧急 / 遇险",
    statusPrompting: "正在巡检...",
    triggerDemoPromptNow: "立即触发安全测试弹窗",

    spokenSafetyCheck: "安全状态确认。您是否一切正常？请点击是否或语音回答。",
    spokenSafeConfirmed: "安全状态已记录，请注意路况，祝您行车平安。",
    spokenEmergencyTriggered: "紧急救援已激活！正在为您规划前往最近派出所的最短路线，已锁定安全庇护站。",
    spokenPoliceDirections: "请沿地图高亮路线前往最近的公安派出所。",

    sttKeywordsYes: ["是", "好的", "正常", "安全", "没问题", "行", "对", "好"],
    sttKeywordsNo: ["否", "不", "救命", "报警", "危险", "警察", "帮助", "不行", "救我"]
  },

  ar: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "نظام تحسين المسار وحماية سلامة السائق الصناعي",
    driverSafetyTag: "حارس سلامة السائق",
    
    routeOptimization: "تحسين المسار",
    optimizeRoute: "تحسين المسار الأكثر أماناً",
    downloadRoute: "تنزيل المسار",
    startNavigation: "بدء الملاحة",
    pauseNavigation: "إيقاف مؤقت",
    stopNavigation: "إنهاء الرحلة",
    speed: "السرعة",
    remainingDistance: "المسافة المتبقية",
    eta: "الوقت المقدر",
    safetyScore: "معدل الأمان",
    safestRoute: "الممر الأكثر أماناً وإضاءة",
    fastestRoute: "المسار الأسرع",
    routeStops: "نقاط التوقف والتسليم",
    addStop: "إضافة نقطة توقف",
    
    safetyPromptTitle: "فحص سلامة السائق الدورية",
    safetyPromptQuestion: "هل أنت بخير؟",
    safetyPromptSubtitle: "تحقق منتظم من أمان السائق. يرجى الإجابة باللمس أو الصوت.",
    btnYesSafe: "نعم، أنا بخير وأمان",
    btnNoEmergency: "لا، أحتاج إلى مساعدة (طوارئ)",
    voiceListening: "التعرف الصوتي قيد التشغيل... قل 'نعم' أو 'لا'",
    voiceCommandHint: "التشغيل بدون استخدام اليدين متاح. قل 'نعم' للتأكيد أو 'لا' في حالة الطوارئ.",
    safetyCountdownRemaining: "التصعيد التلقائي خلال",
    autoEscalationWarning: "في حال عدم الرد، سيتم تفعيل خطة الطوارئ والتوجه لأقرب مركز شرطة.",
    
    emergencyAlertTitle: "تم تفعيل بروتوكول الطوارئ!",
    emergencyActiveWarning: "السائق في خطر أو لم يستجب! جارٍ تحديد أقرب مركز شرطة...",
    nearestPoliceStation: "أقرب مركز شرطة",
    policeStationFound: "تم تحديد الملاذ الآمن",
    divertToPolice: "تحويل المسار فوراً إلى مركز الشرطة",
    cancelEmergency: "إنذار خاطئ / السائق آمن",
    callPolice911: "الاتصال بالشرطة (911 / 112)",
    callDispatcher: "الاتصال بغرفة التحكم والعمليات",
    distanceToPolice: "المسافة إلى المركز",
    estimatedArrivalToPolice: "الوقت المقدر للوصول",
    safeHavenTitle: "ملاذ آمن معتمد على مدار 24 ساعة",
    
    settings: "الإعدادات",
    language: "اللغة",
    buttonSize: "حجم الأزرار",
    buttonSizeStandard: "قياسي",
    buttonSizeLarge: "كبير",
    buttonSizeGlove: "كبير جداً (قفازات الشاحنة)",
    safetyCheckInterval: "الفترة الزمنية للفحص",
    seconds: "ثانية",
    minutes: "دقيقة",
    voiceAssistance: "الأوامر الصوتية (TTS)",
    speechToTextSTT: "التعرف على الصوت (STT)",
    highContrastMode: "وضع التباين العالي",
    soundAlerts: "صافرات وتنبيهات صوتية",
    
    downloadGpx: "تنزيل مسار الملاحة (.GPX)",
    downloadGeoJson: "تنزيل بيانات GIS (.GeoJSON)",
    downloadManifest: "بيان سلامة السائق (طباعة / PDF)",
    downloadJson: "تنزيل حزمة بيانات الأسطول JSON",
    exportFormat: "تحديد صيغة التصدير",
    exportDesc: "متوافق مع أجهزة جارمين ونظم إدارة الأساطيل المتقدمة.",
    
    checkInHistory: "سجل فحوصات الأمان",
    noCheckInsYet: "لم يتم تسجيل أي فحوصات حتى الآن.",
    statusSafe: "عادي / آمن",
    statusEmergency: "طوارئ / استغاثة",
    statusPrompting: "جارٍ فحص السلامة...",
    triggerDemoPromptNow: "تشغيل فحص الأمان الآن (تجربة)",

    spokenSafetyCheck: "فحص الأمان. هل أنت بخير؟ اضغط نعم أو لا أو تحدث بصوتك.",
    spokenSafeConfirmed: "تم تأكيد حالتك الآمنة. نتمنى لك رحلة آمنة.",
    spokenEmergencyTriggered: "تم إطلاق تنبيه الطوارئ! يتم الآن توجيهك فوراً إلى أقرب مركز شرطة.",
    spokenPoliceDirections: "يرجى اتباع المسار الموضح للوصول إلى أقرب مركز شرطة.",

    sttKeywordsYes: ["نعم", "ايوه", "تمام", "بخير", "سليم", "امان", "أنا بخير", "ماشي"],
    sttKeywordsNo: ["لا", "نجدة", "مساعدة", "شرطة", "خطر", "طوارئ", "حادث", "الحقني"]
  },

  pt: {
    appTitle: "SafeDrive Sentinel",
    appSubtitle: "Otimizador de Rotas e Guardião de Segurança do Motorista",
    driverSafetyTag: "Guardião de Segurança Ativo",
    
    routeOptimization: "Otimização de Rota",
    optimizeRoute: "Otimizar Rota Segura",
    downloadRoute: "Baixar Rota",
    startNavigation: "Iniciar Navegação",
    pauseNavigation: "Pausar Viagem",
    stopNavigation: "Encerrar Viagem",
    speed: "Velocidade",
    remainingDistance: "Restante",
    eta: "Previsão",
    safetyScore: "Índice de Segurança",
    safestRoute: "Corredor Iluminado Seguro",
    fastestRoute: "Corredor Mais Rápido",
    routeStops: "Pontos de Parada e Entrega",
    addStop: "Adicionar Ponto",
    
    safetyPromptTitle: "CONTROLE DE BEM-ESTAR DO MOTORISTA",
    safetyPromptQuestion: "Você está bem?",
    safetyPromptSubtitle: "Verificação programada de segurança. Responda por toque ou voz.",
    btnYesSafe: "SIM, ESTOU BEM",
    btnNoEmergency: "NÃO, PRECISO DE AJUDA",
    voiceListening: "Reconhecimento de voz ativo... Diga 'Sim' ou 'Não'",
    voiceCommandHint: "Voz viva-voz ativa. Diga 'Sim' para confirmar, ou 'Não' / 'Socorro' para emergência.",
    safetyCountdownRemaining: "Alerta automático em",
    autoEscalationWarning: "Se não houver resposta, o protocolo de emergência até a delegacia será acionado.",
    
    emergencyAlertTitle: "PROTOCOLO DE EMERGÊNCIA ACIONADO!",
    emergencyActiveWarning: "Motorista em perigo! Localizando delegacia de polícia mais próxima...",
    nearestPoliceStation: "Delegacia de Polícia Mais Próxima",
    policeStationFound: "Refúgio Seguro Identificado",
    divertToPolice: "DESVIAR PARA A DELEGACIA DE POLÍCIA",
    cancelEmergency: "Alarme Falso / Motorista Seguro",
    callPolice911: "Ligar para Polícia (190)",
    callDispatcher: "Contatar Central de Operações",
    distanceToPolice: "Distância até a Delegacia",
    estimatedArrivalToPolice: "Tempo Estimado",
    safeHavenTitle: "Ponto Seguro Verificado 24h",
    
    settings: "Configurações",
    language: "Idioma",
    buttonSize: "Tamanho dos Botões",
    buttonSizeStandard: "Padrão",
    buttonSizeLarge: "Grande (Suporte Veicular)",
    buttonSizeGlove: "Extra Grande (Modo Luva Pesada)",
    safetyCheckInterval: "Intervalo de Verificação",
    seconds: "seg",
    minutes: "min",
    voiceAssistance: "Instruções de Voz (TTS)",
    speechToTextSTT: "Reconhecimento de Voz (STT)",
    highContrastMode: "Modo Alto Contraste",
    soundAlerts: "Sirenes e Avisos Sonoros",
    
    downloadGpx: "Baixar Rota GPS (.GPX)",
    downloadGeoJson: "Baixar Rota GIS (.GeoJSON)",
    downloadManifest: "Manifesto de Segurança (Imprimir/PDF)",
    downloadJson: "Pacote JSON de Frota",
    exportFormat: "Formato de Exportação",
    exportDesc: "Compatível com Garmin, GPS de caminhão e telemetria de frotas.",
    
    checkInHistory: "Histórico de Verificações",
    noCheckInsYet: "Nenhuma verificação registrada ainda.",
    statusSafe: "NORMAL / SEGURO",
    statusEmergency: "EMERGÊNCIA / SOS",
    statusPrompting: "VERIFICANDO ESTADO...",
    triggerDemoPromptNow: "Testar Verificação de Segurança Agora",

    spokenSafetyCheck: "Verificação de segurança. Você está bem? Pressione Sim ou Não, ou fale.",
    spokenSafeConfirmed: "Status de segurança confirmado. Tenha uma boa viagem.",
    spokenEmergencyTriggered: "Alerta de emergência ativado! Redirecionando imediatamente para a delegacia de polícia mais próxima.",
    spokenPoliceDirections: "Siga a rota destacada em direção à delegacia de polícia.",

    sttKeywordsYes: ["sim", "estou bem", "tudo bem", "seguro", "ok", "tranquilo", "positivo"],
    sttKeywordsNo: ["não", "nao", "socorro", "ajuda", "polícia", "policia", "perigo", "sos", "emergência", "acidente"]
  }
};
