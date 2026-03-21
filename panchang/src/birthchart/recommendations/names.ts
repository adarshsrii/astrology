/**
 * Baby Name Suggestions Based on Birth Nakshatra
 *
 * Each nakshatra has 4 padas, each associated with a specific starting syllable.
 * Names beginning with the birth nakshatra's pada syllable are considered auspicious.
 */

// ── Types ───────────────────────────────────────────────────────────────────────

export interface NameEntry {
  name: string;
  gender: 'male' | 'female' | 'unisex';
}

export interface NameSuggestion {
  syllable: string;
  nakshatra: string;
  pada: number;
  gender: 'male' | 'female' | 'unisex';
  names: NameEntry[];
}

// ── Nakshatra Syllable Map (27 × 4 padas) ──────────────────────────────────────

export const NAKSHATRA_SYLLABLES: Record<string, [string, string, string, string]> = {
  'Ashwini':             ['Chu', 'Che', 'Cho', 'La'],
  'Bharani':             ['Li', 'Lu', 'Le', 'Lo'],
  'Krittika':            ['A', 'I', 'U', 'E'],
  'Rohini':              ['O', 'Va', 'Vi', 'Vu'],
  'Mrigashira':          ['Ve', 'Vo', 'Ka', 'Ki'],
  'Ardra':               ['Ku', 'Gha', 'Ng', 'Chha'],
  'Punarvasu':           ['Ke', 'Ko', 'Ha', 'Hi'],
  'Pushya':              ['Hu', 'He', 'Ho', 'Da'],
  'Ashlesha':            ['Di', 'Du', 'De', 'Do'],
  'Magha':               ['Ma', 'Mi', 'Mu', 'Me'],
  'Purva Phalguni':      ['Mo', 'Ta', 'Ti', 'Tu'],
  'Uttara Phalguni':     ['Te', 'To', 'Pa', 'Pi'],
  'Hasta':               ['Pu', 'Sha', 'Na', 'Tha'],
  'Chitra':              ['Pe', 'Po', 'Ra', 'Ri'],
  'Swati':               ['Ru', 'Re', 'Ro', 'Ta'],
  'Vishakha':            ['Ti', 'Tu', 'Te', 'To'],
  'Anuradha':            ['Na', 'Ni', 'Nu', 'Ne'],
  'Jyeshtha':            ['No', 'Ya', 'Yi', 'Yu'],
  'Moola':               ['Ye', 'Yo', 'Bha', 'Bhi'],
  'Purva Ashadha':       ['Bhu', 'Dha', 'Pha', 'Dha'],
  'Uttara Ashadha':      ['Bhe', 'Bho', 'Ja', 'Ji'],
  'Shravana':            ['Ju', 'Je', 'Jo', 'Gha'],
  'Dhanishtha':          ['Ga', 'Gi', 'Gu', 'Ge'],
  'Shatabhisha':         ['Go', 'Sa', 'Si', 'Su'],
  'Purva Bhadrapada':    ['Se', 'So', 'Da', 'Di'],
  'Uttara Bhadrapada':   ['Du', 'Tha', 'Jha', 'Da'],
  'Revati':              ['De', 'Do', 'Cha', 'Chi'],
};

// ── Name Database by Syllable ───────────────────────────────────────────────────

const NAME_DATABASE: Record<string, NameEntry[]> = {
  // Ashwini
  'Chu': [
    { name: 'Chudamani', gender: 'male' },
    { name: 'Churamani', gender: 'male' },
    { name: 'Chunda', gender: 'female' },
  ],
  'Che': [
    { name: 'Chetan', gender: 'male' },
    { name: 'Chetna', gender: 'female' },
    { name: 'Chetak', gender: 'male' },
  ],
  'Cho': [
    { name: 'Chola', gender: 'male' },
    { name: 'Choti', gender: 'female' },
    { name: 'Chotan', gender: 'male' },
  ],
  'La': [
    { name: 'Lakshmi', gender: 'female' },
    { name: 'Lakshmikant', gender: 'male' },
    { name: 'Lavanya', gender: 'female' },
    { name: 'Lakhan', gender: 'male' },
    { name: 'Latika', gender: 'female' },
  ],

  // Bharani
  'Li': [
    { name: 'Lilavati', gender: 'female' },
    { name: 'Lina', gender: 'female' },
    { name: 'Likhit', gender: 'male' },
  ],
  'Lu': [
    { name: 'Luv', gender: 'male' },
    { name: 'Lubhana', gender: 'female' },
    { name: 'Luvkush', gender: 'male' },
  ],
  'Le': [
    { name: 'Leena', gender: 'female' },
    { name: 'Lekha', gender: 'female' },
    { name: 'Lekhan', gender: 'male' },
  ],
  'Lo': [
    { name: 'Lokesh', gender: 'male' },
    { name: 'Lochana', gender: 'female' },
    { name: 'Lokendra', gender: 'male' },
  ],

  // Krittika
  'A': [
    { name: 'Aarav', gender: 'male' },
    { name: 'Aanya', gender: 'female' },
    { name: 'Arjun', gender: 'male' },
    { name: 'Ananya', gender: 'female' },
    { name: 'Aditya', gender: 'male' },
  ],
  'I': [
    { name: 'Ishaan', gender: 'male' },
    { name: 'Isha', gender: 'female' },
    { name: 'Indira', gender: 'female' },
    { name: 'Ishan', gender: 'male' },
  ],
  'U': [
    { name: 'Uma', gender: 'female' },
    { name: 'Uday', gender: 'male' },
    { name: 'Ujjwal', gender: 'male' },
    { name: 'Urvi', gender: 'female' },
  ],
  'E': [
    { name: 'Ekta', gender: 'female' },
    { name: 'Eshaan', gender: 'male' },
    { name: 'Esha', gender: 'female' },
  ],

  // Rohini
  'O': [
    { name: 'Om', gender: 'male' },
    { name: 'Omkar', gender: 'male' },
    { name: 'Ojasvi', gender: 'unisex' },
  ],
  'Va': [
    { name: 'Varun', gender: 'male' },
    { name: 'Vandana', gender: 'female' },
    { name: 'Vani', gender: 'female' },
    { name: 'Vasudha', gender: 'female' },
  ],
  'Vi': [
    { name: 'Vivek', gender: 'male' },
    { name: 'Vidya', gender: 'female' },
    { name: 'Vikas', gender: 'male' },
    { name: 'Vimala', gender: 'female' },
    { name: 'Vihaan', gender: 'male' },
  ],
  'Vu': [
    { name: 'Vupendra', gender: 'male' },
    { name: 'Vushali', gender: 'female' },
    { name: 'Vushti', gender: 'female' },
  ],

  // Mrigashira
  'Ve': [
    { name: 'Veda', gender: 'female' },
    { name: 'Vedant', gender: 'male' },
    { name: 'Veena', gender: 'female' },
  ],
  'Vo': [
    { name: 'Vora', gender: 'male' },
    { name: 'Votika', gender: 'female' },
  ],
  'Ka': [
    { name: 'Karan', gender: 'male' },
    { name: 'Kavya', gender: 'female' },
    { name: 'Kartik', gender: 'male' },
    { name: 'Kamini', gender: 'female' },
    { name: 'Kabir', gender: 'male' },
  ],
  'Ki': [
    { name: 'Kiran', gender: 'unisex' },
    { name: 'Kirti', gender: 'female' },
    { name: 'Kishor', gender: 'male' },
    { name: 'Kiara', gender: 'female' },
  ],

  // Ardra
  'Ku': [
    { name: 'Kunal', gender: 'male' },
    { name: 'Kushal', gender: 'male' },
    { name: 'Kumari', gender: 'female' },
    { name: 'Kundan', gender: 'male' },
  ],
  'Gha': [
    { name: 'Ghanshyam', gender: 'male' },
    { name: 'Ghanendra', gender: 'male' },
    { name: 'Ghazala', gender: 'female' },
  ],
  'Ng': [
    { name: 'Ngawang', gender: 'male' },
    { name: 'Ngozi', gender: 'female' },
  ],
  'Chha': [
    { name: 'Chhavi', gender: 'female' },
    { name: 'Chhaya', gender: 'female' },
    { name: 'Chhatrapal', gender: 'male' },
  ],

  // Punarvasu
  'Ke': [
    { name: 'Keshav', gender: 'male' },
    { name: 'Ketaki', gender: 'female' },
    { name: 'Ketan', gender: 'male' },
  ],
  'Ko': [
    { name: 'Komal', gender: 'female' },
    { name: 'Kovid', gender: 'male' },
    { name: 'Kokila', gender: 'female' },
  ],
  'Ha': [
    { name: 'Harsh', gender: 'male' },
    { name: 'Harini', gender: 'female' },
    { name: 'Hardik', gender: 'male' },
    { name: 'Hansa', gender: 'female' },
  ],
  'Hi': [
    { name: 'Hitesh', gender: 'male' },
    { name: 'Hina', gender: 'female' },
    { name: 'Himanshu', gender: 'male' },
    { name: 'Hiral', gender: 'female' },
  ],

  // Pushya
  'Hu': [
    { name: 'Husain', gender: 'male' },
    { name: 'Huma', gender: 'female' },
  ],
  'He': [
    { name: 'Hemant', gender: 'male' },
    { name: 'Hema', gender: 'female' },
    { name: 'Heena', gender: 'female' },
  ],
  'Ho': [
    { name: 'Homi', gender: 'male' },
    { name: 'Honey', gender: 'female' },
  ],
  'Da': [
    { name: 'Daksh', gender: 'male' },
    { name: 'Darpana', gender: 'female' },
    { name: 'Darshan', gender: 'male' },
    { name: 'Damini', gender: 'female' },
  ],

  // Ashlesha
  'Di': [
    { name: 'Divya', gender: 'female' },
    { name: 'Dinesh', gender: 'male' },
    { name: 'Disha', gender: 'female' },
    { name: 'Dilip', gender: 'male' },
  ],
  'Du': [
    { name: 'Durga', gender: 'female' },
    { name: 'Dushyant', gender: 'male' },
    { name: 'Dulari', gender: 'female' },
  ],
  'De': [
    { name: 'Devika', gender: 'female' },
    { name: 'Dev', gender: 'male' },
    { name: 'Deepak', gender: 'male' },
    { name: 'Deepali', gender: 'female' },
  ],
  'Do': [
    { name: 'Dolly', gender: 'female' },
    { name: 'Dorji', gender: 'male' },
  ],

  // Magha
  'Ma': [
    { name: 'Manish', gender: 'male' },
    { name: 'Maya', gender: 'female' },
    { name: 'Manoj', gender: 'male' },
    { name: 'Madhuri', gender: 'female' },
    { name: 'Manas', gender: 'male' },
  ],
  'Mi': [
    { name: 'Mihir', gender: 'male' },
    { name: 'Mira', gender: 'female' },
    { name: 'Mithun', gender: 'male' },
    { name: 'Mitali', gender: 'female' },
  ],
  'Mu': [
    { name: 'Mukesh', gender: 'male' },
    { name: 'Mukta', gender: 'female' },
    { name: 'Murali', gender: 'male' },
  ],
  'Me': [
    { name: 'Meera', gender: 'female' },
    { name: 'Megha', gender: 'female' },
    { name: 'Mehul', gender: 'male' },
  ],

  // Purva Phalguni
  'Mo': [
    { name: 'Mohit', gender: 'male' },
    { name: 'Mohini', gender: 'female' },
    { name: 'Mohan', gender: 'male' },
  ],
  'Ta': [
    { name: 'Tanvi', gender: 'female' },
    { name: 'Tarun', gender: 'male' },
    { name: 'Tara', gender: 'female' },
    { name: 'Tanmay', gender: 'male' },
  ],
  'Ti': [
    { name: 'Tilak', gender: 'male' },
    { name: 'Tina', gender: 'female' },
    { name: 'Tirth', gender: 'male' },
  ],
  'Tu': [
    { name: 'Tulsi', gender: 'female' },
    { name: 'Tushar', gender: 'male' },
    { name: 'Tuhina', gender: 'female' },
  ],

  // Uttara Phalguni
  'Te': [
    { name: 'Tejas', gender: 'male' },
    { name: 'Tejal', gender: 'female' },
    { name: 'Teerth', gender: 'male' },
  ],
  'To': [
    { name: 'Toral', gender: 'female' },
    { name: 'Tosh', gender: 'male' },
    { name: 'Toshani', gender: 'female' },
  ],
  'Pa': [
    { name: 'Parth', gender: 'male' },
    { name: 'Pallavi', gender: 'female' },
    { name: 'Pankaj', gender: 'male' },
    { name: 'Padma', gender: 'female' },
  ],
  'Pi': [
    { name: 'Piyush', gender: 'male' },
    { name: 'Pinky', gender: 'female' },
    { name: 'Pinak', gender: 'male' },
  ],

  // Hasta
  'Pu': [
    { name: 'Punit', gender: 'male' },
    { name: 'Purnima', gender: 'female' },
    { name: 'Pushkar', gender: 'male' },
    { name: 'Punam', gender: 'female' },
  ],
  'Sha': [
    { name: 'Sharad', gender: 'male' },
    { name: 'Shanti', gender: 'female' },
    { name: 'Shankar', gender: 'male' },
    { name: 'Shakti', gender: 'female' },
  ],
  'Na': [
    { name: 'Naresh', gender: 'male' },
    { name: 'Nandini', gender: 'female' },
    { name: 'Naveen', gender: 'male' },
    { name: 'Nalini', gender: 'female' },
  ],
  'Tha': [
    { name: 'Thakor', gender: 'male' },
    { name: 'Thara', gender: 'female' },
    { name: 'Tharun', gender: 'male' },
  ],

  // Chitra
  'Pe': [
    { name: 'Pema', gender: 'unisex' },
    { name: 'Petal', gender: 'female' },
  ],
  'Po': [
    { name: 'Pooja', gender: 'female' },
    { name: 'Poonam', gender: 'female' },
    { name: 'Porus', gender: 'male' },
  ],
  'Ra': [
    { name: 'Rahul', gender: 'male' },
    { name: 'Radha', gender: 'female' },
    { name: 'Rajesh', gender: 'male' },
    { name: 'Rani', gender: 'female' },
    { name: 'Ravi', gender: 'male' },
  ],
  'Ri': [
    { name: 'Rishi', gender: 'male' },
    { name: 'Ritika', gender: 'female' },
    { name: 'Rishabh', gender: 'male' },
    { name: 'Riya', gender: 'female' },
  ],

  // Swati
  'Ru': [
    { name: 'Ruchi', gender: 'female' },
    { name: 'Rudra', gender: 'male' },
    { name: 'Rupal', gender: 'female' },
  ],
  'Re': [
    { name: 'Rekha', gender: 'female' },
    { name: 'Renu', gender: 'female' },
    { name: 'Reyansh', gender: 'male' },
  ],
  'Ro': [
    { name: 'Rohit', gender: 'male' },
    { name: 'Roshan', gender: 'male' },
    { name: 'Roshni', gender: 'female' },
  ],

  // Vishakha — Ti, Tu, Te, To already defined above

  // Anuradha — Na already defined above
  'Ni': [
    { name: 'Nikhil', gender: 'male' },
    { name: 'Nisha', gender: 'female' },
    { name: 'Nitin', gender: 'male' },
    { name: 'Nidhi', gender: 'female' },
  ],
  'Nu': [
    { name: 'Nupur', gender: 'female' },
    { name: 'Nutan', gender: 'female' },
  ],
  'Ne': [
    { name: 'Neha', gender: 'female' },
    { name: 'Neeraj', gender: 'male' },
    { name: 'Neelam', gender: 'female' },
  ],

  // Jyeshtha
  'No': [
    { name: 'Noel', gender: 'male' },
    { name: 'Noor', gender: 'female' },
  ],
  'Ya': [
    { name: 'Yash', gender: 'male' },
    { name: 'Yamini', gender: 'female' },
    { name: 'Yashoda', gender: 'female' },
    { name: 'Yashwant', gender: 'male' },
  ],
  'Yi': [
    { name: 'Yidesh', gender: 'male' },
    { name: 'Yisha', gender: 'female' },
  ],
  'Yu': [
    { name: 'Yuvraj', gender: 'male' },
    { name: 'Yukti', gender: 'female' },
    { name: 'Yuvika', gender: 'female' },
  ],

  // Moola
  'Ye': [
    { name: 'Yeshwant', gender: 'male' },
    { name: 'Yeshoda', gender: 'female' },
  ],
  'Yo': [
    { name: 'Yogesh', gender: 'male' },
    { name: 'Yogita', gender: 'female' },
    { name: 'Yogi', gender: 'male' },
  ],
  'Bha': [
    { name: 'Bharat', gender: 'male' },
    { name: 'Bhavna', gender: 'female' },
    { name: 'Bhavesh', gender: 'male' },
    { name: 'Bharti', gender: 'female' },
  ],
  'Bhi': [
    { name: 'Bhima', gender: 'male' },
    { name: 'Bhishma', gender: 'male' },
  ],

  // Purva Ashadha
  'Bhu': [
    { name: 'Bhuvan', gender: 'male' },
    { name: 'Bhumi', gender: 'female' },
    { name: 'Bhushan', gender: 'male' },
  ],
  'Dha': [
    { name: 'Dharmesh', gender: 'male' },
    { name: 'Dhara', gender: 'female' },
    { name: 'Dhananjay', gender: 'male' },
    { name: 'Dhanvi', gender: 'female' },
  ],
  'Pha': [
    { name: 'Phalgun', gender: 'male' },
    { name: 'Phalak', gender: 'female' },
  ],

  // Uttara Ashadha
  'Bhe': [
    { name: 'Bheem', gender: 'male' },
    { name: 'Bheshaj', gender: 'male' },
  ],
  'Bho': [
    { name: 'Bholanath', gender: 'male' },
    { name: 'Bhoomika', gender: 'female' },
  ],
  'Ja': [
    { name: 'Jai', gender: 'male' },
    { name: 'Jaya', gender: 'female' },
    { name: 'Janaki', gender: 'female' },
    { name: 'Jayant', gender: 'male' },
  ],
  'Ji': [
    { name: 'Jigar', gender: 'male' },
    { name: 'Jiya', gender: 'female' },
    { name: 'Jitendra', gender: 'male' },
  ],

  // Shravana
  'Ju': [
    { name: 'Jugal', gender: 'male' },
    { name: 'Juhi', gender: 'female' },
  ],
  'Je': [
    { name: 'Jeet', gender: 'male' },
    { name: 'Jeenal', gender: 'female' },
  ],
  'Jo': [
    { name: 'Jyoti', gender: 'female' },
    { name: 'Joshit', gender: 'male' },
  ],

  // Dhanishtha
  'Ga': [
    { name: 'Ganesh', gender: 'male' },
    { name: 'Garima', gender: 'female' },
    { name: 'Gaurav', gender: 'male' },
    { name: 'Gauri', gender: 'female' },
  ],
  'Gi': [
    { name: 'Girish', gender: 'male' },
    { name: 'Gita', gender: 'female' },
    { name: 'Girdhari', gender: 'male' },
  ],
  'Gu': [
    { name: 'Gunjan', gender: 'female' },
    { name: 'Gulshan', gender: 'male' },
    { name: 'Gulab', gender: 'unisex' },
  ],
  'Ge': [
    { name: 'Geeta', gender: 'female' },
    { name: 'Geet', gender: 'unisex' },
  ],

  // Shatabhisha
  'Go': [
    { name: 'Govind', gender: 'male' },
    { name: 'Gopi', gender: 'female' },
    { name: 'Gopal', gender: 'male' },
  ],
  'Sa': [
    { name: 'Sahil', gender: 'male' },
    { name: 'Sarita', gender: 'female' },
    { name: 'Sanjay', gender: 'male' },
    { name: 'Sakshi', gender: 'female' },
    { name: 'Samar', gender: 'male' },
  ],
  'Si': [
    { name: 'Siddharth', gender: 'male' },
    { name: 'Sita', gender: 'female' },
    { name: 'Simran', gender: 'female' },
  ],
  'Su': [
    { name: 'Suresh', gender: 'male' },
    { name: 'Sunita', gender: 'female' },
    { name: 'Sunil', gender: 'male' },
    { name: 'Suman', gender: 'unisex' },
  ],

  // Purva Bhadrapada
  'Se': [
    { name: 'Setu', gender: 'male' },
    { name: 'Sena', gender: 'female' },
  ],
  'So': [
    { name: 'Soham', gender: 'male' },
    { name: 'Sonal', gender: 'female' },
    { name: 'Sohail', gender: 'male' },
  ],

  // Uttara Bhadrapada — Du, Tha, Da already defined above
  'Jha': [
    { name: 'Jhanvi', gender: 'female' },
    { name: 'Jhanak', gender: 'male' },
  ],

  // Revati — De, Do already defined above
  'Cha': [
    { name: 'Chandan', gender: 'male' },
    { name: 'Chandni', gender: 'female' },
    { name: 'Charu', gender: 'female' },
    { name: 'Chaitanya', gender: 'male' },
  ],
  'Chi': [
    { name: 'Chinmay', gender: 'male' },
    { name: 'Chitra', gender: 'female' },
    { name: 'Chirag', gender: 'male' },
  ],
};

// ── Public API ──────────────────────────────────────────────────────────────────

/**
 * Get baby name suggestions for a given nakshatra and pada.
 *
 * @param nakshatra - One of the 27 nakshatras (e.g. "Ashwini")
 * @param pada - Pada number 1-4
 * @returns Array of NameSuggestion objects (typically 1 entry for the matched syllable)
 */
export function getNameSuggestions(nakshatra: string, pada: number): NameSuggestion[] {
  const syllables = NAKSHATRA_SYLLABLES[nakshatra];
  if (!syllables) {
    return [];
  }

  if (pada < 1 || pada > 4) {
    return [];
  }

  const syllable = syllables[pada - 1];
  const names = NAME_DATABASE[syllable] ?? [];

  // Build results — one per gender group
  const maleNames = names.filter(n => n.gender === 'male');
  const femaleNames = names.filter(n => n.gender === 'female');
  const unisexNames = names.filter(n => n.gender === 'unisex');

  const results: NameSuggestion[] = [];

  if (maleNames.length > 0) {
    results.push({
      syllable,
      nakshatra,
      pada,
      gender: 'male',
      names: maleNames,
    });
  }

  if (femaleNames.length > 0) {
    results.push({
      syllable,
      nakshatra,
      pada,
      gender: 'female',
      names: femaleNames,
    });
  }

  if (unisexNames.length > 0) {
    results.push({
      syllable,
      nakshatra,
      pada,
      gender: 'unisex',
      names: unisexNames,
    });
  }

  // If no gender-specific grouping found, return a single entry with all names
  if (results.length === 0 && names.length > 0) {
    results.push({
      syllable,
      nakshatra,
      pada,
      gender: 'unisex',
      names,
    });
  }

  return results;
}
