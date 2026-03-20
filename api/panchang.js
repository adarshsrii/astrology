/**
 * Vercel Serverless Function — Full Panchang API
 *
 * Endpoint: GET /api/panchang?date=2026-03-20&lat=28.6139&lon=77.209&tz=Asia/Kolkata
 *
 * Returns: PanchangResult JSON (Swiss Ephemeris precision)
 *
 * Deploy: Push to Vercel with the astrology-insights package as the root.
 * Vercel auto-detects the api/ directory and deploys as serverless functions.
 */

require('ts-node').register({ transpileOnly: true });
const { calculateFullPanchang } = require('../panchang/src/panchang-v2');

module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { date, lat, lon, tz } = req.query;

  if (!date || !lat || !lon || !tz) {
    return res.status(400).json({
      error: 'Missing required parameters',
      usage: '/api/panchang?date=2026-03-20&lat=28.6139&lon=77.209&tz=Asia/Kolkata',
      params: {
        date: 'YYYY-MM-DD (required)',
        lat: 'Latitude in degrees (required)',
        lon: 'Longitude in degrees (required)',
        tz: 'IANA timezone string (required)',
      },
    });
  }

  try {
    const result = calculateFullPanchang(
      date,
      parseFloat(lat),
      parseFloat(lon),
      decodeURIComponent(tz),
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: 'Panchang calculation failed',
      message: error.message,
    });
  }
};
