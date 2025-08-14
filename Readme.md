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

## Testing

You can run the test suite to view sample outputs for all features (including Panchang calculations):

```bash
npm run test
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
