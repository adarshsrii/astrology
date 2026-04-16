import { Ephemeris } from '../calculations/ephemeris';
import { RASHI_NAMES } from './constants';
import { SadeSatiCycle, SadeSatiPhase, SadeSatiPhasePeriod, SadeSatiResult } from './types';

export interface SadeSatiInput {
  moonSignNumber: number;
  referenceDate?: Date;
  scanYearsPast?: number;
  scanYearsFuture?: number;
}

interface SaturnCheckpoint {
  date: Date;
  signNumber: number;
  houseFromMoon: number;
}

interface RawPhaseWindow {
  phase: SadeSatiPhase;
  houseFromMoon: number;
  startDate: string;
  endDate: string;
  saturnSign: string;
  saturnSignHi: string;
  saturnSignNumber: number;
}

const SADE_SATI_HOUSES = new Set([12, 1, 2]);
const PHASE_ORDER: SadeSatiPhase[] = ['rising', 'peak', 'setting'];
const CYCLE_MERGE_GAP_DAYS = 400;
const PHASE_BY_HOUSE: Record<number, SadeSatiPhase> = {
  12: 'rising',
  1: 'peak',
  2: 'setting',
};

function getHouseFromMoon(signNumber: number, moonSignNumber: number): number {
  return ((signNumber - moonSignNumber + 12) % 12) + 1;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86400000);
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function endOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getSaturnCheckpoint(ephemeris: Ephemeris, date: Date, moonSignNumber: number): SaturnCheckpoint {
  const sidereal = ephemeris.calculateSiderealPosition(date, 'Saturn');
  const signNumber = Math.floor(sidereal.longitude / 30) + 1;
  return {
    date,
    signNumber,
    houseFromMoon: getHouseFromMoon(signNumber, moonSignNumber),
  };
}

function refineBoundary(
  ephemeris: Ephemeris,
  before: SaturnCheckpoint,
  after: SaturnCheckpoint,
  moonSignNumber: number,
): SaturnCheckpoint {
  let low = before.date.getTime();
  let high = after.date.getTime();
  let boundary = after;

  while (high - low > 3600000) {
    const mid = new Date(Math.floor((low + high) / 2));
    const checkpoint = getSaturnCheckpoint(ephemeris, mid, moonSignNumber);

    if (
      checkpoint.signNumber === before.signNumber &&
      checkpoint.houseFromMoon === before.houseFromMoon
    ) {
      low = mid.getTime();
    } else {
      high = mid.getTime();
      boundary = checkpoint;
    }
  }

  return boundary;
}

function checkpointToPhase(checkpoint: SaturnCheckpoint): SadeSatiPhasePeriod {
  const phase = PHASE_BY_HOUSE[checkpoint.houseFromMoon];
  const rashi = RASHI_NAMES[checkpoint.signNumber - 1];

  return {
    phase,
    houseFromMoon: checkpoint.houseFromMoon,
    startDate: toIsoDate(checkpoint.date),
    endDate: toIsoDate(checkpoint.date),
    saturnSign: rashi?.en || 'Unknown',
    saturnSignHi: rashi?.hi || 'अज्ञात',
    saturnSignNumber: checkpoint.signNumber,
  };
}

function isoToMs(value: string): number {
  return new Date(`${value}T00:00:00Z`).getTime();
}

function mergeGapMs(days: number): number {
  return days * 86400000;
}

function finalizeCycle(phases: SadeSatiPhasePeriod[], referenceDate: Date): SadeSatiCycle {
  const startDate = phases[0]?.startDate || '';
  const endDate = phases[phases.length - 1]?.endDate || '';
  const referenceIso = toIsoDate(referenceDate);

  return {
    startDate,
    endDate,
    activeOnReferenceDate: startDate <= referenceIso && referenceIso <= endDate,
    phases,
  };
}

function buildRawPhaseWindows(points: SaturnCheckpoint[]): RawPhaseWindow[] {
  const windows: RawPhaseWindow[] = [];
  let currentWindow: RawPhaseWindow | null = null;

  for (const point of points) {
    const isActive = SADE_SATI_HOUSES.has(point.houseFromMoon);

    if (!isActive) {
      if (currentWindow) {
        windows.push(currentWindow);
        currentWindow = null;
      }
      continue;
    }

    const phase = checkpointToPhase(point);

    if (!currentWindow || currentWindow.phase !== phase.phase) {
      if (currentWindow) windows.push(currentWindow);
      currentWindow = { ...phase };
    } else {
      currentWindow.endDate = phase.endDate;
      currentWindow.saturnSign = phase.saturnSign;
      currentWindow.saturnSignHi = phase.saturnSignHi;
      currentWindow.saturnSignNumber = phase.saturnSignNumber;
      currentWindow.houseFromMoon = phase.houseFromMoon;
    }
  }

  if (currentWindow) {
    windows.push(currentWindow);
  }

  return windows;
}

function groupWindowsIntoCycles(windows: RawPhaseWindow[]): RawPhaseWindow[][] {
  if (windows.length === 0) return [];

  const groups: RawPhaseWindow[][] = [];
  let currentGroup: RawPhaseWindow[] = [windows[0]];

  for (let i = 1; i < windows.length; i += 1) {
    const prev = currentGroup[currentGroup.length - 1];
    const next = windows[i];
    const gap = isoToMs(next.startDate) - isoToMs(prev.endDate);

    if (gap <= mergeGapMs(CYCLE_MERGE_GAP_DAYS)) {
      currentGroup.push(next);
    } else {
      groups.push(currentGroup);
      currentGroup = [next];
    }
  }

  groups.push(currentGroup);
  return groups;
}

function mergeWindowsByPhase(windows: RawPhaseWindow[]): SadeSatiPhasePeriod[] {
  const merged = new Map<SadeSatiPhase, SadeSatiPhasePeriod>();

  for (const window of windows) {
    const existing = merged.get(window.phase);
    if (!existing) {
      merged.set(window.phase, { ...window });
      continue;
    }

    if (isoToMs(window.startDate) < isoToMs(existing.startDate)) {
      existing.startDate = window.startDate;
    }
    if (isoToMs(window.endDate) > isoToMs(existing.endDate)) {
      existing.endDate = window.endDate;
      existing.saturnSign = window.saturnSign;
      existing.saturnSignHi = window.saturnSignHi;
      existing.saturnSignNumber = window.saturnSignNumber;
      existing.houseFromMoon = window.houseFromMoon;
    }
  }

  return PHASE_ORDER
    .map(phase => merged.get(phase))
    .filter(Boolean) as SadeSatiPhasePeriod[];
}

function buildCycles(points: SaturnCheckpoint[], referenceDate: Date): SadeSatiCycle[] {
  const rawWindows = buildRawPhaseWindows(points);
  const cycleGroups = groupWindowsIntoCycles(rawWindows);

  return cycleGroups.map(group => {
    const mergedPhases = mergeWindowsByPhase(group);
    return finalizeCycle(mergedPhases, referenceDate);
  });
}

export function calculateSadeSatiPeriod(input: SadeSatiInput): SadeSatiResult {
  const {
    moonSignNumber,
    referenceDate = new Date(),
    scanYearsPast = 15,
    scanYearsFuture = 20,
  } = input;

  if (moonSignNumber < 1 || moonSignNumber > 12) {
    throw new Error(`Invalid moonSignNumber: ${moonSignNumber}. Must be 1-12.`);
  }

  const referenceDay = startOfUtcDay(referenceDate);
  const scanStart = startOfUtcDay(new Date(Date.UTC(
    referenceDay.getUTCFullYear() - scanYearsPast,
    referenceDay.getUTCMonth(),
    referenceDay.getUTCDate(),
  )));
  const scanEnd = endOfUtcDay(new Date(Date.UTC(
    referenceDay.getUTCFullYear() + scanYearsFuture,
    referenceDay.getUTCMonth(),
    referenceDay.getUTCDate(),
  )));
  const ephemeris = new Ephemeris();

  try {
    const coarsePoints: SaturnCheckpoint[] = [];
    for (let cursor = scanStart; cursor <= scanEnd; cursor = addMonths(cursor, 1)) {
      coarsePoints.push(getSaturnCheckpoint(ephemeris, cursor, moonSignNumber));
    }
    if (coarsePoints[coarsePoints.length - 1].date < scanEnd) {
      coarsePoints.push(getSaturnCheckpoint(ephemeris, scanEnd, moonSignNumber));
    }

    const refinedPoints: SaturnCheckpoint[] = [];
    for (let i = 0; i < coarsePoints.length; i += 1) {
      const point = coarsePoints[i];
      if (refinedPoints.length === 0) {
        refinedPoints.push(point);
      }

      if (i === coarsePoints.length - 1) break;

      const nextPoint = coarsePoints[i + 1];
      const transitionDetected =
        point.signNumber !== nextPoint.signNumber ||
        point.houseFromMoon !== nextPoint.houseFromMoon;

      if (transitionDetected) {
        const boundary = refineBoundary(ephemeris, point, nextPoint, moonSignNumber);
        const dayBefore = getSaturnCheckpoint(ephemeris, addDays(startOfUtcDay(boundary.date), -1), moonSignNumber);
        const boundaryDay = getSaturnCheckpoint(ephemeris, startOfUtcDay(boundary.date), moonSignNumber);
        const boundaryEndDay = getSaturnCheckpoint(ephemeris, endOfUtcDay(boundary.date), moonSignNumber);

        if (refinedPoints[refinedPoints.length - 1].date.getTime() !== dayBefore.date.getTime()) {
          refinedPoints.push(dayBefore);
        }
        refinedPoints.push(boundaryDay);
        if (boundaryDay.houseFromMoon !== boundaryEndDay.houseFromMoon || boundaryDay.signNumber !== boundaryEndDay.signNumber) {
          refinedPoints.push(boundaryEndDay);
        }
      }

      if (refinedPoints[refinedPoints.length - 1].date.getTime() !== nextPoint.date.getTime()) {
        refinedPoints.push(nextPoint);
      }
    }

    const uniquePoints = refinedPoints
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((point, index, arr) => {
        if (index === 0) return true;
        const prev = arr[index - 1];
        return (
          prev.date.getTime() !== point.date.getTime() ||
          prev.signNumber !== point.signNumber ||
          prev.houseFromMoon !== point.houseFromMoon
        );
      });

    const cycles = buildCycles(uniquePoints, referenceDay);
    const referenceIso = toIsoDate(referenceDay);
    const currentCycle = cycles.find(cycle => cycle.startDate <= referenceIso && referenceIso <= cycle.endDate) || null;
    const previousCycle = [...cycles]
      .filter(cycle => cycle.endDate < referenceIso)
      .sort((a, b) => b.endDate.localeCompare(a.endDate))[0] || null;
    const nextCycle = [...cycles]
      .filter(cycle => cycle.startDate > referenceIso)
      .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] || null;

    const currentSaturn = getSaturnCheckpoint(ephemeris, referenceDate, moonSignNumber);
    const moonSign = RASHI_NAMES[moonSignNumber - 1];
    const saturnSign = RASHI_NAMES[currentSaturn.signNumber - 1];

    return {
      referenceDate: referenceDate.toISOString(),
      moonSign: moonSign?.en || 'Unknown',
      moonSignHi: moonSign?.hi || 'अज्ञात',
      moonSignNumber,
      currentSaturnSign: saturnSign?.en || 'Unknown',
      currentSaturnSignHi: saturnSign?.hi || 'अज्ञात',
      currentSaturnSignNumber: currentSaturn.signNumber,
      currentHouseFromMoon: currentSaturn.houseFromMoon,
      isCurrentlyInSadeSati: SADE_SATI_HOUSES.has(currentSaturn.houseFromMoon),
      currentPhase: currentCycle?.phases.find(phase => phase.startDate <= referenceIso && referenceIso <= phase.endDate)?.phase,
      currentCycle,
      previousCycle,
      nextCycle,
    };
  } finally {
    ephemeris.cleanup();
  }
}
