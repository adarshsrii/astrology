/**
 * Vedic Yoga Detection Engine
 * Detects Raj Yogas and other important planetary yogas from birth chart data.
 *
 * Based on: Brihat Parashara Hora Shastra, Phaladeepika, Saravali
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DetectedYoga {
  name: string;
  nameHi: string;
  type: 'raj' | 'dhan' | 'pancha_mahapurusha' | 'nabhas' | 'chandra' | 'surya' | 'negative' | 'other';
  description: string;
  descriptionHi: string;
  planets: string[];
  strength: 'strong' | 'moderate' | 'mild';
}

export interface YogaResult {
  yogas: DetectedYoga[];
  totalCount: number;
  rajYogaCount: number;
  hasGajakesariYoga: boolean;
  hasBudhaAdityaYoga: boolean;
  hasPanchamahapurushaYoga: boolean;
}

// ─── Sign Lords ─────────────────────────────────────────────────────────────

const SIGN_LORD: Record<number, string> = {
  1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
  7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};

// Kendra houses: 1, 4, 7, 10
const KENDRA = [1, 4, 7, 10];
// Trikona houses: 1, 5, 9
const TRIKONA = [1, 5, 9];
// Dusthana houses: 6, 8, 12
const DUSTHANA = [6, 8, 12];
// Trik houses for Viparita: 6, 8, 12
const TRIK = [6, 8, 12];

// ─── Helpers ────────────────────────────────────────────────────────────────

interface PlanetInfo {
  name: string;
  signNumber: number;
  house: number;
  dignity: string;
  retrograde: boolean;
}

function getLord(signNum: number): string {
  return SIGN_LORD[signNum] || 'Sun';
}

function getHouseLord(houses: any[], houseNum: number): string {
  const h = houses.find((h: any) => h.number === houseNum);
  return h ? getLord(h.signNumber) : 'Sun';
}

function getPlanetHouse(planets: PlanetInfo[], name: string): number {
  return planets.find(p => p.name === name)?.house || 0;
}

function isInKendra(house: number): boolean {
  return KENDRA.includes(house);
}

function isInTrikona(house: number): boolean {
  return TRIKONA.includes(house);
}

function areMutualKendraTrikona(house1: number, house2: number): boolean {
  return (isInKendra(house1) && isInTrikona(house2)) ||
         (isInTrikona(house1) && isInKendra(house2));
}

// ─── Main Detection ─────────────────────────────────────────────────────────

export function detectYogas(
  planets: any[],
  houses: any[],
  lagnaSignNumber: number,
): YogaResult {
  const yogas: DetectedYoga[] = [];

  // Build planet info with house numbers
  const planetHouseMap: Record<string, number> = {};
  for (const h of houses) {
    for (const p of h.planets) {
      planetHouseMap[p] = h.number;
    }
  }

  const planetInfos: PlanetInfo[] = planets.map((p: any) => ({
    name: p.name,
    signNumber: p.signNumber,
    house: planetHouseMap[p.name] || 1,
    dignity: p.dignity || 'neutral',
    retrograde: p.retrograde || false,
  }));

  // ── 1. Raj Yogas ──

  // 1a. Same planet rules both Kendra and Trikona (e.g. Mars for Leo lagna rules 4,9)
  const kendraHouseNums = KENDRA;
  const trikonaHouseNums = TRIKONA;
  const kendraLordsSet = new Set(kendraHouseNums.map(h => getHouseLord(houses, h)));
  const trikonaLordsSet = new Set(trikonaHouseNums.map(h => getHouseLord(houses, h)));

  for (const planet of kendraLordsSet) {
    if (trikonaLordsSet.has(planet) && planet !== 'Rahu' && planet !== 'Ketu') {
      const ph = getPlanetHouse(planetInfos, planet);
      yogas.push({
        name: `Raj Yoga (${planet} — Kendra-Trikona Lord)`,
        nameHi: `राजयोग (${planet} — केन्द्र-त्रिकोण स्वामी)`,
        type: 'raj',
        description: `${planet} rules both a Kendra and a Trikona house, making it a Yoga Karaka (single planet forming Raj Yoga). This is one of the most powerful configurations, giving authority, success, and recognition especially during ${planet}'s Dasha periods.`,
        descriptionHi: `${planet} केन्द्र और त्रिकोण दोनों भावों का स्वामी है, जो इसे योगकारक बनाता है (एक ग्रह से राजयोग)। यह सबसे शक्तिशाली विन्यासों में से एक है, जो विशेष रूप से ${planet} की दशा काल में अधिकार, सफलता और मान्यता प्रदान करता है।`,
        planets: [planet],
        strength: isInKendra(ph) || isInTrikona(ph) ? 'strong' : 'moderate',
      });
    }
  }

  // 1b. Kendra-Trikona lord conjunction, exchange, or aspect
  const kendraLords = [...kendraLordsSet];
  const trikonaLords = [...trikonaLordsSet];

  for (const kl of kendraLords) {
    for (const tl of trikonaLords) {
      if (kl === tl) continue;
      if (kl === 'Rahu' || kl === 'Ketu' || tl === 'Rahu' || tl === 'Ketu') continue;

      const klHouse = getPlanetHouse(planetInfos, kl);
      const tlHouse = getPlanetHouse(planetInfos, tl);

      // Conjunction (same house)
      if (klHouse === tlHouse && klHouse > 0) {
        yogas.push({
          name: `Raj Yoga (${kl}-${tl} Conjunction)`,
          nameHi: `राजयोग (${kl}-${tl} युति)`,
          type: 'raj',
          description: `${kl} (Kendra lord) and ${tl} (Trikona lord) are conjunct in the ${getOrdinal(klHouse)} house, creating a powerful Raj Yoga. This indicates success, authority, fame and prosperity.`,
          descriptionHi: `${kl} (केन्द्र स्वामी) और ${tl} (त्रिकोण स्वामी) ${klHouse}वें भाव में युति में हैं, जो शक्तिशाली राजयोग बनाता है। यह सफलता, अधिकार, प्रसिद्धि और समृद्धि का संकेत देता है।`,
          planets: [kl, tl],
          strength: isInKendra(klHouse) || isInTrikona(klHouse) ? 'strong' : 'moderate',
        });
      }

      // Exchange (Parivartana): Kendra lord in Trikona house AND Trikona lord in Kendra house
      if (isInTrikona(klHouse) && isInKendra(tlHouse)) {
        yogas.push({
          name: `Raj Yoga (${kl}-${tl} Exchange)`,
          nameHi: `राजयोग (${kl}-${tl} परिवर्तन)`,
          type: 'raj',
          description: `${kl} (Kendra lord) is in a Trikona house and ${tl} (Trikona lord) is in a Kendra house, forming a Raj Yoga through exchange. This creates a powerful mutual support between fortune and action.`,
          descriptionHi: `${kl} (केन्द्र स्वामी) त्रिकोण भाव में और ${tl} (त्रिकोण स्वामी) केन्द्र भाव में है, जो परिवर्तन द्वारा राजयोग बनाता है। यह भाग्य और कर्म के बीच शक्तिशाली पारस्परिक समर्थन बनाता है।`,
          planets: [kl, tl],
          strength: 'strong',
        });
      }
    }
  }

  // ── 1c. Benefics in Kendras (Shubh Kartari / Benefic influence) ──
  const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const beneficsInKendra = planetInfos.filter(p => benefics.includes(p.name) && isInKendra(p.house));
  if (beneficsInKendra.length >= 2) {
    yogas.push({
      name: 'Shubh Yoga (Benefics in Kendra)',
      nameHi: 'शुभ योग (केन्द्र में शुभ ग्रह)',
      type: 'other',
      description: `${beneficsInKendra.map(p => p.name).join(' and ')} are placed in Kendra houses (1, 4, 7, 10). Benefic planets in angular houses create general auspiciousness, giving a comfortable life, good reputation, and support from others.`,
      descriptionHi: `${beneficsInKendra.map(p => p.name).join(' और ')} केन्द्र भावों (1, 4, 7, 10) में स्थित हैं। केन्द्र भावों में शुभ ग्रह सामान्य शुभता बनाते हैं, जो आरामदायक जीवन, अच्छी प्रतिष्ठा और दूसरों का सहयोग देते हैं।`,
      planets: beneficsInKendra.map(p => p.name),
      strength: beneficsInKendra.length >= 3 ? 'strong' : 'moderate',
    });
  }

  // ── 1d. Planet in exaltation ──
  for (const p of planetInfos) {
    if ((p.dignity === 'exalted' || p.dignity === 'peak_exalted') && p.name !== 'Rahu' && p.name !== 'Ketu') {
      yogas.push({
        name: `Uchcha Graha Yoga (${p.name} Exalted)`,
        nameHi: `उच्च ग्रह योग (${p.name} उच्च)`,
        type: 'other',
        description: `${p.name} is in its sign of exaltation in the ${getOrdinal(p.house)} house. An exalted planet gives its best results, bringing exceptional strength to the areas it governs. This is a sign of natural talent and favorable destiny in ${p.name}'s significations.`,
        descriptionHi: `${p.name} अपनी उच्च राशि में ${p.house}वें भाव में है। उच्च ग्रह अपने सर्वोत्तम परिणाम देता है, जो उन क्षेत्रों में असाधारण शक्ति लाता है जिन पर यह शासन करता है। यह ${p.name} के कारकत्व में प्राकृतिक प्रतिभा और अनुकूल भाग्य का संकेत है।`,
        planets: [p.name],
        strength: isInKendra(p.house) ? 'strong' : 'moderate',
      });
    }
  }

  // ── 1e. Planets in own sign ──
  for (const p of planetInfos) {
    if ((p.dignity === 'own_sign' || p.dignity === 'moolatrikona') && p.name !== 'Rahu' && p.name !== 'Ketu') {
      yogas.push({
        name: `Swa-Griha Yoga (${p.name} in Own Sign)`,
        nameHi: `स्वगृह योग (${p.name} स्वराशि में)`,
        type: 'other',
        description: `${p.name} is in its own sign in the ${getOrdinal(p.house)} house. A planet in its own sign is comfortable and confident, delivering reliable positive results. It strengthens the house it occupies and the houses it rules.`,
        descriptionHi: `${p.name} ${p.house}वें भाव में अपनी स्वराशि में है। अपनी राशि में ग्रह सहज और आत्मविश्वासी होता है, विश्वसनीय सकारात्मक परिणाम देता है। यह उस भाव को और जिन भावों पर शासन करता है उन्हें मजबूत करता है।`,
        planets: [p.name],
        strength: isInKendra(p.house) || isInTrikona(p.house) ? 'moderate' : 'mild',
      });
    }
  }

  // ── 2. Gajakesari Yoga (Jupiter in Kendra from Moon) ──

  const jupiterHouse = getPlanetHouse(planetInfos, 'Jupiter');
  const moonHouse = getPlanetHouse(planetInfos, 'Moon');

  if (jupiterHouse > 0 && moonHouse > 0) {
    const diff = ((jupiterHouse - moonHouse + 12) % 12);
    if ([0, 3, 6, 9].includes(diff)) {
      yogas.push({
        name: 'Gajakesari Yoga',
        nameHi: 'गजकेसरी योग',
        type: 'other',
        description: 'Jupiter is in a Kendra (1st, 4th, 7th or 10th) from the Moon, forming Gajakesari Yoga. This is one of the most auspicious yogas, bestowing wisdom, wealth, good reputation, and positions of authority. The native commands respect and leads a prosperous life.',
        descriptionHi: 'गुरु चंद्रमा से केन्द्र (1, 4, 7 या 10वें) भाव में स्थित है, जो गजकेसरी योग बनाता है। यह सबसे शुभ योगों में से एक है, जो बुद्धि, धन, अच्छी प्रतिष्ठा और अधिकार के पद प्रदान करता है। जातक सम्मान प्राप्त करता है और समृद्ध जीवन जीता है।',
        planets: ['Jupiter', 'Moon'],
        strength: 'strong',
      });
    }
  }

  // ── 3. Budh-Aditya Yoga (Sun-Mercury conjunction) ──

  const sunHouse = getPlanetHouse(planetInfos, 'Sun');
  const mercuryHouse = getPlanetHouse(planetInfos, 'Mercury');

  if (sunHouse === mercuryHouse && sunHouse > 0) {
    const mercury = planetInfos.find(p => p.name === 'Mercury');
    const isCombust = planets.find((p: any) => p.name === 'Mercury')?.isCombust;
    if (!isCombust) {
      yogas.push({
        name: 'Budh-Aditya Yoga',
        nameHi: 'बुधादित्य योग',
        type: 'other',
        description: 'Sun and Mercury are conjunct without Mercury being combust, forming Budh-Aditya Yoga. This grants sharp intelligence, excellent communication skills, success in education and intellectual pursuits. The native is learned, articulate and respected in scholarly circles.',
        descriptionHi: 'सूर्य और बुध बिना बुध के अस्त हुए युति में हैं, जो बुधादित्य योग बनाता है। यह तीव्र बुद्धि, उत्कृष्ट संवाद कौशल, शिक्षा और बौद्धिक कार्यों में सफलता प्रदान करता है। जातक विद्वान, वाक्पटु और विद्वत् मंडल में सम्मानित होता है।',
        planets: ['Sun', 'Mercury'],
        strength: 'moderate',
      });
    }
  }

  // ── 4. Pancha Mahapurusha Yogas ──

  // Ruchaka Yoga: Mars in own/exalted sign in Kendra
  const marsInfo = planetInfos.find(p => p.name === 'Mars');
  if (marsInfo && isInKendra(marsInfo.house) && ['exalted', 'peak_exalted', 'own_sign', 'moolatrikona'].includes(marsInfo.dignity)) {
    yogas.push({
      name: 'Ruchaka Yoga',
      nameHi: 'रुचक योग',
      type: 'pancha_mahapurusha',
      description: 'Mars is in its own or exalted sign in a Kendra house, forming Ruchaka Yoga — one of the five Pancha Mahapurusha Yogas. The native is brave, commanding, strong-bodied, leader-like, and achieves success through courage and determination. Government and military positions are favored.',
      descriptionHi: 'मंगल अपनी स्वराशि या उच्च राशि में केन्द्र भाव में स्थित है, जो रुचक योग बनाता है — पंच महापुरुष योगों में से एक। जातक वीर, प्रभावशाली, बलवान, नेतृत्व गुणों वाला होता है और साहस व दृढ़ संकल्प से सफलता प्राप्त करता है। सरकारी और सैन्य पद अनुकूल हैं।',
      planets: ['Mars'],
      strength: 'strong',
    });
  }

  // Bhadra Yoga: Mercury in own/exalted sign in Kendra
  const mercuryInfo = planetInfos.find(p => p.name === 'Mercury');
  if (mercuryInfo && isInKendra(mercuryInfo.house) && ['exalted', 'peak_exalted', 'own_sign', 'moolatrikona'].includes(mercuryInfo.dignity)) {
    yogas.push({
      name: 'Bhadra Yoga',
      nameHi: 'भद्र योग',
      type: 'pancha_mahapurusha',
      description: 'Mercury is in its own or exalted sign in a Kendra house, forming Bhadra Yoga. The native is highly intelligent, eloquent, skilled in commerce and arts, learned in scriptures, and attains fame through intellect and communication.',
      descriptionHi: 'बुध अपनी स्वराशि या उच्च राशि में केन्द्र भाव में स्थित है, जो भद्र योग बनाता है। जातक अत्यंत बुद्धिमान, वाक्पटु, वाणिज्य और कला में कुशल, शास्त्रों में पारंगत होता है और बुद्धि तथा संवाद से प्रसिद्धि प्राप्त करता है।',
      planets: ['Mercury'],
      strength: 'strong',
    });
  }

  // Hamsa Yoga: Jupiter in own/exalted sign in Kendra
  const jupiterInfo = planetInfos.find(p => p.name === 'Jupiter');
  if (jupiterInfo && isInKendra(jupiterInfo.house) && ['exalted', 'peak_exalted', 'own_sign', 'moolatrikona'].includes(jupiterInfo.dignity)) {
    yogas.push({
      name: 'Hamsa Yoga',
      nameHi: 'हंस योग',
      type: 'pancha_mahapurusha',
      description: 'Jupiter is in its own or exalted sign in a Kendra house, forming Hamsa Yoga — the most auspicious of Pancha Mahapurusha Yogas. The native is righteous, learned, spiritually inclined, charitable, well-respected, and lives a long prosperous life blessed with wisdom.',
      descriptionHi: 'गुरु अपनी स्वराशि या उच्च राशि में केन्द्र भाव में स्थित है, जो हंस योग बनाता है — पंच महापुरुष योगों में सबसे शुभ। जातक धर्मात्मा, विद्वान, आध्यात्मिक, दानशील, सम्मानित होता है और ज्ञान से युक्त दीर्घ समृद्ध जीवन जीता है।',
      planets: ['Jupiter'],
      strength: 'strong',
    });
  }

  // Malavya Yoga: Venus in own/exalted sign in Kendra
  const venusInfo = planetInfos.find(p => p.name === 'Venus');
  if (venusInfo && isInKendra(venusInfo.house) && ['exalted', 'peak_exalted', 'own_sign', 'moolatrikona'].includes(venusInfo.dignity)) {
    yogas.push({
      name: 'Malavya Yoga',
      nameHi: 'मालव्य योग',
      type: 'pancha_mahapurusha',
      description: 'Venus is in its own or exalted sign in a Kendra house, forming Malavya Yoga. The native enjoys luxuries, comforts, beautiful spouse, vehicles, artistic talents, and leads a life full of pleasures and material prosperity.',
      descriptionHi: 'शुक्र अपनी स्वराशि या उच्च राशि में केन्द्र भाव में स्थित है, जो मालव्य योग बनाता है। जातक विलासिता, सुख-सुविधाओं, सुंदर जीवनसाथी, वाहनों, कलात्मक प्रतिभा का आनंद लेता है और भोग-विलास तथा भौतिक समृद्धि से परिपूर्ण जीवन जीता है।',
      planets: ['Venus'],
      strength: 'strong',
    });
  }

  // Shasha Yoga: Saturn in own/exalted sign in Kendra
  const saturnInfo = planetInfos.find(p => p.name === 'Saturn');
  if (saturnInfo && isInKendra(saturnInfo.house) && ['exalted', 'peak_exalted', 'own_sign', 'moolatrikona'].includes(saturnInfo.dignity)) {
    yogas.push({
      name: 'Shasha Yoga',
      nameHi: 'शश योग',
      type: 'pancha_mahapurusha',
      description: 'Saturn is in its own or exalted sign in a Kendra house, forming Shasha Yoga. The native rises to power through discipline, hard work and perseverance. Success comes in politics, administration, law, and positions requiring authority over large organizations.',
      descriptionHi: 'शनि अपनी स्वराशि या उच्च राशि में केन्द्र भाव में स्थित है, जो शश योग बनाता है। जातक अनुशासन, कड़ी मेहनत और दृढ़ता से सत्ता प्राप्त करता है। राजनीति, प्रशासन, कानून और बड़े संगठनों पर अधिकार रखने वाले पदों में सफलता मिलती है।',
      planets: ['Saturn'],
      strength: 'strong',
    });
  }

  // ── 5. Dhana Yogas (Wealth) ──

  const lord2 = getHouseLord(houses, 2);
  const lord11 = getHouseLord(houses, 11);
  const lord2House = getPlanetHouse(planetInfos, lord2);
  const lord11House = getPlanetHouse(planetInfos, lord11);

  // 2nd and 11th lord conjunction or exchange
  if (lord2 !== lord11 && lord2House === lord11House && lord2House > 0) {
    yogas.push({
      name: 'Dhana Yoga',
      nameHi: 'धन योग',
      type: 'dhan',
      description: `The lords of the 2nd house (${lord2}) and 11th house (${lord11}) are conjunct, forming a Dhana Yoga. This is a strong indicator of wealth accumulation. The native earns well through the significations of the house where these planets are placed.`,
      descriptionHi: `द्वितीय भाव (${lord2}) और एकादश भाव (${lord11}) के स्वामी युति में हैं, जो धन योग बनाता है। यह धन संचय का प्रबल संकेत है। जातक उस भाव के कारकत्व से अच्छी कमाई करता है जहां ये ग्रह स्थित हैं।`,
      planets: [lord2, lord11],
      strength: 'moderate',
    });
  }

  // Lakshmi Yoga: Lord of 9th in Kendra, strong
  const lord9 = getHouseLord(houses, 9);
  const lord9House = getPlanetHouse(planetInfos, lord9);
  const lord9Info = planetInfos.find(p => p.name === lord9);
  if (lord9Info && isInKendra(lord9House) && ['exalted', 'peak_exalted', 'own_sign', 'moolatrikona'].includes(lord9Info.dignity)) {
    yogas.push({
      name: 'Lakshmi Yoga',
      nameHi: 'लक्ष्मी योग',
      type: 'dhan',
      description: `The 9th lord (${lord9}) is placed in a Kendra house in its own or exalted sign, forming Lakshmi Yoga. This bestows great fortune, wealth, prosperity and divine blessings. The native is highly fortunate and lives a comfortable, affluent life.`,
      descriptionHi: `नवम स्वामी (${lord9}) केन्द्र भाव में अपनी स्वराशि या उच्च राशि में स्थित है, जो लक्ष्मी योग बनाता है। यह महान भाग्य, धन, समृद्धि और दैवीय आशीर्वाद प्रदान करता है। जातक अत्यंत भाग्यशाली है और आरामदायक, संपन्न जीवन जीता है।`,
      planets: [lord9],
      strength: 'strong',
    });
  }

  // ── 6. Viparita Raj Yoga (lords of 6, 8, 12 in each other's houses) ──

  const lord6 = getHouseLord(houses, 6);
  const lord8 = getHouseLord(houses, 8);
  const lord12 = getHouseLord(houses, 12);
  const lord6House = getPlanetHouse(planetInfos, lord6);
  const lord8House = getPlanetHouse(planetInfos, lord8);
  const lord12House = getPlanetHouse(planetInfos, lord12);

  const trikLords = [
    { lord: lord6, house: lord6House, from: 6 },
    { lord: lord8, house: lord8House, from: 8 },
    { lord: lord12, house: lord12House, from: 12 },
  ];

  for (let i = 0; i < trikLords.length; i++) {
    for (let j = i + 1; j < trikLords.length; j++) {
      const a = trikLords[i];
      const b = trikLords[j];
      if (a.lord !== b.lord && TRIK.includes(a.house) && TRIK.includes(b.house)) {
        yogas.push({
          name: 'Viparita Raj Yoga',
          nameHi: 'विपरीत राजयोग',
          type: 'raj',
          description: `The lord of the ${getOrdinal(a.from)} house (${a.lord}) and lord of the ${getOrdinal(b.from)} house (${b.lord}) are placed in Dusthana houses, forming Viparita Raj Yoga. This yoga turns adversity into advantage — the native gains success through unconventional or difficult circumstances.`,
          descriptionHi: `${a.from}वें भाव के स्वामी (${a.lord}) और ${b.from}वें भाव के स्वामी (${b.lord}) दुस्थान भावों में स्थित हैं, जो विपरीत राजयोग बनाता है। यह योग विपरीत परिस्थितियों को लाभ में बदलता है — जातक अपरंपरागत या कठिन परिस्थितियों से सफलता प्राप्त करता है।`,
          planets: [a.lord, b.lord],
          strength: 'moderate',
        });
        break; // Only report once
      }
    }
  }

  // ── 7. Chandra Yogas ──

  // Sunafa Yoga: Planet (not Sun) in 2nd from Moon
  const planetsIn2FromMoon = planetInfos.filter(p =>
    p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu' &&
    ((p.house - moonHouse + 12) % 12) === 1
  );
  if (planetsIn2FromMoon.length > 0) {
    yogas.push({
      name: 'Sunafa Yoga',
      nameHi: 'सुनफा योग',
      type: 'chandra',
      description: `${planetsIn2FromMoon.map(p => p.name).join(', ')} is in the 2nd house from Moon, forming Sunafa Yoga. This gives self-earned wealth, good intelligence, and a respected position in society. The native is independent and achieves success through own efforts.`,
      descriptionHi: `${planetsIn2FromMoon.map(p => p.name).join(', ')} चंद्रमा से दूसरे भाव में स्थित है, जो सुनफा योग बनाता है। यह स्वयं अर्जित धन, अच्छी बुद्धि और समाज में सम्मानित स्थान देता है। जातक स्वतंत्र है और अपने प्रयासों से सफलता प्राप्त करता है।`,
      planets: planetsIn2FromMoon.map(p => p.name),
      strength: 'mild',
    });
  }

  // Anafa Yoga: Planet (not Sun) in 12th from Moon
  const planetsIn12FromMoon = planetInfos.filter(p =>
    p.name !== 'Sun' && p.name !== 'Rahu' && p.name !== 'Ketu' &&
    ((p.house - moonHouse + 12) % 12) === 11
  );
  if (planetsIn12FromMoon.length > 0) {
    yogas.push({
      name: 'Anafa Yoga',
      nameHi: 'अनफा योग',
      type: 'chandra',
      description: `${planetsIn12FromMoon.map(p => p.name).join(', ')} is in the 12th house from Moon, forming Anafa Yoga. This gives good health, pleasing personality, fame and virtue. The native is well-spoken and respected.`,
      descriptionHi: `${planetsIn12FromMoon.map(p => p.name).join(', ')} चंद्रमा से बारहवें भाव में स्थित है, जो अनफा योग बनाता है। यह अच्छा स्वास्थ्य, आकर्षक व्यक्तित्व, प्रसिद्धि और सद्गुण देता है। जातक वाक्पटु और सम्मानित होता है।`,
      planets: planetsIn12FromMoon.map(p => p.name),
      strength: 'mild',
    });
  }

  // ── 8. Neech Bhanga Raj Yoga (Debilitation cancelled) ──

  for (const p of planetInfos) {
    if (p.dignity === 'debilitated' || p.dignity === 'peak_debilitated') {
      const dispositor = getLord(p.signNumber);
      const dispositorHouse = getPlanetHouse(planetInfos, dispositor);
      // If dispositor is in Kendra from Lagna or Moon
      if (isInKendra(dispositorHouse)) {
        yogas.push({
          name: `Neech Bhanga Raj Yoga (${p.name})`,
          nameHi: `नीच भंग राजयोग (${p.name})`,
          type: 'raj',
          description: `${p.name} is debilitated but its dispositor ${dispositor} is in a Kendra, cancelling the debilitation and forming Neech Bhanga Raj Yoga. This turns weakness into extraordinary strength — the native rises from humble or challenging beginnings to great heights.`,
          descriptionHi: `${p.name} नीच है लेकिन इसका स्वामी ${dispositor} केन्द्र में है, जो नीच भंग राजयोग बनाता है। यह कमजोरी को असाधारण शक्ति में बदलता है — जातक विनम्र या चुनौतीपूर्ण शुरुआत से महान ऊंचाइयों तक पहुंचता है।`,
          planets: [p.name, dispositor],
          strength: 'strong',
        });
      }
    }
  }

  // ── Deduplicate ──
  const seen = new Set<string>();
  const uniqueYogas = yogas.filter(y => {
    const key = y.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    yogas: uniqueYogas,
    totalCount: uniqueYogas.length,
    rajYogaCount: uniqueYogas.filter(y => y.type === 'raj').length,
    hasGajakesariYoga: uniqueYogas.some(y => y.name === 'Gajakesari Yoga'),
    hasBudhaAdityaYoga: uniqueYogas.some(y => y.name === 'Budh-Aditya Yoga'),
    hasPanchamahapurushaYoga: uniqueYogas.some(y => y.type === 'pancha_mahapurusha'),
  };
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
