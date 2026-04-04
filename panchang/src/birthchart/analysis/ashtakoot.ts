/**
 * Ashtakoot Guna Milan (अष्टकूट गुण मिलान)
 *
 * Eight-factor compatibility scoring for Vedic matchmaking.
 * Uses Moon's Nakshatra, Pada, and Rashi from each person's birth chart.
 * Total: 36 points (Gunas).
 */

import { NATURAL_FRIENDSHIPS } from './friendships';

// ── Types ────────────────────────────────────────────────────────────────────

export interface MatchInput {
  /** Moon's nakshatra number (1-27) */
  nakshatraNumber: number;
  /** Moon's nakshatra pada (1-4) */
  nakshatraPada: number;
  /** Moon's rashi/sign number (1-12) */
  rashiNumber: number;
  /** Moon's nakshatra lord planet name */
  nakshatraLord: string;
}

export interface GunaScore {
  name: string;
  nameHi: string;
  points: number;
  maxPoints: number;
  description: string;
}

export interface AshtakootResult {
  gunas: GunaScore[];
  totalPoints: number;
  maxPoints: 36;
  percentage: number;
  verdict: string;
  verdictHi: string;
}

// ── Lookup Tables ────────────────────────────────────────────────────────────

/**
 * Varna (वर्ण) — Spiritual compatibility
 * Nakshatra → Varna: Brahmin(3), Kshatriya(2), Vaishya(1), Shudra(0)
 * Index = nakshatraNumber - 1
 */
const NAKSHATRA_VARNA: number[] = [
  /* 1  Ashwini    */ 2,
  /* 2  Bharani    */ 0,
  /* 3  Krittika   */ 3,
  /* 4  Rohini     */ 0,
  /* 5  Mrigashira */ 1,
  /* 6  Ardra      */ 2,
  /* 7  Punarvasu  */ 1,
  /* 8  Pushya     */ 2,
  /* 9  Ashlesha   */ 0,
  /* 10 Magha      */ 0,
  /* 11 P.Phalguni */ 3,
  /* 12 U.Phalguni */ 2,
  /* 13 Hasta      */ 1,
  /* 14 Chitra     */ 0,
  /* 15 Swati      */ 3,
  /* 16 Vishakha   */ 3,
  /* 17 Anuradha   */ 0,
  /* 18 Jyeshtha   */ 1,
  /* 19 Moola      */ 2,
  /* 20 P.Ashadha  */ 3,
  /* 21 U.Ashadha  */ 2,
  /* 22 Shravana   */ 1,
  /* 23 Dhanishta  */ 0,
  /* 24 Shatabhisha*/ 2,
  /* 25 P.Bhadra   */ 3,
  /* 26 U.Bhadra   */ 2,
  /* 27 Revati     */ 1,
];

/**
 * Vasya (वश्य) — Dominance/attraction
 * Rashi → Vasya group: 0=Chatushpad, 1=Manav, 2=Jalachara, 3=Vanachara, 4=Keeta
 */
const RASHI_VASYA: number[] = [
  /* 1  Aries    */ 0,
  /* 2  Taurus   */ 0,
  /* 3  Gemini   */ 1,
  /* 4  Cancer   */ 2,
  /* 5  Leo      */ 3,
  /* 6  Virgo    */ 1,
  /* 7  Libra    */ 1,
  /* 8  Scorpio  */ 4,
  /* 9  Sagit.   */ 1, // upper half Manav
  /* 10 Capricorn*/ 2, // lower half Jalachara
  /* 11 Aquarius */ 1,
  /* 12 Pisces   */ 2,
];

/**
 * Vasya compatibility matrix [groomGroup][brideGroup] → points (0, 1, or 2)
 * Groups: 0=Chatushpad, 1=Manav, 2=Jalachara, 3=Vanachara, 4=Keeta
 */
const VASYA_MATRIX: number[][] = [
  /* Chatushpad */ [2, 0, 1, 0, 0],
  /* Manav      */ [1, 2, 1, 0, 1],
  /* Jalachara  */ [1, 0, 2, 1, 0],
  /* Vanachara  */ [1, 1, 0, 2, 0],
  /* Keeta      */ [0, 0, 1, 0, 2],
];

/**
 * Yoni (योनि) — Sexual/physical compatibility
 * Nakshatra → Yoni animal (0-13)
 * 0=Horse, 1=Elephant, 2=Sheep, 3=Serpent, 4=Dog, 5=Cat, 6=Rat,
 * 7=Cow, 8=Buffalo, 9=Tiger, 10=Deer, 11=Monkey, 12=Mongoose, 13=Lion
 */
const NAKSHATRA_YONI: number[] = [
  /* 1  Ashwini    */ 0,   // Horse
  /* 2  Bharani    */ 1,   // Elephant
  /* 3  Krittika   */ 2,   // Sheep
  /* 4  Rohini     */ 3,   // Serpent
  /* 5  Mrigashira */ 3,   // Serpent
  /* 6  Ardra      */ 4,   // Dog
  /* 7  Punarvasu  */ 5,   // Cat
  /* 8  Pushya     */ 2,   // Sheep
  /* 9  Ashlesha   */ 5,   // Cat
  /* 10 Magha      */ 6,   // Rat
  /* 11 P.Phalguni */ 6,   // Rat
  /* 12 U.Phalguni */ 7,   // Cow
  /* 13 Hasta      */ 8,   // Buffalo
  /* 14 Chitra     */ 9,   // Tiger
  /* 15 Swati      */ 8,   // Buffalo
  /* 16 Vishakha   */ 9,   // Tiger
  /* 17 Anuradha   */ 10,  // Deer
  /* 18 Jyeshtha   */ 10,  // Deer
  /* 19 Moola      */ 4,   // Dog
  /* 20 P.Ashadha  */ 11,  // Monkey
  /* 21 U.Ashadha  */ 12,  // Mongoose
  /* 22 Shravana   */ 11,  // Monkey
  /* 23 Dhanishta  */ 13,  // Lion
  /* 24 Shatabhisha*/ 0,   // Horse
  /* 25 P.Bhadra   */ 13,  // Lion
  /* 26 U.Bhadra   */ 7,   // Cow
  /* 27 Revati     */ 1,   // Elephant
];

/**
 * Yoni enemy pairs — these pairs are hostile (0 points)
 */
const YONI_ENEMIES: [number, number][] = [
  [0, 8],   // Horse - Buffalo
  [1, 13],  // Elephant - Lion
  [2, 11],  // Sheep - Monkey
  [3, 12],  // Serpent - Mongoose
  [4, 10],  // Dog - Deer
  [5, 6],   // Cat - Rat
  [7, 9],   // Cow - Tiger
];

/**
 * Gana (गण) — Temperament
 * Nakshatra → Gana: 0=Deva, 1=Manushya, 2=Rakshasa
 */
const NAKSHATRA_GANA: number[] = [
  /* 1  Ashwini    */ 0,
  /* 2  Bharani    */ 1,
  /* 3  Krittika   */ 2,
  /* 4  Rohini     */ 1,
  /* 5  Mrigashira */ 0,
  /* 6  Ardra      */ 1,
  /* 7  Punarvasu  */ 0,
  /* 8  Pushya     */ 0,
  /* 9  Ashlesha   */ 2,
  /* 10 Magha      */ 2,
  /* 11 P.Phalguni */ 1,
  /* 12 U.Phalguni */ 1,
  /* 13 Hasta      */ 0,
  /* 14 Chitra     */ 2,
  /* 15 Swati      */ 0,
  /* 16 Vishakha   */ 2,
  /* 17 Anuradha   */ 0,
  /* 18 Jyeshtha   */ 2,
  /* 19 Moola      */ 2,
  /* 20 P.Ashadha  */ 1,
  /* 21 U.Ashadha  */ 1,
  /* 22 Shravana   */ 0,
  /* 23 Dhanishta  */ 2,
  /* 24 Shatabhisha*/ 2,
  /* 25 P.Bhadra   */ 1,
  /* 26 U.Bhadra   */ 1,
  /* 27 Revati     */ 0,
];

/**
 * Gana compatibility matrix [groom][bride] → points (0, 1, or 6)
 * 0=Deva, 1=Manushya, 2=Rakshasa
 */
const GANA_MATRIX: number[][] = [
  /* Deva     */ [6, 6, 1],
  /* Manushya */ [5, 6, 0],
  /* Rakshasa */ [1, 0, 6],
];

/**
 * Nadi (नाड़ी) — Health/progeny
 * Nakshatra → Nadi: 0=Aadi(Vata), 1=Madhya(Pitta), 2=Antya(Kapha)
 */
const NAKSHATRA_NADI: number[] = [
  /* 1  Ashwini    */ 0,
  /* 2  Bharani    */ 1,
  /* 3  Krittika   */ 2,
  /* 4  Rohini     */ 2,
  /* 5  Mrigashira */ 1,
  /* 6  Ardra      */ 0,
  /* 7  Punarvasu  */ 0,
  /* 8  Pushya     */ 1,
  /* 9  Ashlesha   */ 2,
  /* 10 Magha      */ 0,
  /* 11 P.Phalguni */ 1,
  /* 12 U.Phalguni */ 2,
  /* 13 Hasta      */ 2,
  /* 14 Chitra     */ 1,
  /* 15 Swati      */ 0,
  /* 16 Vishakha   */ 0,
  /* 17 Anuradha   */ 1,
  /* 18 Jyeshtha   */ 2,
  /* 19 Moola      */ 0,
  /* 20 P.Ashadha  */ 1,
  /* 21 U.Ashadha  */ 2,
  /* 22 Shravana   */ 2,
  /* 23 Dhanishta  */ 1,
  /* 24 Shatabhisha*/ 0,
  /* 25 P.Bhadra   */ 0,
  /* 26 U.Bhadra   */ 1,
  /* 27 Revati     */ 2,
];

/**
 * Bhakoot (भकूट) unfavourable rashi pairs (distance-based)
 * Distances 2/12 (Dwidwadash), 5/9 (Navapanchak), 6/8 (Shadashtak) = 0 points
 * All others = 7 points
 */
const BHAKOOT_BAD_DISTANCES = new Set([2, 5, 6, 8, 9, 12]);

// ── Guna Calculators ─────────────────────────────────────────────────────────

function calcVarna(groom: MatchInput, bride: MatchInput): number {
  const gv = NAKSHATRA_VARNA[groom.nakshatraNumber - 1];
  const bv = NAKSHATRA_VARNA[bride.nakshatraNumber - 1];
  // Groom's varna should be >= bride's varna
  return gv >= bv ? 1 : 0;
}

function calcVasya(groom: MatchInput, bride: MatchInput): number {
  const gv = RASHI_VASYA[groom.rashiNumber - 1];
  const bv = RASHI_VASYA[bride.rashiNumber - 1];
  return VASYA_MATRIX[gv][bv];
}

function calcTara(groom: MatchInput, bride: MatchInput): number {
  // Count from bride's nakshatra to groom's, and vice versa
  const diff1 = ((groom.nakshatraNumber - bride.nakshatraNumber + 27) % 27) || 27;
  const diff2 = ((bride.nakshatraNumber - groom.nakshatraNumber + 27) % 27) || 27;
  const tara1 = diff1 % 9 || 9;
  const tara2 = diff2 % 9 || 9;
  // Taras 1,2,4,6,8,9 are auspicious; 3,5,7 are inauspicious
  const BAD = new Set([3, 5, 7]);
  let pts = 0;
  if (!BAD.has(tara1)) pts += 1.5;
  if (!BAD.has(tara2)) pts += 1.5;
  return pts;
}

function calcYoni(groom: MatchInput, bride: MatchInput): number {
  const gy = NAKSHATRA_YONI[groom.nakshatraNumber - 1];
  const by = NAKSHATRA_YONI[bride.nakshatraNumber - 1];

  // Same yoni
  if (gy === by) return 4;

  // Check enemy pairs
  for (const [a, b] of YONI_ENEMIES) {
    if ((gy === a && by === b) || (gy === b && by === a)) return 0;
  }

  // Friendly = 3, Neutral = 2, Unfriendly = 1
  // Simplified: same species family → 3, otherwise 2
  return 2;
}

function calcGrahaMaitri(groom: MatchInput, bride: MatchInput): number {
  const gl = groom.nakshatraLord;
  const bl = bride.nakshatraLord;

  if (gl === bl) return 5;

  const gFriends = NATURAL_FRIENDSHIPS[gl];
  const bFriends = NATURAL_FRIENDSHIPS[bl];
  if (!gFriends || !bFriends) return 0;

  const gToBFriend = gFriends.friends.includes(bl);
  const gToBNeutral = gFriends.neutral.includes(bl);
  const bToGFriend = bFriends.friends.includes(gl);
  const bToGNeutral = bFriends.neutral.includes(gl);

  // Both friends
  if (gToBFriend && bToGFriend) return 5;
  // One friend, one neutral
  if ((gToBFriend && bToGNeutral) || (gToBNeutral && bToGFriend)) return 4;
  // Both neutral
  if (gToBNeutral && bToGNeutral) return 3;
  // One friend, one enemy
  if (gToBFriend || bToGFriend) return 1;
  // One neutral, one enemy
  if (gToBNeutral || bToGNeutral) return 0.5;
  // Both enemies
  return 0;
}

function calcGana(groom: MatchInput, bride: MatchInput): number {
  const gg = NAKSHATRA_GANA[groom.nakshatraNumber - 1];
  const bg = NAKSHATRA_GANA[bride.nakshatraNumber - 1];
  return GANA_MATRIX[gg][bg];
}

function calcBhakoot(groom: MatchInput, bride: MatchInput): number {
  const diff = ((groom.rashiNumber - bride.rashiNumber + 12) % 12) || 12;
  return BHAKOOT_BAD_DISTANCES.has(diff) ? 0 : 7;
}

function calcNadi(groom: MatchInput, bride: MatchInput): number {
  const gn = NAKSHATRA_NADI[groom.nakshatraNumber - 1];
  const bn = NAKSHATRA_NADI[bride.nakshatraNumber - 1];
  // Same nadi = 0 (Nadi Dosha), different = 8
  return gn === bn ? 0 : 8;
}

// ── Main Function ────────────────────────────────────────────────────────────

export function calculateAshtakootMilan(
  groom: MatchInput,
  bride: MatchInput,
): AshtakootResult {
  const gunas: GunaScore[] = [
    {
      name: 'Varna',
      nameHi: 'वर्ण',
      points: calcVarna(groom, bride),
      maxPoints: 1,
      description: 'Spiritual compatibility',
    },
    {
      name: 'Vasya',
      nameHi: 'वश्य',
      points: calcVasya(groom, bride),
      maxPoints: 2,
      description: 'Mutual attraction & dominance',
    },
    {
      name: 'Tara',
      nameHi: 'तारा',
      points: calcTara(groom, bride),
      maxPoints: 3,
      description: 'Birth star compatibility',
    },
    {
      name: 'Yoni',
      nameHi: 'योनि',
      points: calcYoni(groom, bride),
      maxPoints: 4,
      description: 'Physical & sexual compatibility',
    },
    {
      name: 'Graha Maitri',
      nameHi: 'ग्रह मैत्री',
      points: calcGrahaMaitri(groom, bride),
      maxPoints: 5,
      description: 'Mental & intellectual compatibility',
    },
    {
      name: 'Gana',
      nameHi: 'गण',
      points: calcGana(groom, bride),
      maxPoints: 6,
      description: 'Temperament compatibility',
    },
    {
      name: 'Bhakoot',
      nameHi: 'भकूट',
      points: calcBhakoot(groom, bride),
      maxPoints: 7,
      description: 'Love & family harmony',
    },
    {
      name: 'Nadi',
      nameHi: 'नाड़ी',
      points: calcNadi(groom, bride),
      maxPoints: 8,
      description: 'Health & progeny',
    },
  ];

  const totalPoints = gunas.reduce((sum, g) => sum + g.points, 0);
  const percentage = Math.round((totalPoints / 36) * 100);

  let verdict: string;
  let verdictHi: string;
  if (totalPoints >= 28) {
    verdict = 'Excellent match';
    verdictHi = 'उत्तम मिलान';
  } else if (totalPoints >= 21) {
    verdict = 'Good match';
    verdictHi = 'शुभ मिलान';
  } else if (totalPoints >= 18) {
    verdict = 'Average match';
    verdictHi = 'सामान्य मिलान';
  } else {
    verdict = 'Below average — consult a pandit';
    verdictHi = 'औसत से कम — पंडित से परामर्श करें';
  }

  return {
    gunas,
    totalPoints,
    maxPoints: 36,
    percentage,
    verdict,
    verdictHi,
  };
}
