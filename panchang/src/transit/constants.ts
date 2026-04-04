/**
 * Transit (Gochar) Constants
 *
 * Classical Vedic transit rules from:
 * - Phaladeepika (Chapter 26 - Gocharadhyaya)
 * - Brihat Parashara Hora Shastra
 * - Saravali
 *
 * Transit results are calculated from the natal Moon sign.
 * Vedha (obstruction) points cancel favorable transits.
 */

import { TransitRule, TransitInterpretation, LifeArea } from './types';

// ── Rashi Names ──────────────────────────────────────────────────────────────

export const RASHI_NAMES: { en: string; hi: string }[] = [
  { en: 'Aries', hi: 'मेष' },
  { en: 'Taurus', hi: 'वृषभ' },
  { en: 'Gemini', hi: 'मिथुन' },
  { en: 'Cancer', hi: 'कर्क' },
  { en: 'Leo', hi: 'सिंह' },
  { en: 'Virgo', hi: 'कन्या' },
  { en: 'Libra', hi: 'तुला' },
  { en: 'Scorpio', hi: 'वृश्चिक' },
  { en: 'Sagittarius', hi: 'धनु' },
  { en: 'Capricorn', hi: 'मकर' },
  { en: 'Aquarius', hi: 'कुम्भ' },
  { en: 'Pisces', hi: 'मीन' },
];

// ── Transit Rules (Favorable Houses + Vedha Points) ─────────────────────────
// Source: Phaladeepika, Chapter 26

export const TRANSIT_RULES: Record<string, TransitRule> = {
  Sun: {
    favorableHouses: [3, 6, 10, 11],
    vedhaPairs: { 3: 9, 6: 12, 10: 4, 11: 5 },
  },
  Moon: {
    favorableHouses: [1, 3, 6, 7, 10, 11],
    vedhaPairs: { 1: 5, 3: 9, 6: 12, 7: 2, 10: 4, 11: 8 },
  },
  Mars: {
    favorableHouses: [3, 6, 11],
    vedhaPairs: { 3: 12, 6: 9, 11: 5 },
  },
  Mercury: {
    favorableHouses: [2, 4, 6, 8, 10, 11],
    vedhaPairs: { 2: 5, 4: 3, 6: 9, 8: 1, 10: 8, 11: 12 },
  },
  Jupiter: {
    favorableHouses: [2, 5, 7, 9, 11],
    vedhaPairs: { 2: 12, 5: 4, 7: 3, 9: 10, 11: 8 },
  },
  Venus: {
    favorableHouses: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    vedhaPairs: { 1: 8, 2: 7, 3: 1, 4: 10, 5: 9, 8: 5, 9: 11, 11: 6, 12: 3 },
  },
  Saturn: {
    favorableHouses: [3, 6, 11],
    vedhaPairs: { 3: 12, 6: 9, 11: 5 },
  },
  Rahu: {
    favorableHouses: [3, 6, 10, 11],
    vedhaPairs: { 3: 9, 6: 12, 10: 4, 11: 5 },
  },
  Ketu: {
    favorableHouses: [3, 6, 11],
    vedhaPairs: { 3: 12, 6: 9, 11: 5 },
  },
};

// ── Planet Transit Weights ──────────────────────────────────────────────────
// Slow planets have more weight in daily horoscope

export const PLANET_WEIGHTS: Record<string, number> = {
  Saturn: 1.0,    // ~2.5 years per sign — strongest long-term impact
  Jupiter: 0.9,   // ~1 year per sign
  Rahu: 0.85,     // ~1.5 years per sign
  Ketu: 0.85,     // ~1.5 years per sign
  Mars: 0.6,      // ~45 days per sign
  Sun: 0.5,       // ~30 days per sign
  Venus: 0.5,     // ~30 days per sign
  Mercury: 0.4,   // ~25 days per sign
  Moon: 0.3,      // ~2.5 days per sign — fastest, least daily weight
};

// ── Planet → Life Area Mapping ──────────────────────────────────────────────

export const PLANET_AREA_MAP: Record<string, LifeArea[]> = {
  Sun: ['career', 'health', 'general'],
  Moon: ['health', 'relationships', 'general'],
  Mars: ['career', 'health', 'general'],
  Mercury: ['career', 'finance', 'general'],
  Jupiter: ['finance', 'spiritual', 'general'],
  Venus: ['relationships', 'finance', 'general'],
  Saturn: ['career', 'health', 'general'],
  Rahu: ['career', 'general'],
  Ketu: ['spiritual', 'health', 'general'],
};

// ── Transit Interpretations ─────────────────────────────────────────────────
// Planet → House (1-12) → Interpretation
// Based on Phaladeepika Gochar results

export const TRANSIT_INTERPRETATIONS: Record<string, Record<number, TransitInterpretation>> = {
  Sun: {
    1: {
      en: 'Fatigue, ego conflicts, and health concerns. Avoid unnecessary travel. Government-related matters may bring stress.',
      hi: 'थकान, अहंकार संघर्ष और स्वास्थ्य चिंताएं। अनावश्यक यात्रा से बचें। सरकारी मामले तनाव दे सकते हैं।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    2: {
      en: 'Financial losses possible. Be cautious with speech and family matters. Avoid risky investments.',
      hi: 'आर्थिक हानि संभव। वाणी और पारिवारिक मामलों में सावधानी बरतें। जोखिम भरे निवेश से बचें।',
      areas: ['finance', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    3: {
      en: 'Victory over rivals, good health, and increased courage. Favorable for bold initiatives and short travels.',
      hi: 'शत्रुओं पर विजय, अच्छा स्वास्थ्य और बढ़ा हुआ साहस। साहसिक पहल और छोटी यात्राओं के लिए अनुकूल।',
      areas: ['career', 'health'],
      effect: 'favorable',
      intensity: 2,
    },
    4: {
      en: 'Domestic unrest and mental anxiety. Vehicle-related issues possible. Relationship strain with close ones.',
      hi: 'घरेलू अशांति और मानसिक चिंता। वाहन संबंधी समस्याएं संभव। करीबियों से संबंधों में तनाव।',
      areas: ['relationships', 'health'],
      effect: 'unfavorable',
      intensity: 2,
    },
    5: {
      en: 'Mental restlessness and obstacles in creative pursuits. Children-related concerns. Avoid speculative activities.',
      hi: 'मानसिक अशांति और रचनात्मक कार्यों में बाधा। संतान संबंधी चिंता। सट्टेबाजी से बचें।',
      areas: ['general', 'finance'],
      effect: 'unfavorable',
      intensity: 1,
    },
    6: {
      en: 'Victory over enemies and diseases. Good health and confidence. Legal matters favor you. Debts get resolved.',
      hi: 'शत्रुओं और रोगों पर विजय। अच्छा स्वास्थ्य और आत्मविश्वास। कानूनी मामले अनुकूल। ऋण का समाधान।',
      areas: ['health', 'career'],
      effect: 'favorable',
      intensity: 2,
    },
    7: {
      en: 'Travel fatigue and disagreements with partner. Stomach issues possible. Business partnerships need care.',
      hi: 'यात्रा की थकान और साथी से मतभेद। पेट की समस्या संभव। व्यापारिक साझेदारी में सावधानी।',
      areas: ['relationships', 'health'],
      effect: 'unfavorable',
      intensity: 2,
    },
    8: {
      en: 'Health issues, fever, and obstacles. Be cautious with government authorities. Avoid risky ventures.',
      hi: 'स्वास्थ्य समस्याएं, बुखार और बाधाएं। सरकारी अधिकारियों से सावधान रहें। जोखिम भरे कार्यों से बचें।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    9: {
      en: 'Obstacles in fortune, possible humiliation, and mental stress. Spiritual pursuits face interruptions.',
      hi: 'भाग्य में बाधा, संभावित अपमान और मानसिक तनाव। आध्यात्मिक कार्यों में रुकावट।',
      areas: ['spiritual', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    10: {
      en: 'Success in career and professional recognition. Authority and status improve. Good time for ambitious projects.',
      hi: 'करियर में सफलता और पेशेवर मान्यता। अधिकार और प्रतिष्ठा में वृद्धि। महत्वाकांक्षी परियोजनाओं के लिए अच्छा समय।',
      areas: ['career', 'general'],
      effect: 'favorable',
      intensity: 3,
    },
    11: {
      en: 'Financial gains, new income sources, and fulfillment of desires. Social circle expands. Promotions likely.',
      hi: 'आर्थिक लाभ, नई आय के स्रोत और इच्छाओं की पूर्ति। सामाजिक दायरा बढ़ता है। पदोन्नति संभव।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    12: {
      en: 'Expenditure increases and energy depletes. Eye-related issues possible. Avoid confrontations with authority.',
      hi: 'खर्च बढ़ता है और ऊर्जा कम होती है। नेत्र संबंधी समस्या संभव। अधिकारियों से टकराव से बचें।',
      areas: ['finance', 'health'],
      effect: 'unfavorable',
      intensity: 2,
    },
  },

  Moon: {
    1: {
      en: 'Good food, comforts, and pleasant experiences. Emotional well-being is strong. Social interactions are fulfilling.',
      hi: 'अच्छा भोजन, सुख-सुविधाएं और सुखद अनुभव। भावनात्मक स्वास्थ्य मजबूत। सामाजिक संवाद संतोषजनक।',
      areas: ['health', 'relationships'],
      effect: 'favorable',
      intensity: 1,
    },
    2: {
      en: 'Loss of reputation and financial setbacks. Be careful with speech. Family tensions possible.',
      hi: 'प्रतिष्ठा में हानि और आर्थिक झटके। वाणी में सावधानी बरतें। पारिवारिक तनाव संभव।',
      areas: ['finance', 'relationships'],
      effect: 'unfavorable',
      intensity: 1,
    },
    3: {
      en: 'Success and victory. Good time for communication and short trips. Confidence runs high.',
      hi: 'सफलता और विजय। संवाद और छोटी यात्राओं के लिए अच्छा समय। आत्मविश्वास ऊंचा।',
      areas: ['career', 'general'],
      effect: 'favorable',
      intensity: 1,
    },
    4: {
      en: 'Fear and mental unease. Domestic environment feels unsettled. Avoid major decisions today.',
      hi: 'भय और मानसिक अशांति। घरेलू वातावरण अस्थिर। आज बड़े फैसलों से बचें।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 1,
    },
    5: {
      en: 'Obstacles in plans and low energy. Children or creative work may cause worry. Stay patient.',
      hi: 'योजनाओं में बाधा और कम ऊर्जा। संतान या रचनात्मक कार्य चिंता का कारण। धैर्य रखें।',
      areas: ['general', 'health'],
      effect: 'unfavorable',
      intensity: 1,
    },
    6: {
      en: 'Victory over rivals and good health. Obstacles clear naturally. A productive and confident day.',
      hi: 'प्रतिद्वंद्वियों पर विजय और अच्छा स्वास्थ्य। बाधाएं स्वतः दूर। उत्पादक और आत्मविश्वासी दिन।',
      areas: ['health', 'career'],
      effect: 'favorable',
      intensity: 1,
    },
    7: {
      en: 'Pleasant interactions and social harmony. Good for meetings, partnerships, and romantic connections.',
      hi: 'सुखद बातचीत और सामाजिक सद्भाव। बैठकों, साझेदारी और प्रेम संबंधों के लिए अच्छा।',
      areas: ['relationships', 'general'],
      effect: 'favorable',
      intensity: 1,
    },
    8: {
      en: 'Emotional turbulence and unexpected expenses. Health needs attention. Avoid risky activities.',
      hi: 'भावनात्मक उथल-पुथल और अप्रत्याशित खर्च। स्वास्थ्य पर ध्यान दें। जोखिम भरी गतिविधियों से बचें।',
      areas: ['health', 'finance'],
      effect: 'unfavorable',
      intensity: 1,
    },
    9: {
      en: 'Low mood and spiritual disconnect. Long-distance plans may face delays. Rest is advised.',
      hi: 'कम मनोदशा और आध्यात्मिक विच्छेद। लंबी दूरी की योजनाओं में देरी। आराम की सलाह।',
      areas: ['spiritual', 'general'],
      effect: 'unfavorable',
      intensity: 1,
    },
    10: {
      en: 'Professional success and public recognition. Work flows smoothly. Good time for important meetings.',
      hi: 'पेशेवर सफलता और सार्वजनिक मान्यता। कार्य सुचारू रूप से। महत्वपूर्ण बैठकों के लिए अच्छा समय।',
      areas: ['career', 'general'],
      effect: 'favorable',
      intensity: 1,
    },
    11: {
      en: 'Gains, happy news, and social enjoyment. Desires get fulfilled. A cheerful and rewarding day.',
      hi: 'लाभ, शुभ समाचार और सामाजिक आनंद। इच्छाएं पूरी होती हैं। प्रसन्न और फलदायक दिन।',
      areas: ['finance', 'relationships'],
      effect: 'favorable',
      intensity: 1,
    },
    12: {
      en: 'Expenses and emotional drain. Sleep may be disturbed. Practice mindfulness and avoid overthinking.',
      hi: 'खर्च और भावनात्मक थकान। नींद में बाधा। सचेतनता का अभ्यास करें और अधिक सोचने से बचें।',
      areas: ['finance', 'health'],
      effect: 'unfavorable',
      intensity: 1,
    },
  },

  Mars: {
    1: {
      en: 'Anger and accidents prone. Health issues related to blood and heat. Avoid conflicts and rash driving.',
      hi: 'क्रोध और दुर्घटना की संभावना। रक्त और गर्मी से संबंधित स्वास्थ्य समस्याएं। संघर्ष और तेज ड्राइविंग से बचें।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    2: {
      en: 'Harsh speech causes problems. Financial disputes and family arguments. Guard your words carefully.',
      hi: 'कठोर वाणी समस्याएं पैदा करती है। आर्थिक विवाद और पारिवारिक बहस। अपने शब्दों पर ध्यान दें।',
      areas: ['relationships', 'finance'],
      effect: 'unfavorable',
      intensity: 2,
    },
    3: {
      en: 'Courage peaks, rivals defeated. Excellent for competitive exams, sports, and assertive action.',
      hi: 'साहस चरम पर, प्रतिद्वंद्वी पराजित। प्रतियोगी परीक्षाओं, खेल और दृढ़ कार्रवाई के लिए उत्कृष्ट।',
      areas: ['career', 'health'],
      effect: 'favorable',
      intensity: 3,
    },
    4: {
      en: 'Domestic strife and property troubles. Stomach ailments possible. Mental peace disturbed.',
      hi: 'घरेलू कलह और संपत्ति की समस्याएं। पेट की बीमारी संभव। मानसिक शांति भंग।',
      areas: ['relationships', 'health'],
      effect: 'unfavorable',
      intensity: 2,
    },
    5: {
      en: 'Obstacles in education and children matters. Impulsive decisions bring trouble. Think before acting.',
      hi: 'शिक्षा और संतान मामलों में बाधा। आवेगपूर्ण निर्णय परेशानी लाते हैं। कार्य करने से पहले सोचें।',
      areas: ['general', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    6: {
      en: 'Complete victory over enemies and diseases. Legal wins, debt clearance. A powerful and dominant day.',
      hi: 'शत्रुओं और रोगों पर पूर्ण विजय। कानूनी जीत, ऋण मुक्ति। शक्तिशाली और प्रभावशाली दिन।',
      areas: ['health', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    7: {
      en: 'Partner disagreements and marital tension. Business partnerships face friction. Practice patience.',
      hi: 'साथी से मतभेद और वैवाहिक तनाव। व्यापारिक साझेदारी में घर्षण। धैर्य रखें।',
      areas: ['relationships', 'career'],
      effect: 'unfavorable',
      intensity: 2,
    },
    8: {
      en: 'Accidents, surgeries, or sudden health crises. Blood-related issues. Exercise extreme caution.',
      hi: 'दुर्घटनाएं, शल्य चिकित्सा या अचानक स्वास्थ्य संकट। रक्त संबंधी समस्याएं। अत्यधिक सावधानी बरतें।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    9: {
      en: 'Conflicts with father or guru figures. Luck feels blocked. Avoid arguments about beliefs.',
      hi: 'पिता या गुरु से संघर्ष। भाग्य अवरुद्ध लगता है। विश्वासों पर बहस से बचें।',
      areas: ['spiritual', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    10: {
      en: 'Career obstacles and conflicts with authority. Professional setbacks possible. Stay disciplined.',
      hi: 'करियर में बाधाएं और अधिकारियों से संघर्ष। पेशेवर झटके संभव। अनुशासित रहें।',
      areas: ['career', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    11: {
      en: 'Financial gains through bold action. New income opportunities. Friends and networks bring profit.',
      hi: 'साहसिक कार्रवाई से आर्थिक लाभ। नई आय के अवसर। मित्र और नेटवर्क लाभ लाते हैं।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    12: {
      en: 'Expenditure on medical issues. Eye problems possible. Energy drains through hidden enemies.',
      hi: 'चिकित्सा मुद्दों पर खर्च। नेत्र समस्या संभव। छिपे शत्रुओं से ऊर्जा का क्षय।',
      areas: ['health', 'finance'],
      effect: 'unfavorable',
      intensity: 2,
    },
  },

  Mercury: {
    1: {
      en: 'Mental confusion and communication errors. Avoid signing important documents. Double-check everything.',
      hi: 'मानसिक भ्रम और संवाद में त्रुटियां। महत्वपूर्ण दस्तावेजों पर हस्ताक्षर से बचें। सब कुछ दोबारा जांचें।',
      areas: ['general', 'career'],
      effect: 'unfavorable',
      intensity: 1,
    },
    2: {
      en: 'Gains through intellect and communication. Good for business deals, writing, and financial planning.',
      hi: 'बुद्धि और संवाद से लाभ। व्यापारिक सौदों, लेखन और वित्तीय योजना के लिए अच्छा।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 2,
    },
    3: {
      en: 'Conflicts with siblings and neighbors. Communication misunderstandings. Short travel may bring trouble.',
      hi: 'भाई-बहनों और पड़ोसियों से संघर्ष। संवाद में गलतफहमी। छोटी यात्रा परेशानी ला सकती है।',
      areas: ['relationships', 'general'],
      effect: 'unfavorable',
      intensity: 1,
    },
    4: {
      en: 'Domestic happiness and intellectual pursuits thrive. Good for education, property deals, and family bonding.',
      hi: 'घरेलू सुख और बौद्धिक कार्य फलते-फूलते हैं। शिक्षा, संपत्ति सौदों और पारिवारिक जुड़ाव के लिए अच्छा।',
      areas: ['relationships', 'career'],
      effect: 'favorable',
      intensity: 2,
    },
    5: {
      en: 'Arguments and mental agitation. Speculative losses possible. Creative blocks. Avoid gambling.',
      hi: 'बहस और मानसिक उत्तेजना। सट्टा हानि संभव। रचनात्मक अवरोध। जुआ से बचें।',
      areas: ['finance', 'general'],
      effect: 'unfavorable',
      intensity: 1,
    },
    6: {
      en: 'Victory in debates and competitions. Health improves. Legal matters resolved favorably. Enemies retreat.',
      hi: 'वाद-विवाद और प्रतियोगिताओं में विजय। स्वास्थ्य सुधरता है। कानूनी मामले अनुकूल। शत्रु पीछे हटते हैं।',
      areas: ['career', 'health'],
      effect: 'favorable',
      intensity: 2,
    },
    7: {
      en: 'Misunderstandings with partner. Business negotiations hit snags. Avoid verbal commitments.',
      hi: 'साथी से गलतफहमी। व्यापार वार्ता में अड़चन। मौखिक प्रतिबद्धताओं से बचें।',
      areas: ['relationships', 'career'],
      effect: 'unfavorable',
      intensity: 1,
    },
    8: {
      en: 'Research and investigation succeed. Hidden knowledge surfaces. Good for occult studies and deep analysis.',
      hi: 'अनुसंधान और जांच सफल। छिपा ज्ञान सामने आता है। गूढ़ अध्ययन और गहन विश्लेषण के लिए अच्छा।',
      areas: ['spiritual', 'career'],
      effect: 'favorable',
      intensity: 1,
    },
    9: {
      en: 'Obstacles in higher learning and long travel. Religious activities face disruption.',
      hi: 'उच्च शिक्षा और लंबी यात्रा में बाधा। धार्मिक गतिविधियों में व्यवधान।',
      areas: ['spiritual', 'general'],
      effect: 'unfavorable',
      intensity: 1,
    },
    10: {
      en: 'Professional success through communication. Recognition for intellectual work. Excellent for presentations.',
      hi: 'संवाद से पेशेवर सफलता। बौद्धिक कार्य के लिए मान्यता। प्रस्तुतियों के लिए उत्कृष्ट।',
      areas: ['career', 'general'],
      effect: 'favorable',
      intensity: 2,
    },
    11: {
      en: 'Profits through trade, writing, or communication. Network expansion. Intellectual friendships bring gains.',
      hi: 'व्यापार, लेखन या संवाद से लाभ। नेटवर्क विस्तार। बौद्धिक मित्रता से लाभ।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 2,
    },
    12: {
      en: 'Mental fatigue and overthinking. Communication breakdowns. Avoid important negotiations.',
      hi: 'मानसिक थकान और अत्यधिक सोच। संवाद में टूटन। महत्वपूर्ण वार्ता से बचें।',
      areas: ['health', 'career'],
      effect: 'unfavorable',
      intensity: 1,
    },
  },

  Jupiter: {
    1: {
      en: 'Low confidence and displaced from comfort zone. Expenses on travel. Health needs attention.',
      hi: 'कम आत्मविश्वास और आराम क्षेत्र से विस्थापन। यात्रा पर खर्च। स्वास्थ्य पर ध्यान दें।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    2: {
      en: 'Wealth accumulation and family happiness. Eloquent speech brings respect. Good for investments.',
      hi: 'धन संचय और पारिवारिक सुख। वाक्पटुता सम्मान लाती है। निवेश के लिए अच्छा।',
      areas: ['finance', 'relationships'],
      effect: 'favorable',
      intensity: 3,
    },
    3: {
      en: 'Setbacks in efforts and strained sibling relations. Plans face obstacles. Stay persistent.',
      hi: 'प्रयासों में झटके और भाई-बहनों से तनावपूर्ण संबंध। योजनाओं में बाधा। दृढ़ रहें।',
      areas: ['career', 'relationships'],
      effect: 'unfavorable',
      intensity: 1,
    },
    4: {
      en: 'Domestic unhappiness and property issues. Emotional restlessness. Relationship with mother may be strained.',
      hi: 'घरेलू दुख और संपत्ति समस्याएं। भावनात्मक बेचैनी। माता से संबंध तनावपूर्ण हो सकते हैं।',
      areas: ['relationships', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    5: {
      en: 'Children bring joy. Wisdom and learning flourish. Good for education, mantras, and spiritual practices.',
      hi: 'संतान सुख देती है। ज्ञान और शिक्षा फलती-फूलती है। शिक्षा, मंत्र और आध्यात्मिक साधना के लिए अच्छा।',
      areas: ['spiritual', 'general'],
      effect: 'favorable',
      intensity: 3,
    },
    6: {
      en: 'Enemies cause trouble and health suffers. Legal issues may arise. Be cautious with opponents.',
      hi: 'शत्रु परेशानी देते हैं और स्वास्थ्य खराब। कानूनी मुद्दे उत्पन्न हो सकते हैं। विरोधियों से सावधान।',
      areas: ['health', 'career'],
      effect: 'unfavorable',
      intensity: 2,
    },
    7: {
      en: 'Excellent for relationships and partnerships. Marriage prospects improve. Business collaborations thrive.',
      hi: 'संबंधों और साझेदारी के लिए उत्कृष्ट। विवाह की संभावनाएं बेहतर। व्यापारिक सहयोग फलता-फूलता है।',
      areas: ['relationships', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    8: {
      en: 'Obstacles, humiliation, and health issues. Avoid risky ventures. Unexpected setbacks possible.',
      hi: 'बाधाएं, अपमान और स्वास्थ्य समस्याएं। जोखिम भरे कार्यों से बचें। अप्रत्याशित झटके संभव।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    9: {
      en: 'Peak fortune and divine blessings. Spiritual growth, pilgrimage, and dharmic activities blessed. Guru guidance arrives.',
      hi: 'चरम भाग्य और दैवीय आशीर्वाद। आध्यात्मिक विकास, तीर्थयात्रा और धार्मिक गतिविधियां आशीर्वादित। गुरु मार्गदर्शन प्राप्त।',
      areas: ['spiritual', 'general'],
      effect: 'favorable',
      intensity: 3,
    },
    10: {
      en: 'Career struggles and loss of position. Professional reputation under pressure. Stay humble and patient.',
      hi: 'करियर में संघर्ष और पद हानि। पेशेवर प्रतिष्ठा पर दबाव। विनम्र और धैर्यवान रहें।',
      areas: ['career', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    11: {
      en: 'Maximum gains and wish fulfillment. Promotions, new vehicles, and celebrations. Best transit for prosperity.',
      hi: 'अधिकतम लाभ और मनोकामना पूर्ति। पदोन्नति, नए वाहन और उत्सव। समृद्धि के लिए सर्वोत्तम गोचर।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    12: {
      en: 'Expenditure and spiritual isolation. Financial outflow increases. However, good for meditation and charity.',
      hi: 'खर्च और आध्यात्मिक एकांत। आर्थिक बहिर्वाह बढ़ता है। हालांकि, ध्यान और दान के लिए अच्छा।',
      areas: ['finance', 'spiritual'],
      effect: 'unfavorable',
      intensity: 2,
    },
  },

  Venus: {
    1: {
      en: 'Luxury, pleasure, and enjoyment. Attractive appearance and social charm. Romantic opportunities arise.',
      hi: 'विलासिता, आनंद और भोग। आकर्षक उपस्थिति और सामाजिक आकर्षण। प्रेम के अवसर।',
      areas: ['relationships', 'general'],
      effect: 'favorable',
      intensity: 2,
    },
    2: {
      en: 'Wealth through luxury items. Family harmony and good food. Gains from art, music, or beauty.',
      hi: 'विलासिता की वस्तुओं से धन। पारिवारिक सद्भाव और अच्छा भोजन। कला, संगीत या सौंदर्य से लाभ।',
      areas: ['finance', 'relationships'],
      effect: 'favorable',
      intensity: 2,
    },
    3: {
      en: 'Success in creative endeavors. Good relations with siblings. Short trips bring pleasure.',
      hi: 'रचनात्मक प्रयासों में सफलता। भाई-बहनों से अच्छे संबंध। छोटी यात्राएं आनंद लाती हैं।',
      areas: ['career', 'relationships'],
      effect: 'favorable',
      intensity: 2,
    },
    4: {
      en: 'Domestic bliss, new vehicle, and property gains. Home feels luxurious and comforting.',
      hi: 'घरेलू आनंद, नया वाहन और संपत्ति लाभ। घर विलासितापूर्ण और सुखदायक लगता है।',
      areas: ['relationships', 'finance'],
      effect: 'favorable',
      intensity: 2,
    },
    5: {
      en: 'Romance, creativity, and children bring joy. Good for artistic expression and entertainment.',
      hi: 'प्रेम, रचनात्मकता और संतान सुख देते हैं। कलात्मक अभिव्यक्ति और मनोरंजन के लिए अच्छा।',
      areas: ['relationships', 'general'],
      effect: 'favorable',
      intensity: 2,
    },
    6: {
      en: 'Enemies cause trouble through women or luxury-related matters. Health issues related to kidneys or sugar.',
      hi: 'स्त्री या विलासिता संबंधी मामलों से शत्रु परेशानी देते हैं। गुर्दे या शर्करा संबंधी स्वास्थ्य समस्याएं।',
      areas: ['health', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    7: {
      en: 'Relationship conflicts and partner dissatisfaction. Business partnerships face friction over values.',
      hi: 'संबंधों में संघर्ष और साथी से असंतोष। मूल्यों पर व्यापारिक साझेदारी में घर्षण।',
      areas: ['relationships', 'career'],
      effect: 'unfavorable',
      intensity: 2,
    },
    8: {
      en: 'Unexpected gains and secret pleasures. Inheritance or insurance benefits. Good for tantric practices.',
      hi: 'अप्रत्याशित लाभ और गुप्त सुख। विरासत या बीमा लाभ। तांत्रिक साधनाओं के लिए अच्छा।',
      areas: ['finance', 'spiritual'],
      effect: 'favorable',
      intensity: 1,
    },
    9: {
      en: 'Spiritual growth through beauty and art. Pilgrimages are pleasant. Fortune supports creative ventures.',
      hi: 'सौंदर्य और कला से आध्यात्मिक विकास। तीर्थयात्राएं सुखद। भाग्य रचनात्मक उद्यमों का समर्थन करता है।',
      areas: ['spiritual', 'finance'],
      effect: 'favorable',
      intensity: 2,
    },
    10: {
      en: 'Professional setbacks and loss of comfort. Status in society may dip. Avoid luxury expenditures.',
      hi: 'पेशेवर झटके और सुख की हानि। समाज में प्रतिष्ठा गिर सकती है। विलासिता खर्चों से बचें।',
      areas: ['career', 'finance'],
      effect: 'unfavorable',
      intensity: 2,
    },
    11: {
      en: 'Maximum gains from luxury, art, and beauty. Social life flourishes. All desires get fulfilled.',
      hi: 'विलासिता, कला और सौंदर्य से अधिकतम लाभ। सामाजिक जीवन फलता-फूलता है। सभी इच्छाएं पूरी।',
      areas: ['finance', 'relationships'],
      effect: 'favorable',
      intensity: 3,
    },
    12: {
      en: 'Bedroom pleasures and spiritual experiences. Expenditure on luxury but with satisfaction. Good for meditation.',
      hi: 'शयनकक्ष सुख और आध्यात्मिक अनुभव। विलासिता पर खर्च लेकिन संतुष्टि के साथ। ध्यान के लिए अच्छा।',
      areas: ['relationships', 'spiritual'],
      effect: 'favorable',
      intensity: 1,
    },
  },

  Saturn: {
    1: {
      en: 'Health issues, fatigue, and low vitality. Start of Sade Sati-like effects. Practice patience and self-care.',
      hi: 'स्वास्थ्य समस्याएं, थकान और कम जीवन शक्ति। साढ़ेसाती जैसे प्रभावों की शुरुआत। धैर्य और आत्म-देखभाल करें।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    2: {
      en: 'Financial losses and family discord. Speech becomes harsh. Savings deplete. Avoid lending money.',
      hi: 'आर्थिक हानि और पारिवारिक कलह। वाणी कठोर होती है। बचत कम। पैसे उधार देने से बचें।',
      areas: ['finance', 'relationships'],
      effect: 'unfavorable',
      intensity: 3,
    },
    3: {
      en: 'Courage and determination at their peak. Enemies defeated through perseverance. Promotions through hard work.',
      hi: 'साहस और दृढ़ संकल्प चरम पर। दृढ़ता से शत्रु पराजित। कड़ी मेहनत से पदोन्नति।',
      areas: ['career', 'general'],
      effect: 'favorable',
      intensity: 3,
    },
    4: {
      en: 'Deep domestic unhappiness and property troubles. Vehicle breakdowns. Mental depression possible.',
      hi: 'गहरा घरेलू दुख और संपत्ति की समस्याएं। वाहन खराबी। मानसिक अवसाद संभव।',
      areas: ['relationships', 'health'],
      effect: 'unfavorable',
      intensity: 3,
    },
    5: {
      en: 'Children cause worry. Education faces obstacles. Intellectual dullness. Avoid speculation entirely.',
      hi: 'संतान चिंता का कारण। शिक्षा में बाधा। बौद्धिक मंदता। सट्टेबाजी से पूरी तरह बचें।',
      areas: ['general', 'finance'],
      effect: 'unfavorable',
      intensity: 2,
    },
    6: {
      en: 'Dominance over enemies and legal victories. Health stabilizes. Debts get cleared. Strong willpower.',
      hi: 'शत्रुओं पर प्रभुत्व और कानूनी विजय। स्वास्थ्य स्थिर। ऋण मुक्ति। मजबूत इच्छाशक्ति।',
      areas: ['health', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    7: {
      en: 'Relationship strain and marital difficulties. Business partnerships face delays. Travel brings fatigue.',
      hi: 'संबंधों में तनाव और वैवाहिक कठिनाइयां। व्यापारिक साझेदारी में देरी। यात्रा थकान लाती है।',
      areas: ['relationships', 'career'],
      effect: 'unfavorable',
      intensity: 3,
    },
    8: {
      en: 'Serious health issues and accidents. Legal troubles and humiliation. The most challenging Saturn transit.',
      hi: 'गंभीर स्वास्थ्य समस्याएं और दुर्घटनाएं। कानूनी परेशानी और अपमान। सबसे चुनौतीपूर्ण शनि गोचर।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    9: {
      en: 'Fortune blocked and spiritual crisis. Father\'s health may suffer. Dharmic activities feel fruitless.',
      hi: 'भाग्य अवरुद्ध और आध्यात्मिक संकट। पिता का स्वास्थ्य प्रभावित। धार्मिक गतिविधियां निष्फल लगती हैं।',
      areas: ['spiritual', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    10: {
      en: 'Career setbacks and loss of authority. Professional reputation under threat. Demotion or transfer possible.',
      hi: 'करियर में झटके और अधिकार की हानि। पेशेवर प्रतिष्ठा खतरे में। पदावनति या स्थानांतरण संभव।',
      areas: ['career', 'general'],
      effect: 'unfavorable',
      intensity: 3,
    },
    11: {
      en: 'Steady gains and long-term profits. Hard work pays off handsomely. Best Saturn transit for material success.',
      hi: 'स्थिर लाभ और दीर्घकालिक मुनाफा। कड़ी मेहनत का बेहतरीन फल। भौतिक सफलता के लिए सर्वोत्तम शनि गोचर।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    12: {
      en: 'Heavy expenditure and confinement. Hospitalization or foreign settlement possible. Spiritual surrender helps.',
      hi: 'भारी खर्च और बंधन। अस्पताल में भर्ती या विदेश बसना संभव। आध्यात्मिक समर्पण सहायक।',
      areas: ['finance', 'health'],
      effect: 'unfavorable',
      intensity: 3,
    },
  },

  Rahu: {
    1: {
      en: 'Confusion about identity and health anxiety. Avoid intoxicants. Unconventional thoughts dominate.',
      hi: 'पहचान को लेकर भ्रम और स्वास्थ्य चिंता। नशीले पदार्थों से बचें। अपरंपरागत विचार हावी।',
      areas: ['health', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    2: {
      en: 'Financial instability and deceptive dealings. Family misunderstandings. Guard savings carefully.',
      hi: 'आर्थिक अस्थिरता और छलपूर्ण व्यवहार। पारिवारिक गलतफहमी। बचत की सावधानी से रक्षा करें।',
      areas: ['finance', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    3: {
      en: 'Bold communication and unconventional success. Media, technology, and networking bring gains.',
      hi: 'साहसी संवाद और अपरंपरागत सफलता। मीडिया, प्रौद्योगिकी और नेटवर्किंग से लाभ।',
      areas: ['career', 'finance'],
      effect: 'favorable',
      intensity: 2,
    },
    4: {
      en: 'Domestic turbulence and property disputes. Mother\'s health may be affected. Mental restlessness.',
      hi: 'घरेलू उथल-पुथल और संपत्ति विवाद। माता का स्वास्थ्य प्रभावित। मानसिक बेचैनी।',
      areas: ['relationships', 'health'],
      effect: 'unfavorable',
      intensity: 2,
    },
    5: {
      en: 'Unexpected events with children. Speculative gains or losses — unpredictable. Avoid impulsive romance.',
      hi: 'संतान से अप्रत्याशित घटनाएं। सट्टा लाभ या हानि — अप्रत्याशित। आवेगपूर्ण प्रेम से बचें।',
      areas: ['relationships', 'finance'],
      effect: 'unfavorable',
      intensity: 2,
    },
    6: {
      en: 'Victory over enemies through cunning strategy. Legal wins using unconventional methods. Health improves.',
      hi: 'चतुर रणनीति से शत्रुओं पर विजय। अपरंपरागत तरीकों से कानूनी जीत। स्वास्थ्य सुधरता है।',
      areas: ['career', 'health'],
      effect: 'favorable',
      intensity: 2,
    },
    7: {
      en: 'Foreign connections in relationships. Unconventional partnerships. Existing relationships face confusion.',
      hi: 'संबंधों में विदेशी संपर्क। अपरंपरागत साझेदारी। मौजूदा संबंधों में भ्रम।',
      areas: ['relationships', 'career'],
      effect: 'unfavorable',
      intensity: 2,
    },
    8: {
      en: 'Sudden health scares and hidden dangers. Occult experiences intensify. Avoid risky investments.',
      hi: 'अचानक स्वास्थ्य भय और छिपे खतरे। गूढ़ अनुभव तीव्र। जोखिम भरे निवेश से बचें।',
      areas: ['health', 'finance'],
      effect: 'unfavorable',
      intensity: 3,
    },
    9: {
      en: 'Spiritual confusion and questioning beliefs. Foreign travel possible but with complications.',
      hi: 'आध्यात्मिक भ्रम और विश्वासों पर सवाल। विदेश यात्रा संभव लेकिन जटिलताओं के साथ।',
      areas: ['spiritual', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    10: {
      en: 'Career breakthrough through unconventional paths. Foreign companies or technology sectors favor you.',
      hi: 'अपरंपरागत मार्गों से करियर में सफलता। विदेशी कंपनियां या प्रौद्योगिकी क्षेत्र अनुकूल।',
      areas: ['career', 'finance'],
      effect: 'favorable',
      intensity: 3,
    },
    11: {
      en: 'Large gains through foreign or unconventional sources. Network expansion. Technology investments succeed.',
      hi: 'विदेशी या अपरंपरागत स्रोतों से बड़ा लाभ। नेटवर्क विस्तार। प्रौद्योगिकी निवेश सफल।',
      areas: ['finance', 'career'],
      effect: 'favorable',
      intensity: 3,
    },
    12: {
      en: 'Foreign settlement or isolation. Expenditure on foreign travel. Spiritual confusion but also awakening.',
      hi: 'विदेश बसना या एकांत। विदेश यात्रा पर खर्च। आध्यात्मिक भ्रम लेकिन जागृति भी।',
      areas: ['finance', 'spiritual'],
      effect: 'unfavorable',
      intensity: 2,
    },
  },

  Ketu: {
    1: {
      en: 'Spiritual awakening but worldly confusion. Health anxiety without clear cause. Identity questioning.',
      hi: 'आध्यात्मिक जागृति लेकिन सांसारिक भ्रम। बिना स्पष्ट कारण स्वास्थ्य चिंता। पहचान पर सवाल।',
      areas: ['spiritual', 'health'],
      effect: 'unfavorable',
      intensity: 2,
    },
    2: {
      en: 'Detachment from family and wealth. Speech becomes cryptic. Financial carelessness. Guard your savings.',
      hi: 'परिवार और धन से वैराग्य। वाणी गूढ़ होती है। आर्थिक लापरवाही। बचत की रक्षा करें।',
      areas: ['finance', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    3: {
      en: 'Intuitive courage and spiritual strength. Good for meditation-based actions. Silent victories.',
      hi: 'सहज साहस और आध्यात्मिक शक्ति। ध्यान-आधारित कार्यों के लिए अच्छा। मौन विजय।',
      areas: ['spiritual', 'career'],
      effect: 'favorable',
      intensity: 2,
    },
    4: {
      en: 'Detachment from home comforts. Mother\'s health needs attention. Property matters bring confusion.',
      hi: 'घरेलू सुखों से वैराग्य। माता के स्वास्थ्य पर ध्यान दें। संपत्ति मामलों में भ्रम।',
      areas: ['relationships', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    5: {
      en: 'Past-life karma surfaces. Children face unusual situations. Intuition is strong but unstable.',
      hi: 'पूर्व जन्म का कर्म सामने आता है। संतान असामान्य स्थितियों का सामना करती है। अंतर्ज्ञान मजबूत लेकिन अस्थिर।',
      areas: ['spiritual', 'relationships'],
      effect: 'unfavorable',
      intensity: 2,
    },
    6: {
      en: 'Victory over hidden enemies. Mysterious health improvements. Spiritual practices resolve chronic issues.',
      hi: 'छिपे शत्रुओं पर विजय। रहस्यमय स्वास्थ्य सुधार। आध्यात्मिक साधनाएं पुरानी समस्याओं का समाधान करती हैं।',
      areas: ['health', 'spiritual'],
      effect: 'favorable',
      intensity: 2,
    },
    7: {
      en: 'Detachment in relationships. Partner feels distant. Existing bonds tested. Good for spiritual partnerships.',
      hi: 'संबंधों में वैराग्य। साथी दूर लगता है। मौजूदा बंधन परीक्षित। आध्यात्मिक साझेदारी के लिए अच्छा।',
      areas: ['relationships', 'spiritual'],
      effect: 'unfavorable',
      intensity: 2,
    },
    8: {
      en: 'Deep transformation and occult experiences. Health issues with unclear diagnosis. Avoid risky ventures.',
      hi: 'गहन परिवर्तन और गूढ़ अनुभव। अस्पष्ट निदान वाली स्वास्थ्य समस्याएं। जोखिम भरे कार्यों से बचें।',
      areas: ['health', 'spiritual'],
      effect: 'unfavorable',
      intensity: 3,
    },
    9: {
      en: 'Disillusionment with religion but deeper spiritual insight. Guru relationships transform.',
      hi: 'धर्म से मोहभंग लेकिन गहरी आध्यात्मिक अंतर्दृष्टि। गुरु संबंध रूपांतरित।',
      areas: ['spiritual', 'general'],
      effect: 'unfavorable',
      intensity: 2,
    },
    10: {
      en: 'Career feels meaningless temporarily. Professional detachment. Good for spiritual vocations.',
      hi: 'करियर अस्थायी रूप से अर्थहीन लगता है। पेशेवर वैराग्य। आध्यात्मिक व्यवसायों के लिए अच्छा।',
      areas: ['career', 'spiritual'],
      effect: 'unfavorable',
      intensity: 2,
    },
    11: {
      en: 'Gains through spiritual or unconventional networks. Unexpected windfalls. Wishes fulfilled mysteriously.',
      hi: 'आध्यात्मिक या अपरंपरागत नेटवर्क से लाभ। अप्रत्याशित लाभ। इच्छाएं रहस्यमय ढंग से पूरी।',
      areas: ['finance', 'spiritual'],
      effect: 'favorable',
      intensity: 2,
    },
    12: {
      en: 'Spiritual liberation and moksha tendencies. Heavy expenditure but spiritual gains. Best for meditation and retreat.',
      hi: 'आध्यात्मिक मुक्ति और मोक्ष प्रवृत्ति। भारी खर्च लेकिन आध्यात्मिक लाभ। ध्यान और एकांत के लिए सर्वोत्तम।',
      areas: ['spiritual', 'finance'],
      effect: 'unfavorable',
      intensity: 2,
    },
  },
};

// ── Lucky Elements by Moon Sign ─────────────────────────────────────────────

export const LUCKY_BY_SIGN: Record<number, { color: string; colorHi: string; number: number; direction: string; directionHi: string }> = {
  1:  { color: 'Red', colorHi: 'लाल', number: 9, direction: 'East', directionHi: 'पूर्व' },
  2:  { color: 'White', colorHi: 'सफेद', number: 6, direction: 'Southeast', directionHi: 'दक्षिण-पूर्व' },
  3:  { color: 'Green', colorHi: 'हरा', number: 5, direction: 'North', directionHi: 'उत्तर' },
  4:  { color: 'Silver', colorHi: 'चांदी', number: 2, direction: 'Northwest', directionHi: 'उत्तर-पश्चिम' },
  5:  { color: 'Gold', colorHi: 'सुनहरा', number: 1, direction: 'East', directionHi: 'पूर्व' },
  6:  { color: 'Green', colorHi: 'हरा', number: 5, direction: 'South', directionHi: 'दक्षिण' },
  7:  { color: 'White', colorHi: 'सफेद', number: 6, direction: 'West', directionHi: 'पश्चिम' },
  8:  { color: 'Red', colorHi: 'लाल', number: 9, direction: 'South', directionHi: 'दक्षिण' },
  9:  { color: 'Yellow', colorHi: 'पीला', number: 3, direction: 'Northeast', directionHi: 'उत्तर-पूर्व' },
  10: { color: 'Blue', colorHi: 'नीला', number: 8, direction: 'West', directionHi: 'पश्चिम' },
  11: { color: 'Blue', colorHi: 'नीला', number: 8, direction: 'West', directionHi: 'पश्चिम' },
  12: { color: 'Yellow', colorHi: 'पीला', number: 3, direction: 'Northeast', directionHi: 'उत्तर-पूर्व' },
};

// ── Daily Summary Templates ─────────────────────────────────────────────────

export const RATING_SUMMARIES: Record<string, { en: string; hi: string }[]> = {
  excellent: [
    { en: 'A highly auspicious day with planetary blessings on your side. Seize opportunities with confidence.', hi: 'ग्रहों के आशीर्वाद से अत्यंत शुभ दिन। आत्मविश्वास के साथ अवसरों का लाभ उठाएं।' },
    { en: 'Stars align in your favor today. Bold actions bring exceptional results.', hi: 'आज तारे आपके पक्ष में हैं। साहसिक कार्य असाधारण परिणाम लाते हैं।' },
  ],
  good: [
    { en: 'A generally favorable day. Most efforts will bear fruit. Stay positive and proactive.', hi: 'सामान्यतः अनुकूल दिन। अधिकांश प्रयास फलदायक। सकारात्मक और सक्रिय रहें।' },
    { en: 'Planetary support is with you. Focus on priorities and make steady progress.', hi: 'ग्रहों का सहयोग आपके साथ है। प्राथमिकताओं पर ध्यान दें और स्थिर प्रगति करें।' },
  ],
  average: [
    { en: 'A mixed day with both opportunities and challenges. Stay balanced and mindful.', hi: 'अवसरों और चुनौतियों दोनों वाला मिश्रित दिन। संतुलित और सचेत रहें।' },
    { en: 'Some planets support you while others test you. Navigate with patience.', hi: 'कुछ ग्रह सहायक तो कुछ परीक्षा लेते हैं। धैर्य के साथ चलें।' },
  ],
  challenging: [
    { en: 'A demanding day requiring extra patience. Avoid impulsive decisions. Focus on essentials.', hi: 'अतिरिक्त धैर्य की आवश्यकता वाला कठिन दिन। आवेगपूर्ण निर्णयों से बचें। आवश्यक कार्यों पर ध्यान दें।' },
    { en: 'Planetary influences suggest caution. Postpone major decisions if possible.', hi: 'ग्रह प्रभाव सावधानी सुझाते हैं। यदि संभव हो तो बड़े फैसले टालें।' },
  ],
  difficult: [
    { en: 'A tough day — lie low and avoid confrontations. Focus on self-care and spiritual practices.', hi: 'कठिन दिन — शांत रहें और टकराव से बचें। आत्म-देखभाल और आध्यात्मिक साधना पर ध्यान दें।' },
    { en: 'Heavy planetary pressure today. Practice patience, prayers, and avoid risks.', hi: 'आज भारी ग्रह दबाव। धैर्य, प्रार्थना का अभ्यास करें और जोखिमों से बचें।' },
  ],
};
