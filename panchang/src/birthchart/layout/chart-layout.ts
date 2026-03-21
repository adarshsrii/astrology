/**
 * Chart Layout Generator
 * Produces North Indian, South Indian, and Western chart box layouts.
 */

import { HouseInfo, ChartLayout, ChartBox, GrahaName } from '../types';
import { SIGN_NAMES } from '../core/constants';

// ── South Indian: signs are fixed in these positions (Pisces top-left) ───────
//  Box positions (0-11) correspond to:
//  [0]  [1]  [2]  [3]
//  [4]            [5]
//  [6]            [7]
//  [8]  [9]  [10] [11]
//
// Fixed sign numbers per box (South Indian convention):
const SOUTH_INDIAN_SIGN_ORDER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// ── North Indian: houses are fixed in positions, signs rotate ────────────────
// House positions (diamond):
//  [12] [1]  [2]  [3]
//  [11]           [4]
//  [10]           [5]
//  [9]  [8]  [7]  [6]
const NORTH_INDIAN_HOUSE_ORDER = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

/**
 * Generate all three chart layouts from house data.
 */
export function generateChartLayouts(houses: HouseInfo[]): {
  northIndian: ChartLayout;
  southIndian: ChartLayout;
  western: ChartLayout;
} {
  return {
    northIndian: generateNorthIndian(houses),
    southIndian: generateSouthIndian(houses),
    western: generateWestern(houses),
  };
}

// ── North Indian ─────────────────────────────────────────────────────────────

function generateNorthIndian(houses: HouseInfo[]): ChartLayout {
  const boxes: ChartBox[] = [];

  for (let i = 0; i < 12; i++) {
    const houseNum = NORTH_INDIAN_HOUSE_ORDER[i];
    const house = houses.find(h => h.number === houseNum);

    boxes.push({
      houseNumber: houseNum,
      signNumber: house ? house.signNumber : 0,
      signName: house ? house.signName : '',
      planets: house ? [...house.planets] : [],
    });
  }

  return { style: 'north_indian', boxes };
}

// ── South Indian ─────────────────────────────────────────────────────────────

function generateSouthIndian(houses: HouseInfo[]): ChartLayout {
  const boxes: ChartBox[] = [];

  // In South Indian, each box position is a fixed sign.
  // We need to find which house occupies that sign.
  for (let i = 0; i < 12; i++) {
    const signNum = SOUTH_INDIAN_SIGN_ORDER[i];
    const house = houses.find(h => h.signNumber === signNum);

    boxes.push({
      houseNumber: house ? house.number : 0,
      signNumber: signNum,
      signName: SIGN_NAMES[signNum] || '',
      planets: house ? [...house.planets] : [],
    });
  }

  return { style: 'south_indian', boxes };
}

// ── Western ──────────────────────────────────────────────────────────────────

function generateWestern(houses: HouseInfo[]): ChartLayout {
  const boxes: ChartBox[] = [];

  // Western layout: houses in order 1-12, counter-clockwise from ascendant
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const house = houses.find(h => h.number === houseNum);

    boxes.push({
      houseNumber: houseNum,
      signNumber: house ? house.signNumber : 0,
      signName: house ? house.signName : '',
      planets: house ? [...house.planets] : [],
    });
  }

  return { style: 'western', boxes };
}
