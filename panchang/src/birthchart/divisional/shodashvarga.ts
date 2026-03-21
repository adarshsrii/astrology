/**
 * Shodashvarga Summary Table
 * Shows each planet's dignity across all 16 divisional charts
 * and computes Varga Viswa points.
 */

import { GrahaName } from '../types';
import {
  EXALTATION_TABLE,
  DEBILITATION_TABLE,
  OWN_SIGNS,
  MOOLATRIKONA_TABLE,
  SIGN_NAMES,
} from '../core/constants';
import { SHODASHVARGA_CHARTS } from './charts';
import { calculateDivisionalChart, PlanetInput } from './calculator';

// ── Types ───────────────────────────────────────────────────────────────────

export interface ShodashvargaChartScore {
  chart: string;       // "D1", "D9", etc.
  sign: string;        // Sign name in this varga
  signNumber: number;  // Sign number in this varga
  dignity: string;     // "own_sign", "exalted", etc.
}

export interface ShodashvargaEntry {
  planet: string;
  scores: ShodashvargaChartScore[];
  totalPoints: number;  // Varga Viswa points
}

// ── Dignity detection for varga charts ──────────────────────────────────────

/**
 * Determine a planet's dignity in a given sign (simplified for varga scoring).
 * Returns: 'exalted' | 'moolatrikona' | 'own_sign' | 'friendly' | 'neutral' | 'enemy' | 'debilitated'
 */
function getVargaDignity(planet: string, signNumber: number): string {
  const grahaName = planet as GrahaName;

  // Check exaltation (just sign match, ignoring exact degree for vargas)
  const exalt = EXALTATION_TABLE[grahaName];
  if (exalt && exalt.sign === signNumber) {
    return 'exalted';
  }

  // Check debilitation
  const debi = DEBILITATION_TABLE[grahaName];
  if (debi && debi.sign === signNumber) {
    return 'debilitated';
  }

  // Check moolatrikona (sign match only for vargas)
  const moola = MOOLATRIKONA_TABLE[grahaName];
  if (moola && moola.sign === signNumber) {
    return 'moolatrikona';
  }

  // Check own sign
  const ownSigns = OWN_SIGNS[grahaName];
  if (ownSigns && ownSigns.includes(signNumber)) {
    return 'own_sign';
  }

  // For simplified scoring, everything else is neutral.
  // A full implementation would check natural friendships with the sign lord.
  return 'neutral';
}

// ── Varga Viswa point values ────────────────────────────────────────────────

const DIGNITY_POINTS: Record<string, number> = {
  exalted:      20,
  moolatrikona: 15,
  own_sign:     20,
  friendly:     10,
  neutral:      5,
  enemy:        2,
  debilitated:  0,
};

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Calculate the Shodashvarga summary for all planets.
 * Returns each planet's sign and dignity in all 16 charts plus total Varga Viswa points.
 */
export function calculateShodashvarga(
  planets: PlanetInput[],
  lagnaSignNumber: number,
  lagnaDegree: number,
): ShodashvargaEntry[] {
  // Pre-compute all 16 divisional charts
  const charts = SHODASHVARGA_CHARTS.map(chartDef =>
    calculateDivisionalChart(chartDef.division, planets, lagnaSignNumber, lagnaDegree),
  );

  // Build per-planet summaries
  return planets.map(planet => {
    const scores: ShodashvargaChartScore[] = [];
    let totalPoints = 0;

    charts.forEach((chart, idx) => {
      const chartDef = SHODASHVARGA_CHARTS[idx];
      const pos = chart.planets.find(p => p.planet === planet.name);

      if (pos) {
        const dignity = getVargaDignity(planet.name, pos.vargaSignNumber);
        const points = DIGNITY_POINTS[dignity] ?? 5;
        totalPoints += points;

        scores.push({
          chart: chartDef.shortName,
          sign: pos.vargaSignName,
          signNumber: pos.vargaSignNumber,
          dignity,
        });
      }
    });

    return {
      planet: planet.name,
      scores,
      totalPoints,
    };
  });
}
