// Jest manual mock for swisseph native module
// Used when the native binary is not built (CI, development without build step)
module.exports = {
  swe_set_ephe_path: () => {},
  swe_calc_ut: (_jd, _planet, _flags, cb) => {
    if (typeof cb === 'function') cb({ longitude: 0, latitude: 0, distance: 1 });
    return { longitude: 0, latitude: 0, distance: 1 };
  },
  swe_get_ayanamsa_ut: (_jd, cb) => {
    if (typeof cb === 'function') cb(24.17);
    return 24.17;
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
  SE_CALC_RISE: 1,
  SE_CALC_SET: 2,
  SE_BIT_DISC_CENTER: 256,
};
