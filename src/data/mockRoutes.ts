import { Waypoint, PoliceStation } from '../types';

// Preset realistic routes with safety corridors and nearby verified police stations
export interface PresetRouteTemplate {
  id: string;
  name: string;
  city: string;
  description: string;
  waypoints: Waypoint[];
  policeStations: PoliceStation[];
}

export const PRESET_ROUTES: PresetRouteTemplate[] = [
  {
    id: 'metro-logistics',
    name: 'Metropolitan Logistics & High-Value Cargo Corridor',
    city: 'New York / New Jersey Corridor',
    description: 'High-security distribution transit through urban and industrial hubs with 24/7 police coverage.',
    waypoints: [
      {
        id: 'wp-1',
        name: 'Main Central Logistics Terminal',
        lat: 40.7580,
        lng: -73.9855,
        type: 'depot',
        address: '42nd St & 8th Ave Logistics Depot, New York, NY',
        priority: 'high'
      },
      {
        id: 'wp-2',
        name: 'Midtown Commercial Hub A',
        lat: 40.7484,
        lng: -73.9857,
        type: 'delivery',
        address: '350 5th Ave, New York, NY',
        priority: 'normal'
      },
      {
        id: 'wp-3',
        name: 'Lower Manhattan Distribution Center',
        lat: 40.7128,
        lng: -74.0060,
        type: 'delivery',
        address: 'Broadway & Fulton St, New York, NY',
        priority: 'high'
      },
      {
        id: 'wp-4',
        name: 'Jersey City Harbor Fulfillment Hub',
        lat: 40.7178,
        lng: -74.0431,
        type: 'delivery',
        address: 'Exchange Place Pier, Jersey City, NJ',
        priority: 'normal'
      },
      {
        id: 'wp-5',
        name: 'Secaucus Intermodal Freight Terminal',
        lat: 40.7895,
        lng: -74.0565,
        type: 'delivery',
        address: 'County Ave Freight Interchange, Secaucus, NJ',
        priority: 'critical'
      }
    ],
    policeStations: [
      {
        id: 'ps-1',
        name: 'NYPD Midtown South Precinct',
        lat: 40.7508,
        lng: -73.9892,
        address: '357 W 35th St, New York, NY 10001',
        phone: '+1 (212) 239-9811',
        jurisdiction: 'NYPD Patrol Borough Manhattan South',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'ps-2',
        name: 'NYPD 1st Precinct - Tribeca & Financial District',
        lat: 40.7202,
        lng: -74.0084,
        address: '16 Ericsson Pl, New York, NY 10013',
        phone: '+1 (212) 334-0611',
        jurisdiction: 'NYPD Manhattan North / Downtown',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'ps-3',
        name: 'Jersey City Police Headquarters - East District',
        lat: 40.7255,
        lng: -74.0478,
        address: '1 Journal Square Plaza, Jersey City, NJ 07306',
        phone: '+1 (201) 547-5477',
        jurisdiction: 'Jersey City Police Department',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'ps-4',
        name: 'Secaucus Police Department HQ',
        lat: 40.7915,
        lng: -74.0510,
        address: '1203 Paterson Plank Rd, Secaucus, NJ 07094',
        phone: '+1 (201) 330-2060',
        jurisdiction: 'Secaucus Municipal Police',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  },
  {
    id: 'delhi-ncr-freight',
    name: 'National Capital Region Highway & Express Cargo',
    city: 'Delhi - Gurugram Expressway',
    description: 'Critical freight corridor with high-frequency highway patrol posts and emergency safe havens.',
    waypoints: [
      {
        id: 'del-1',
        name: 'IGI Airport Air Cargo Complex',
        lat: 28.5562,
        lng: 77.1000,
        type: 'depot',
        address: 'Cargo Terminal 2, IGI Airport, New Delhi',
        priority: 'high'
      },
      {
        id: 'del-2',
        name: 'Aerocity Commercial Logistics Center',
        lat: 28.5495,
        lng: 77.1215,
        type: 'delivery',
        address: 'Hospitality District, Aerocity, New Delhi',
        priority: 'normal'
      },
      {
        id: 'del-3',
        name: 'Cyber City Corporate Hub',
        lat: 28.4950,
        lng: 77.0895,
        type: 'delivery',
        address: 'DLF Cyber City Phase 2, Gurugram',
        priority: 'critical'
      },
      {
        id: 'del-4',
        name: 'Manesar Industrial Model Township',
        lat: 28.3615,
        lng: 76.9370,
        type: 'delivery',
        address: 'Sector 8 IMT, Manesar, Haryana',
        priority: 'normal'
      }
    ],
    policeStations: [
      {
        id: 'del-ps-1',
        name: 'IGI Airport Police Station',
        lat: 28.5601,
        lng: 77.1120,
        address: 'Near Terminal 1, IGI Airport, New Delhi',
        phone: '112 / +91 11 2565 6092',
        jurisdiction: 'Delhi Police (Airport Division)',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'del-ps-2',
        name: 'DLF Phase 2 Police Station',
        lat: 28.4890,
        lng: 77.0870,
        address: 'Near Sikanderpur Metro, Gurugram, Haryana',
        phone: '112 / +91 124 235 6100',
        jurisdiction: 'Gurugram Police East District',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'del-ps-3',
        name: 'Kherki Daula Highway Patrol & Police Post',
        lat: 28.4110,
        lng: 76.9950,
        address: 'NH-48 Highway Toll Plaza, Gurugram',
        phone: '112 / +91 124 221 2100',
        jurisdiction: 'Haryana Highway Police',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'del-ps-4',
        name: 'Manesar Police Station',
        lat: 28.3680,
        lng: 76.9420,
        address: 'IMT Chowk, Manesar, Haryana',
        phone: '112 / +91 124 229 0100',
        jurisdiction: 'Manesar Police Division',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  },
  {
    id: 'europe-rhine-corridor',
    name: 'European Industrial Transit & Cold-Chain',
    city: 'Frankfurt - Rhine-Main Hub',
    description: 'High-speed transit along German Autobahn corridor with integrated safe service areas and Autobahnpolizei stations.',
    waypoints: [
      {
        id: 'de-1',
        name: 'Frankfurt CargoCity South',
        lat: 50.0270,
        lng: 8.5680,
        type: 'depot',
        address: 'Flughafen Frankfurt CargoCity Süd, 60549 Frankfurt am Main',
        priority: 'high'
      },
      {
        id: 'de-2',
        name: 'Rüsselsheim Automotive Hub',
        lat: 49.9950,
        lng: 8.4210,
        type: 'delivery',
        address: 'Opelring 1, 65428 Rüsselsheim',
        priority: 'normal'
      },
      {
        id: 'de-3',
        name: 'Wiesbaden Industrial Logistics',
        lat: 50.0540,
        lng: 8.2710,
        type: 'delivery',
        address: 'Mainzer Str. 180, 65187 Wiesbaden',
        priority: 'critical'
      },
      {
        id: 'de-4',
        name: 'Mainz Port Intermodal Terminal',
        lat: 50.0210,
        lng: 8.2430,
        type: 'delivery',
        address: 'Rheinallee 100, 55120 Mainz',
        priority: 'normal'
      }
    ],
    policeStations: [
      {
        id: 'de-ps-1',
        name: 'Autobahnpolizeistation Frankfurt (A3/A5)',
        lat: 50.0380,
        lng: 8.5720,
        address: 'Am Flughafen 12, 60549 Frankfurt am Main',
        phone: '110 / +49 69 755 46400',
        jurisdiction: 'Polizeipräsidium Frankfurt am Main',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'de-ps-2',
        name: 'Polizeidirektion Groß-Gerau / Rüsselsheim',
        lat: 49.9920,
        lng: 8.4190,
        address: 'Hochstraße 27, 65428 Rüsselsheim',
        phone: '110 / +49 6142 6960',
        jurisdiction: 'Polizeipräsidium Südhessen',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'de-ps-3',
        name: 'Polizeipräsidium Westhessen Wiesbaden',
        lat: 50.0620,
        lng: 8.2610,
        address: 'Konrad-Adenauer-Ring 51, 65187 Wiesbaden',
        phone: '110 / +49 611 3450',
        jurisdiction: 'Polizei Hessen',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  },
  {
    id: 'london-thames-gateway',
    name: 'Greater London & Thames Gateway Freight Corridor',
    city: 'London, United Kingdom',
    description: 'Secured high-value cargo transport across central London, Docklands, and the Thames gateway with Met Police coverage.',
    waypoints: [
      {
        id: 'lon-1',
        name: 'Heathrow Cargo Centre & Customs Depot',
        lat: 51.4700,
        lng: -0.4543,
        type: 'depot',
        address: 'Scara Way, Heathrow Airport, Hounslow TW6 3RT',
        priority: 'high'
      },
      {
        id: 'lon-2',
        name: 'Park Royal Industrial Distribution Hub',
        lat: 51.5312,
        lng: -0.2701,
        type: 'delivery',
        address: 'Abbey Road, Park Royal, London NW10 7RG',
        priority: 'normal'
      },
      {
        id: 'lon-3',
        name: 'Canary Wharf High-Value Financial Vault',
        lat: 51.5054,
        lng: -0.0235,
        type: 'delivery',
        address: '1 Canada Square, Canary Wharf, London E14 5AA',
        priority: 'critical'
      },
      {
        id: 'lon-4',
        name: 'London Gateway Port & Logistics Park',
        lat: 51.5032,
        lng: 0.4721,
        type: 'delivery',
        address: 'North Sea Gateway, Stanford-le-Hope SS17 9DY',
        priority: 'normal'
      }
    ],
    policeStations: [
      {
        id: 'lon-ps-1',
        name: 'Metropolitan Police Heathrow Station',
        lat: 51.4720,
        lng: -0.4501,
        address: 'East Ramp, Heathrow Airport, Hounslow TW6 2DX',
        phone: '999 / +44 20 8897 7343',
        jurisdiction: 'Metropolitan Police Aviation Security',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'lon-ps-2',
        name: 'City of London Police HQ - Bishopsgate',
        lat: 51.5175,
        lng: -0.0812,
        address: '182 Bishopsgate, London EC2M 4PT',
        phone: '999 / +44 20 7601 2222',
        jurisdiction: 'City of London Police',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'lon-ps-3',
        name: 'Isle of Dogs Police Station (Canary Wharf)',
        lat: 51.4980,
        lng: -0.0160,
        address: '126 Manchester Rd, London E14 3HN',
        phone: '999 / +44 20 7275 4484',
        jurisdiction: 'Metropolitan Police Central East',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  },
  {
    id: 'tokyo-bay-express',
    name: 'Tokyo Bay Intermodal Logistics & Expressway Corridor',
    city: 'Tokyo, Japan',
    description: 'Automated rapid freight corridor connecting Haneda Air Cargo, Ohi Container Wharf, and Ginza Central distribution.',
    waypoints: [
      {
        id: 'tyo-1',
        name: 'Haneda International Air Cargo Hub',
        lat: 35.5494,
        lng: 139.7798,
        type: 'depot',
        address: 'Hanedakuko 2-Chome, Ota City, Tokyo 144-0041',
        priority: 'high'
      },
      {
        id: 'tyo-2',
        name: 'Ohi Container Terminal 3',
        lat: 35.5982,
        lng: 139.7610,
        type: 'delivery',
        address: 'Yashio 2-Chome, Shinagawa City, Tokyo 140-0003',
        priority: 'normal'
      },
      {
        id: 'tyo-3',
        name: 'Ginza Commercial Vault & Delivery Center',
        lat: 35.6719,
        lng: 139.7650,
        type: 'delivery',
        address: 'Ginza 4-Chome, Chuo City, Tokyo 104-0061',
        priority: 'critical'
      },
      {
        id: 'tyo-4',
        name: 'Shinjuku Logistics Exchange',
        lat: 35.6900,
        lng: 139.7005,
        type: 'delivery',
        address: 'Nishi-Shinjuku 2-Chome, Shinjuku City, Tokyo 163-8001',
        priority: 'normal'
      }
    ],
    policeStations: [
      {
        id: 'tyo-ps-1',
        name: 'Tokyo Haneda Airport Police Station',
        lat: 35.5480,
        lng: 139.7845,
        address: '2-6-4 Hanedakuko, Ota City, Tokyo',
        phone: '110 / +81 3-5757-0110',
        jurisdiction: 'Tokyo Metropolitan Police Department (TMPD)',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'tyo-ps-2',
        name: 'Tokyo Bay Port Police Station',
        lat: 35.6170,
        lng: 139.7750,
        address: '5-10-1 Aomi, Koto City, Tokyo',
        phone: '110 / +81 3-3599-0110',
        jurisdiction: 'TMPD Tokyo Bay Division',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'tyo-ps-3',
        name: 'Tsukiji Police Station (Chuo/Ginza)',
        lat: 35.6660,
        lng: 139.7710,
        address: '3-6-10 Tsukiji, Chuo City, Tokyo',
        phone: '110 / +81 3-3543-0110',
        jurisdiction: 'TMPD Tsukiji Division',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  },
  {
    id: 'paris-ile-de-france',
    name: 'Paris & Île-de-France Industrial Logistics Axis',
    city: 'Paris, France',
    description: 'Secured high-priority freight corridor linking Roissy CDG Airport Cargo to La Défense and Paris Centre.',
    waypoints: [
      {
        id: 'par-1',
        name: 'Charles de Gaulle Airport Cargo City',
        lat: 49.0097,
        lng: 2.5479,
        type: 'depot',
        address: 'Zone de Fret 4, 95700 Roissy-en-France',
        priority: 'high'
      },
      {
        id: 'par-2',
        name: 'Saint-Denis Intermodal Logistics Hub',
        lat: 48.9360,
        lng: 2.3574,
        type: 'delivery',
        address: 'Avenue du Président Wilson, 93200 Saint-Denis',
        priority: 'normal'
      },
      {
        id: 'par-3',
        name: 'La Défense Corporate Hub & Secure Vault',
        lat: 48.8920,
        lng: 2.2370,
        type: 'delivery',
        address: 'Esplanade de La Défense, 92800 Puteaux',
        priority: 'critical'
      },
      {
        id: 'par-4',
        name: 'Paris Rive Gauche Distribution Center',
        lat: 48.8280,
        lng: 2.3780,
        type: 'delivery',
        address: 'Quai Panhard et Levassor, 75013 Paris',
        priority: 'normal'
      }
    ],
    policeStations: [
      {
        id: 'par-ps-1',
        name: 'Police aux Frontières CDG Hub',
        lat: 49.0070,
        lng: 2.5530,
        address: 'Terminal 2, Aéroport CDG, 95700 Roissy',
        phone: '17 / 112 / +33 1 48 62 31 22',
        jurisdiction: 'Police Nationale PAF CDG',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'par-ps-2',
        name: 'Commissariat Central de Police de Paris 8e',
        lat: 48.8740,
        lng: 2.3160,
        address: '1 Rue de Lisbonne, 75008 Paris',
        phone: '17 / 112 / +33 1 53 76 60 00',
        jurisdiction: 'Préfecture de Police de Paris',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'par-ps-3',
        name: 'Commissariat de Police de Puteaux / La Défense',
        lat: 48.8850,
        lng: 2.2380,
        address: '15 Rue de Verdun, 92800 Puteaux',
        phone: '17 / 112 / +33 1 41 44 48 70',
        jurisdiction: 'Police Nationale Hauts-de-Seine',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  },
  {
    id: 'dubai-logistics-corridor',
    name: 'Dubai Logistics City & JAFZA Port Transit',
    city: 'Dubai, United Arab Emirates',
    description: 'Ultra-modern arterial corridor linking Jebel Ali Port, Al Maktoum Cargo, and Downtown Dubai.',
    waypoints: [
      {
        id: 'dxb-1',
        name: 'Al Maktoum Airport Cargo City Depot',
        lat: 24.8960,
        lng: 55.1610,
        type: 'depot',
        address: 'Dubai South Aviation District, Dubai',
        priority: 'high'
      },
      {
        id: 'dxb-2',
        name: 'JAFZA Port Free Zone Warehouse',
        lat: 25.0110,
        lng: 55.0880,
        type: 'delivery',
        address: 'Jebel Ali Free Zone Gate 4, Dubai',
        priority: 'critical'
      },
      {
        id: 'dxb-3',
        name: 'Dubai Marina Commercial Tower',
        lat: 25.0800,
        lng: 55.1400,
        type: 'delivery',
        address: 'Marina Plaza, Dubai Marina, Dubai',
        priority: 'normal'
      },
      {
        id: 'dxb-4',
        name: 'Downtown Dubai Financial Center (DIFC)',
        lat: 25.2048,
        lng: 55.2708,
        type: 'delivery',
        address: 'Gate Precinct 4, DIFC, Dubai',
        priority: 'high'
      }
    ],
    policeStations: [
      {
        id: 'dxb-ps-1',
        name: 'Dubai Police General HQ - Jebel Ali',
        lat: 25.0080,
        lng: 55.1050,
        address: 'Near JAFZA Roundabout 8, Jebel Ali, Dubai',
        phone: '999 / +971 4 609 9999',
        jurisdiction: 'Dubai Police Force (Smart Police Post)',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'dxb-ps-2',
        name: 'Al Barsha Police Station',
        lat: 25.1020,
        lng: 55.1980,
        address: 'First Al Khail St, Al Barsha 2, Dubai',
        phone: '999 / +971 4 814 8888',
        jurisdiction: 'Dubai Police Bur Dubai Sector',
        open24_7: true,
        emergencyType: 'police'
      },
      {
        id: 'dxb-ps-3',
        name: 'Zabeel Police Station (DIFC & Downtown)',
        lat: 25.2150,
        lng: 55.2850,
        address: 'Sheikh Rashid Rd, Zabeel 2, Dubai',
        phone: '999 / +971 4 398 1111',
        jurisdiction: 'Dubai Police Central Command',
        open24_7: true,
        emergencyType: 'police'
      }
    ]
  }
];
