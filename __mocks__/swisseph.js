// Jest manual mock for swisseph native module
// Used when the native binary is not built (CI, development without build step)
module.exports = {
  swe_set_ephe_path: () => {},
  swe_set_sid_mode: () => {},
  swe_calc_ut: (_jd, _planet, _flags, cb) => {
    if (typeof cb === 'function') cb({ longitude: 0, latitude: 0, distance: 1, longitudeSpeed: 0 });
    return { longitude: 0, latitude: 0, distance: 1, longitudeSpeed: 0 };
  },
  swe_get_ayanamsa_ut: (_jd, cb) => {
    if (typeof cb === 'function') cb(24.17);
    return 24.17;
  },
  swe_julday: (year, month, day, hour, _cal) => {
    // Simplified Julian Day calculation
    let y = year;
    let m = month;
    if (m <= 2) { y -= 1; m += 12; }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + hour / 24 + b - 1524.5;
  },
  swe_revjul: (jd, _cal) => {
    const d = new Date((jd - 2440587.5) * 86400000);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours() + d.getUTCMinutes() / 60 };
  },
  swe_houses: (_jd, _lat, _lon, _hsys) => {
    // Return mock house data — ascendant at 0° with 30° equal houses
    const house = [];
    for (let i = 0; i < 12; i++) house.push(i * 30);
    return { house, ascmc: [0, 270] };
  },
  swe_rise_trans: (_jd, _planet, _star, _flags, _rsmi, _geopos, _atpress, _attemp, cb) => {
    if (typeof cb === 'function') cb({ riseTime: null });
    return { riseTime: null };
  },
  swe_close: () => {},
  // Constants
  SEFLG_SWIEPH: 2,
  SEFLG_SPEED: 256,
  SE_SUN: 0,
  SE_MOON: 1,
  SE_MERCURY: 2,
  SE_VENUS: 3,
  SE_MARS: 4,
  SE_JUPITER: 5,
  SE_SATURN: 6,
  SE_URANUS: 7,
  SE_NEPTUNE: 8,
  SE_PLUTO: 9,
  SE_MEAN_NODE: 11,
  SE_SIDM_LAHIRI: 1,
  SE_GREG_CAL: 1,
  SE_CALC_RISE: 1,
  SE_CALC_SET: 2,
  SE_BIT_DISC_CENTER: 256,
};
