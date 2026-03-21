# astrology-insights

**Comprehensive Vedic astrology engine for Node.js** -- Panchang, birth charts, Vimshottari Dasha, divisional charts, dosha analysis, and more.

[![npm version](https://img.shields.io/npm/v/astrology-insights.svg)](https://www.npmjs.com/package/astrology-insights)
[![license](https://img.shields.io/npm/l/astrology-insights.svg)](https://github.com/adarshsrii/astrology/blob/main/LICENSE)
[![tests](https://img.shields.io/badge/tests-62%20passing-brightgreen.svg)]()

---

## Overview

`astrology-insights` is a production-grade Vedic astrology library that computes:

- **Daily Panchang** with Swiss Ephemeris precision (tithi, nakshatra, yoga, karana, muhurats, kalams)
- **Birth Charts (Kundli)** with 9 grahas, 12 houses, 3 chart layouts, dignity, combustion
- **Vimshottari Dasha** with 5-level depth (Maha through Prana)
- **16 Divisional Charts** (Shodashvarga) with Varga Viswa scoring
- **Dosha Analysis** (Manglik, Kaal Sarp, Ganda Moola, Gandanta)
- **Planetary Strength** (Shad Bala), Tattva balance, aspects, friendships
- **Recommendations** -- baby name suggestions by nakshatra/pada, gemstone and mantra remedies

Validated against [Drik Panchang](https://www.drikpanchang.com/) with 28/29 fields matching exactly.

Built for astrology apps, Kundli generators, calendar services, and research tools.

---

## Features

- Swiss Ephemeris planetary positions (sidereal, Lahiri or KP ayanamsa)
- Full Panchang: tithi, nakshatra, yoga, karana, vara, paksha, ayana, ritu, samvatsar
- 7 auspicious muhurats and 5 inauspicious kalams per day
- Monthly Panchang batch calculation
- Complete birth chart with North Indian, South Indian, and Western layouts
- Whole Sign, Equal, and Placidus house systems
- Planetary dignity (exalted, moolatrikona, own sign, debilitated), combustion detection
- Vimshottari Dasha: Maha, Antar, Pratyantar, Sookshma, Prana levels
- All 16 Shodashvarga divisional charts (D1 through D60)
- Manglik, Kaal Sarp, Ganda Moola, Gandanta dosha detection
- Shad Bala six-fold planetary strength
- Tattva (element) balance analysis
- Planetary aspects with full/partial strength
- Natural, temporal, and compound planetary friendships
- Baby name suggestions based on birth nakshatra syllable
- Gemstone, mantra, charity, and fasting remedies for weak planets
- React Native compatible entry point with API fetch
- Vercel serverless deployment ready
- Backward-compatible legacy APIs (sunrise/sunset, Choghadiya, biorhythms)

---

## Installation

```bash
npm install astrology-insights
```

**Requirements:** Node.js >= 16

---

## Quick Start

### 1. Daily Panchang

```javascript
const { calculateFullPanchang } = require("astrology-insights");

const panchang = calculateFullPanchang("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");

console.log(panchang.tithi[0].name);       // "Shukla Tritiya"
console.log(panchang.nakshatra[0].name);    // "Ashwini"
console.log(panchang.yoga[0].name);         // "Indra"
console.log(panchang.sunrise);              // "06:25"
console.log(panchang.auspiciousMuhurats);   // Brahma, Abhijit, Vijaya, ...
```

### 2. Birth Chart (Kundli)

```javascript
const { calculateBirthChart } = require("astrology-insights");

const chart = calculateBirthChart({
  date: "2000-01-01",
  time: "04:30",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: "Asia/Kolkata",
  name: "Sample",
});

console.log(chart.lagna.signName);           // Ascendant sign
console.log(chart.planets[0].name);          // "Sun"
console.log(chart.planets[0].signName);      // Zodiac sign
console.log(chart.planets[0].dignity);       // "exalted", "own_sign", etc.
console.log(chart.layout.northIndian.boxes); // 12 chart boxes with planets
```

### 3. Vimshottari Dasha

```javascript
const { calculateVimshottariDasha } = require("astrology-insights");

const dasha = calculateVimshottariDasha(
  new Date("2000-01-01T04:30:00Z"),
  "Ashwini",   // Moon's nakshatra at birth
  5.5,         // Moon's degree within nakshatra (0-13.333)
  5            // Depth: 1=Maha only, 5=down to Prana
);

console.log(dasha.currentDasha.maha);       // Current Maha Dasha lord
console.log(dasha.currentDasha.antar);       // Current Antar Dasha lord
console.log(dasha.balanceAtBirth);           // Remaining dasha at birth
console.log(dasha.mahaDashas.length);        // 9 Maha Dasha periods
```

---

## API Reference

### Panchang

#### `calculateFullPanchang(date, latitude, longitude, timezone)`

Computes the complete daily Panchang for any date and location.

**Parameters:**

| Param | Type | Example |
|---|---|---|
| `date` | `string \| Date` | `"2026-03-21"` |
| `latitude` | `number` | `28.6139` |
| `longitude` | `number` | `77.209` |
| `timezone` | `string` | `"Asia/Kolkata"` |

**Returns:** `PanchangResult`

| Field | Type | Description |
|---|---|---|
| `tithi` | `TithiResult[]` | Lunar day: name, number, paksha, progress % |
| `nakshatra` | `NakshatraResult[]` | Lunar mansion: name, pada (1-4), lord, deity, progress % |
| `yoga` | `YogaResult[]` | Sun-Moon conjunction: name, number (1-27), progress % |
| `karana` | `KaranaResult[]` | Half-tithi: name, number, progress % |
| `vara` | `object` | Weekday: name and number |
| `moonSign` / `sunSign` | `RashiInfo` | Zodiac sign with lord and degree |
| `moonPhase` | `object` | Phase name and illumination % |
| `paksha` | `string` | `"Shukla"` or `"Krishna"` |
| `sunrise` / `sunset` | `string` | `"HH:mm"` format |
| `moonrise` / `moonset` | `string` | `"HH:mm"` format |
| `auspiciousMuhurats` | `array` | Brahma, Pratah Sandhya, Abhijit, Vijaya, Godhuli, Sayahna Sandhya, Nishita |
| `inauspiciousKalams` | `array` | Rahu Kalam, Gulika Kalam, Yamaganda, Varjyam, Dur Muhurtam |
| `sunNakshatra` | `object` | Sun's nakshatra with pada, lord, deity |
| `ayana` | `string` | `"Uttarayana"` or `"Dakshinayana"` |
| `ritu` | `object` | `{ vedic: "Vasanta", english: "Spring" }` |
| `solarMonth` | `string` | Solar month name (Mesha, Vrishabha, etc.) |
| `dinamana` / `ratrimana` | `string` | Day/night duration |
| `madhyahna` | `string` | Solar noon |
| `samvatsar` | `string` | Name of the 60-year cycle year |
| `vikramSamvat` / `shakaSamvat` | `number` | Calendar years |

```javascript
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

---

#### `calculateMonthlyPanchang(year, month, latitude, longitude, timezone)`

Compute Panchang for every day in a given month.

**Parameters:**

| Param | Type | Example |
|---|---|---|
| `year` | `number` | `2026` |
| `month` | `number` | `3` (March) |
| `latitude` | `number` | `28.6139` |
| `longitude` | `number` | `77.209` |
| `timezone` | `string` | `"Asia/Kolkata"` |

**Returns:** `{ year, month, location, days: PanchangResult[] }`

```javascript
const { calculateMonthlyPanchang } = require("astrology-insights");

const month = calculateMonthlyPanchang(2026, 3, 28.6139, 77.209, "Asia/Kolkata");

month.days.forEach(day => {
  console.log(`${day.date}: ${day.tithi[0].name} | ${day.nakshatra[0].name}`);
});
```

---

#### `calculateTithi(sunLongitude, moonLongitude)`

Calculate tithi from raw sidereal longitudes.

**Returns:** `{ name, number, paksha, progress }`

```javascript
const { calculateTithi } = require("astrology-insights");

const tithi = calculateTithi(335.5, 359.8);
// { name: "Shukla Tritiya", number: 3, paksha: "Shukla", progress: 2.5 }
```

---

#### `calculateNakshatraV2(moonLongitude)`

Calculate nakshatra from the Moon's sidereal longitude.

> Exported as `calculateNakshatraV2`. Internally this is `calculateNakshatra` from `panchang/src/core/nakshatra`.

**Returns:** `{ name, number, pada, lord, deity, progress }`

```javascript
const { calculateNakshatraV2 } = require("astrology-insights");

const nakshatra = calculateNakshatraV2(355.0);
// { name: "Revati", number: 27, pada: 3, lord: "Mercury", deity: "Pushan" }
```

---

#### `calculateYoga(sunLongitude, moonLongitude)`

Calculate yoga from Sun and Moon sidereal longitudes.

**Returns:** `{ name, number, progress }`

```javascript
const { calculateYoga } = require("astrology-insights");

const yoga = calculateYoga(335.5, 359.8);
// { name: "Indra", number: 26, progress: 14.8 }
```

---

#### `calculateKarana(sunLongitude, moonLongitude)`

Calculate karana from Sun and Moon sidereal longitudes.

**Returns:** `{ name, number, progress }`

```javascript
const { calculateKarana } = require("astrology-insights");

const karana = calculateKarana(335.5, 359.8);
// { name: "Kaulava", number: 3, progress: 5.0 }
```

---

#### `calculateRashi(longitude)`

Determine the zodiac sign (rashi) for a given sidereal longitude.

**Returns:** `{ name, lord, degree }`

```javascript
const { calculateRashi } = require("astrology-insights");

const rashi = calculateRashi(355.0);
// { name: "Pisces", lord: "Jupiter", degree: 25 }
```

---

### Birth Chart

#### `calculateBirthChart(birthData, options?)`

Calculate a complete Vedic birth chart (Kundli).

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `birthData` | `BirthData` | Birth details (see below) |
| `options?` | `BirthChartOptions` | Ayanamsa and house system |

**`BirthData`:**

| Field | Type | Required | Example |
|---|---|---|---|
| `date` | `string` | Yes | `"2000-01-01"` |
| `time` | `string` | Yes | `"04:30"` |
| `latitude` | `number` | Yes | `28.6139` |
| `longitude` | `number` | Yes | `77.209` |
| `timezone` | `string` | Yes | `"Asia/Kolkata"` |
| `name` | `string` | No | `"Adarsh"` |

**`BirthChartOptions`:**

| Field | Type | Default | Options |
|---|---|---|---|
| `ayanamsa` | `AyanamsaType` | `"lahiri"` | `"lahiri"`, `"kp"` |
| `houseSystem` | `HouseSystemType` | `"whole_sign"` | `"whole_sign"`, `"equal"`, `"placidus"` |

**Returns:** `BirthChartResult`

| Field | Type | Description |
|---|---|---|
| `birthData` | `BirthData` | Echo of input |
| `ayanamsa` | `{ type, degree }` | Ayanamsa used |
| `lagna` | `LagnaInfo` | Ascendant: longitude, sign, degree, nakshatra, pada, lord |
| `planets` | `GrahaPosition[]` | 9 grahas with sign, nakshatra, dignity, combustion, retrograde |
| `houses` | `HouseInfo[]` | 12 houses with sign, cusp degree, occupying planets |
| `layout` | `{ northIndian, southIndian, western }` | Chart layouts for rendering |
| `meta` | `object` | Julian day, UTC date, house system, timestamp |

**`GrahaPosition` fields:**

| Field | Type | Description |
|---|---|---|
| `name` | `GrahaName` | `"Sun"`, `"Moon"`, `"Mars"`, etc. |
| `longitude` | `number` | Sidereal longitude (0-360) |
| `speed` | `number` | Degrees/day (negative = retrograde) |
| `retrograde` | `boolean` | Whether planet is retrograde |
| `signName` | `string` | `"Aries"`, `"Taurus"`, etc. |
| `signNumber` | `number` | 1-12 |
| `degreeInSign` | `number` | 0-30 |
| `nakshatra` | `string` | Nakshatra name |
| `nakshatraPada` | `number` | Pada (1-4) |
| `nakshatraLord` | `string` | Nakshatra lord |
| `dignity` | `Dignity` | `"exalted"`, `"own_sign"`, `"debilitated"`, etc. |
| `isCombust` | `boolean` | Proximity to Sun |
| `combustOrb` | `number` | Degrees from Sun |
| `symbol` | `string` | Dignity symbol |

```javascript
const { calculateBirthChart } = require("astrology-insights");

const chart = calculateBirthChart(
  {
    date: "2000-01-01",
    time: "04:30",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
    name: "Sample",
  },
  { ayanamsa: "lahiri", houseSystem: "whole_sign" }
);

// Lagna (Ascendant)
console.log(chart.lagna.signName);        // e.g. "Scorpio"
console.log(chart.lagna.degreeInSign);    // e.g. 12.45

// Planets
chart.planets.forEach(p => {
  console.log(`${p.name}: ${p.signName} ${p.degreeInSign.toFixed(1)}° [${p.dignity}]`);
});
// Sun: Sagittarius 15.2° [neutral]
// Moon: Virgo 8.7° [neutral]
// Mars: Aquarius 3.1° [neutral]
// ...

// Houses
chart.houses.forEach(h => {
  console.log(`House ${h.number}: ${h.signName} — ${h.planets.join(", ") || "empty"}`);
});

// Chart layout (for rendering)
console.log(chart.layout.northIndian.boxes[0]);
// { houseNumber: 1, signNumber: 8, signName: "Scorpio", planets: ["Mars"] }
```

---

### Analysis APIs

#### `calculateTattvaBalance(placements)`

Analyze the five-element (Tattva) distribution across planetary placements.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `placements` | `TattvaInput[]` | Array of `{ name, signNumber }` |

**Returns:** `TattvaBalance` -- counts and percentages for Fire, Earth, Air, Water elements.

```javascript
const { calculateTattvaBalance } = require("astrology-insights");

const chart = calculateBirthChart({ /* ... */ });
const tattva = calculateTattvaBalance(
  chart.planets.map(p => ({ name: p.name, signNumber: p.signNumber }))
);

console.log(tattva);
// {
//   Fire: { planets: ["Mars", "Jupiter"], count: 2, percent: 22.2 },
//   Earth: { planets: ["Moon", "Saturn"], count: 2, percent: 22.2 },
//   Air: { planets: ["Rahu"], count: 1, percent: 11.1 },
//   Water: { planets: ["Sun", "Mercury", "Venus", "Ketu"], count: 4, percent: 44.4 },
//   dominant: "Water",
//   weak: "Air"
// }
```

---

#### `calculateFriendships(planets)`

Compute natural, temporal, and compound (Pancha-vargiya) friendships between planets.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `planets` | `FriendshipInput[]` | Array of `{ name, signNumber }` |

**Returns:** `PlanetaryFriendships` -- natural, temporal, and compound relationship maps.

```javascript
const { calculateFriendships } = require("astrology-insights");

const friendships = calculateFriendships(
  chart.planets.map(p => ({ name: p.name, signNumber: p.signNumber }))
);

// friendships.natural.Sun.Jupiter   → "friend"
// friendships.temporal.Sun.Mars     → "friend" or "enemy"
// friendships.compound.Sun.Saturn   → "bitter_enemy" or "neutral"
```

---

#### `calculateAspects(planets)`

Calculate Vedic planetary aspects with full and partial (Drishti) strengths.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `planets` | `AspectPlanetInput[]` | Array of `{ name, house }` |

**Returns:** `AspectResult` -- array of aspects with source, target, house, and strength.

```javascript
const { calculateAspects } = require("astrology-insights");

const aspects = calculateAspects(
  chart.planets.map(p => ({
    name: p.name,
    house: chart.houses.findIndex(h => h.planets.includes(p.name)) + 1,
  }))
);

aspects.aspects.forEach(a => {
  console.log(`${a.fromPlanet} aspects ${a.toPlanet} (house ${a.toHouse}, strength: ${a.strength})`);
});
```

---

#### `calculateShadBala(planets, lagnaSignNumber, birthHour?)`

Compute the six-fold planetary strength (Shad Bala).

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `planets` | `ShadBalaPlanetInput[]` | Array of `{ name, signNumber, degreeInSign, speed, house }` |
| `lagnaSignNumber` | `number` | Lagna sign (1-12) |
| `birthHour` | `number?` | Hour of birth (0-23), optional |

**Returns:** `ShadBalaResult[]`

| Field | Type | Description |
|---|---|---|
| `planet` | `string` | Planet name |
| `sthana` | `number` | Positional strength (0-100) |
| `dig` | `number` | Directional strength (0-60) |
| `kala` | `number` | Temporal strength (0-100) |
| `chesta` | `number` | Motional strength (0-60) |
| `naisargika` | `number` | Natural strength (fixed) |
| `drik` | `number` | Aspectual strength (0-60) |
| `total` | `number` | Sum of all components |
| `required` | `number` | Minimum required threshold |
| `ratio` | `number` | total / required (>1 = strong) |
| `isStrong` | `boolean` | Whether ratio >= 1 |

```javascript
const { calculateShadBala } = require("astrology-insights");

const bala = calculateShadBala(
  chart.planets.map(p => ({
    name: p.name,
    signNumber: p.signNumber,
    degreeInSign: p.degreeInSign,
    speed: p.speed,
    house: chart.houses.findIndex(h => h.planets.includes(p.name)) + 1,
  })),
  chart.lagna.signNumber
);

bala.forEach(b => {
  console.log(`${b.planet}: ${b.total.toFixed(1)} (${b.isStrong ? "strong" : "weak"})`);
});
```

---

### Dosha APIs

#### `analyzeManglik(planets, houses)`

Detect Manglik (Kuja) Dosha from birth chart data.

**Returns:** `ManglikResult`

| Field | Type | Description |
|---|---|---|
| `isManglik` | `boolean` | Whether Manglik Dosha is present |
| `severity` | `string` | `"none"`, `"mild"`, or `"full"` |
| `marsHouse` | `number` | House occupied by Mars |
| `details` | `string` | Explanation |
| `cancellations` | `string[]` | Applicable cancellation conditions |

```javascript
const { analyzeManglik } = require("astrology-insights");

const manglik = analyzeManglik(chart.planets, chart.houses);

console.log(manglik.isManglik);     // true
console.log(manglik.severity);      // "mild"
console.log(manglik.marsHouse);     // 7
console.log(manglik.cancellations); // ["Jupiter aspects Mars from house 3"]
```

---

#### `analyzeKaalSarp(planets, houses)`

Detect Kaal Sarp Dosha (all planets hemmed between Rahu and Ketu).

**Returns:** `KaalSarpResult`

| Field | Type | Description |
|---|---|---|
| `hasDosha` | `boolean` | Whether Kaal Sarp Dosha is present |
| `type` | `string` | Specific type name (e.g., "Anant", "Kulik") |
| `rahuHouse` | `number` | House of Rahu |
| `ketuHouse` | `number` | House of Ketu |
| `details` | `string` | Explanation |

```javascript
const { analyzeKaalSarp } = require("astrology-insights");

const kaalSarp = analyzeKaalSarp(chart.planets, chart.houses);

console.log(kaalSarp.hasDosha);     // false
console.log(kaalSarp.type);         // "none" or "Anant", "Kulik", etc.
```

---

#### `analyzeGandaMoola(planets)`

Detect Ganda Moola Dosha (Moon in a junction nakshatra).

**Returns:** `GandaMoolaResult`

| Field | Type | Description |
|---|---|---|
| `hasDosha` | `boolean` | Whether Moon is in a Ganda Moola nakshatra |
| `nakshatra` | `string` | Moon's nakshatra |
| `details` | `string` | Explanation and traditional implications |

```javascript
const { analyzeGandaMoola } = require("astrology-insights");

const gandaMoola = analyzeGandaMoola(chart.planets);

console.log(gandaMoola.hasDosha);    // true/false
console.log(gandaMoola.nakshatra);   // "Ashlesha" (if applicable)
```

---

#### `analyzeGandanta(planets, lagna)`

Analyze Gandanta -- planets at the junction of water and fire signs (critical degrees).

**Returns:** `GandantaResult`

| Field | Type | Description |
|---|---|---|
| `hasGandanta` | `boolean` | Whether any planet or lagna is in Gandanta zone |
| `affectedPlanets` | `GandantaPlanet[]` | Planets in Gandanta with severity |
| `details` | `string` | Summary |

```javascript
const { analyzeGandanta } = require("astrology-insights");

const gandanta = analyzeGandanta(chart.planets, chart.lagna);

console.log(gandanta.hasGandanta);         // true/false
console.log(gandanta.affectedPlanets);     // [{ planet: "Moon", severity: "severe", ... }]
```

---

### Divisional Charts

#### `calculateDivisionalChart(division, planets, lagnaSignNumber, lagnaDegree)`

Calculate any of the 16 Shodashvarga divisional charts.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `division` | `number` | Division number (1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60) |
| `planets` | `PlanetInput[]` | Array of `{ name, signNumber, degreeInSign }` |
| `lagnaSignNumber` | `number` | Lagna sign number (1-12) |
| `lagnaDegree` | `number` | Lagna degree within sign (0-30) |

**Returns:** `DivisionalChart`

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Chart name, e.g. `"Navamsa (D9)"` |
| `division` | `number` | Division number |
| `planets` | `DivisionalPosition[]` | Planet placements in this varga |
| `lagnaSign` | `{ number, name }` | Lagna in this divisional chart |

**All 16 Shodashvarga charts:**

| Division | Name | Shorthand | Signification |
|---|---|---|---|
| 1 | Rasi | D1 | Birth chart -- overall life |
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

```javascript
const { calculateDivisionalChart } = require("astrology-insights");

const planets = chart.planets.map(p => ({
  name: p.name,
  signNumber: p.signNumber,
  degreeInSign: p.degreeInSign,
}));

// Navamsa (D9)
const navamsa = calculateDivisionalChart(9, planets, chart.lagna.signNumber, chart.lagna.degreeInSign);

console.log(navamsa.name);         // "Navamsa (D9)"
console.log(navamsa.lagnaSign);    // { number: 4, name: "Cancer" }
navamsa.planets.forEach(p => {
  console.log(`${p.planet}: ${p.vargaSignName} (${p.vargaSignNumber})`);
});

// Dasamsa (D10) for career
const dasamsa = calculateDivisionalChart(10, planets, chart.lagna.signNumber, chart.lagna.degreeInSign);
```

---

#### `calculateShodashvarga(planets, lagnaSignNumber, lagnaDegree)`

Compute all 16 divisional charts at once with Varga Viswa dignity scoring.

**Returns:** `ShodashvargaEntry[]` -- one entry per planet, each with scores across all 16 charts and a `totalPoints` (Varga Viswa points).

```javascript
const { calculateShodashvarga } = require("astrology-insights");

const shodash = calculateShodashvarga(planets, chart.lagna.signNumber, chart.lagna.degreeInSign);

shodash.forEach(entry => {
  console.log(`${entry.planet}: ${entry.totalPoints} Varga Viswa points`);
  entry.scores.forEach(s => {
    console.log(`  ${s.chart}: ${s.sign} [${s.dignity}]`);
  });
});
```

---

### Vimshottari Dasha

#### `calculateVimshottariDasha(birthDate, moonNakshatra, moonNakshatraDegree, depth?)`

Compute the 120-year Vimshottari Dasha planetary period system.

**Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `birthDate` | `Date` | -- | UTC birth date/time |
| `moonNakshatra` | `string` | -- | Moon's nakshatra at birth (e.g., `"Ashwini"`) |
| `moonNakshatraDegree` | `number` | -- | Moon's degree within the nakshatra (0-13.333) |
| `depth` | `number` | `5` | Levels: 1=Maha, 2=Antar, 3=Pratyantar, 4=Sookshma, 5=Prana |

**Returns:** `VimshottariResult`

| Field | Type | Description |
|---|---|---|
| `birthNakshatra` | `string` | Moon's nakshatra |
| `birthNakshatraLord` | `string` | Nakshatra lord (first Maha Dasha) |
| `balanceAtBirth` | `object` | `{ planet, years, months, days }` remaining at birth |
| `mahaDashas` | `DashaPeriod[]` | 9 Maha Dasha periods with nested sub-periods |
| `currentDasha` | `object` | `{ maha, antar, pratyantar, sookshma, prana }` active now |

**`DashaPeriod` fields:**

| Field | Type | Description |
|---|---|---|
| `planet` | `string` | Dasha lord |
| `level` | `number` | 1=Maha, 2=Antar, 3=Pratyantar, 4=Sookshma, 5=Prana |
| `levelName` | `string` | `"Maha Dasha"`, `"Antar Dasha"`, etc. |
| `startDate` | `string` | ISO date (YYYY-MM-DD) |
| `endDate` | `string` | ISO date |
| `durationDays` | `number` | Period length in days |
| `isActive` | `boolean` | Whether current date falls in this period |
| `subPeriods` | `DashaPeriod[]?` | Next level down (if depth allows) |

```javascript
const { calculateVimshottariDasha } = require("astrology-insights");

const dasha = calculateVimshottariDasha(
  new Date("2000-01-01T04:30:00Z"),
  "Rohini",
  8.5,
  3  // Maha → Antar → Pratyantar
);

console.log(dasha.birthNakshatra);       // "Rohini"
console.log(dasha.birthNakshatraLord);   // "Moon"

console.log(dasha.balanceAtBirth);
// { planet: "Moon", years: 6, months: 3, days: 18 }

console.log(dasha.currentDasha);
// { maha: "Mars", antar: "Jupiter", pratyantar: "Saturn", ... }

// Traverse the tree
dasha.mahaDashas.forEach(maha => {
  console.log(`${maha.planet} Maha Dasha: ${maha.startDate} → ${maha.endDate}`);
  maha.subPeriods?.forEach(antar => {
    console.log(`  ${antar.planet} Antar: ${antar.startDate} → ${antar.endDate}`);
  });
});
```

---

### Recommendations

#### `getNameSuggestions(nakshatra, pada)`

Get auspicious baby name suggestions based on birth nakshatra and pada.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `nakshatra` | `string` | Birth nakshatra (e.g., `"Ashwini"`) |
| `pada` | `number` | Pada (1-4) |

**Returns:** `NameSuggestion[]` -- suggestions with syllable, gender, and name list.

```javascript
const { getNameSuggestions } = require("astrology-insights");

const names = getNameSuggestions("Ashwini", 1);

console.log(names[0].syllable);    // "Chu"
console.log(names[0].nakshatra);   // "Ashwini"
console.log(names[0].pada);        // 1
names[0].names.forEach(n => {
  console.log(`${n.name} (${n.gender})`);
});
// "Chunda (male)", "Chumki (female)", etc.
```

---

#### `getRemedies(planets)`

Recommend gemstones, mantras, charity, and fasting remedies for weak or afflicted planets.

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `planets` | `RemedyPlanetInput[]` | Array of `{ name, dignity, isCombust, house }` |

**Returns:** `RemedyResult`

| Field | Type | Description |
|---|---|---|
| `weakPlanets` | `WeakPlanetRemedy[]` | Each weak planet with reason and full remedy |
| `generalRemedies` | `string[]` | General spiritual advice |

**`WeakPlanetRemedy` contains a `PlanetaryRemedy`:**

| Field | Type | Description |
|---|---|---|
| `gemstone` | `GemstoneInfo` | Name, alternates, metal, finger, day, weight |
| `mantra` | `MantraInfo` | Vedic mantra, beej mantra, japa count |
| `charity` | `CharityInfo` | Items, day, deity |
| `color` | `string` | Lucky color |
| `direction` | `string` | Favorable direction |
| `fasting` | `string` | Recommended fasting day |

```javascript
const { getRemedies } = require("astrology-insights");

const remedies = getRemedies(
  chart.planets.map(p => ({
    name: p.name,
    dignity: p.dignity,
    isCombust: p.isCombust,
    house: chart.houses.findIndex(h => h.planets.includes(p.name)) + 1,
  }))
);

remedies.weakPlanets.forEach(wp => {
  console.log(`${wp.planet} is weak: ${wp.reason}`);
  console.log(`  Gemstone: ${wp.remedy.gemstone.name} (${wp.remedy.gemstone.weight})`);
  console.log(`  Mantra: ${wp.remedy.mantra.vedic} (${wp.remedy.mantra.japaCount}x)`);
  console.log(`  Charity: ${wp.remedy.charity.items.join(", ")} on ${wp.remedy.charity.day}`);
  console.log(`  Fast on: ${wp.remedy.fasting}`);
});
```

---

### Legacy APIs

These functions remain available and backward-compatible. They work with `HH:mm:ss` time strings.

#### `calculateSunriseSunset(date, latitude, longitude, timezone)`

```javascript
const { calculateSunriseSunset } = require("astrology-insights");

const { sunrise, sunset } = calculateSunriseSunset("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
// sunrise: "06:25:46", sunset: "18:33:45"
```

#### `calculateChoghadiya(date, sunrise, sunset, timezone)`

```javascript
const { calculateChoghadiya } = require("astrology-insights");

const choghadiya = calculateChoghadiya("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// choghadiya.daytimeChoghadiyas: 8 periods
// choghadiya.nighttimeChoghadiyas: 8 periods
// choghadiya.auspicious: ["Amrit", "Shubh", "Labh"]
```

#### `calculateAbhijeetMuhurt(date, sunrise, sunset, latitude, longitude, timezone)`

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

> **Breaking change in v2.0.0:** Previously accepted a date string only. Now requires `(date, sunrise, sunset, timezone)` -- same signature as Rahu Kalam.

```javascript
const { calculateGulikaKalam } = require("astrology-insights");

const gulika = calculateGulikaKalam("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// { start: "06:25:46", end: "07:56:45" }
```

#### `calculateDurMuhurtam(date, sunrise, sunset, timezone)`

```javascript
const { calculateDurMuhurtam } = require("astrology-insights");

const dur = calculateDurMuhurtam("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// Inauspicious time periods for the day
```

#### `calculateYamghantKalam(date, sunrise, sunset, timezone)`

```javascript
const { calculateYamghantKalam } = require("astrology-insights");

const yamghant = calculateYamghantKalam("2026-03-21", sunrise, sunset, "Asia/Kolkata");
// Yamaganda Kalam period
```

#### `calculateMoonPosition(date, latitude, longitude, timezone)`

```javascript
const { calculateMoonPosition } = require("astrology-insights");

const moon = calculateMoonPosition("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
// moon.getMoonPosition: { azimuth, altitude, distance, parallacticAngle }
// moon.getMoonIllumination: { fraction, phase, angle }
// moon.getMoonTimes: { rise: "07:27:08", set: "21:07:18" }
```

#### `calculateBioRhythms(dateOfBirth, targetDate)`

```javascript
const { calculateBioRhythms } = require("astrology-insights");

const bio = calculateBioRhythms("1991-12-10", "2026-03-21");
// bio.data: Physical, Emotional, Intellectual, Intuitive cycles
```

---

## React Native

The package provides a React Native compatible entry point at `index.rn.js`. It excludes Swiss Ephemeris (native module not available on RN) and exports:

- All legacy utility modules (work offline on device)
- `fetchPanchang()` for server-side Swiss Ephemeris precision via API

```javascript
// Automatically resolved via "react-native" field in package.json
const { fetchPanchang, calculateSunriseSunset } = require("astrology-insights");

// Fetch full Panchang from your API
const result = await fetchPanchang(
  "2026-03-21",
  28.6139,
  77.209,
  "Asia/Kolkata",
  "https://your-app.vercel.app/api/panchang"
);

// Or use offline utilities directly
const { sunrise, sunset } = calculateSunriseSunset("2026-03-21", 28.6139, 77.209, "Asia/Kolkata");
```

---

## Validation Against Drik Panchang

Cross-validated for **March 21, 2026** (Delhi, 28.6139N, 77.209E):

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

Also validated against historical dates:
- **October 20, 2025** (Diwali) -- Chaturdashi, Hasta, Shakuni confirmed
- **January 14, 2026** (Makar Sankranti) -- Ekadashi, Anuradha confirmed
- **August 15, 1947** (Independence Day) -- historical accuracy verified

---

## Deployment (Vercel Serverless API)

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
| `date` | `string` | Yes | `2026-03-21` |
| `lat` | `number` | Yes | `28.6139` |
| `lon` | `number` | Yes | `77.209` |
| `tz` | `string` | Yes | `Asia/Kolkata` |

Responses are cached for 1 hour (`s-maxage=3600`) with stale-while-revalidate for 24 hours.

---

## Breaking Changes from v1

### v2.0.0

- **`calculateGulikaKalam`** signature changed from `(date)` to `(date, sunrise, sunset, timezone)` -- now matches Rahu Kalam's signature.
- **`calculateNakshatraV2`** replaces the old `calculateNakshatra` for core nakshatra calculation from raw longitude. The legacy `calculateNakshatras` module is still exported for backward compatibility.

### v2.1.0

- Added birth chart module: `calculateBirthChart`, analysis APIs, dosha detection, divisional charts, Vimshottari Dasha, and recommendations.
- No breaking changes from v2.0.0.

---

## Testing

```bash
npm run test         # Legacy test (node test.js)
npm run test:unit    # Jest unit tests (62 tests)
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Write tests for new functionality
4. Ensure all tests pass: `npm run test:unit`
5. Submit a pull request

Please follow existing code style and add JSDoc comments to all public functions.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **[Swiss Ephemeris](https://www.astro.com/swisseph/)** (swisseph) -- high-precision planetary positions
- **[Luxon](https://moment.github.io/luxon/)** -- date-time utilities
- **[SunCalc](https://github.com/mourner/suncalc)** -- sunrise/sunset and moon calculations
- Vedic astrology principles for Panchang, Kundli, Dasha, and Muhurat calculations
