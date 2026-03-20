---

## Astrology Insights for JavaScript 🌌

**Astrology Insights** is a Node.js library for computing astrological and astronomical events. It includes:

- **Biorhythm Calculations** for physical, emotional, intellectual, and intuitive cycles
- **Sunrise/Sunset** times for any date and location
- **Abhijit Muhurat** (auspicious period of the day)
- **Choghadiya** segments for day and night (Vedic astrology)

## Installation

Install via npm:
```bash
npm install astrology-insights
```

## Usage

### Biorhythm Calculations
```js
const { calculateBioRhythms } = require('astrology-insights');

const timezone = 'UTC';
const dob = '1994-11-11';
const today = '2024-12-06';
const days = 30;

const rhythms = calculateBioRhythms(today, dob, timezone, days);
console.log(rhythms);
```

### Sunrise and Sunset
```js
const { calculateSunriseSunset } = require('astrology-insights');

const date = '2024-11-24';
const lat = 28.6139;
const lon = 77.2090;
const tz = 'Asia/Kolkata';

const { sunrise, sunset } = calculateSunriseSunset(date, lat, lon, tz);
console.log(`Sunrise: ${sunrise}, Sunset: ${sunset}`);
```

---

## Installation 📦

Install the package using npm:

```bash
npm install astrology-insights
```

---

## Usage 🛠️

Here’s how you can use the features of this toolkit:

### 1. Biorhythm Calculations

```javascript
const { calculateBioRhythms } = require("astrology-insights");

const timezone = "UTC";
const dob = "1994-11-11";
const currentDate = "2024-12-06";
const daysToDisplay = 30;

const biorhythms = calculateBioRhythms(currentDate, dob, timezone, daysToDisplay);
console.log(biorhythms);
```

**Output**:
```json
{
  "survivalDays": 12058,
  "data": [
    {
      "label": "Physical",
      "borderColor": "#FF0000",
      "description": "Represents your physical energy, strength, and stamina.",
      "data": [
        { "dayOffset": 0, "value": 89 },
        ...
      ]
    },
    ...
  ]
}
```


### Importing the Library for Astrology Numbers

```javascript
const { 
    calculateSunriseSunset,
    calculateMoonriseMoonset,
    calculateMoonPosition,
    calculateNakshatras,
    calculateAbhijeetMuhurt,
    calculateChoghadiya 
} = require("astrology-insights");
```

### 1. **Calculate Sunrise and Sunset**

```javascript
const date = "2024-11-24";
const latitude = 28.6139; // Example: New Delhi
const longitude = 77.2090;
const timezone = "Asia/Kolkata";

const { sunrise, sunset } = calculateSunriseSunset(date, latitude, longitude, timezone);
console.log(`Sunrise: ${sunrise}, Sunset: ${sunset}`);
```

### 2. **Calculate Abhijit Muhurat**

```javascript
const abhijitMuhurat = calculateAbhijeetMuhurt(date, sunrise, sunset, latitude, longitude, timezone);

console.log(`Abhijit Muhurat Start: ${abhijitMuhurat.start_time}, End: ${abhijitMuhurat.end_time}`);
```

### 3. **Calculate Day and Night Choghadiya**

```javascript
const choghadiyas = calculateChoghadiya(date, sunrise, sunset, timezone);

choghadiyas.day.forEach(({ type, start_time, end_time }) => {
    console.log(`${type}: ${start_time} - ${end_time}`);
});


choghadiyas.night.forEach(({ type, start_time, end_time }) => {
    console.log(`${type}: ${start_time} - ${end_time}`);
});
```

### 4. **Calculate Moon Position**

```javascript
const { getMoonPosition, getMoonIllumination, getMoonTimes } = calculateMoonPosition(
    date,
    latitude,
    longitude,
    timezone
);
console.log(getMoonPosition);
console.log(getMoonIllumination);
console.log(getMoonTimes);
```

### 5. **Calculate Nakshatras**

```javascript
const nakshatras = calculateNakshatras(date, latitude, longitude, timezone);
nakshatras.forEach(({ name, start, end, planet, deity, motivation }) => {
  console.log(`${name}: ${start} - ${end} (${planet}, deity: ${deity}, motivation: ${motivation})`);
});
```

## Output Examples

### Sunrise and Sunset
```
Sunrise: 06:50:59, Sunset: 17:24:33
```

### Abhijit Muhurat
```
Abhijit Muhurat Start: 11:27:46, End: 12:07:46
```

### Day and Night Choghadiya
**Day Choghadiya**
```
Udveg: 06:50:59 - 08:10:11
Char: 08:10:11 - 09:29:23
Labh: 09:29:23 - 10:48:35
Amrit: 10:48:35 - 12:07:46
Kaal: 12:07:46 - 13:26:58
Shubh: 13:26:58 - 14:46:10
Rog: 14:46:10 - 16:05:22
Udveg: 16:05:22 - 17:24:33
```

**Night Choghadiya**
```
Shubh: 17:24:33 - 18:54:44
Rog: 18:54:44 - 20:24:55
Kaal: 20:24:55 - 21:55:06
Labh: 21:55:06 - 23:25:17
Udveg: 23:25:17 - 00:55:28
Amrit: 00:55:28 - 02:25:39
Char: 02:25:39 - 03:55:50
Rog: 03:55:50 - 05:26:01
```

## v2 — Full Panchang (Swiss Ephemeris)

**New in v2.0.0** — Comprehensive Vedic Panchang with Swiss Ephemeris precision, validated against Drik Panchang.

### Full Panchang

```javascript
const { calculateFullPanchang } = require("astrology-insights");

const result = calculateFullPanchang("2026-03-20", 28.6139, 77.209, "Asia/Kolkata");
console.log(result.tithi[0].name);      // "Shukla Dwitiya"
console.log(result.nakshatra[0].name);   // "Revati"
console.log(result.nakshatra[0].pada);   // 1
console.log(result.yoga[0].name);        // "Brahma"
console.log(result.karana[0].name);      // "Balava"
console.log(result.moonSign.name);       // "Pisces"
console.log(result.sunSign.name);        // "Pisces"
console.log(result.paksha);             // "Shukla"
console.log(result.sunrise);            // "06:26"
console.log(result.sunset);             // "18:33"
```

**Returns a `PanchangResult` object with:**
- **Tithi** — lunar day with name, number (1-15), paksha, and progress %
- **Nakshatra** — lunar mansion with pada (1-4), lord, deity, and progress %
- **Yoga** — auspicious conjunction with name, number (1-27), and progress %
- **Karana** — half-tithi with name, number, and progress %
- **Vara** — weekday
- **Moon/Sun Sign** — zodiac sign with lord and degree
- **Moon Phase** — name and illumination %
- **Sunrise/Sunset/Moonrise/Moonset** — precise times for location

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

// Tithi from Sun and Moon sidereal longitudes
const tithi = calculateTithi(335.5, 359.8);
console.log(tithi.name);    // "Shukla Tritiya"
console.log(tithi.paksha);  // "Shukla"
console.log(tithi.progress); // 2.5

// Nakshatra from Moon longitude
const nakshatra = calculateNakshatraV2(355.0);
console.log(nakshatra.name); // "Revati"
console.log(nakshatra.pada); // 3
console.log(nakshatra.lord); // "Mercury"

// Yoga from Sun + Moon
const yoga = calculateYoga(335.5, 359.8);
console.log(yoga.name); // "Indra"

// Karana from Sun-Moon difference
const karana = calculateKarana(335.5, 359.8);
console.log(karana.name); // "Kaulava"

// Rashi (zodiac sign) from any longitude
const rashi = calculateRashi(355.0);
console.log(rashi.name); // "Pisces"
console.log(rashi.lord); // "Jupiter"
```

### Validation

Tested against Drik Panchang for multiple dates including:
- March 20, 2026 (Delhi) — all elements match
- October 20, 2025 (Diwali) — Chaturdashi, Hasta, Shakuni confirmed
- January 14, 2026 (Makar Sankranti) — Ekadashi, Anuradha confirmed
- August 15, 1947 (Independence Day) — historical accuracy verified

Sunrise/sunset accuracy: ±1-2 minutes vs Drik Panchang reference.

### React Native

On React Native, `calculateFullPanchang` uses a **local fallback** (Jean Meeus + SunCalc) that gives correct Tithi/Nakshatra/Yoga/Karana names and signs. For Swiss Ephemeris precision (exact transition times, sub-degree accuracy), use `fetchPanchang()` to call your API:

```javascript
const { fetchPanchang } = require("astrology-insights");

// Local fallback (works offline, ~1° accuracy — correct names/signs)
// Swiss Ephemeris is not available on React Native, but the Jean Meeus
// fallback produces results validated against Drik Panchang.

// For Swiss Ephemeris precision, call your deployed API:
const panchang = await fetchPanchang(
  "2026-03-20", 28.6139, 77.209, "Asia/Kolkata",
  "https://your-app.vercel.app/api/panchang"
);
```

### Deploying the Panchang API (Vercel)

The package includes a ready-to-deploy Vercel Serverless Function at `api/panchang.js`. It wraps `calculateFullPanchang()` with Swiss Ephemeris for maximum precision.

**Step 1: Deploy to Vercel**
```bash
cd astrology-insights
npx vercel
```
Or connect your GitHub repo to Vercel — it auto-detects the `api/` directory.

**Step 2: Test the endpoint**
```bash
curl "https://your-app.vercel.app/api/panchang?date=2026-03-20&lat=28.6139&lon=77.209&tz=Asia/Kolkata"
```

**API Parameters:**

| Param | Type | Required | Example |
|-------|------|----------|---------|
| `date` | string | Yes | `2026-03-20` |
| `lat` | number | Yes | `28.6139` |
| `lon` | number | Yes | `77.209` |
| `tz` | string | Yes | `Asia/Kolkata` |

**Response:** Full `PanchangResult` JSON (same shape as `calculateFullPanchang()`).

**Caching:** Responses are cached for 1 hour (`s-maxage=3600`) with stale-while-revalidate for 24 hours. Same date+location returns cached result instantly.

**Step 3: Use in React Native**
```javascript
const { fetchPanchang } = require("astrology-insights");
const PANCHANG_API = "https://your-app.vercel.app/api/panchang";

const result = await fetchPanchang("2026-03-20", 28.6139, 77.209, "Asia/Kolkata", PANCHANG_API);
console.log(result.tithi[0].name); // "Shukla Dwitiya"
```

**Architecture:**
```
┌──────────────────────────┐     ┌──────────────────────────┐
│   React Native App       │     │  Vercel Serverless       │
│                          │     │                          │
│  Local fallback (fast)   │────▶│  Swiss Ephemeris (precise)│
│  Jean Meeus + SunCalc    │     │  calculateFullPanchang() │
│  ~1° accuracy            │     │  ~0.001° accuracy        │
│  Works offline           │     │  Transition times        │
└──────────────────────────┘     └──────────────────────────┘
```

**When to use which:**
- **Local fallback**: Choghadiya display, current period detection, basic Panchang
- **Server API**: Precise transition end times, progress %, detailed daily Panchang view

## Testing

Run the test suite to view sample outputs for all features:

```bash
npm run test        # Legacy test (node test.js)
npm run test:unit   # Jest unit tests (34 tests)
```

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- **Luxon** for date-time utilities
- **SunCalc** for astronomical calculations
- **Swisseph** for astronomical calculations
- **Vedic astrology principles** for Choghadiya and Muhurat calculations
- **Biorhythm theory** for health and wellness insights
- **Open-source community** for continuous improvements and contributions
- Inspired by Wilhelm Fliess’s work on biorhythm theory

Happy coding and stargazing! 🌠
