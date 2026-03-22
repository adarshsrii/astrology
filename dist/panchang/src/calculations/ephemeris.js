"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ephemeris = void 0;
const swisseph = __importStar(require("swisseph"));
const index_1 = require("../utils/index");
const planetary_1 = require("./planetary");
const path = __importStar(require("path"));
class Ephemeris {
    constructor(ephemeris_path) {
        this.planet_map = {
            'Sun': 0,
            'Moon': 1,
            'Mercury': 2,
            'Venus': 3,
            'Mars': 4,
            'Jupiter': 5,
            'Saturn': 6,
            'Uranus': 7,
            'Neptune': 8,
            'Pluto': 9,
            'Rahu': 11,
            'Ketu': -1 // Special handling for South Node (180° from Rahu)
        };
        this.ephemeris_path = '';
        // Use the local ephe directory that contains Swiss Ephemeris files
        if (!ephemeris_path) {
            // Try multiple possible paths for the ephemeris files
            const possible_paths = [
                path.join(__dirname, '../../ephe'),
                path.join(__dirname, '../node_modules/swisseph/ephe'),
                path.join(process.cwd(), 'ephe'),
                path.join(process.cwd(), 'node_modules/swisseph/ephe') // CWD node_modules
            ];
            // Use the first existing path
            this.ephemeris_path = possible_paths.find(p => {
                try {
                    const fs = require('fs');
                    return fs.existsSync(p);
                }
                catch {
                    return false;
                }
            }) || possible_paths[0];
        }
        else {
            this.ephemeris_path = ephemeris_path;
        }
        this.initialize_swiss_eph();
    }
    initialize_swiss_eph() {
        try {
            swisseph.swe_set_ephe_path(this.ephemeris_path);
        }
        catch (error) {
            console.warn('Could not set ephemeris path, using default built-in panchang');
        }
    }
    calculatePosition(date, body) {
        const jd = this.date_to_julian(date);
        const planet_id = this.get_planet_id(body);
        try {
            let result;
            if (body === 'Ketu') {
                // Ketu is 180° opposite to Rahu
                result = swisseph.swe_calc_ut(jd, swisseph.SE_MEAN_NODE, swisseph.SEFLG_SWIEPH);
                if (result && 'longitude' in result) {
                    const ketuLongitude = (0, index_1.normalizeAngle)(result.longitude + 180);
                    return {
                        longitude: ketuLongitude,
                        latitude: -result.latitude // Opposite latitude
                    };
                }
            }
            else {
                result = swisseph.swe_calc_ut(jd, planet_id, swisseph.SEFLG_SWIEPH);
            }
            if (result && 'longitude' in result) {
                return {
                    longitude: (0, index_1.normalizeAngle)(result.longitude),
                    latitude: result.latitude
                };
            }
            // Fallback if Swiss Ephemeris fails
            return this.get_fallback_position(body, date);
        }
        catch (error) {
            console.warn(`Swiss Ephemeris calculation failed for ${body}, using fallback`);
            return this.get_fallback_position(body, date);
        }
    }
    calculateSiderealPosition(date, body, ayanamsa) {
        const current_ayanamsa = ayanamsa || this.calculate_lahiri_ayanamsa(date);
        const tropicalPosition = this.calculatePosition(date, body);
        return {
            longitude: (0, index_1.normalizeAngle)(tropicalPosition.longitude - current_ayanamsa),
            latitude: tropicalPosition.latitude
        };
    }
    calculate_lahiri_ayanamsa(date) {
        try {
            const jd = this.date_to_julian(date);
            // Set Lahiri ayanamsa (SE_SIDM_LAHIRI = 1)
            swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, jd, 0);
            const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);
            return ayanamsa || this.get_fallback_lahiri_ayanamsa(date);
        }
        catch (error) {
            return this.get_fallback_lahiri_ayanamsa(date);
        }
    }
    get_fallback_lahiri_ayanamsa(date) {
        // Simple Lahiri ayanamsa fallback
        const year = date.getFullYear() + (date.getMonth() + 1) / 12 + date.getDate() / 365.25;
        const t = (year - 1900.0) / 100.0;
        return 22.46000 + 1.3915817 * t - 0.0130125 * t * t;
    }
    /**
     * Get all available ayanamsa systems with their degrees for a given date
     * @param date Date for ayanamsa calculation
     * @returns Array of ayanamsa information including name, ID, degree, and description
     */
    getAyanamsa(date) {
        const jd = this.date_to_julian(date);
        // Swiss Ephemeris Ayanamsa Systems (SE_SIDM constants)
        const ayanamsa_systems = [
            { id: 0, name: 'Fagan/Bradley', description: 'Fagan/Bradley (Western Sidereal)' },
            { id: 1, name: 'Lahiri', description: 'Lahiri (Chitrapaksha) - Official Indian Government' },
            { id: 2, name: 'De Luce', description: 'De Luce ayanamsa' },
            { id: 3, name: 'Raman', description: 'B.V. Raman ayanamsa' },
            { id: 4, name: 'Ushashashi', description: 'Ushashashi ayanamsa' },
            { id: 5, name: 'Krishnamurti', description: 'Krishnamurti ayanamsa (KP System)' },
            { id: 6, name: 'Djwhal Khul', description: 'Djwhal Khul ayanamsa' },
            { id: 7, name: 'Yukteshwar', description: 'Sri Yukteshwar ayanamsa' },
            { id: 8, name: 'J.N. Bhasin', description: 'J.N. Bhasin ayanamsa' },
            { id: 9, name: 'Babylonian (Kugler 1)', description: 'Babylonian ayanamsa (Kugler 1)' },
            { id: 10, name: 'Babylonian (Kugler 2)', description: 'Babylonian ayanamsa (Kugler 2)' },
            { id: 11, name: 'Babylonian (Kugler 3)', description: 'Babylonian ayanamsa (Kugler 3)' },
            { id: 12, name: 'Babylonian (Huber)', description: 'Babylonian ayanamsa (Huber)' },
            { id: 13, name: 'Eta Piscium', description: 'Eta Piscium ayanamsa' },
            { id: 14, name: 'Aldebaran 15 Tau', description: 'Aldebaran at 15° Taurus' },
            { id: 15, name: 'Hipparchos', description: 'Hipparchos ayanamsa' },
            { id: 16, name: 'Sassanian', description: 'Sassanian ayanamsa' },
            { id: 17, name: 'Galact. Center (Brand)', description: 'Galactic Center ayanamsa (Brand)' },
            { id: 18, name: 'J2000', description: 'J2000.0 reference frame' },
            { id: 19, name: 'J1900', description: 'J1900.0 reference frame' },
            { id: 20, name: 'B1950', description: 'B1950.0 reference frame' },
            { id: 21, name: 'Suryasiddhanta', description: 'Suryasiddhanta ayanamsa' },
            { id: 22, name: 'Suryasiddhanta (mean Sun)', description: 'Suryasiddhanta (mean Sun)' },
            { id: 23, name: 'Aryabhata', description: 'Aryabhata ayanamsa' },
            { id: 24, name: 'Aryabhata 522', description: 'Aryabhata 522 CE ayanamsa' },
            { id: 25, name: 'Babylonian (Britton)', description: 'Babylonian ayanamsa (Britton)' },
            { id: 26, name: 'True Chitra', description: 'True Chitra ayanamsa' },
            { id: 27, name: 'True Revati', description: 'True Revati ayanamsa' },
            { id: 28, name: 'True Pushya', description: 'True Pushya ayanamsa' },
            { id: 29, name: 'Galactic (Gil Brand)', description: 'Galactic Center (Gil Brand)' },
            { id: 30, name: 'Galactic Equator (IAU1958)', description: 'Galactic Equator (IAU1958)' },
            { id: 31, name: 'Galactic Equator', description: 'Galactic Equator' },
            { id: 32, name: 'Galactic Equator (mid-Mula)', description: 'Galactic Equator at mid-Mula' },
            { id: 33, name: 'Skydram (Mardyks)', description: 'Skydram ayanamsa (Mardyks)' },
            { id: 34, name: 'True Mula', description: 'True Mula ayanamsa' },
            { id: 35, name: 'Dhruva Galactic Center', description: 'Dhruva Galactic Center ayanamsa' },
            { id: 36, name: 'Aryabhata Mean Sun', description: 'Aryabhata Mean Sun ayanamsa' },
            { id: 37, name: 'Lahiri VP285', description: 'Lahiri VP285 ayanamsa' },
            { id: 38, name: 'Krishnamurti VP291', description: 'Krishnamurti VP291 ayanamsa' },
            { id: 39, name: 'Lahiri ICRC', description: 'Lahiri ICRC ayanamsa' }
        ];
        const results = [];
        ayanamsa_systems.forEach(system => {
            try {
                // Set the ayanamsa mode
                swisseph.swe_set_sid_mode(system.id, jd, 0);
                // Get ayanamsa value for the given date
                const ayanamsaValue = swisseph.swe_get_ayanamsa_ut(jd);
                results.push({
                    name: system.name,
                    id: system.id,
                    degree: ayanamsaValue || this.get_fallback_ayanamsa(system.id, date),
                    description: system.description
                });
            }
            catch (error) {
                results.push({
                    name: system.name,
                    id: system.id,
                    degree: this.get_fallback_ayanamsa(system.id, date),
                    description: system.description
                });
            }
        });
        // Sort by degree value for easier comparison
        results.sort((a, b) => a.degree - b.degree);
        return results;
    }
    /**
     * Get a specific ayanamsa value by name or ID
     * @param date Date for calculation
     * @param ayanamsaId Ayanamsa ID or name
     * @returns Ayanamsa information
     */
    getSpecificAyanamsa(date, ayanamsa_id) {
        const allAyanamsas = this.getAyanamsa(date);
        if (typeof ayanamsa_id === 'number') {
            return allAyanamsas.find(a => a.id === ayanamsa_id) || null;
        }
        else {
            const exact_match = allAyanamsas.find(a => a.name.toLowerCase() === ayanamsa_id.toLowerCase());
            if (exact_match) {
                return exact_match;
            }
            return allAyanamsas.find(a => a.name.toLowerCase().includes(ayanamsa_id.toLowerCase())) || null;
        }
    }
    get_fallback_ayanamsa(systemId, date) {
        const year = date.getFullYear();
        const t = (year - 1900) / 100;
        // Approximate calculations for different ayanamsa systems
        switch (systemId) {
            case 0: // Fagan/Bradley
                return 24.740 + 1.39 * t - 0.01 * t * t;
            case 1: // Lahiri
                return 22.460 + 1.39 * t - 0.01 * t * t;
            case 3: // Raman
                return 21.580 + 1.39 * t - 0.01 * t * t;
            case 5: // Krishnamurti
                return 23.230 + 1.39 * t - 0.01 * t * t;
            case 7: // Yukteshwar
                return 22.460 + 1.39 * t - 0.01 * t * t;
            default:
                // Default to Lahiri approximation
                return 22.460 + 1.39 * t - 0.01 * t * t;
        }
    }
    calculateSunrise(date, location) {
        try {
            // Improved sunrise calculation using NOAA Solar Calculator algorithm
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();
            // Calculate Julian day number
            const a = Math.floor((14 - month) / 12);
            const y = year - a;
            const m = month + 12 * a - 3;
            const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
            // Calculate day of year
            const dayOfYear = jd - Math.floor((14 - 1) / 12) * 365 - Math.floor(y / 4) + Math.floor(y / 100) - Math.floor(y / 400) + Math.floor((153 * (1 + 12 * Math.floor((14 - 1) / 12) - 3) + 2) / 5) + 1 - 32045;
            // More accurate solar calculations
            const P = Math.asin(0.39795 * Math.cos(0.98563 * (dayOfYear - 173) * Math.PI / 180));
            const argumentum = Math.tan(location.latitude * Math.PI / 180) * Math.tan(P);
            if (Math.abs(argumentum) > 1) {
                return null; // Polar day or night
            }
            const hourAngle = Math.acos(-argumentum) * 180 / Math.PI;
            const sunrise = 12 - hourAngle / 15 - location.longitude / 15;
            // Adjust for UTC
            let sunriseUTC = sunrise;
            if (sunriseUTC < 0)
                sunriseUTC += 24;
            if (sunriseUTC >= 24)
                sunriseUTC -= 24;
            const sunriseHours = Math.floor(sunriseUTC);
            const sunriseMinutes = Math.floor((sunriseUTC - sunriseHours) * 60);
            const sunriseSeconds = Math.floor(((sunriseUTC - sunriseHours) * 60 - sunriseMinutes) * 60);
            return new Date(Date.UTC(year, month - 1, day, sunriseHours, sunriseMinutes, sunriseSeconds));
        }
        catch (error) {
            console.warn('Sunrise calculation failed:', error);
            // Fallback calculation
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 6, 0, 0, 0);
        }
    }
    calculate_sun_altitude(sunLon, sunLat, location, jd) {
        // Convert ecliptic coordinates to equatorial
        const obliquity = 23.43929111; // Mean obliquity of ecliptic for J2000
        const sunLonRad = sunLon * Math.PI / 180;
        const sunLatRad = sunLat * Math.PI / 180;
        const oblRad = obliquity * Math.PI / 180;
        // Calculate right ascension and declination
        const ra = Math.atan2(Math.sin(sunLonRad) * Math.cos(oblRad) - Math.tan(sunLatRad) * Math.sin(oblRad), Math.cos(sunLonRad));
        const dec = Math.asin(Math.sin(sunLatRad) * Math.cos(oblRad) + Math.cos(sunLatRad) * Math.sin(oblRad) * Math.sin(sunLonRad));
        // Calculate Greenwich Mean Sidereal Time
        const t = (jd - 2451545.0) / 36525;
        const gmst0 = 100.46061837 + 36000.770053608 * t + 0.000387933 * t * t - t * t * t / 38710000;
        const gmst = gmst0 + 15.04106864 * ((jd - Math.floor(jd)) * 24);
        const lst = (gmst + location.longitude + 360) % 360;
        // Calculate hour angle
        const ha = (lst - ra * 180 / Math.PI) * Math.PI / 180;
        // Calculate altitude
        const latRad = location.latitude * Math.PI / 180;
        const altitude = Math.asin(Math.sin(latRad) * Math.sin(dec) + Math.cos(latRad) * Math.cos(dec) * Math.cos(ha));
        return altitude * 180 / Math.PI;
    }
    calculateMoonrise(date, location) {
        try {
            const jd = this.date_to_julian(date);
            for (let hour = 0; hour < 48; hour += 0.1) { // Check 48 hours for moonrise
                const testJd = jd - 0.5 + hour / 24;
                const moonPos = swisseph.swe_calc_ut(testJd, swisseph.SE_MOON, swisseph.SEFLG_SWIEPH);
                if (moonPos && 'longitude' in moonPos && moonPos.longitude !== undefined) {
                    const altitude = this.calculate_moon_altitude(moonPos.longitude, moonPos.latitude, location, testJd);
                    if (altitude > -0.8333 && hour > 3) {
                        return this.julian_to_date(testJd);
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.warn('Swiss Ephemeris moonrise calculation failed:', error);
            return null;
        }
    }
    calculateMoonset(date, location) {
        try {
            const jd = this.date_to_julian(date);
            for (let hour = 0; hour < 48; hour += 0.1) { // Check 48 hours for moonset
                const testJd = jd - 0.5 + hour / 24;
                const moonPos = swisseph.swe_calc_ut(testJd, swisseph.SE_MOON, swisseph.SEFLG_SWIEPH);
                if (moonPos && 'longitude' in moonPos && moonPos.longitude !== undefined) {
                    const altitude = this.calculate_moon_altitude(moonPos.longitude, moonPos.latitude, location, testJd);
                    if (altitude < -0.8333 && hour > 3) {
                        return this.julian_to_date(testJd);
                    }
                }
            }
            return null;
        }
        catch (error) {
            console.warn('Swiss Ephemeris moonset calculation failed:', error);
            return null;
        }
    }
    calculate_moon_altitude(moonLon, moonLat, location, jd) {
        // This is a simplified calculation and can be improved with more precise models
        const obliquity = 23.43929111;
        const moonLonRad = moonLon * Math.PI / 180;
        const moonLatRad = moonLat * Math.PI / 180;
        const oblRad = obliquity * Math.PI / 180;
        const ra = Math.atan2(Math.sin(moonLonRad) * Math.cos(oblRad) - Math.tan(moonLatRad) * Math.sin(oblRad), Math.cos(moonLonRad));
        const dec = Math.asin(Math.sin(moonLatRad) * Math.cos(oblRad) + Math.cos(moonLatRad) * Math.sin(oblRad) * Math.sin(moonLonRad));
        const t = (jd - 2451545.0) / 36525;
        const gmst0 = 100.46061837 + 36000.770053608 * t + 0.000387933 * t * t - t * t * t / 38710000;
        const gmst = gmst0 + 15.04106864 * ((jd - Math.floor(jd)) * 24);
        const lst = (gmst + location.longitude + 360) % 360;
        const ha = (lst - ra * 180 / Math.PI) * Math.PI / 180;
        const latRad = location.latitude * Math.PI / 180;
        const altitude = Math.asin(Math.sin(latRad) * Math.sin(dec) + Math.cos(latRad) * Math.cos(dec) * Math.cos(ha));
        return altitude * 180 / Math.PI;
    }
    calculateSunset(date, location) {
        try {
            // Improved sunset calculation using NOAA Solar Calculator algorithm
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();
            // Calculate Julian day number
            const a = Math.floor((14 - month) / 12);
            const y = year - a;
            const m = month + 12 * a - 3;
            const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
            // Calculate day of year
            const dayOfYear = jd - Math.floor((14 - 1) / 12) * 365 - Math.floor(y / 4) + Math.floor(y / 100) - Math.floor(y / 400) + Math.floor((153 * (1 + 12 * Math.floor((14 - 1) / 12) - 3) + 2) / 5) + 1 - 32045;
            // More accurate solar calculations
            const P = Math.asin(0.39795 * Math.cos(0.98563 * (dayOfYear - 173) * Math.PI / 180));
            const argumentum = Math.tan(location.latitude * Math.PI / 180) * Math.tan(P);
            if (Math.abs(argumentum) > 1) {
                return null; // Polar day or night
            }
            const hourAngle = Math.acos(-argumentum) * 180 / Math.PI;
            const sunset = 12 + hourAngle / 15 - location.longitude / 15;
            // Adjust for UTC
            let sunsetUTC = sunset;
            if (sunsetUTC < 0)
                sunsetUTC += 24;
            if (sunsetUTC >= 24)
                sunsetUTC -= 24;
            const sunsetHours = Math.floor(sunsetUTC);
            const sunsetMinutes = Math.floor((sunsetUTC - sunsetHours) * 60);
            const sunsetSeconds = Math.floor(((sunsetUTC - sunsetHours) * 60 - sunsetMinutes) * 60);
            return new Date(Date.UTC(year, month - 1, day, sunsetHours, sunsetMinutes, sunsetSeconds));
        }
        catch (error) {
            console.warn('Sunset calculation failed:', error);
            // Fallback calculation
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 18, 0, 0, 0);
        }
    }
    calculateNakshatra(longitude) {
        const nakshatraNames = [
            'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
            'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
            'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
            'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
            'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
        ];
        const oneNakshatra = 360 / 27; // 13°20'
        const onePada = oneNakshatra / 4; // 3°20'
        const normalizedLon = (0, index_1.normalizeAngle)(longitude);
        const nakshatraNum = Math.floor(normalizedLon / oneNakshatra) + 1;
        const remainder = normalizedLon % oneNakshatra;
        const padaNum = Math.floor(remainder / onePada) + 1;
        return {
            nakshatra: nakshatraNum,
            pada: padaNum,
            name: nakshatraNames[nakshatraNum - 1] || 'Unknown'
        };
    }
    date_to_julian(date) {
        // CRITICAL: Use UTC components to ensure consistent Julian Day calculation
        // This preserves the exact moment represented by the Date object
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours() +
            date.getUTCMinutes() / 60 +
            date.getUTCSeconds() / 3600 +
            date.getUTCMilliseconds() / 3600000;
        try {
            // Use Swiss Ephemeris for accurate Julian Day calculation
            return swisseph.swe_julday(year, month, day, hour, swisseph.SE_GREG_CAL);
        }
        catch (error) {
            // High-precision fallback Julian Day calculation
            // Algorithm from Meeus "Astronomical Algorithms"
            let a, b;
            if (month <= 2) {
                year = year - 1;
                month = month + 12;
            }
            a = Math.floor(year / 100);
            b = 2 - a + Math.floor(a / 4);
            const jd = Math.floor(365.25 * (year + 4716)) +
                Math.floor(30.6001 * (month + 1)) +
                day + hour / 24 + b - 1524.5;
            return jd;
        }
    }
    julian_to_date(jd) {
        try {
            const result = swisseph.swe_revjul(jd, swisseph.SE_GREG_CAL);
            return new Date(result.year, result.month - 1, result.day, Math.floor(result.hour), Math.floor((result.hour % 1) * 60));
        }
        catch (error) {
            // Fallback conversion
            return new Date((jd - 2440587.5) * 86400000);
        }
    }
    get_planet_id(body) {
        return this.planet_map[body] !== undefined ? this.planet_map[body] : 0;
    }
    get_fallback_position(body, date) {
        // Simple fallback using basic orbital elements
        // Use proper UTC epoch calculation
        const epoch = new Date(Date.UTC(2000, 0, 1, 12, 0, 0, 0)); // J2000.0 epoch
        const daysSinceEpoch = (date.getTime() - epoch.getTime()) / 86400000;
        const positions = {
            'Sun': { lon: 280.460, motion: 0.985647 },
            'Moon': { lon: 218.316, motion: 13.176396 },
            'Mercury': { lon: 252.251, motion: 4.092317 },
            'Venus': { lon: 181.980, motion: 1.602136 },
            'Mars': { lon: 355.433, motion: 0.524071 },
            'Jupiter': { lon: 34.351, motion: 0.083056 },
            'Saturn': { lon: 50.078, motion: 0.033371 }
        };
        const body_data = positions[body] || positions['Sun'];
        const longitude = (0, index_1.normalizeAngle)(body_data.lon + body_data.motion * daysSinceEpoch);
        return { longitude, latitude: 0 };
    }
    getCurrentPlanets(date = new Date(), ayanamsaId = 1) {
        const planetary = new planetary_1.Planetary();
        const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
        const positions = [];
        // Get ayanamsa value for the date
        const ayanamsaInfo = this.getSpecificAyanamsa(date, ayanamsaId);
        const ayanamsa = ayanamsaInfo ? ayanamsaInfo.degree : 24.0; // Default to approximate Lahiri
        for (const planet of planets) {
            try {
                const position = this.calculatePosition(date, planet);
                // Convert to sidereal longitude by subtracting ayanamsa
                const siderealLongitude = (0, index_1.normalizeAngle)(position.longitude - ayanamsa);
                // Calculate Rashi and Nakshatra
                const rashi = planetary.calculateRashi(siderealLongitude);
                const nakshatra = planetary.calculateNakshatra(siderealLongitude);
                positions.push({
                    planet: planet,
                    longitude: siderealLongitude,
                    latitude: position.latitude,
                    rashi: rashi,
                    nakshatra: nakshatra
                });
            }
            catch (error) {
                console.warn(`Could not calculate position for ${planet}:`, error);
                // Add with fallback panchang
                const fallbackPos = this.get_fallback_position(planet, date);
                const siderealLongitude = (0, index_1.normalizeAngle)(fallbackPos.longitude - ayanamsa);
                positions.push({
                    planet: planet,
                    longitude: siderealLongitude,
                    latitude: fallbackPos.latitude,
                    rashi: planetary.calculateRashi(siderealLongitude),
                    nakshatra: planetary.calculateNakshatra(siderealLongitude)
                });
            }
        }
        return positions;
    }
    /**
     * Calculate house cusps and ascendant using Swiss Ephemeris swe_houses.
     * @param date UTC Date for calculation
     * @param latitude Geographic latitude
     * @param longitude Geographic longitude
     * @param houseSystem House system type ('whole_sign' | 'equal' | 'placidus')
     * @returns Object with ascendant, mc, and cusps[1..12]
     */
    calculateHouseCusps(date, latitude, longitude, houseSystem) {
        const jd = this.date_to_julian(date);
        // Map house system to Swiss Ephemeris code
        const systemCodes = {
            whole_sign: 'W',
            equal: 'E',
            placidus: 'P',
        };
        const hsys = systemCodes[houseSystem] || 'W';
        try {
            const result = swisseph.swe_houses(jd, latitude, longitude, hsys);
            if (result && result.house) {
                // result.house is array of 12 cusp longitudes (0-indexed)
                // ascendant and mc may be in ascmc array or as direct properties
                const cusps = [0]; // index 0 is unused
                for (let i = 0; i < 12; i++) {
                    cusps.push(result.house[i]);
                }
                let ascendant;
                let mc;
                if (result.ascmc) {
                    ascendant = result.ascmc[0];
                    mc = result.ascmc[1];
                }
                else {
                    ascendant = result.ascendant || cusps[1];
                    mc = result.mc || cusps[10] || 0;
                }
                return { ascendant, mc, cusps };
            }
            throw new Error('swe_houses returned invalid result');
        }
        catch (error) {
            // Fallback: use Sun position as rough ascendant proxy
            console.warn('swe_houses failed, using fallback:', error);
            const sunPos = this.calculatePosition(date, 'Sun');
            const asc = (0, index_1.normalizeAngle)(sunPos.longitude);
            const cusps = [0];
            for (let i = 0; i < 12; i++) {
                cusps.push((0, index_1.normalizeAngle)(asc + i * 30));
            }
            return { ascendant: asc, mc: (0, index_1.normalizeAngle)(asc + 270), cusps };
        }
    }
    /**
     * Calculate position WITH speed (degrees/day) for a celestial body.
     * Uses SEFLG_SPEED flag.
     * @param date Date for calculation
     * @param body Celestial body name
     * @returns Object with longitude, latitude, and speed
     */
    calculatePositionWithSpeed(date, body) {
        const jd = this.date_to_julian(date);
        const planet_id = this.get_planet_id(body);
        try {
            let result;
            if (body === 'Ketu') {
                result = swisseph.swe_calc_ut(jd, swisseph.SE_MEAN_NODE, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
                if (result && 'longitude' in result) {
                    return {
                        longitude: (0, index_1.normalizeAngle)(result.longitude + 180),
                        latitude: -result.latitude,
                        speed: -(result.longitudeSpeed || 0),
                    };
                }
            }
            else {
                result = swisseph.swe_calc_ut(jd, planet_id, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
            }
            if (result && 'longitude' in result) {
                return {
                    longitude: (0, index_1.normalizeAngle)(result.longitude),
                    latitude: result.latitude,
                    speed: result.longitudeSpeed || 0,
                };
            }
            throw new Error('swe_calc_ut returned invalid result');
        }
        catch (error) {
            // Return fallback with zero speed
            const pos = this.get_fallback_position(body, date);
            return { longitude: pos.longitude, latitude: pos.latitude, speed: 0 };
        }
    }
    cleanup() {
        try {
            swisseph.swe_close();
        }
        catch (error) {
            console.warn('Error closing Swiss Ephemeris:', error);
        }
    }
}
exports.Ephemeris = Ephemeris;
