const SunCalc = require('suncalc');
const { DateTime } = require('luxon');

/**
 * Calculate the current and next 26 Nakshatras based on the Moon's approximate ecliptic longitude.
 * @param {string|Date} date - Starting date/time.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [timezone='UTC'] - IANA timezone for output times.
 * @param {number} [stepMinutes=10] - Sampling interval in minutes.
 * @returns {Array<Object>} Array of 27 Nakshatra objects with start/end times and metadata.
 */
function calculateNakshatras(date, latitude, longitude, timezone = 'UTC', stepMinutes = 10) {
  const start = new Date(date);
  const width = 360 / 27;
  const results = [];
  let currentDate = start;
  // compute initial index
  const degFromAz = az => ((az * 180 / Math.PI + 360) % 360);
  let az = SunCalc.getMoonPosition(currentDate, latitude, longitude).azimuth;
  let currentIndex = Math.floor(degFromAz(az) / width);

  while (results.length < 27) {
    const info = nakshatraInfo[currentIndex];
    const segStart = currentDate;
    let segEnd = new Date(currentDate);
    let idx = currentIndex;
    // advance until index changes
    while (idx === currentIndex) {
      segEnd = new Date(segEnd.getTime() + stepMinutes * 60000);
      const az2 = SunCalc.getMoonPosition(segEnd, latitude, longitude).azimuth;
      idx = Math.floor(degFromAz(az2) / width);
    }
    results.push({
      name: info.name,
      planet: info.planet,
      deity: info.deity,
      motivation: info.motivation,
      description: info.description,
      start: DateTime.fromJSDate(segStart).setZone(timezone).toISO(),
      end: DateTime.fromJSDate(segEnd).setZone(timezone).toISO(),
    });
    currentDate = segEnd;
    currentIndex = idx;
  }
  return results;
}

// Nakshatra metadata
const nakshatraInfo = [
  { name: 'Ashwini', planet: 'Ketu', deity: 'Ashwini Kumars', motivation: 'Dharma', description: 'Ashwini Ketu It is believed that this Nakshatra is ruled by the deity Ashwini brothers.' },
  { name: 'Bharani', planet: 'Venus', deity: 'Yama', motivation: 'Artha', description: 'Bharani Venus It is believed that this Nakshatra is ruled by the deity Yama, the god of death and dharma.' },
  { name: 'Krittika', planet: 'Sun', deity: 'Agni', motivation: 'Kama', description: 'Krittika Sun It is believed that this Nakshatra is ruled by the deity Agni, the god of fire.' },
  { name: 'Rohini', planet: 'Moon', deity: 'Prajapati', motivation: 'Artha', description: 'Rohini Moon It is believed that this Nakshatra is ruled by the deity Prajapati (Brahma), the creator.' },
  { name: 'Mrigashira', planet: 'Mars', deity: 'Soma', motivation: 'Moksha', description: 'Mrigashira Mars It is believed that this Nakshatra is ruled by the deity Soma, the Moon god.' },
  { name: 'Ardra', planet: 'Rahu', deity: 'Rudra', motivation: 'Kama', description: 'Ardra Rahu It is believed that this Nakshatra is ruled by the deity Rudra, the storm god.' },
  { name: 'Punarvasu', planet: 'Jupiter', deity: 'Aditi', motivation: 'Dharma', description: 'Punarvasu Jupiter It is believed that this Nakshatra is ruled by the deity Aditi, mother of gods.' },
  { name: 'Pushya', planet: 'Saturn', deity: 'Brihaspati', motivation: 'Dharma', description: 'Pushya Saturn It is believed that this Nakshatra is ruled by the deity Brihaspati, guru of the gods.' },
  { name: 'Ashlesha', planet: 'Mercury', deity: 'Nagas', motivation: 'Moksha', description: 'Ashlesha Mercury It is believed that this Nakshatra is ruled by the deity Nagas, serpent beings.' },
  { name: 'Magha', planet: 'Ketu', deity: 'Pitris', motivation: 'Artha', description: 'Magha Ketu It is believed that this Nakshatra is ruled by the Pitris, the ancestral fathers.' },
  { name: 'Purva Phalguni', planet: 'Venus', deity: 'Bhaga', motivation: 'Kama', description: 'Purva Phalguni Venus It is believed that this Nakshatra is ruled by the deity Bhaga, god of prosperity.' },
  { name: 'Uttara Phalguni', planet: 'Sun', deity: 'Aryaman', motivation: 'Moksha', description: 'Uttara Phalguni Sun It is believed that this Nakshatra is ruled by the deity Aryaman, god of contracts.' },
  { name: 'Hasta', planet: 'Moon', deity: 'Savitar', motivation: 'Dharma', description: 'Hasta Moon It is believed that this Nakshatra is ruled by the deity Savitar, the sun god of skill.' },
  { name: 'Chitra', planet: 'Mars', deity: 'Vishvakarma', motivation: 'Kama', description: 'Chitra Mars It is believed that this Nakshatra is ruled by the deity Vishvakarma, the divine architect.' },
  { name: 'Swati', planet: 'Rahu', deity: 'Vayu', motivation: 'Artha', description: 'Swati Rahu It is believed that this Nakshatra is ruled by the deity Vayu, the wind god.' },
  { name: 'Vishakha', planet: 'Jupiter', deity: 'Indra and Agni', motivation: 'Dharma', description: 'Vishakha Jupiter It is believed that this Nakshatra is ruled by the deities Indra and Agni, thunder and fire gods.' },
  { name: 'Anuradha', planet: 'Saturn', deity: 'Mitra', motivation: 'Dharma', description: 'Anuradha Saturn It is believed that this Nakshatra is ruled by the deity Mitra, god of friendship.' },
  { name: 'Jyeshtha', planet: 'Mercury', deity: 'Indra', motivation: 'Artha', description: 'Jyeshtha Mercury It is believed that this Nakshatra is ruled by the deity Indra, king of the gods.' },
  { name: 'Mula', planet: 'Ketu', deity: 'Nirriti', motivation: 'Moksha', description: 'Mula Ketu It is believed that this Nakshatra is ruled by the deity Nirriti, goddess of dissolution.' },
  { name: 'Purva Ashadha', planet: 'Venus', deity: 'Apah (Varuna)', motivation: 'Kama', description: 'Purva Ashadha Venus It is believed that this Nakshatra is ruled by the deity Apah (Varuna), water deity.' },
  { name: 'Uttara Ashadha', planet: 'Sun', deity: 'Vishvadevas', motivation: 'Moksha', description: 'Uttara Ashadha Sun It is believed that this Nakshatra is ruled by the Vishvadevas, the universal gods.' },
  { name: 'Shravana', planet: 'Moon', deity: 'Vishnu', motivation: 'Artha', description: 'Shravana Moon It is believed that this Nakshatra is ruled by the deity Vishnu, the preserver and listener.' },
  { name: 'Dhanishta', planet: 'Mars', deity: 'Ashta Vasus', motivation: 'Kama', description: 'Dhanishta Mars It is believed that this Nakshatra is ruled by the Ashta Vasus, elemental gods.' },
  { name: 'Shatabhisha', planet: 'Rahu', deity: 'Varuna', motivation: 'Moksha', description: 'Shatabhisha Rahu It is believed that this Nakshatra is ruled by the deity Varuna, god of cosmic waters.' },
  { name: 'Purva Bhadrapada', planet: 'Jupiter', deity: 'Aja Ekapada', motivation: 'Artha', description: 'Purva Bhadrapada Jupiter It is believed that this Nakshatra is ruled by the deity Aja Ekapada, the one-footed goat deity.' },
  { name: 'Uttara Bhadrapada', planet: 'Saturn', deity: 'Ahirbudhnya', motivation: 'Moksha', description: 'Uttara Bhadrapada Saturn It is believed that this Nakshatra is ruled by the deity Ahirbudhnya, serpent of the deep.' },
  { name: 'Revati', planet: 'Mercury', deity: 'Pushan', motivation: 'Dharma', description: 'Revati Mercury It is believed that this Nakshatra is ruled by the deity Pushan, protector of journeys.' },
];

module.exports = calculateNakshatras;
