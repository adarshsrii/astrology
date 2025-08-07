---

# Astrology Insights for JavaScript 🌌

A comprehensive toolkit for astrology calculations and utilities, built for JavaScript developers. This package provides functions for biorhythms, zodiac sign determination, compatibility checks, and other astrology-related computations. 
**Astrology Insights** is a Node.js library designed to calculate important astrological and astronomical events, such as sunrise, sunset, Abhijit Muhurat, Choghadiya, and more. This library is perfect for those who want to integrate astrological insights into their applications.

## Features ✨

- **Biorhythm Calculations**: Analyze physical, emotional, intellectual, and intuitive cycles.

- **Sunrise and Sunset Calculator**  
  Calculate accurate sunrise and sunset times for any given date, latitude, longitude, and timezone.
  
- **Abhijit Muhurat**  
  Calculate the most auspicious Abhijit Muhurat during the day, based on the middle segment of the day.

- **Day and Night Choghadiya**  
  Determine the start and end times of each Choghadiya (day and night) based on Vedic astrology principles.

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

## License 📜

This project is licensed under the MIT License.

## Contribute 🤝

Feel free to contribute to the project! Open an issue or submit a pull request to improve the functionality.

---

## Contributions 🤝

We welcome contributions! Feel free to submit issues or pull requests to improve this toolkit. To get started:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add a new feature"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License 📜

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments 🙌

- **Luxon** for date-time calculations.
- Inspired by the works of **Wilhelm Fliess** for biorhythm theory.

For any questions or feature requests, feel free to [open an issue](https://github.com/your-repo/issues) or contact me at adarsh@synchsoft.com.

Happy coding and stargazing! 🌠
