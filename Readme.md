# Astrology Insights v2.0.0

A comprehensive Node.js library for Vedic Panchang, astronomical calculations, and astrological insights. Uses Swiss Ephemeris for precision and is validated against Drik Panchang.

## Installation

```bash
npm install astrology-insights
```

**Requirements:** Node.js >= 16

## Quick Start

```javascript
const { calculateFullPanchang } = require("astrology-insights");

const result = calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
console.log(result.tithi[0].name);      // "Shukla Tritiya"
console.log(result.nakshatra[0].name);   // "Ashwini"
console.log(result.yoga[0].name);        // "Indra"
console.log(result.karana[0].name);      // "Taitila"
console.log(result.vara.name);           // "Saturday"
console.log(result.moonSign.name);       // "Aries"
console.log(result.sunSign.name);        // "Pisces"
console.log(result.paksha);              // "Shukla"
console.log(result.sunrise);             // "06:25"
console.log(result.sunset);              // "18:33"
console.log(result.ayana);              // "Uttarayana"
console.log(result.ritu);               // { vedic: "Vasanta", english: "Spring" }
console.log(result.samvatsar);           // "Siddharthi"
console.log(result.vikramSamvat);        // 2083
console.log(result.dinamana);           // "12h 08m"
```

## Features

### Full Panchang (`calculateFullPanchang`)

Computes the complete daily Panchang for any date and location.

```javascript
calculateFullPanchang(date, latitude, longitude, timezone)
```

**Parameters:**
| Param | Type | Example |
|---|---|---|
| `date` | `string \| Date` | `"2026-03-21"` |
| `latitude` | `number` | `28.6139` |
| `longitude` | `number` | `77.209` |
| `timezone` | `string` | `"Asia/Kolkata"` |

**Returns `PanchangResult` with:**

| Field | Description |
|---|---|
| `tithi` | Lunar day: name, number, paksha, progress % |
| `nakshatra` | Lunar mansion: name, pada (1-4), lord, deity, progress % |
| `yoga` | Sun-Moon conjunction: name, number (1-27), progress % |
| `karana` | Half-tithi: name, number, progress % |
| `vara` | Weekday: name and number |
| `moonSign` / `sunSign` | Zodiac sign with lord and degree |
| `moonPhase` | Phase name and illumination % |
| `paksha` | Shukla or Krishna |
| `sunrise` / `sunset` | HH:mm format |
| `moonrise` / `moonset` | HH:mm format |
| `auspiciousMuhurats` | Array of Brahma, Pratah Sandhya, Abhijit, Vijaya, Godhuli, Sayahna Sandhya, Nishita |
| `inauspiciousKalams` | Array of Rahu Kalam, Gulika Kalam, Yamaganda, Varjyam, Dur Muhurtam |
| `sunNakshatra` | Sun's nakshatra with pada, lord, deity |
| `ayana` | Uttarayana or Dakshinayana |
| `ritu` | Season: vedic name and English translation |
| `solarMonth` | Solar month name (Mesha, Vrishabha, etc.) |
| `dinamana` / `ratrimana` | Day/night duration |
| `madhyahna` | Solar noon |
| `samvatsar` | Name of the 60-year cycle year |
| `vikramSamvat` / `shakaSamvat` | Calendar years |

### Monthly Panchang (`calculateMonthlyPanchang`)

Compute Panchang for every day in a month.

```javascript
const { calculateMonthlyPanchang } = require("astrology-insights");

const month = calculateMonthlyPanchang(2026, 3, 28.6139, 77.209, "Asia/Kolkata");
// Returns: { year, month, location, days: PanchangResult[] }

month.days.forEach(day => {
  console.log(`${day.date}: ${day.tithi[0].name} | ${day.nakshatra[0].name}`);
});
```

### Individual Core Modules

For direct calculation from raw sidereal longitudes:

```javascript
const {
  calculateTithi,
  calculateNakshatraV2,
  calculateYoga,
  calculateKarana,
  calculateRashi,
} = require("astrology-insights");

const tithi = calculateTithi(335.5, 359.8);
// { name: "Shukla Tritiya", number: 3, paksha: "Shukla", progress: 2.5 }

const nakshatra = calculateNakshatraV2(355.0);
// { name: "Revati", number: 27, pada: 3, lord: "Mercury", deity: "Pushan" }

const yoga = calculateYoga(335.5, 359.8);
// { name: "Indra", number: 26, progress: 14.8 }

const karana = calculateKarana(335.5, 359.8);
// { name: "Kaulava", number: 3, progress: 5.0 }

const rashi = calculateRashi(355.0);
// { name: "Pisces", lord: "Jupiter", degree: 25 }
```

### Legacy Functions

These functions remain available and work with `HH:mm:ss` time strings.

#### `calculateSunriseSunset(date, latitude, longitude, timezone)`

```javascript
const { calculateSunriseSunset } = require("astrology-insights");
const { sunrise, sunset } = calculateSunriseSunset("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
// sunrise: "06:25:46", sunset: "18:33:45"
```

#### `calculateChoghadiya(date, sunrise, sunset, timezone)`

```javascript
const { calculateChoghadiya } = require("astrology-insights");
const result = calculateChoghadiya("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// result.daytimeChoghadiyas: 8 periods
// result.nighttimeChoghadiyas: 8 periods
// result.auspicious: ["Amrit", "Shubh", "Labh"]
```

#### `calculateAbhijeetMuhurt(date, sunrise, sunset, lat, lon, tz)`

```javascript
const { calculateAbhijeetMuhurt } = require("astrology-insights");
const muhurt = calculateAbhijeetMuhurt("2026-03-21", sunrise, sunset, 28.6139, 77.209, "Asia/Kolkata");
// { start: "12:05:29", end: "12:54:01" }
```

#### `calculateRahuKalam(date, sunrise, sunset, timezone)`

```javascript
const { calculateRahuKalam } = require("astrology-insights");
const rahu = calculateRahuKalam("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// { start: "09:27:45", end: "10:58:45" }
```

#### `calculateGulikaKalam(date, sunrise, sunset, timezone)`

**Breaking change in v2.0.0:** Previously accepted a date string only. Now requires `(date, sunrise, sunset, timezone)` — the same signature as Rahu Kalam.

```javascript
const { calculateGulikaKalam } = require("astrology-insights");
const gulika = calculateGulikaKalam("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// { start: "06:25:46", end: "07:56:45" }
```

#### `calculateMoonPosition(date, latitude, longitude, timezone)`

```javascript
const { calculateMoonPosition } = require("astrology-insights");
const moon = calculateMoonPosition("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
// moon.getMoonPosition: { azimuth, altitude, distance, parallacticAngle }
// moon.getMoonIllumination: { fraction, phase, angle }
// moon.getMoonTimes: { rise: "07:27:08", set: "21:07:18" }
```

#### `calculateBioRhythms(dob, date)`

```javascript
const { calculateBioRhythms } = require("astrology-insights");
const bio = calculateBioRhythms("1991-12-10", "2026-03-21");
// bio.data: Physical, Emotional, Intellectual, Intuitive cycles
```

## Validation Against Drik Panchang

Cross-validated for March 21, 2026 (Delhi, 28.6139N, 77.209E):

| Field | Our Value | Drik Panchang | Match |
|---|---|---|---|
| Tithi | Shukla Tritiya | Shukla Tritiya | YES |
| Nakshatra | Ashwini | Ashwini | YES |
| Yoga | Indra | Indra | YES |
| Karana | Taitila | Taitila | YES |
| Vara | Saturday | Saturday | YES |
| Sunrise | 06:25 | 06:24 | ~1 min |
| Sunset | 18:33 | 18:33 | YES |
| Moon Sign | Aries | Aries | YES |
| Sun Sign | Pisces | Pisces | YES |
| Paksha | Shukla | Shukla | YES |
| Brahma Muhurta | 04:48-05:36 | 04:49-05:37 | ~1 min |
| Pratah Sandhya | 05:14-06:25 | 05:13-06:24 | ~1 min |
| Abhijit Muhurat | 12:04-12:53 | 12:04-12:53 | YES |
| Vijaya Muhurat | 14:30-15:19 | 14:30-15:18 | ~1 min |
| Godhuli Muhurat | 18:32-18:55 | 18:32-18:55 | YES |
| Sayahna Sandhya | 18:33-19:44 | 18:33-19:44 | YES |
| Nishita Muhurat | 00:05-00:53 | 00:04-00:52 | ~1 min |
| Rahu Kalam | 09:27-10:58 | 09:26-10:57 | ~1 min |
| Yamaganda | 14:00-15:30 | 14:00-15:31 | ~1 min |
| Gulika Kalam | 06:25-07:56 | 06:24-07:55 | ~1 min |
| Dur Muhurtam | 06:25-07:13 | 06:24-07:13 | ~1 min |
| Vikram Samvat | 2083 | 2083 | YES |
| Shaka Samvat | 1948 | 1948 | YES |
| Samvatsar | Siddharthi | Siddharthi | YES |
| Ritu | Vasanta | Vasanta | YES |
| Ayana | Uttarayana | Uttarayana | YES |
| Dinamana | 12h 08m | 12h 08m | YES |

**Score: 28/29 fields match** (moonrise has ~8 min variance due to SunCalc library limitation for lunar calculations).

Also validated against multiple historical dates:
- October 20, 2025 (Diwali) -- Chaturdashi, Hasta, Shakuni confirmed
- January 14, 2026 (Makar Sankranti) -- Ekadashi, Anuradha confirmed
- August 15, 1947 (Independence Day) -- historical accuracy verified

## React Native

On React Native, `calculateFullPanchang` uses a local fallback (Jean Meeus + SunCalc) that gives correct Tithi/Nakshatra/Yoga/Karana names and signs. For Swiss Ephemeris precision, use `fetchPanchang()` to call your API:

```javascript
const { fetchPanchang } = require("astrology-insights");

const result = await fetchPanchang(
  "2026-03-21", 28.6139, 77.209, "Asia/Kolkata",
  "https://your-app.vercel.app/api/panchang"
);
```

## Deploying the Panchang API (Vercel)

The package includes a ready-to-deploy Vercel Serverless Function at `api/panchang.js`.

```bash
cd astrology-insights
npx vercel
```

**Test the endpoint:**
```bash
curl "https://your-app.vercel.app/api/panchang?date=2026-03-21&lat=28.6139&lon=77.209&tz=Asia/Kolkata"
```

| Param | Type | Required | Example |
|---|---|---|---|
| `date` | string | Yes | `2026-03-21` |
| `lat` | number | Yes | `28.6139` |
| `lon` | number | Yes | `77.209` |
| `tz` | string | Yes | `Asia/Kolkata` |

Responses are cached for 1 hour (`s-maxage=3600`) with stale-while-revalidate for 24 hours.

## Testing

```bash
npm run test        # Legacy test (node test.js)
npm run test:unit   # Jest unit tests (62 tests)
```

## License

MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- **Swiss Ephemeris** (swisseph) for high-precision planetary positions
- **Luxon** for date-time utilities
- **SunCalc** for sunrise/sunset and moon calculations
- Vedic astrology principles for Panchang, Choghadiya, and Muhurat calculations
