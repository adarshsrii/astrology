/**
 * Integration test for the Birth Chart (Kundli) module.
 * Tests end-to-end calculation against a known fixture.
 *
 * These tests use the real Swiss Ephemeris if available.
 * If swisseph is not loadable, the suite is skipped.
 */

import { calculateBirthChart } from '../panchang/src/birthchart/index';
import type { BirthData, BirthChartResult } from '../panchang/src/birthchart/types';
import * as fixture from './fixtures/birthchart-2000-01-01-delhi.json';

// ── Check if real swisseph is available ──────────────────────────────────────

function canLoadSwisseph(): boolean {
  try {
    const swe = require('swisseph');
    // If we get the mock (longitude always 0), swe_calc_ut exists
    // but try a real calc to see if the native module works
    const result = swe.swe_calc_ut(2451545.0, 0, 2); // J2000 Sun
    return result && typeof result.longitude === 'number' && result.longitude !== 0;
  } catch {
    return false;
  }
}

const HAS_SWISSEPH = canLoadSwisseph();
const describeIfSwisseph = HAS_SWISSEPH ? describe : describe.skip;

// ── Shared test data ─────────────────────────────────────────────────────────

const birthData: BirthData = {
  date: fixture.meta.date,
  time: fixture.meta.time,
  latitude: fixture.meta.latitude,
  longitude: fixture.meta.longitude,
  timezone: fixture.meta.timezone,
};

// ── Tests ────────────────────────────────────────────────────────────────────

describeIfSwisseph('Birth Chart Integration (real swisseph)', () => {
  let chart: BirthChartResult;

  beforeAll(() => {
    chart = calculateBirthChart(birthData, { ayanamsa: 'lahiri', houseSystem: 'whole_sign' });
  });

  test('result has the expected shape', () => {
    expect(chart).toBeDefined();
    expect(chart.birthData).toEqual(birthData);
    expect(chart.lagna).toBeDefined();
    expect(chart.lagna.signName).toBeTruthy();
    expect(chart.lagna.signNumber).toBeGreaterThanOrEqual(1);
    expect(chart.lagna.signNumber).toBeLessThanOrEqual(12);
    expect(chart.planets).toHaveLength(9);
    expect(chart.houses).toHaveLength(12);
    expect(chart.layout.northIndian).toBeDefined();
    expect(chart.layout.southIndian).toBeDefined();
    expect(chart.layout.western).toBeDefined();
    expect(chart.meta.houseSystem).toBe('whole_sign');
    expect(chart.ayanamsa.type).toBe('lahiri');
    expect(chart.ayanamsa.degree).toBeGreaterThan(20);
    expect(chart.ayanamsa.degree).toBeLessThan(30);
  });

  test('lagna sign matches fixture', () => {
    expect(chart.lagna.signName).toBe(fixture.lagna.signName);
    expect(chart.lagna.signNumber).toBe(fixture.lagna.signNumber);
  });

  test('planet signs match fixture', () => {
    const fixtPlanets = fixture.planets as Record<string, any>;
    for (const planet of chart.planets) {
      const expected = fixtPlanets[planet.name];
      if (expected) {
        expect(planet.signName).toBe(expected.signName);
        expect(planet.signNumber).toBe(expected.signNumber);
      }
    }
  });

  test('retrograde status matches fixture', () => {
    const fixtPlanets = fixture.planets as Record<string, any>;
    for (const planet of chart.planets) {
      const expected = fixtPlanets[planet.name];
      if (expected) {
        expect(planet.retrograde).toBe(expected.retrograde);
      }
    }
  });

  test('Mercury is combust in this chart', () => {
    const mercury = chart.planets.find(p => p.name === 'Mercury');
    expect(mercury).toBeDefined();
    expect(mercury!.isCombust).toBe(true);
  });

  test('each planet has valid dignity', () => {
    const validDignities = [
      'peak_exalted', 'exalted', 'moolatrikona', 'own_sign',
      'neutral', 'debilitated', 'peak_debilitated',
    ];
    for (const planet of chart.planets) {
      expect(validDignities).toContain(planet.dignity);
    }
  });

  test('houses are numbered 1-12 with valid sign numbers', () => {
    for (const house of chart.houses) {
      expect(house.number).toBeGreaterThanOrEqual(1);
      expect(house.number).toBeLessThanOrEqual(12);
      expect(house.signNumber).toBeGreaterThanOrEqual(1);
      expect(house.signNumber).toBeLessThanOrEqual(12);
    }
  });

  test('layout boxes contain 12 entries each', () => {
    expect(chart.layout.northIndian.boxes).toHaveLength(12);
    expect(chart.layout.southIndian.boxes).toHaveLength(12);
    expect(chart.layout.western.boxes).toHaveLength(12);
  });
});

// ── Tests that work with the mock (no real swisseph needed) ──────────────────

describe('Birth Chart Structure (mock)', () => {
  test('calculateBirthChart returns a valid result shape', () => {
    const chart = calculateBirthChart(birthData);

    expect(chart).toBeDefined();
    expect(chart.birthData).toEqual(birthData);
    expect(chart.planets).toHaveLength(9);
    expect(chart.houses).toHaveLength(12);
    expect(chart.lagna).toBeDefined();
    expect(chart.layout).toBeDefined();
    expect(chart.meta).toBeDefined();
    expect(chart.ayanamsa).toBeDefined();
    expect(chart.ayanamsa.type).toBe('lahiri');
  });

  test('all 9 grahas are present', () => {
    const chart = calculateBirthChart(birthData);
    const names = chart.planets.map(p => p.name);
    expect(names).toContain('Sun');
    expect(names).toContain('Moon');
    expect(names).toContain('Mars');
    expect(names).toContain('Mercury');
    expect(names).toContain('Jupiter');
    expect(names).toContain('Venus');
    expect(names).toContain('Saturn');
    expect(names).toContain('Rahu');
    expect(names).toContain('Ketu');
  });

  test('Rahu and Ketu are always retrograde', () => {
    const chart = calculateBirthChart(birthData);
    const rahu = chart.planets.find(p => p.name === 'Rahu');
    const ketu = chart.planets.find(p => p.name === 'Ketu');
    expect(rahu!.retrograde).toBe(true);
    expect(ketu!.retrograde).toBe(true);
  });

  test('KP ayanamsa option works', () => {
    const chart = calculateBirthChart(birthData, { ayanamsa: 'kp' });
    expect(chart.ayanamsa.type).toBe('kp');
    expect(chart.ayanamsa.degree).toBeGreaterThan(20);
  });
});
