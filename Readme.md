# astrology-insights

**Vedic astrology engine for Node.js** — Panchang, birth charts (Kundli), house lords, Sudarshana Chakra, Vimshottari Dasha, 16 divisional charts, doshas, yogas, Shad Bala, Ashtakoot Milan, Sade Sati, daily Gochar horoscope, and remedies. Planetary positions come from Swiss Ephemeris (sidereal, Lahiri or KP ayanamsa); the daily Panchang is validated against Drik Panchang. English, Hindi and Nepali output wherever the library returns names.

[![npm version](https://img.shields.io/npm/v/astrology-insights.svg)](https://www.npmjs.com/package/astrology-insights)
[![license](https://img.shields.io/npm/l/astrology-insights.svg)](https://github.com/adarshsrii/astrology/blob/main/LICENSE)
[![tests](https://img.shields.io/badge/jest-286%20passing-brightgreen.svg)]()

The package exposes 62 named exports from `index.js` (Node) and 52 from `index.rn.js` (React Native). Every example below was run against the code in this repository; the values in comments are real output.

---

## Install

```bash
npm install astrology-insights
```

- **Node.js >= 16** (`engines` in `package.json`).
- **`swisseph` is a native addon.** `npm install` compiles it with node-gyp, so you need a C++ toolchain (Xcode CLT on macOS, `build-essential` on Debian/Ubuntu, VS Build Tools on Windows). If the build fails, the birth-chart functions throw and `calculateFullPanchang` silently falls back to a low-precision Jean Meeus formula for Sun/Moon longitudes.
- **`index.js` loads TypeScript at runtime** through `ts-node` (`transpileOnly`). The first `require` costs a few hundred milliseconds; keep the module loaded in long-running processes.
- **React Native** resolves `index.rn.js` automatically through the `"react-native"` field. That entry reads the compiled `dist/` folder, never `ts-node`, and expects `swisseph` to be provided by a bridge such as `react-native-swisseph`. See [React Native](#react-native) for what it does and does not export.

```javascript
const ai = require("astrology-insights");
console.log(Object.keys(ai).length); // 62
```

---

## Quick start

All four snippets are self-contained and runnable.

### 1. Daily Panchang

```javascript
const { calculateFullPanchang } = require("astrology-insights");

const p = calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");

console.log(p.tithi[0].name);           // "Shukla Tritiya"
console.log(p.nakshatra[0].name);       // "Ashwini"
console.log(p.yoga[0].name);            // "Indra"
console.log(p.karana.map(k => k.name)); // ["Taitila", "Garija"]   (karana changed at 01:15 pm)
console.log(p.sunrise, p.sunset);       // "06:25" "18:33"
console.log(p.vikramSamvat, p.hinduMonth); // 2083 "Chaitra"
```

### 2. Birth chart (Kundli)

```javascript
const { calculateBirthChart } = require("astrology-insights");

const chart = calculateBirthChart({
  date: "2000-01-01",
  time: "04:30",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
});

console.log(chart.lagna.signName, chart.lagna.degreeInSign); // "Scorpio" 8.5
console.log(chart.planets.map(p => `${p.name}:${p.signName}`).join(" "));
// Sun:Sagittarius Moon:Libra Mars:Aquarius Mercury:Sagittarius Jupiter:Aries Venus:Scorpio Saturn:Aries Rahu:Cancer Ketu:Capricorn
console.log(chart.planets.find(p => p.name === "Saturn").dignity); // "debilitated"
console.log(chart.houses[5].planets);                            // ["Jupiter", "Saturn"]   (house 6)
```

### 3. Vimshottari Dasha

```javascript
const { calculateBirthChart, calculateVimshottariDasha } = require("astrology-insights");

const chart = calculateBirthChart({ date: "2000-01-01", time: "04:30", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" });
const moon = chart.planets.find(p => p.name === "Moon");

const dasha = calculateVimshottariDasha(
  new Date(chart.meta.utcDate),   // birth instant in UTC
  moon.nakshatra,                 // "Swati"
  moon.longitude % (360 / 27),    // degrees traversed inside the nakshatra (6.27)
  3,                              // depth: Maha > Antar > Pratyantar
);

console.log(dasha.birthNakshatraLord);      // "Rahu"
console.log(dasha.balanceAtBirth);          // { planet: "Rahu", years: 9, months: 6, days: 15 }
console.log(dasha.mahaDashas[2].planet, dasha.mahaDashas[2].startDate, dasha.mahaDashas[2].endDate);
// "Saturn" "2025-07-17" "2044-07-16"
console.log(dasha.currentDasha.maha);       // "Saturn"   (depends on today's date)
```

### 4. Ashtakoot Guna Milan

```javascript
const { calculateAshtakootMilan } = require("astrology-insights");

const groom = { nakshatraNumber: 15, nakshatraPada: 2, rashiNumber: 7, nakshatraLord: "Rahu" };    // Swati, Libra Moon
const bride = { nakshatraNumber: 7,  nakshatraPada: 3, rashiNumber: 3, nakshatraLord: "Jupiter" }; // Punarvasu, Gemini Moon

const milan = calculateAshtakootMilan(groom, bride);
console.log(milan.totalPoints, "/", milan.maxPoints); // 27 / 36
console.log(milan.verdict, "|", milan.verdictHi);     // "Good match" | "शुभ मिलान"
console.log(milan.gunas.map(g => `${g.name}=${g.points}`).join(" "));
// Varna=1 Vasya=2 Tara=3 Yoni=2 Graha Maitri=5 Gana=6 Bhakoot=0 Nadi=8
```

---

## Conventions

These apply everywhere unless a function says otherwise.

| Thing | Convention |
|---|---|
| Sign numbers | **1-based**: 1 = Aries … 12 = Pisces |
| House numbers | 1-12, whole-sign from the lagna unless stated |
| Nakshatra numbers | 1-27 (1 = Ashwini), pada 1-4 |
| Longitudes | sidereal degrees 0-360 (`longitude`); degree inside the sign 0-30 (`degreeInSign`) |
| `date` argument | `"YYYY-MM-DD"` string (or a `Date`, where noted). Birth `time` is `"HH:mm"` 24-hour local time |
| `timezone` | IANA name, e.g. `"Asia/Kolkata"`, `"Asia/Kathmandu"` |
| Times returned | `calculateFullPanchang` uses `"HH:mm"` (`"hh:mm am/pm"` for the tithi/nakshatra/yoga/karana windows); the legacy `lib/` helpers use `"HH:mm:ss"`; the legacy v1 `calculatePanchang` returns `Date` objects |
| `lang` | `'en'` (default), `'hi'`, `'ne'`. Anything else falls through to English |
| Nakshatra spellings | The same 27 strings everywhere: `"Moola"` (not Mula), `"Jyeshtha"`, `"Ashlesha"`, `"Shatabhisha"`, `"Purva Phalguni"`, `"Uttara Bhadrapada"` … `NAKSHATRA_LORDS` holds the canonical list |

---

## API reference

### Panchang

#### `calculateFullPanchang(date, latitude, longitude, timezone, lang = 'en')`

The validated daily Panchang (v2). Tithi, nakshatra, yoga and karana are evaluated **at local sunrise** (Drik Panchang convention); if any of them changes before sunset the second value is appended with the transition time found by binary search (about one-minute precision).

- `date`: `"YYYY-MM-DD"` or a `Date` (a string is read as local noon).
- Returns `PanchangResult`:

| Field | Type | Notes |
|---|---|---|
| `date` | `string` | `"2026-03-21"` |
| `location` | `{ lat, lon, timezone }` | |
| `sunrise`, `sunset`, `moonrise`, `moonset` | `string` | `"HH:mm"` local; moon times from SunCalc |
| `tithi`, `yoga`, `karana` | `PanchangEntry[]` | `{ name, number, startTime, endTime, progress }`; one entry, or two if it changed during daylight. `number` is 1-15 within the paksha for tithi, 1-27 for yoga, 1-60 for karana. `progress` is % elapsed at sunrise |
| `nakshatra` | `NakshatraEntry[]` | adds `pada`, `lord`, `deity`, `padaProgress` |
| `vara` | `{ name, number }` | `number` 0 = Sunday |
| `moonSign`, `sunSign` | `RashiInfo` | `{ name, lord, degree, number }` |
| `moonPhase` | `{ name, illumination }` | illumination in % |
| `paksha` | `string` | `"Shukla"` / `"Krishna"` |
| `auspiciousMuhurats` | `TimingEntry[]` | Brahma, Pratah Sandhya, Abhijit, Vijaya, Godhuli, Sayahna Sandhya, Nishita — `{ name, startTime, endTime, description }` |
| `inauspiciousKalams` | `TimingEntry[]` | Rahu Kalam, Gulika Kalam, Yamaganda, Varjyam, Dur Muhurtam. **Varjyam is a placeholder** with empty times |
| `sunNakshatra` | `NakshatraEntry` | times are empty strings |
| `ayana` | `string` | `"Uttarayana"` / `"Dakshinayana"` (sidereal Sun 270°→90°) |
| `ritu` | `{ vedic, english }` | |
| `solarMonth` | `string` | `"Meena"` etc. |
| `dinamana`, `ratrimana` | `string` | `"12h 08m"` |
| `madhyahna` | `string` | `"HH:mm"` |
| `samvatsar` | `string` | 60-year cycle name |
| `vikramSamvat`, `shakaSamvat` | `number` | year rolls at Chaitra Shukla Pratipada |
| `hinduMonth`, `hinduMonthAmanta` | `string` | lunar month from the Sun's sign (Amanta naming). Both fields carry the same value |

```javascript
const { calculateFullPanchang } = require("astrology-insights");

const p = calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
console.log(p.tithi[0]);
// { name: "Shukla Tritiya", number: 3, startTime: "06:25 am", endTime: "06:33 pm", progress: 18.2 }
console.log(p.nakshatra[0].pada, p.nakshatra[0].lord, p.nakshatra[0].deity); // 1 "Ketu" "Ashwini Kumaras"
console.log(p.moonSign);         // { name: "Aries", lord: "Mars", degree: 2.4, number: 1 }
console.log(p.moonPhase);        // { name: "Waxing Crescent", illumination: 6 }
console.log(p.auspiciousMuhurats[2].name, p.auspiciousMuhurats[2].startTime, p.auspiciousMuhurats[2].endTime);
// "Abhijit Muhurat" "12:04" "12:53"
console.log(p.inauspiciousKalams[0].name, p.inauspiciousKalams[0].startTime, p.inauspiciousKalams[0].endTime);
// "Rahu Kalam" "09:27" "10:58"
console.log(p.ayana, p.ritu, p.solarMonth);              // "Uttarayana" { vedic: "Vasanta", english: "Spring" } "Meena"
console.log(p.samvatsar, p.vikramSamvat, p.shakaSamvat); // "Siddharthi" 2083 1948
console.log(p.dinamana, p.ratrimana, p.madhyahna);       // "12h 08m" "11h 52m" "12:29"

const hi = calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata", "hi");
console.log(hi.tithi[0].name, hi.nakshatra[0].name, hi.vara.name, hi.hinduMonth); // "शुक्ल तृतीया" "अश्विनी" "शनिवार" "चैत्र"
const ne = calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata", "ne");
console.log(ne.vara.name);       // "शनिबार"   (Nepali, not the Hindi table)
```

Gotchas: `startTime`/`endTime` on the four Panchang elements are clipped to the sunrise–sunset window (the first entry always starts at sunrise, the last ends at sunset) — they are *not* the astronomical start and end of the tithi. Under `'hi'`/`'ne'` the `lord`, `deity`, `paksha`, `ayana`, `ritu.english` and `moonPhase.name` strings are localised too.

#### `calculateMonthlyPanchang(year, month, latitude, longitude, timezone)`

One compact summary per calendar day. `month` is 1-12.

Returns `{ year, month, location: { lat, lon, timezone }, days: DailySummary[] }` where each `DailySummary` is:

`{ date, weekday, sunrise, sunset, tithi: { name, paksha, progress }, nakshatra: { name, pada, lord }, yoga: { name }, karana: { name }, moonSign, sunSign, moonPhase, moonIllumination, specialDays, isPurnima, isAmavasya, isEkadashi }`

```javascript
const { calculateMonthlyPanchang } = require("astrology-insights");

const m = calculateMonthlyPanchang(2026, 3, 28.6139, 77.209, "Asia/Kolkata");
console.log(m.days.length);                       // 31
console.log(m.days[20].date, m.days[20].sunrise); // "2026-03-21" "6:25 AM"   (h:mm AM here, not HH:mm)
console.log(m.days[20].tithi);                    // { name: "Shukla Tritiya", paksha: "Shukla", progress: 18.2 }
console.log(m.days.filter(d => d.specialDays.length).map(d => `${d.date}:${d.specialDays.join("/")}`).join(" "));
// 2026-03-01:Pradosh 2026-03-03:Purnima 2026-03-07:Chaturthi 2026-03-15:Ekadashi/Sankranti 2026-03-17:Pradosh
// 2026-03-18:Shivaratri 2026-03-19:Amavasya 2026-03-22:Chaturthi 2026-03-29:Ekadashi 2026-03-31:Pradosh
```

#### Core element calculators

Pure functions on sidereal longitudes; no ephemeris involved. Use them when you already have Sun/Moon positions.

| Function | Returns |
|---|---|
| `calculateTithi(sunLon, moonLon)` | `{ name, number (1-15 in paksha), tithiIndex (1-30), paksha, progress }` |
| `calculateNakshatraV2(moonLon)` | `{ name, number (1-27), pada, lord, deity, progress, padaProgress }` |
| `calculateYoga(sunLon, moonLon)` | `{ name, number (1-27), progress }` |
| `calculateKarana(sunLon, moonLon)` | `{ name, number (1-60), progress }` |
| `calculateRashi(lon)` | `{ name, lord, degree (0-30), number (1-12) }` |

`calculateNakshatraV2` is `calculateNakshatra` from `panchang/src/core/nakshatra`, renamed at export so it does not clash with the legacy `calculateNakshatras` stub.

```javascript
const { calculateTithi, calculateNakshatraV2, calculateYoga, calculateKarana, calculateRashi } = require("astrology-insights");

console.log(calculateTithi(335.5, 359.8));
// { name: "Shukla Tritiya", number: 3, tithiIndex: 3, paksha: "Shukla", progress: 2.5 }
console.log(calculateNakshatraV2(355.0));
// { name: "Revati", number: 27, pada: 3, lord: "Mercury", deity: "Pushan", progress: 62.5, padaProgress: 50 }
console.log(calculateYoga(335.5, 359.8));    // { name: "Indra", number: 26, progress: 14.8 }
console.log(calculateKarana(335.5, 359.8));  // { name: "Taitila", number: 5, progress: 5 }
console.log(calculateRashi(355.0));          // { name: "Pisces", lord: "Jupiter", degree: 25, number: 12 }
```

#### `calculatePanchang(date, latitude, longitude, timezone, locationName?, lang?)` — legacy v1

The original class-based engine (`PanchangCalculator`), kept for backward compatibility. `date` must be a `Date`. Returns `PanchangOutput` with **`Date` objects whose UTC fields hold the local wall-clock time** (`sunrise.toISOString()` = `"2026-03-21T06:24:16.000Z"` means 06:24 local), `dinamana`/`ratrimana` as `{ hours, minutes, seconds }`, `lunarMonth: { amanta, purnimanta }`, `samvata: { shaka, vikrama, gujarati, name }`, `kalam.{rahu,gulikai,yamaganda}`, `muhurat.*`, `planetaryPositions` for the seven classical planets, and a `formatters` object (`getSunriseFormatted()`, `getRahuKaalFormatted()`, `formatInLocalTimezone(date, pattern)`). The `locationName` and `lang` arguments are accepted but unused.

```javascript
const { calculatePanchang } = require("astrology-insights");

const v1 = calculatePanchang(new Date("2026-03-21T00:00:00Z"), 28.6139, 77.209, "Asia/Kolkata");
console.log(v1.tithi.name, v1.nakshatra.name, v1.yoga.name); // "Tritiya" "Ashwini" "Indra"
console.log(v1.formatters.getSunriseFormatted());            // "06:24:16"
console.log(v1.dinamana);                                    // { hours: 12, minutes: 8, seconds: 36 }
console.log(v1.samvata.vikrama, v1.ayana.drik);              // 2083 "Uttarayana"
```

Prefer `calculateFullPanchang`. v1 is only guarded for sunrise/sunset and ayana (`panchang.check.js`); its Rahu Kaal weekday table, ritu and moonrise disagree with v2 for the same day.

---

### Sunrise, sunset and the Moon

All take `(date, latitude, longitude, timezone = "UTC")` with `date` as `"YYYY-MM-DD"` or a `Date`, and return `"HH:mm:ss"` strings in `timezone`. Backed by SunCalc.

```javascript
const { calculateSunriseSunset, calculateMoonriseMoonset, calculateMoonPosition } = require("astrology-insights");

console.log(calculateSunriseSunset("2026-03-21", 28.6139, 77.209, "Asia/Kolkata"));
// { sunrise: "06:25:46", sunset: "18:33:45" }
console.log(calculateMoonriseMoonset("2026-03-21", 28.6139, 77.209, "Asia/Kolkata"));
// { moonrise: "07:27:08", moonset: "21:07:18" }

const moon = calculateMoonPosition("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
console.log(moon.getMoonTimes);                                   // { rise: "07:27:08", set: "21:07:18" }
console.log(Math.round(moon.getMoonIllumination.fraction * 100)); // 5   (fraction, phase, angle — raw SunCalc)
console.log(Object.keys(moon.getMoonPosition));                   // ["azimuth", "altitude", "distance", "parallacticAngle"]   (radians / km)
```

Gotchas: a string `date` is parsed by `new Date(date)`, i.e. as **UTC midnight**, so SunCalc evaluates that UTC day; far from Greenwich the moon rise/set can belong to the neighbouring local day. If the Moon does not rise or set on that day the field comes back as the string `"Invalid DateTime"`.

#### `calculateNakshatras(date, latitude, longitude, timezone)`

A stub kept for backward compatibility. **Always returns `[]`.** Use `calculateFullPanchang(...).nakshatra` or `calculateNakshatraV2` instead.

---

### Muhurta and kalams (legacy helpers)

These take the day's sunrise and sunset as `"HH:mm:ss"` strings (from `calculateSunriseSunset`) and return `"HH:mm:ss"` strings. All derive the weekday from `date` in `timezone`.

| Function | Returns |
|---|---|
| `calculateAbhijeetMuhurt(date, sunrise, sunset, latitude, longitude, timezone)` | `{ start, end }` — the 8th of the 15 daytime muhurtas |
| `calculateChoghadiya(date, sunrise, sunset, timezone)` | `{ daytimeChoghadiyas: [{ type, start, end }] × 8, nighttimeChoghadiyas × 8, auspicious, mild_auspicious, inauspicious }` |
| `calculateRahuKalam(date, sunrise, sunset, timezone)` | `{ start, end }` |
| `calculateYamghantKalam(date, sunrise, sunset, timezone)` | `{ start, end }` (Yamaganda) |
| `calculateDurMuhurtam(date, sunrise, sunset, timezone)` | `[{ start, end }]` — one or two 48-minute periods depending on weekday |
| `calculateGulikaKalam(date, sunrise, sunset, timezone)` | `{ start, end }` — **exported from `index.rn.js` only** |

```javascript
const { calculateSunriseSunset, calculateAbhijeetMuhurt, calculateChoghadiya, calculateRahuKalam, calculateYamghantKalam, calculateDurMuhurtam } = require("astrology-insights");

const { sunrise, sunset } = calculateSunriseSunset("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");

console.log(calculateAbhijeetMuhurt("2026-03-21", sunrise, sunset, 28.6139, 77.209, "Asia/Kolkata"));
// { start: "12:05:29", end: "12:54:01" }
console.log(calculateRahuKalam("2026-03-21", sunrise, sunset, "Asia/Kolkata"));     // { start: "09:27:45", end: "10:58:45" }
console.log(calculateYamghantKalam("2026-03-21", sunrise, sunset, "Asia/Kolkata")); // { start: "14:00:45", end: "15:30:45" }
console.log(calculateDurMuhurtam("2026-03-21", sunrise, sunset, "Asia/Kolkata"));   // [ { start: "06:25:46", end: "07:13:46" } ]

const c = calculateChoghadiya("2026-03-21", sunrise, sunset, "Asia/Kolkata");
console.log(c.daytimeChoghadiyas[0]);   // { type: "Kaal", start: "06:25:46", end: "07:56:45" }   (Saturday)
console.log(c.nighttimeChoghadiyas[0]); // { type: "Labh", start: "18:33:45", end: "20:02:45" }
console.log(c.auspicious, c.mild_auspicious, c.inauspicious); // ["Amrit", "Shubh", "Labh"] ["Char"] ["Rog", "Kaal", "Udveg"]
```

Gotchas: since 2.3.1 `calculateChoghadiya` interprets `sunrise`/`sunset` in the given `timezone` (it used to use the machine's zone) and **throws** on an unparsable time. Night Choghadiya assumes tomorrow's sunrise is at today's clock time (about a minute of drift).

#### `calculateBioRhythms(currentDate, dateOfBirth, timezone, daysToDisplay)`

Argument order is *current date first*. Returns `{ survivalDays, data: [{ label, borderColor, description, data: [{ dayOffset, value }] }] }` for the Physical (23 d), Emotional (28 d), Intellectual (33 d) and Intuitive (38 d) cycles; `value` is -100..100.

```javascript
const { calculateBioRhythms } = require("astrology-insights");

const bio = calculateBioRhythms("2026-03-21", "1991-12-10", "Asia/Kolkata", 3);
console.log(bio.survivalDays);                    // 12520
console.log(bio.data[0].label, bio.data[0].data); // "Physical" [ { dayOffset: 0, value: 82 }, { dayOffset: 1, value: 63 }, { dayOffset: 2, value: 40 } ]
```

---

### Birth chart

#### `calculateBirthChart(birthData, options?)`

```typescript
interface BirthData { date: string; time: string; latitude: number; longitude: number; timezone: string; name?: string }
interface BirthChartOptions { ayanamsa?: 'lahiri' | 'kp'; houseSystem?: 'whole_sign' | 'equal' | 'placidus' }
```

Defaults: `lahiri`, `whole_sign`. Returns `BirthChartResult`:

| Field | Shape |
|---|---|
| `birthData` | echo of the input |
| `ayanamsa` | `{ type, degree }` |
| `lagna` | `LagnaInfo`: `{ longitude, signName, signNumber, degreeInSign, nakshatra, nakshatraNumber, nakshatraPada, nakshatraLord }` |
| `planets` | `GrahaPosition[]` (9, in `ALL_GRAHAS` order): `{ name, longitude, latitude, speed, retrograde, signName, signNumber, degreeInSign, nakshatra, nakshatraNumber, nakshatraPada, nakshatraLord, dignity, isCombust, combustOrb, symbol }` |
| `houses` | `HouseInfo[]` (12): `{ number, signName, signNumber, cuspDegree, planets: GrahaName[] }` |
| `layout` | `{ northIndian, southIndian, western }`, each `{ style, boxes: ChartBox[12] }` with `ChartBox = { houseNumber, signNumber, signName, planets }` |
| `meta` | `{ calculatedAt, houseSystem, julianDay, utcDate }` |

`dignity` is one of `'peak_exalted' | 'exalted' | 'moolatrikona' | 'own_sign' | 'neutral' | 'debilitated' | 'peak_debilitated'`; `symbol` is the short label from `getDignitySymbol`. Rahu is the **mean** node and Ketu is exactly Rahu + 180°; both carry `retrograde: true`.

```javascript
const { calculateBirthChart } = require("astrology-insights");

const chart = calculateBirthChart(
  { date: "2000-01-01", time: "04:30", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" },
  { ayanamsa: "lahiri", houseSystem: "whole_sign" },
);

console.log(chart.ayanamsa);             // { type: "lahiri", degree: 23.8571 }
console.log(chart.meta.utcDate);         // "1999-12-31T23:00:00.000Z"
console.log(chart.lagna);
// { longitude: 218.4994, signName: "Scorpio", signNumber: 8, degreeInSign: 8.5,
//   nakshatra: "Anuradha", nakshatraNumber: 17, nakshatraPada: 2, nakshatraLord: "Saturn" }

const saturn = chart.planets.find(p => p.name === "Saturn");
console.log(saturn.signName, saturn.degreeInSign, saturn.retrograde, saturn.dignity, saturn.symbol);
// "Aries" 16.55 true "debilitated" "(D)"
const mercury = chart.planets.find(p => p.name === "Mercury");
console.log(mercury.isCombust, mercury.combustOrb); // true 8.77

console.log(chart.houses.map(h => `${h.number}:${h.signName}:${h.planets.join("+") || "-"}`).join(" "));
// 1:Scorpio:Venus 2:Sagittarius:Sun+Mercury 3:Capricorn:Ketu 4:Aquarius:Mars 5:Pisces:- 6:Aries:Jupiter+Saturn
// 7:Taurus:- 8:Gemini:- 9:Cancer:Rahu 10:Leo:- 11:Virgo:- 12:Libra:Moon

console.log(chart.layout.northIndian.boxes[1]); // { houseNumber: 1, signNumber: 8, signName: "Scorpio", planets: ["Venus"] }
```

Gotchas:
- `time` is local civil time in `timezone`; the UTC instant actually used is `meta.utcDate`.
- Planet-to-house assignment is whole-sign for **all three** house systems (`equal` and `placidus` only change `cuspDegree`).
- `cuspDegree` is the Swiss Ephemeris cusp converted to sidereal. Under `whole_sign` that is the *tropical* sign boundary minus the ayanamsa (216.14 for the chart above), not `(signNumber - 1) * 30`. Use `signNumber` for house-to-sign logic.
- Many analysis functions want a planet's house number. The one-liner used through the rest of this document:
  ```javascript
  const houseOf = name => chart.houses.find(h => h.planets.includes(name)).number;
  ```

#### Dignity and combustion helpers

```typescript
determineDignity(planet: GrahaName, signNumber: number, degreeInSign: number): Dignity
determineCombustion(planet: GrahaName, planetLon: number, sunLon: number, isRetrograde: boolean): { isCombust: boolean; orb: number }
getDignitySymbol(dignity: Dignity): string
```

Peak exaltation/debilitation is within 1° of the classical degree. Combustion orbs: Moon 12°, Mars 17°, Mercury 14° (12° retrograde), Jupiter 11°, Venus 10° (8° retrograde), Saturn 15°; Sun, Rahu and Ketu are never combust. Symbols: `(U+)`, `(U)`, `(MT)`, `(Own)`, `""`, `(D)`, `(D-)`.

```javascript
const { determineDignity, determineCombustion, getDignitySymbol } = require("astrology-insights");

console.log(determineDignity("Saturn", 7, 20.5));  // "peak_exalted"   (Libra 20°)
console.log(determineDignity("Saturn", 1, 16.55)); // "debilitated"
console.log(determineDignity("Sun", 5, 10));       // "moolatrikona"   (Leo 0-20°)
console.log(determineDignity("Mars", 10, 28.4));   // "peak_exalted"
console.log(getDignitySymbol("exalted"));          // "(U)"
console.log(determineCombustion("Mercury", 247.19, 255.96, false)); // { isCombust: true, orb: 8.77 }
console.log(determineCombustion("Mercury", 243, 255.96, true));     // { isCombust: false, orb: 12.96 }
console.log(determineCombustion("Rahu", 255, 255, true));           // { isCombust: false, orb: 0 }
```

#### Houses and lords

```typescript
calculateHouses(lagnaSignNumber: number, houseSystem: HouseSystemType, cusps?: number[]): HouseInfo[]
assignPlanetsToHouses(planets: GrahaPosition[], lagnaSignNumber: number, houseSystem: HouseSystemType): Record<string, number>
populateHousePlanets(houses: HouseInfo[], planets: GrahaPosition[], assignment: Record<string, number>): HouseInfo[]
SIGN_LORDS: Record<number, GrahaName>          // 1 → 'Mars' … 12 → 'Jupiter' (classical Parashari; no Rahu/Ketu co-lordship)
getSignLord(signNumber: number): GrahaName      // wraps any integer into 1-12
getSignName(signNumber: number): string         // wraps any integer into 1-12
getHouseLords(houses: HouseInfo[], planets: GrahaPosition[]): HouseLordInfo[]
```

`calculateHouses` without `cusps` sets `cuspDegree` to `(signNumber - 1) * 30`. `populateHousePlanets` mutates and returns the `houses` you pass in. `getHouseLords` returns one row per house:

`{ house, signName, signNumber, lord, lordHouse, lordSignName, lordSignNumber, lordDegreeInSign, lordDignity, lordRetrograde, lordCombust }` — the `lord*` fields are `null` only if the lord is missing from `planets`.

```javascript
const { calculateBirthChart, calculateHouses, assignPlanetsToHouses, populateHousePlanets, getHouseLords, getSignLord, getSignName, SIGN_LORDS } = require("astrology-insights");

console.log(SIGN_LORDS[8], getSignLord(13), getSignName(0)); // "Mars" "Mars" "Pisces"

const chart = calculateBirthChart({ date: "1992-05-03", time: "22:05", latitude: 25.99, longitude: 79.45, timezone: "Asia/Kolkata" });
console.log(chart.lagna.signName, chart.lagna.degreeInSign); // "Sagittarius" 4.26

const lords = getHouseLords(chart.houses, chart.planets);
console.log(lords[9]);
// { house: 10, signName: "Virgo", signNumber: 6, lord: "Mercury", lordHouse: 4, lordSignName: "Pisces",
//   lordSignNumber: 12, lordDegreeInSign: 24.85, lordDignity: "debilitated", lordRetrograde: false, lordCombust: false }

// Rebuild the houses by hand (this is what calculateBirthChart does internally)
const houses = calculateHouses(chart.lagna.signNumber, "whole_sign");
const assignment = assignPlanetsToHouses(chart.planets, chart.lagna.signNumber, "whole_sign");
console.log(assignment); // { Sun: 5, Moon: 6, Mars: 4, Mercury: 4, Jupiter: 9, Venus: 5, Saturn: 2, Rahu: 1, Ketu: 7 }
populateHousePlanets(houses, chart.planets, assignment);
console.log(houses[0]);  // { number: 1, signName: "Sagittarius", signNumber: 9, cuspDegree: 240, planets: ["Rahu"] }
```

#### `calculateSudarshanaChakra(planets, lagnaSignNumber)`

The same chart read from three references: the lagna, the Moon sign (Chandra lagna) and the Sun sign (Surya lagna). Whole-sign only; no interpretation.

Returns `{ lagna, moon, sun }`, each a `SudarshanaView = { reference: 'lagna' | 'moon' | 'sun', referenceSignNumber, referenceSignName, houses: HouseInfo[] }`. The reference body always sits in house 1 of its own view, and `lagna.houses` equals the birth chart's `houses`.

```javascript
const { calculateBirthChart, calculateSudarshanaChakra } = require("astrology-insights");

const chart = calculateBirthChart({ date: "1992-05-03", time: "22:05", latitude: 25.99, longitude: 79.45, timezone: "Asia/Kolkata" });
const s = calculateSudarshanaChakra(chart.planets, chart.lagna.signNumber);

console.log(s.lagna.referenceSignName, s.moon.referenceSignName, s.sun.referenceSignName); // "Sagittarius" "Taurus" "Aries"
console.log(s.moon.houses[0].planets); // ["Moon"]
console.log(s.sun.houses[0].planets);  // ["Sun", "Venus"]
```

#### `generateChartLayouts(houses)`

Returns `{ northIndian, southIndian, western }` from a populated `HouseInfo[]`. North Indian boxes are in fixed *house* order `[12, 1, 2, …, 11]`; South Indian boxes are in fixed *sign* order `[12, 1, 2, …, 11]` (Pisces top-left) with `houseNumber` filled in; Western boxes are houses 1-12 in order.

```javascript
const { calculateBirthChart, generateChartLayouts } = require("astrology-insights");

const chart = calculateBirthChart({ date: "2000-01-01", time: "04:30", latitude: 28.6139, longitude: 77.209, timezone: "Asia/Kolkata" });
const layout = generateChartLayouts(chart.houses);

console.log(layout.northIndian.boxes.map(b => b.houseNumber).join(",")); // 12,1,2,3,4,5,6,7,8,9,10,11
console.log(layout.southIndian.boxes.map(b => b.signNumber).join(","));  // 12,1,2,3,4,5,6,7,8,9,10,11
console.log(layout.southIndian.boxes[1]); // { houseNumber: 6, signNumber: 1, signName: "Aries", planets: ["Jupiter", "Saturn"] }
console.log(layout.western.style);        // "western"
```

---

### Analysis

All examples in this section use `chart` from the 2000-01-01 04:30 Delhi birth above and the `houseOf` helper.

#### `calculateTattvaBalance(placements)`

`placements: { name: string; signNumber: number }[]` — include `"Lagna"` if you want it counted.

Returns `{ fire, earth, air, water, dominant, deficient }` where each element is `{ count, planets, percentage }` (percentage is a rounded integer of the placements passed; ties go to the earlier of Fire, Earth, Air, Water).

```javascript
const { calculateTattvaBalance } = require("astrology-insights");

const tattva = calculateTattvaBalance(chart.planets.map(p => ({ name: p.name, signNumber: p.signNumber })));
console.log(tattva.fire);      // { count: 4, planets: ["Sun", "Mercury", "Jupiter", "Saturn"], percentage: 44 }
console.log(tattva.earth);     // { count: 1, planets: ["Ketu"], percentage: 11 }
console.log(tattva.dominant, tattva.deficient); // "Fire" "Earth"
```

#### Friendships

```typescript
calculateFriendships(planets: FriendshipInput[]): PlanetaryFriendships
calculateTemporalFriendships(planets: FriendshipInput[]): Record<string, { friends: string[]; enemies: string[] }>
calculateCompoundFriendships(planets: FriendshipInput[], temporal): Record<string, { bestFriend; friend; neutral; enemy; bitterEnemy }>
NATURAL_FRIENDSHIPS: Record<string, { friends: string[]; neutral: string[]; enemies: string[] }>
interface FriendshipInput { name: string; houseNumber: number }   // house, NOT sign
```

`calculateFriendships` returns `{ natural, temporal, compound }` keyed by planet name. Compound (Panchadha) combines the two: natural friend + temporal friend = `bestFriend`, natural enemy + temporal enemy = `bitterEnemy`, a mixed pair is `neutral`, and a natural neutral takes the temporal verdict.

```javascript
const { calculateFriendships, calculateTemporalFriendships, calculateCompoundFriendships, NATURAL_FRIENDSHIPS } = require("astrology-insights");

console.log(NATURAL_FRIENDSHIPS.Saturn);
// { friends: ["Mercury", "Venus"], neutral: ["Jupiter"], enemies: ["Sun", "Moon", "Mars", "Rahu", "Ketu"] }

const input = chart.planets.map(p => ({ name: p.name, houseNumber: houseOf(p.name) }));
const fr = calculateFriendships(input);
console.log(fr.temporal.Sun);  // { friends: ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"], enemies: ["Rahu", "Ketu"] }
console.log(fr.compound.Sun);  // { bestFriend: ["Moon", "Mars", "Jupiter"], friend: ["Mercury"], neutral: ["Venus", "Saturn"], enemy: [], bitterEnemy: ["Rahu", "Ketu"] }

// The two halves are also exposed separately
const temporal = calculateTemporalFriendships(input);
const compound = calculateCompoundFriendships(input, temporal);
console.log(compound.Sun.bestFriend); // ["Moon", "Mars", "Jupiter"]
```

Gotcha: the temporal rule is implemented on the raw house *offset* `(other - self + 12) % 12`, treating offsets 2, 3, 4, 10, 11, 12 as friends. Counted inclusively that is the 3rd, 4th, 5th, 11th, 12th and 1st house — one house off the textbook 2/3/4/10/11/12, and planets sharing a house come out as temporal friends. The unit tests pin this behaviour, so treat it as the library's definition.

#### `calculateAspects(planets)`

`planets: { name: string; houseNumber: number }[]`. Every planet aspects the 7th house from itself; Mars adds the 4th and 8th, Jupiter the 5th and 9th, Saturn the 3rd and 10th, Rahu/Ketu the 5th and 9th. All aspects are `'full'` / strength `100` (the `aspectType` union also declares `three_quarter | half | quarter` but nothing emits them).

Returns `{ aspects: PlanetaryAspect[], houseAspects: Record<1..12, { aspectedBy: string[] }> }` with `PlanetaryAspect = { planet, aspectsHouse, aspectsPlanets, aspectType, strength }`.

```javascript
const { calculateAspects } = require("astrology-insights");

const asp = calculateAspects(chart.planets.map(p => ({ name: p.name, houseNumber: houseOf(p.name) })));
console.log(asp.aspects.filter(a => a.planet === "Jupiter").map(a => `${a.aspectsHouse}:${a.aspectsPlanets.join("+") || "-"}`));
// ["12:Moon", "10:-", "2:Sun+Mercury"]   (Jupiter in 6 → 7th, 5th, 9th)
console.log(asp.houseAspects[7]); // { aspectedBy: ["Mars", "Venus", "Ketu"] }
```

#### `calculateShadBala(planets, lagnaSignNumber, birthHour?)`

```typescript
interface ShadBalaPlanetInput { name; signNumber; degreeInSign; house; retrograde: boolean; speed: number; dignity: string }
```

A simplified six-fold strength. Returns one `ShadBalaResult` per input planet: `{ planet, sthana (0-100), dig (0-60), kala (0-100), chesta (0-60), naisargika, drik (0-60), total, required, ratio, isStrong }`. `required` thresholds are the classical virupa minimums scaled ×0.55 to this engine's range (Sun 215, Moon 200, Mars 165, Mercury 230, Jupiter 215, Venus 180, Saturn 165, nodes 140). `birthHour` (0-23 local) drives Kala Bala and defaults to 12 (day birth).

```javascript
const { calculateShadBala } = require("astrology-insights");

const bala = calculateShadBala(
  chart.planets.map(p => ({ name: p.name, signNumber: p.signNumber, degreeInSign: p.degreeInSign, house: houseOf(p.name), retrograde: p.retrograde, speed: p.speed, dignity: p.dignity })),
  chart.lagna.signNumber,
  4,   // born 04:30
);
console.log(bala[0]);
// { planet: "Sun", sthana: 42.77, dig: 20, kala: 10, chesta: 30, naisargika: 60, drik: 40, total: 202.77, required: 215, ratio: 0.94, isStrong: false }
console.log(bala.map(b => `${b.planet}:${b.ratio}`).join(" "));
// Sun:0.94 Moon:1.09 Mars:1.36 Mercury:1.02 Jupiter:0.7 Venus:1.13 Saturn:1.35 Rahu:1.33 Ketu:1.11
```

#### `detectYogas(planets, houses, lagnaSignNumber)`

Pass `chart.planets` and `chart.houses` straight in. Detects Raj Yoga (Kendra–Trikona lord as yoga-karaka, conjunction, placement "exchange"), Shubh Yoga, Uchcha Graha, Swa-Griha, Gajakesari, Budh-Aditya, the five Pancha Mahapurusha yogas (Ruchaka, Bhadra, Hamsa, Malavya, Shasha), Dhana, Lakshmi, Viparita Raj, Sunafa, Anafa and Neech Bhanga Raj Yoga.

Returns `{ yogas: DetectedYoga[], totalCount, rajYogaCount, hasGajakesariYoga, hasBudhaAdityaYoga, hasPanchamahapurushaYoga }` with `DetectedYoga = { name, nameHi, nameNe, type, description, descriptionHi, descriptionNe, planets, strength }`; `type` is `'raj' | 'dhan' | 'pancha_mahapurusha' | 'nabhas' | 'chandra' | 'surya' | 'negative' | 'other'`, `strength` is `'strong' | 'moderate' | 'mild'`.

```javascript
const { detectYogas } = require("astrology-insights");

const y = detectYogas(chart.planets, chart.houses, chart.lagna.signNumber);
console.log(y.totalCount, y.rajYogaCount, y.hasGajakesariYoga); // 6 4 true
console.log(y.yogas.map(x => x.name));
// [ "Raj Yoga (Mars — Kendra-Trikona Lord)", "Raj Yoga (Saturn-Jupiter Conjunction)", "Raj Yoga (Venus-Mars Exchange)",
//   "Gajakesari Yoga", "Sunafa Yoga", "Neech Bhanga Raj Yoga (Saturn)" ]
console.log(y.yogas[3].nameHi, y.yogas[3].type, y.yogas[3].planets); // "गजकेसरी योग" "other" ["Jupiter", "Moon"]
```

Gotcha: the "Exchange" Raj Yoga fires when a Kendra lord sits in a Trikona *house* and a Trikona lord in a Kendra *house* — a placement rule, not a Parivartana (sign exchange). Because house 1 is both Kendra and Trikona, a lord in the 1st satisfies either side.

---

### Doshas

All four take `chart.planets` (plus `chart.houses` / `chart.lagna` where shown).

| Function | Returns |
|---|---|
| `analyzeManglik(planets, houses)` | `{ isManglik, severity: 'none'\|'mild'\|'full', marsHouse, details, cancellations: string[] }` — Mars in 1, 2, 4, 7, 8, 12; cancelled by own sign, exaltation, Jupiter conjunction or a fire sign in the 1st; Jupiter's aspect (5/7/9, counted inclusively) downgrades to `mild`. The "both partners Manglik" note is always appended to `cancellations` |
| `analyzeKaalSarp(planets, houses)` | `{ hasDosha, type, rahuHouse, ketuHouse, allPlanetsOnOneSide, details, affectedHouses }` — `type` is one of Anant, Kulik, Vasuki, Shankhpal, Padma, Mahapadma, Takshak, Karkotak, Shankhchur, Ghatak, Vishdhar, Sheshnag (by Rahu's house) or `null`. All planets on the Ketu→Rahu side is reported as Kaal Amrit Yoga with `hasDosha: false` |
| `analyzeGandaMoola(planets)` | `{ hasDosha, moonNakshatra, moonPada, affectedNakshatras, details, severity: 'none'\|'mild'\|'severe' }` — Ashwini, Ashlesha, Magha, Jyeshtha, Moola, Revati; pada 1 of Ashwini/Magha/Moola and pada 4 of Ashlesha/Jyeshtha/Revati are `severe` |
| `analyzeGandanta(planets, lagna)` | `{ hasGandanta, planets: [{ name, signName, degree, type: 'rashi_gandanta', details }] }` — last 3°20' of Cancer/Scorpio/Pisces or first 3°20' of Leo/Sagittarius/Aries; the lagna is checked as `"Lagna"` |

```javascript
const { analyzeManglik, analyzeKaalSarp, analyzeGandaMoola, analyzeGandanta } = require("astrology-insights");

const manglik = analyzeManglik(chart.planets, chart.houses);
console.log(manglik.isManglik, manglik.severity, manglik.marsHouse); // true "full" 4
console.log(manglik.details);   // "Mars in house 4 causes full Manglik Dosha."

const ks = analyzeKaalSarp(chart.planets, chart.houses);
console.log(ks.hasDosha, ks.type, ks.rahuHouse, ks.ketuHouse); // false null 9 3

const gm = analyzeGandaMoola(chart.planets);
console.log(gm.hasDosha, gm.moonNakshatra, gm.severity); // false "Swati" "none"

const gd = analyzeGandanta(chart.planets, chart.lagna);
console.log(gd.hasGandanta, gd.planets[0].name, gd.planets[0].degree); // true "Jupiter" 1.37
```

---

### Divisional charts (Shodashvarga)

```typescript
calculateDivisionalChart(division: number, planets: PlanetInput[], lagnaSignNumber: number, lagnaDegree: number): DivisionalChart
calculateShodashvarga(planets: PlanetInput[], lagnaSignNumber: number, lagnaDegree: number): ShodashvargaEntry[]
getChartInfo(division: number): VargaChartInfo | undefined
SHODASHVARGA_CHARTS: VargaChartInfo[]          // 16 entries: { division, name, shortName, description }
interface PlanetInput { name: string; signNumber: number; degreeInSign: number }
```

`DivisionalChart = { name, division, planets: DivisionalPosition[], lagnaSign: { number, name } }` and `DivisionalPosition = { planet, d1SignNumber, d1Degree, vargaSignNumber, vargaSignName, vargaDegree }`.

`calculateShodashvarga` returns one entry per planet: `{ planet, scores: [{ chart: 'D1'…'D60', sign, signNumber, dignity }], totalPoints }`. Varga dignity is by sign only (`exalted`, `debilitated`, `moolatrikona`, `own_sign`, then `friendly` / `enemy` / `neutral` from the planet's *natural* relationship with the varga sign's lord) and scores 20 / 0 / 15 / 20 / 10 / 2 / 5 points respectively; `totalPoints` is the sum over all 16 charts (max 320).

The 16 charts in `SHODASHVARGA_CHARTS`:

| Division | Name | Short | Signification |
|---|---|---|---|
| 1 | Rasi | D1 | Birth chart — overall life |
| 2 | Hora | D2 | Wealth and finances |
| 3 | Drekkana | D3 | Siblings and courage |
| 4 | Chaturthamsa | D4 | Property and fortune |
| 7 | Saptamsa | D7 | Children and progeny |
| 9 | Navamsa | D9 | Marriage, dharma, spiritual life |
| 10 | Dasamsa | D10 | Career and profession |
| 12 | Dwadasamsa | D12 | Parents and ancestry |
| 16 | Shodasamsa | D16 | Vehicles and comforts |
| 20 | Vimsamsa | D20 | Spiritual progress and worship |
| 24 | Chaturvimsamsa | D24 | Education and learning |
| 27 | Saptavimsamsa | D27 | Physical strength and stamina |
| 30 | Trimsamsa | D30 | Misfortunes and challenges |
| 40 | Khavedamsa | D40 | Auspicious/inauspicious effects |
| 45 | Akshavedamsa | D45 | General indications, paternal legacy |
| 60 | Shashtiamsa | D60 | Past life karma, overall summary |

D16, D20 and D45 start rasis follow BPHS Ch. 6 (keyed on modality — movable/fixed/dual), verified by `varga-bphs.check.js`. Rahu and Ketu get no special treatment in the vargas.

```javascript
const { calculateDivisionalChart, calculateShodashvarga, getChartInfo, SHODASHVARGA_CHARTS } = require("astrology-insights");

const planets = chart.planets.map(p => ({ name: p.name, signNumber: p.signNumber, degreeInSign: p.degreeInSign }));

const d9 = calculateDivisionalChart(9, planets, chart.lagna.signNumber, chart.lagna.degreeInSign);
console.log(d9.name, d9.lagnaSign);            // "Navamsa (D9)" { number: 6, name: "Virgo" }
console.log(d9.planets.map(p => `${p.planet}:${p.vargaSignName}`).join(" "));
// Sun:Leo Moon:Capricorn Mars:Scorpio Mercury:Gemini Jupiter:Aries Venus:Virgo Saturn:Leo Rahu:Libra Ketu:Aries
console.log(d9.planets[1].d1SignNumber, d9.planets[1].vargaSignNumber, d9.planets[1].vargaDegree.toFixed(2)); // 7 10 "2.93"

console.log(getChartInfo(10));                 // { division: 10, name: "Dasamsa", shortName: "D10", description: "Career and profession" }
console.log(getChartInfo(5));                  // undefined
console.log(SHODASHVARGA_CHARTS.map(c => c.shortName).join(" "));
// D1 D2 D3 D4 D7 D9 D10 D12 D16 D20 D24 D27 D30 D40 D45 D60

const sv = calculateShodashvarga(planets, chart.lagna.signNumber, chart.lagna.degreeInSign);
console.log(sv.map(e => `${e.planet}:${e.totalPoints}`).join(" "));
// Sun:149 Moon:90 Mars:149 Mercury:105 Jupiter:120 Venus:76 Saturn:128 Rahu:101 Ketu:114
console.log(sv[0].scores[1]);                  // { chart: "D2", sign: "Cancer", signNumber: 4, dignity: "friendly" }
```

---

### Vimshottari Dasha

```typescript
calculateVimshottariDasha(birthDate: Date, moonNakshatra: string, moonNakshatraDegree: number, depth = 5): VimshottariResult
DASHA_YEARS: Record<string, number>      // Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17, Ketu 7, Venus 20
DASHA_SEQUENCE: string[]                 // ['Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury','Ketu','Venus']
NAKSHATRA_LORDS: Record<string, string>  // 27 nakshatra names → lord; also the canonical spelling list
```

- `birthDate` is the birth **instant** (`new Date(chart.meta.utcDate)`).
- `moonNakshatraDegree` is how far the Moon has travelled into the nakshatra, 0 to 13.333 (`moon.longitude % (360/27)`). Out of range, or an unknown nakshatra name, throws.
- `depth` 1-5: Maha, Antar, Pratyantar, Sookshma, Prana. The full tree is generated only under the **currently active** Maha Dasha; inactive Maha Dashas get the Antar level only. Dates are civil `"YYYY-MM-DD"` on a 365.25-day year.

Returns `{ birthNakshatra, birthNakshatraLord, balanceAtBirth: { planet, years, months, days }, mahaDashas: DashaPeriod[9], currentDasha: { maha, antar, pratyantar, sookshma, prana } }` where `DashaPeriod = { planet, level, levelName, startDate, endDate, durationDays, isActive, subPeriods? }`. `isActive` and `currentDasha` are evaluated against **now**, so they change from day to day.

```javascript
const { calculateVimshottariDasha, DASHA_YEARS, DASHA_SEQUENCE, NAKSHATRA_LORDS } = require("astrology-insights");

console.log(DASHA_SEQUENCE.reduce((s, p) => s + DASHA_YEARS[p], 0)); // 120
console.log(NAKSHATRA_LORDS.Swati, Object.keys(NAKSHATRA_LORDS).length); // "Rahu" 27

const d = calculateVimshottariDasha(new Date("2000-01-01T04:30:00Z"), "Rohini", 8.5, 2);
console.log(d.birthNakshatraLord, d.balanceAtBirth); // "Moon" { planet: "Moon", years: 3, months: 7, days: 15 }
console.log(d.mahaDashas.map(m => `${m.planet}:${m.startDate}`).join(" "));
// Moon:2000-01-01 Mars:2003-08-17 Rahu:2010-08-16 Jupiter:2028-08-16 Saturn:2044-08-16 Mercury:2063-08-17 Ketu:2080-08-16 Venus:2087-08-17 Sun:2107-08-18
console.log(d.mahaDashas[0].subPeriods.length, d.mahaDashas[0].subPeriods[0].levelName); // 9 "Antar Dasha"
```

---

### Sade Sati

#### `calculateSadeSatiPeriod({ moonSignNumber, referenceDate?, scanYearsPast?, scanYearsFuture? })`

Scans Saturn's sidereal transit (defaults: 15 years back and 20 years ahead of `referenceDate`, which defaults to now) and returns the 7½-year windows where Saturn is in the 12th, 1st or 2nd sign from the natal Moon.

Returns `{ referenceDate, moonSign, moonSignHi, moonSignNumber, currentSaturnSign, currentSaturnSignHi, currentSaturnSignNumber, currentHouseFromMoon, isCurrentlyInSadeSati, currentPhase?, currentCycle, previousCycle, nextCycle }`. A cycle is `{ startDate, endDate, activeOnReferenceDate, phases: [{ phase: 'rising'|'peak'|'setting', houseFromMoon: 12|1|2, startDate, endDate, saturnSign, saturnSignHi, saturnSignNumber }] }`; cycles outside the scan window are `null`.

```javascript
const { calculateSadeSatiPeriod } = require("astrology-insights");

const s = calculateSadeSatiPeriod({ moonSignNumber: 11, referenceDate: new Date("2026-09-20T00:00:00Z") }); // Aquarius Moon
console.log(s.currentSaturnSign, s.currentHouseFromMoon, s.isCurrentlyInSadeSati, s.currentPhase); // "Pisces" 2 true "setting"
console.log(s.currentCycle.startDate, s.currentCycle.endDate);   // "2020-01-24" "2028-02-23"
console.log(s.currentCycle.phases.map(p => `${p.phase}:${p.saturnSign}:${p.startDate}`).join(" "));
// rising:Capricorn:2020-01-24 peak:Aquarius:2022-04-29 setting:Pisces:2025-03-29
console.log(s.previousCycle, s.nextCycle); // null null   (outside the default 15y/20y scan)
```

Gotcha: phase windows can overlap when Saturn retrogrades back across a sign boundary (above, `rising` ends 2023-01-17 while `peak` begins 2022-04-29).

---

### Ashtakoot Milan

#### `calculateAshtakootMilan(groom, bride)`

```typescript
interface MatchInput { nakshatraNumber: number; nakshatraPada: number; rashiNumber: number; nakshatraLord: string }  // all from the natal Moon
```

Eight kootas out of 36: Varna (1, read from the Moon rashi), Vasya (2), Tara (3, half points possible), Yoni (4), Graha Maitri (5, compares the lords of the two Moon signs), Gana (6), Bhakoot (7, inclusive sign count), Nadi (8).

Returns `{ gunas: [{ name, nameHi, points, maxPoints, description }] × 8, totalPoints, maxPoints: 36, percentage, verdict, verdictHi }`. Verdicts: ≥ 28 "Excellent match", ≥ 21 "Good match", ≥ 18 "Average match", otherwise "Below average — consult a pandit".

```javascript
const { calculateAshtakootMilan } = require("astrology-insights");

const m = calculateAshtakootMilan(
  { nakshatraNumber: 15, nakshatraPada: 2, rashiNumber: 7, nakshatraLord: "Rahu" },  // Swati
  { nakshatraNumber: 4,  nakshatraPada: 3, rashiNumber: 2, nakshatraLord: "Moon" },  // Rohini
);
console.log(m.totalPoints, m.percentage, m.verdict); // 14.5 40 "Below average — consult a pandit"
console.log(m.gunas[2]); // { name: "Tara", nameHi: "तारा", points: 1.5, maxPoints: 3, description: "Birth star compatibility" }
```

To build a `MatchInput` from a chart: `const moon = chart.planets.find(p => p.name === "Moon");` then `{ nakshatraNumber: moon.nakshatraNumber, nakshatraPada: moon.nakshatraPada, rashiNumber: moon.signNumber, nakshatraLord: moon.nakshatraLord }`.

---

### Recommendations

#### `getNameSuggestions(nakshatra, pada)` and `NAKSHATRA_SYLLABLES`

`NAKSHATRA_SYLLABLES` maps each of the 27 nakshatra names to its four pada syllables. `getNameSuggestions` returns one `NameSuggestion` per gender group that has names — `{ syllable, nakshatra, pada, gender: 'male'|'female'|'unisex', names: [{ name, gender }] }` — or `[]` for an unknown nakshatra or a pada outside 1-4.

```javascript
const { getNameSuggestions, NAKSHATRA_SYLLABLES } = require("astrology-insights");

console.log(NAKSHATRA_SYLLABLES.Ashwini);   // ["Chu", "Che", "Cho", "La"]
const names = getNameSuggestions("Ashwini", 1);
console.log(names.map(n => `${n.syllable}/${n.gender}/${n.names.length}`)); // ["Chu/male/2", "Chu/female/1"]
console.log(names[0].names[0]);             // { name: "Chudamani", gender: "male" }
console.log(getNameSuggestions("Mula", 1)); // []   (the key is "Moola")
```

#### `getRemedies(planets)`, `getPlanetRemedy(planet)`, `PLANET_DIRECTIONS`, `getPlanetDirection(planet)`

```typescript
interface RemedyPlanetInput { name: string; dignity: string; isCombust: boolean; house: number }
interface PlanetaryRemedy { planet; gemstone: { name, alternates, metal, finger, day, weight }; mantra: { vedic, beej, japaCount }; charity: { items, day, deity }; color; direction; fasting }
```

`getRemedies` flags a planet as weak if it is debilitated, combust, or in a dusthana (6, 8, 12) and returns `{ weakPlanets: [{ planet, reason, remedy: PlanetaryRemedy }], generalRemedies: string[] }`. `getPlanetRemedy` returns the full remedy for any graha (or `null`). `PLANET_DIRECTIONS` is `{ Sun: 'East', Moon: 'Northwest', Mars: 'South', Mercury: 'North', Jupiter: 'Northeast', Venus: 'Southeast', Saturn: 'West', Rahu: 'Southwest', Ketu: 'Southwest' }` and `getPlanetDirection` returns `null` for an unknown name.

```javascript
const { getRemedies, getPlanetRemedy, PLANET_DIRECTIONS, getPlanetDirection } = require("astrology-insights");

const r = getRemedies(chart.planets.map(p => ({ name: p.name, dignity: p.dignity, isCombust: p.isCombust, house: houseOf(p.name) })));
console.log(r.weakPlanets.map(w => `${w.planet}: ${w.reason}`));
// [ "Moon: Moon is placed in house 12 (dusthana)", "Mercury: Mercury is combust",
//   "Jupiter: Jupiter is placed in house 6 (dusthana)", "Saturn: Saturn is debilitated, placed in house 6 (dusthana)" ]
const sat = r.weakPlanets[3].remedy;
console.log(sat.gemstone.name, sat.gemstone.weight, sat.mantra.japaCount, sat.fasting); // "Blue Sapphire" "3-5 carats" 23000 "Saturday"
console.log(r.generalRemedies.length);      // 6

console.log(getPlanetRemedy("Saturn").mantra.vedic); // "Om Shanaishcharaya Namah"
console.log(PLANET_DIRECTIONS.Mars, getPlanetDirection("Jupiter"), getPlanetDirection("Pluto")); // "South" "Northeast" null
```

---

### Daily horoscope (Gochar)

```typescript
calculateDailyHoroscope({ date: Date; moonSignNumber: number; latitude?; longitude?; timezone? }): DailyHoroscope
getDailyHoroscope(date: Date, moonSignNumber: number): DailyHoroscope   // shorthand for the above
```

Transit positions of all nine grahas on `date` are read from Swiss Ephemeris and scored against the natal Moon sign using Phaladeepika's favourable-house and Vedha tables. `latitude`/`longitude`/`timezone` are accepted but do not change the result (transits are geocentric).

`DailyHoroscope = { date, moonSign, moonSignHi, moonSignNumber, overallScore (-100..100), rating: 'excellent'|'good'|'average'|'challenging'|'difficult', summary, summaryHi, transits: PlanetTransit[9], areas: LifeAreaPrediction[], lucky: { color, colorHi, number, direction, directionHi }, caution, cautionHi }`

`PlanetTransit = { planet, currentRashi, currentRashiNumber, houseFromMoon, isFavorable, isVedhaActive, vedhaPlanet?, interpretation: { en, hi, areas, effect, intensity }, longitude }`; `LifeAreaPrediction = { area, label, labelHi, score, prediction, predictionHi, planets }` for career, finance, health, relationships, spiritual and general.

```javascript
const { getDailyHoroscope } = require("astrology-insights");

const h = getDailyHoroscope(new Date("2026-09-20T00:00:00Z"), 7); // Libra Moon
console.log(h.moonSign, h.moonSignHi, h.overallScore, h.rating); // "Libra" "तुला" 62 "excellent"
console.log(h.transits.map(t => `${t.planet}:${t.currentRashi}:${t.houseFromMoon}${t.isFavorable ? "+" : "-"}`).join(" "));
// Saturn:Pisces:6+ Jupiter:Cancer:10- Rahu:Aquarius:5- Ketu:Leo:11+ Mars:Cancer:10- Sun:Virgo:12- Venus:Libra:1+ Mercury:Virgo:12- Moon:Sagittarius:3+
console.log(h.transits[3].isVedhaActive);       // true   (Ketu's 11th-house result is obstructed)
console.log(h.areas[0].area, h.areas[0].score); // "career" 52
console.log(h.lucky);                           // { color: "White", colorHi: "सफेद", number: 1, direction: "West", directionHi: "पश्चिम" }
```

---

### Constants

| Export | Value |
|---|---|
| `ALL_GRAHAS` | `['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']` — also the order of `chart.planets` |
| `SIGN_LORDS` | `{ 1:'Mars', 2:'Venus', 3:'Mercury', 4:'Moon', 5:'Sun', 6:'Mercury', 7:'Venus', 8:'Mars', 9:'Jupiter', 10:'Saturn', 11:'Saturn', 12:'Jupiter' }` |
| `NATURAL_FRIENDSHIPS` | Naisargika maitri table, `{ [planet]: { friends, neutral, enemies } }` for all nine grahas |
| `DASHA_YEARS` | Vimshottari years per lord (sums to 120) |
| `DASHA_SEQUENCE` | Vimshottari order starting from Sun |
| `NAKSHATRA_LORDS` | 27 nakshatra names → lord; the canonical spellings used by every module |
| `SHODASHVARGA_CHARTS` | the 16 `{ division, name, shortName, description }` rows above |
| `NAKSHATRA_SYLLABLES` | 27 nakshatra names → `[pada1, pada2, pada3, pada4]` syllables |
| `PLANET_DIRECTIONS` | graha → compass direction |

```javascript
const { ALL_GRAHAS, SIGN_LORDS, NATURAL_FRIENDSHIPS, DASHA_YEARS, NAKSHATRA_LORDS, SHODASHVARGA_CHARTS, NAKSHATRA_SYLLABLES, PLANET_DIRECTIONS } = require("astrology-insights");

console.log(ALL_GRAHAS.length, Object.keys(SIGN_LORDS).length, Object.keys(NATURAL_FRIENDSHIPS).length);   // 9 12 9
console.log(Object.keys(DASHA_YEARS).length, Object.keys(NAKSHATRA_LORDS).length, SHODASHVARGA_CHARTS.length); // 9 27 16
console.log(Object.keys(NAKSHATRA_SYLLABLES).length, Object.keys(PLANET_DIRECTIONS).length);                // 27 9
```

---

## Validation against Drik Panchang

`calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata")` (Delhi) against drikpanchang.com. The "Our value" column is what the current code returns.

| Field | Our value | Drik Panchang | Match |
|---|---|---|---|
| Tithi | Shukla Tritiya | Shukla Tritiya | YES |
| Nakshatra | Ashwini | Ashwini | YES |
| Yoga | Indra | Indra | YES |
| Karana | Taitila | Taitila | YES |
| Vara | Saturday | Saturday | YES |
| Sunrise | 06:25 | 06:24 | ~1 min |
| Sunset | 18:33 | 18:33 | YES |
| Moon sign | Aries | Aries | YES |
| Sun sign | Pisces | Pisces | YES |
| Paksha | Shukla | Shukla | YES |
| Brahma Muhurta | 04:48–05:36 | 04:49–05:37 | ~1 min |
| Pratah Sandhya | 05:14–06:25 | 05:13–06:24 | ~1 min |
| Abhijit Muhurat | 12:04–12:53 | 12:04–12:53 | YES |
| Vijaya Muhurat | 14:30–15:19 | 14:30–15:18 | ~1 min |
| Godhuli Muhurat | 18:32–18:55 | 18:32–18:55 | YES |
| Sayahna Sandhya | 18:33–19:44 | 18:33–19:44 | YES |
| Nishita Muhurat | 00:05–00:53 | 00:04–00:52 | ~1 min |
| Rahu Kalam | 09:27–10:58 | 09:26–10:57 | ~1 min |
| Yamaganda | 14:00–15:30 | 14:00–15:31 | ~1 min |
| Gulika Kalam | 06:25–07:56 | 06:24–07:55 | ~1 min |
| Dur Muhurtam | 06:25–07:13 | 06:24–07:13 | ~1 min |
| Vikram Samvat | 2083 | 2083 | YES |
| Shaka Samvat | 1948 | 1948 | YES |
| Samvatsar | Siddharthi | Siddharthi | YES |
| Ritu | Vasanta | Vasanta | YES |
| Ayana | Uttarayana | Uttarayana | YES |
| Dinamana | 12h 08m | 12h 08m | YES |

**28/29 fields match**; moonrise is ~8 minutes off because lunar rise/set come from SunCalc. The jest suite also pins 2026-03-20 (Lucknow) against a Swiss Ephemeris fixture, the 2000-01-01 Delhi birth chart, and sunrise/sunset for Kathmandu, Delhi and London on 2026-09-10 (`panchang.check.js`).

Historical spot checks: 2025-10-20 (Diwali — Chaturdashi, Hasta, Shakuni), 2026-01-14 (Makar Sankranti — Ekadashi, Anuradha), 1947-08-15.

---

## React Native

`package.json` has `"react-native": "index.rn.js"`, so Metro picks that entry automatically. It requires the compiled JavaScript in `dist/` (no `ts-node`) plus the legacy `lib/` helpers, and expects the `swisseph` module name to resolve to a native bridge such as `react-native-swisseph`. Without that bridge `calculateBirthChart`, `calculateDailyHoroscope` and `calculateSadeSatiPeriod` throw, and `calculateFullPanchang` falls back to the Meeus approximation for Sun/Moon longitudes.

Differences from the Node entry (52 exports vs 62):

- **Only in `index.rn.js`:** `calculateGulikaKalam`, `grahaName(englishName, lang)`, `PLANETS_HI`, `PLANETS_NE`.
- **Only in `index.js`:** `calculatePanchang` (legacy v1), `ALL_GRAHAS`, `determineDignity`, `determineCombustion`, `getDignitySymbol`, `generateChartLayouts`, `calculateTemporalFriendships`, `calculateCompoundFriendships`, `NATURAL_FRIENDSHIPS`, `DASHA_YEARS`, `DASHA_SEQUENCE`, `NAKSHATRA_LORDS`, `getChartInfo`, `NAKSHATRA_SYLLABLES`.
- Everything else (Panchang v2, core calculators, birth chart, houses/lords/Sudarshana, analysis, doshas, yogas, milan, dasha, divisional, recommendations, horoscope, Sade Sati, legacy timings) is identical.

```javascript
// In a React Native app this resolves to index.rn.js
const { calculateFullPanchang, calculateGulikaKalam, grahaName } = require("astrology-insights");

const p = calculateFullPanchang("2026-03-21", 27.7172, 85.324, "Asia/Kathmandu", "ne");
console.log(p.vara.name);                                                              // "शनिबार"
console.log(calculateGulikaKalam("2026-03-21", "06:25:46", "18:33:45", "Asia/Kolkata")); // { start: "06:25:46", end: "07:56:45" }
console.log(grahaName("Saturn", "hi"), grahaName("Jupiter", "ne"));                     // "शनि" "बृहस्पति"
```

The `.check.js` scripts at the repo root deliberately load `index.rn.js` / `dist/` so that a fix that exists only in TypeScript and was never rebuilt fails loudly.

---

## Deployment (Vercel serverless API)

`api/panchang.js` is a ready-to-deploy function wrapping `calculateFullPanchang` (English only). `vercel.json` gives it 256 MB and a 10 s limit.

```bash
npx vercel
curl "https://your-app.vercel.app/api/panchang?date=2026-03-21&lat=28.6139&lon=77.209&tz=Asia/Kolkata"
```

| Param | Required | Example |
|---|---|---|
| `date` | yes | `2026-03-21` |
| `lat` | yes | `28.6139` |
| `lon` | yes | `77.209` |
| `tz` | yes | `Asia/Kolkata` (URL-encoded) |

Responses are `PanchangResult` JSON with `Cache-Control: s-maxage=3600, stale-while-revalidate=86400` and permissive CORS. Missing parameters return 400; calculation errors return 500 with `{ error, message }`.

---

## Building and testing

```bash
npm test                # node test.js — smoke run of the legacy helpers and both Panchang engines (prints, no asserts)
npm run test:unit       # jest — 21 suites, 286 tests (8 skipped without a native swisseph build)
npm run build           # tsc → dist/ for every .ts under panchang/src (what index.rn.js loads)
npm run check:dist      # requires the dist birthchart, shodashvarga and panchang-v2 entry points
npm run prepublishOnly  # build + check:dist + npm test — runs automatically on `npm publish`
```

Runnable, framework-free guards (plain `assert`) live at the repo root and are worth running after any engine change:

```bash
node panchang.check.js                 # sunrise/sunset within 3 min for Kathmandu/Delhi/London; ayana turns at the solstices
node house-lords-sudarshana.check.js   # lordship table, getHouseLords on a fixed chart, Sudarshana views, planet directions, varga friendly/enemy marks
node varga-bphs.check.js               # D16/D20/D45 start rasis vs BPHS Ch. 6
node rahu-ketu-nakshatra.check.js      # Rahu/Ketu exactly 180° apart across 1950-2030; nakshatra spellings resolve in every table
node nepali-localization.check.js      # 'ne' returns Nepali, not Hindi; 'en'/'hi' untouched; every yoga has nameNe/descriptionNe
```

Jest maps `swisseph` to `__mocks__/swisseph.js` so the unit suite runs without the native addon; the tests that need real positions skip themselves when the mock is detected.

---

## Changelog

### 2.3.2 — 2026-09-20
- `dist/` now ships `birthchart/core/lords.js` — 2.3.1's `index.rn.js` required it but the compiled file was missing, so the React Native entry failed to load.
- `prepublishOnly` runs `npm run build && npm run check:dist && npm test`, so a publish can no longer ship a stale or incomplete `dist/`.

### 2.3.1 — 2026-09-18
New:
- `getHouseLords`, `SIGN_LORDS`, `getSignLord`, `getSignName` — one sign-lordship table (it used to be duplicated privately in `yogas.ts` and `ashtakoot.ts`).
- `calculateSudarshanaChakra` — lagna / Chandra / Surya views of the same chart.
- `getPlanetRemedy`, `PLANET_DIRECTIONS`, `getPlanetDirection`.
- `detectYogas` (Raj, Pancha Mahapurusha, Gajakesari, Budh-Aditya, Dhana, Lakshmi, Viparita, Sunafa/Anafa, Neech Bhanga) with Hindi and Nepali names.
- `calculateAshtakootMilan` (36-point Guna Milan).
- `calculateDailyHoroscope` / `getDailyHoroscope` — Phaladeepika Gochar with Vedha.
- `calculateSadeSatiPeriod`.
- Nepali (`'ne'`) tables for the Panchang and yoga text; `grahaName`, `PLANETS_HI`, `PLANETS_NE` on the RN entry.
- `npm run build` compiles every `.ts` under `panchang/src`, not a hand-picked list.

Fixed:
- Rahu now uses the **mean** node (SE_MEAN_NODE = 10, not 11); Ketu is exactly Rahu + 180°. The old true-node Rahu bent the axis by up to 1.9° and put Ketu in the wrong sign on ~3 % of dates.
- Nakshatra spelling unified (`Moola`, not `Mula`) so `calculateVimshottariDasha`, `analyzeGandaMoola` and `getNameSuggestions` accept what `calculateBirthChart` emits.
- D16, D20 and D45 start rasis keyed on modality per BPHS Ch. 6 (were keyed on element; 8 of 12 signs landed wrong).
- Varga dignity can return `friendly` / `enemy` (was stuck on `neutral`, scoring a flat 5).
- Ashtakoot: Varna read from the Moon rashi; Graha Maitri compares Moon-sign lords; corrected Varna, Gana and Nadi tables; Bhakoot counts inclusively.
- Manglik: Jupiter's 5th/7th/9th aspects counted inclusively (were shifted one house, falsely cancelling the dosha).
- `calculateChoghadiya` reads sunrise/sunset in the supplied timezone instead of the machine's; throws on an invalid time.
- Shad Bala `required` thresholds recalibrated to this engine's scale (every planet used to read "weak").
- v1 `calculatePanchang`: sunrise/sunset and ayana corrected (ayana turns at the solstices).

### 2.3.0 — 2026-03-22
- `calculateFullPanchang` returns `startTime`/`endTime` for tithi, nakshatra, yoga and karana and appends the second value when one changes between sunrise and sunset (binary-searched transition time).
- All birth-chart modules exported from the package root: `calculateBirthChart`, dignity/combustion helpers, houses and layouts, tattva, friendships, aspects, Shad Bala, doshas, divisional charts and Shodashvarga, Vimshottari Dasha, name suggestions and remedies.

### 2.2.1 — 2026-03-22
- Tithi/nakshatra/yoga/karana transition detection with binary search for the exact time.

### 2.2.0 — 2026-03-21
- `index.rn.js` wired to the compiled Panchang v2 and birth-chart modules.

### 2.1.0 — 2026-03-21
- Birth chart module introduced.

### 2.0.0 — 2026-03-21
- Panchang v2 on Swiss Ephemeris (`calculateFullPanchang`, `calculateMonthlyPanchang`, core calculators). `calculateNakshatraV2` added; `calculateGulikaKalam` signature changed to `(date, sunrise, sunset, timezone)`.

---

## Contributing

1. Fork and branch: `git checkout -b feature/my-feature`
2. Add a jest test under `tests/` (or a root `*.check.js` for engine corrections that must survive a rebuild)
3. `npm run test:unit && npm run build && npm run check:dist`
4. Open a pull request

## License

MIT — see [LICENSE](LICENSE).

## Acknowledgments

- [Swiss Ephemeris](https://www.astro.com/swisseph/) via the `swisseph` addon — planetary positions, ayanamsa, house cusps
- [SunCalc](https://github.com/mourner/suncalc) — sunrise/sunset and lunar rise/set
- [Luxon](https://moment.github.io/luxon/) and [date-fns](https://date-fns.org/) — timezone arithmetic
- Brihat Parashara Hora Shastra, Phaladeepika and Saravali for the classical rules
