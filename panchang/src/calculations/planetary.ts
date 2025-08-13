import { OrbitalElements } from '../types/panchang';
import { normalizeAngle } from '../utils/index';

export interface OrbitalParameters {
    perihelion: number;
    aphelion: number;
    eccentricity: number;
    semiMajorAxis: number;
    orbitalPeriod: number;
    inclination: number;
    longitudeOfAscendingNode: number;
    argumentOfPeriapsis: number;
}

export interface TithiInfo {
    tithi: number;
    name: string;
    percentage: number;
    isWaxing: boolean;
}

export interface RashiInfo {
    rashi: number;
    name: string;
    element: string;
    ruler: string;
    degree: number; // Position within the rashi (0-30°)
}

export interface NakshatraInfo {
    nakshatra: number;
    name: string;
    pada: number;
    ruler: string;
    deity: string;
    symbol: string;
    degree: number; // Position within nakshatra
}

export interface PlanetaryPosition {
    planet: string;
    longitude: number; // Sidereal longitude
    latitude: number;
    rashi: RashiInfo;
    nakshatra: NakshatraInfo;
}

export const RASHIS = [
    { name: "Mesha", element: "Fire", ruler: "Mars" },
    { name: "Vrishabha", element: "Earth", ruler: "Venus" },
    { name: "Mithuna", element: "Air", ruler: "Mercury" },
    { name: "Karka", element: "Water", ruler: "Moon" },
    { name: "Simha", element: "Fire", ruler: "Sun" },
    { name: "Kanya", element: "Earth", ruler: "Mercury" },
    { name: "Tula", element: "Air", ruler: "Venus" },
    { name: "Vrishchika", element: "Water", ruler: "Mars" },
    { name: "Dhanu", element: "Fire", ruler: "Jupiter" },
    { name: "Makara", element: "Earth", ruler: "Saturn" },
    { name: "Kumbha", element: "Air", ruler: "Saturn" },
    { name: "Meena", element: "Water", ruler: "Jupiter" }
];

export const NAKSHATRAS = [
    { name: "Ashwini", ruler: "Ketu", deity: "Ashwini Kumaras", symbol: "Horse's head" },
    { name: "Bharani", ruler: "Venus", deity: "Yama", symbol: "Yoni" },
    { name: "Krittika", ruler: "Sun", deity: "Agni", symbol: "Razor/flame" },
    { name: "Rohini", ruler: "Moon", deity: "Brahma", symbol: "Cart/chariot" },
    { name: "Mrigashira", ruler: "Mars", deity: "Soma", symbol: "Deer's head" },
    { name: "Ardra", ruler: "Rahu", deity: "Rudra", symbol: "Teardrop" },
    { name: "Punarvasu", ruler: "Jupiter", deity: "Aditi", symbol: "Quiver of arrows" },
    { name: "Pushya", ruler: "Saturn", deity: "Brihaspati", symbol: "Cow's udder" },
    { name: "Ashlesha", ruler: "Mercury", deity: "Nagas", symbol: "Serpent" },
    { name: "Magha", ruler: "Ketu", deity: "Pitrs", symbol: "Throne" },
    { name: "Purva Phalguni", ruler: "Venus", deity: "Bhaga", symbol: "Hammock" },
    { name: "Uttara Phalguni", ruler: "Sun", deity: "Aryaman", symbol: "Bed" },
    { name: "Hasta", ruler: "Moon", deity: "Savitar", symbol: "Hand" },
    { name: "Chitra", ruler: "Mars", deity: "Vishvakarma", symbol: "Pearl" },
    { name: "Swati", ruler: "Rahu", deity: "Vayu", symbol: "Sword" },
    { name: "Vishakha", ruler: "Jupiter", deity: "Indragni", symbol: "Triumphal arch" },
    { name: "Anuradha", ruler: "Saturn", deity: "Mitra", symbol: "Lotus" },
    { name: "Jyeshtha", ruler: "Mercury", deity: "Indra", symbol: "Earring" },
    { name: "Mula", ruler: "Ketu", deity: "Nirriti", symbol: "Bunch of roots" },
    { name: "Purva Ashadha", ruler: "Venus", deity: "Apah", symbol: "Fan" },
    { name: "Uttara Ashadha", ruler: "Sun", deity: "Vishvedevas", symbol: "Elephant tusk" },
    { name: "Shravana", ruler: "Moon", deity: "Vishnu", symbol: "Ear" },
    { name: "Dhanishtha", ruler: "Mars", deity: "Vasus", symbol: "Drum" },
    { name: "Shatabhisha", ruler: "Rahu", deity: "Varuna", symbol: "Circle" },
    { name: "Purva Bhadrapada", ruler: "Jupiter", deity: "Ajaikapat", symbol: "Front legs of bed" },
    { name: "Uttara Bhadrapada", ruler: "Saturn", deity: "Ahirbudhnya", symbol: "Back legs of bed" },
    { name: "Revati", ruler: "Mercury", deity: "Pushan", symbol: "Fish" }
];

export class Planetary {
    private readonly orbital_data: { [key: string]: OrbitalParameters } = {
        'Mercury': {
            perihelion: 0.307,
            aphelion: 0.467,
            eccentricity: 0.2056,
            semiMajorAxis: 0.387,
            orbitalPeriod: 87.97,
            inclination: 7.005,
            longitudeOfAscendingNode: 48.331,
            argumentOfPeriapsis: 29.124
        },
        'Venus': {
            perihelion: 0.718,
            aphelion: 0.728,
            eccentricity: 0.0067,
            semiMajorAxis: 0.723,
            orbitalPeriod: 224.70,
            inclination: 3.395,
            longitudeOfAscendingNode: 76.680,
            argumentOfPeriapsis: 54.884
        },
        'Earth': {
            perihelion: 0.983,
            aphelion: 1.017,
            eccentricity: 0.0167,
            semiMajorAxis: 1.000,
            orbitalPeriod: 365.26,
            inclination: 0.000,
            longitudeOfAscendingNode: 0.000,
            argumentOfPeriapsis: 114.208
        },
        'Mars': {
            perihelion: 1.381,
            aphelion: 1.666,
            eccentricity: 0.0935,
            semiMajorAxis: 1.524,
            orbitalPeriod: 686.98,
            inclination: 1.850,
            longitudeOfAscendingNode: 49.558,
            argumentOfPeriapsis: 286.502
        },
        'Jupiter': {
            perihelion: 4.950,
            aphelion: 5.455,
            eccentricity: 0.0489,
            semiMajorAxis: 5.203,
            orbitalPeriod: 4332.59,
            inclination: 1.304,
            longitudeOfAscendingNode: 100.464,
            argumentOfPeriapsis: 273.867
        },
        'Saturn': {
            perihelion: 9.020,
            aphelion: 10.054,
            eccentricity: 0.0565,
            semiMajorAxis: 9.537,
            orbitalPeriod: 10759.22,
            inclination: 2.489,
            longitudeOfAscendingNode: 113.665,
            argumentOfPeriapsis: 339.392
        },
        'Uranus': {
            perihelion: 18.324,
            aphelion: 20.110,
            eccentricity: 0.0457,
            semiMajorAxis: 19.217,
            orbitalPeriod: 30688.5,
            inclination: 0.773,
            longitudeOfAscendingNode: 74.006,
            argumentOfPeriapsis: 96.998
        },
        'Neptune': {
            perihelion: 29.820,
            aphelion: 30.330,
            eccentricity: 0.0113,
            semiMajorAxis: 30.075,
            orbitalPeriod: 60182,
            inclination: 1.770,
            longitudeOfAscendingNode: 131.784,
            argumentOfPeriapsis: 276.336
        }
    };

    calculateOrbit(planet: string, date: Date): { perihelion: number; aphelion: number; eccentricity: number } {
        const orbital_params = this.orbital_data[planet];
        
        if (!orbital_params) {
            // Return default values for unknown planets
            return {
                perihelion: 1.0,
                aphelion: 1.0,
                eccentricity: 0.0
            };
        }

        // Apply small variations based on date for more realistic simulation
        const epoch = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)); // J2000.0 epoch
        const days_since_epoch = (date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24);
        const variation = Math.sin(days_since_epoch / 365.25) * 0.001;

        return {
            perihelion: orbital_params.perihelion * (1 + variation),
            aphelion: orbital_params.aphelion * (1 + variation),
            eccentricity: orbital_params.eccentricity * (1 + variation * 0.1)
        };
    }

    calculateTithi(sunLongitude: number, moonLongitude: number): TithiInfo {
        const tithi_names = [
            'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
            'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
            'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
        ];

        // Calculate elongation (longitude difference between Moon and Sun)
        // This follows the correct astronomical definition
        let elongation = normalizeAngle(moonLongitude - sunLongitude);
        
        // Each tithi spans 12 degrees (360° / 30 tithis)
        const tithi_length = 12;
        
        // Calculate tithi number (1-30)
        const tithi_number = Math.floor(elongation / tithi_length) + 1;
        
        // Calculate percentage completion of current tithi
        const remainder = elongation % tithi_length;
        const percentage = (remainder / tithi_length) * 100;
        
        // Determine paksha (fortnight) and adjust tithi
        let final_tithi: number;
        let is_waxing: boolean;
        let tithi_name: string;
        
        if (tithi_number <= 15) {
            // Shukla Paksha (Waxing Moon) - Tithis 1-15
            is_waxing = true;
            final_tithi = tithi_number;
            if (final_tithi === 15) {
                tithi_name = 'Purnima'; // Full Moon
            } else {
                tithi_name = tithi_names[final_tithi - 1];
            }
        } else {
            // Krishna Paksha (Waning Moon) - Tithis 16-30, numbered as 1-15
            is_waxing = false;
            final_tithi = tithi_number - 15;
            if (final_tithi === 15) {
                tithi_name = 'Amavasya'; // New Moon
            } else {
                tithi_name = tithi_names[final_tithi - 1];
            }
        }
        
        return {
            tithi: final_tithi,
            name: tithi_name,
            percentage: percentage,
            isWaxing: is_waxing
        };
    }

    calculateYoga(sunLongitude: number, moonLongitude: number): { yoga: number; name: string } {
        const yoga_names = [
            'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
            'Sukarman', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva',
            'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan',
            'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla',
            'Brahma', 'Indra', 'Vaidhriti'
        ];

        // Yoga is the sum of Sun and Moon longitudes
        // Each yoga spans 13°20' (360° / 27 yogas = 13.333...°)
        const sum = normalizeAngle(sunLongitude + moonLongitude);
        const yoga_arc = 360 / 27;
        
        // Calculate yoga number (0-based for array indexing)
        let yoga_index = Math.floor(sum / yoga_arc);
        
        // Ensure yoga index is within valid range (0-26)
        yoga_index = Math.max(0, Math.min(26, yoga_index));
        
        return {
            yoga: yoga_index + 1,
            name: yoga_names[yoga_index]
        };
    }

    calculateKarana(sunLongitude: number, moonLongitude: number): { karana: number; name: string } {
        const karana_names = [
            'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
            'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
        ];

        // Calculate elongation (longitude difference between Moon and Sun)
        const elongation = normalizeAngle(moonLongitude - sunLongitude);
        const karana_arc = 6;
        let karana_index = Math.floor(elongation / karana_arc);
        
        // Handle the cyclic nature of karanas properly
        // In a lunar month, there are 60 karanas total:
        // - First 57 karanas: 7 movable karanas (Bava through Vishti) repeat in cycles
        // - Last 4 karanas: fixed karanas (Shakuni, Chatushpada, Naga, Kimstughna)
        
        let final_index: number;
        let karana_number: number;
        
        if (karana_index < 57) {
            // Movable karanas (first 57) - cycle through Bava to Vishti
            final_index = karana_index % 7;
            karana_number = karana_index + 1;
        } else {
            // Fixed karanas (last 4)
            const fixed_index = Math.min(3, karana_index - 57);
            final_index = 7 + fixed_index;
            karana_number = 58 + fixed_index;
        }
        
        // Ensure we don't go beyond array bounds
        final_index = Math.min(Math.max(0, final_index), karana_names.length - 1);
        
        return {
            karana: karana_number,
            name: karana_names[final_index]
        };
    }

    getOrbitalPeriod(planet: string): number {
        const orbital_params = this.orbital_data[planet];
        return orbital_params ? orbital_params.orbitalPeriod : 365.25;
    }

    getSemiMajorAxis(planet: string): number {
        const orbital_params = this.orbital_data[planet];
        return orbital_params ? orbital_params.semiMajorAxis : 1.0;
    }

    getEccentricity(planet: string): number {
        const orbital_params = this.orbital_data[planet];
        return orbital_params ? orbital_params.eccentricity : 0.0;
    }

    getInclination(planet: string): number {
        const orbital_params = this.orbital_data[planet];
        return orbital_params ? orbital_params.inclination : 0.0;
    }

    calculateMeanAnomaly(planet: string, date: Date): number {
        const orbital_params = this.orbital_data[planet];
        if (!orbital_params) return 0;

        const epoch = new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0));
        const days_since_epoch = (date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24);
        const mean_motion = 360 / orbital_params.orbitalPeriod;

        return normalizeAngle(mean_motion * days_since_epoch);
    }

    calculateTrueAnomaly(planet: string, date: Date): number {
        const mean_anomaly = this.calculateMeanAnomaly(planet, date);
        const eccentricity = this.getEccentricity(planet);

        const mean_anomaly_rad = mean_anomaly * Math.PI / 180;
        const true_anomaly_rad = mean_anomaly_rad + 2 * eccentricity * Math.sin(mean_anomaly_rad);

        return normalizeAngle(true_anomaly_rad * 180 / Math.PI);
    }

    calculateRashi(longitude: number): RashiInfo {
        const rashi_number = Math.floor(longitude / 30);
        const degree_in_rashi = longitude % 30;

        const rashi_data = RASHIS[rashi_number];

        return {
            rashi: rashi_number + 1,
            name: rashi_data.name,
            element: rashi_data.element,
            ruler: rashi_data.ruler,
            degree: degree_in_rashi
        };
    }

    calculateNakshatra(longitude: number): NakshatraInfo {
        const nakshatra_size = 360 / 27;
        const nakshatra_number = Math.floor(longitude / nakshatra_size);
        const degree_in_nakshatra = longitude % nakshatra_size;

        const pada = Math.floor(degree_in_nakshatra / (nakshatra_size / 4)) + 1;

        const nakshatra_data = NAKSHATRAS[nakshatra_number];

        return {
            nakshatra: nakshatra_number + 1,
            name: nakshatra_data.name,
            pada: pada,
            ruler: nakshatra_data.ruler,
            deity: nakshatra_data.deity,
            symbol: nakshatra_data.symbol,
            degree: degree_in_nakshatra
        };
    }
}
