"use strict";
/**
 * Planetary Remedies — Gemstones, Mantras, and Charity
 *
 * Recommends remedies for weak/afflicted planets based on their
 * dignity, combustion status, and house placement.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanetRemedy = exports.getRemedies = void 0;
// ── Remedy Data for All 9 Planets ───────────────────────────────────────────────
const PLANETARY_REMEDIES = {
    Sun: {
        planet: 'Sun',
        gemstone: {
            name: 'Ruby',
            alternates: ['Red Garnet', 'Red Spinel'],
            metal: 'Gold',
            finger: 'Ring finger',
            day: 'Sunday',
            weight: '3-5 carats',
        },
        mantra: {
            vedic: 'Om Suryaya Namah',
            beej: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
            japaCount: 7000,
        },
        charity: {
            items: ['Wheat', 'Jaggery', 'Red cloth'],
            day: 'Sunday',
            deity: 'Lord Sun',
        },
        color: 'Red',
        direction: 'East',
        fasting: 'Sunday',
    },
    Moon: {
        planet: 'Moon',
        gemstone: {
            name: 'Pearl',
            alternates: ['Moonstone', 'White Sapphire'],
            metal: 'Silver',
            finger: 'Little finger',
            day: 'Monday',
            weight: '4-6 carats',
        },
        mantra: {
            vedic: 'Om Chandraya Namah',
            beej: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
            japaCount: 11000,
        },
        charity: {
            items: ['Rice', 'White cloth', 'Milk'],
            day: 'Monday',
            deity: 'Lord Shiva',
        },
        color: 'White',
        direction: 'Northwest',
        fasting: 'Monday',
    },
    Mars: {
        planet: 'Mars',
        gemstone: {
            name: 'Red Coral',
            alternates: ['Carnelian'],
            metal: 'Gold/Copper',
            finger: 'Ring finger',
            day: 'Tuesday',
            weight: '5-7 carats',
        },
        mantra: {
            vedic: 'Om Mangalaya Namah',
            beej: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
            japaCount: 10000,
        },
        charity: {
            items: ['Red lentils', 'Red cloth'],
            day: 'Tuesday',
            deity: 'Lord Hanuman',
        },
        color: 'Red',
        direction: 'South',
        fasting: 'Tuesday',
    },
    Mercury: {
        planet: 'Mercury',
        gemstone: {
            name: 'Emerald',
            alternates: ['Green Tourmaline', 'Peridot'],
            metal: 'Gold',
            finger: 'Little finger',
            day: 'Wednesday',
            weight: '3-5 carats',
        },
        mantra: {
            vedic: 'Om Budhaya Namah',
            beej: 'Om Braam Breem Braum Sah Budhaya Namah',
            japaCount: 9000,
        },
        charity: {
            items: ['Green moong', 'Green cloth'],
            day: 'Wednesday',
            deity: 'Lord Vishnu',
        },
        color: 'Green',
        direction: 'North',
        fasting: 'Wednesday',
    },
    Jupiter: {
        planet: 'Jupiter',
        gemstone: {
            name: 'Yellow Sapphire',
            alternates: ['Topaz', 'Citrine'],
            metal: 'Gold',
            finger: 'Index finger',
            day: 'Thursday',
            weight: '3-5 carats',
        },
        mantra: {
            vedic: 'Om Gurave Namah',
            beej: 'Om Graam Greem Graum Sah Gurave Namah',
            japaCount: 19000,
        },
        charity: {
            items: ['Turmeric', 'Yellow cloth', 'Books'],
            day: 'Thursday',
            deity: 'Lord Brihaspati',
        },
        color: 'Yellow',
        direction: 'Northeast',
        fasting: 'Thursday',
    },
    Venus: {
        planet: 'Venus',
        gemstone: {
            name: 'Diamond',
            alternates: ['White Sapphire', 'Zircon'],
            metal: 'Silver/Platinum',
            finger: 'Middle finger',
            day: 'Friday',
            weight: '1-2 carats',
        },
        mantra: {
            vedic: 'Om Shukraya Namah',
            beej: 'Om Draam Dreem Draum Sah Shukraya Namah',
            japaCount: 16000,
        },
        charity: {
            items: ['White rice', 'White flowers', 'Silk'],
            day: 'Friday',
            deity: 'Goddess Lakshmi',
        },
        color: 'White',
        direction: 'Southeast',
        fasting: 'Friday',
    },
    Saturn: {
        planet: 'Saturn',
        gemstone: {
            name: 'Blue Sapphire',
            alternates: ['Amethyst', 'Iolite'],
            metal: 'Iron/Silver',
            finger: 'Middle finger',
            day: 'Saturday',
            weight: '3-5 carats',
        },
        mantra: {
            vedic: 'Om Shanaishcharaya Namah',
            beej: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
            japaCount: 23000,
        },
        charity: {
            items: ['Black sesame', 'Iron', 'Mustard oil'],
            day: 'Saturday',
            deity: 'Lord Shani',
        },
        color: 'Black/Dark Blue',
        direction: 'West',
        fasting: 'Saturday',
    },
    Rahu: {
        planet: 'Rahu',
        gemstone: {
            name: 'Hessonite (Gomed)',
            alternates: ['Spessartite Garnet'],
            metal: 'Silver',
            finger: 'Middle finger',
            day: 'Saturday',
            weight: '4-6 carats',
        },
        mantra: {
            vedic: 'Om Rahave Namah',
            beej: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah',
            japaCount: 18000,
        },
        charity: {
            items: ['Black cloth', 'Coconut'],
            day: 'Saturday',
            deity: 'Goddess Durga',
        },
        color: 'Smoky/Dark Blue',
        direction: 'Southwest',
        fasting: 'Saturday',
    },
    Ketu: {
        planet: 'Ketu',
        gemstone: {
            name: "Cat's Eye (Lehsunia)",
            alternates: ['Chrysoberyl'],
            metal: 'Silver',
            finger: 'Ring finger',
            day: 'Tuesday',
            weight: '3-5 carats',
        },
        mantra: {
            vedic: 'Om Ketave Namah',
            beej: 'Om Sraam Sreem Sraum Sah Ketave Namah',
            japaCount: 17000,
        },
        charity: {
            items: ['Blanket', 'Seven grains'],
            day: 'Tuesday',
            deity: 'Lord Ganesha',
        },
        color: 'Grey/Brown',
        direction: 'Southwest',
        fasting: 'Tuesday',
    },
};
// ── Dusthana Houses ─────────────────────────────────────────────────────────────
const DUSTHANA_HOUSES = [6, 8, 12];
// ── Affliction Detection ────────────────────────────────────────────────────────
function isDebilitated(dignity) {
    return dignity === 'debilitated' || dignity === 'peak_debilitated';
}
function isInDusthana(house) {
    return DUSTHANA_HOUSES.includes(house);
}
function getAfflictionReason(planet) {
    const reasons = [];
    if (isDebilitated(planet.dignity)) {
        reasons.push('debilitated');
    }
    if (planet.isCombust) {
        reasons.push('combust');
    }
    if (isInDusthana(planet.house)) {
        reasons.push(`placed in house ${planet.house} (dusthana)`);
    }
    return reasons.length > 0
        ? `${planet.name} is ${reasons.join(', ')}`
        : null;
}
// ── Public API ──────────────────────────────────────────────────────────────────
/**
 * Get remedies for weak/afflicted planets.
 *
 * A planet is considered weak when it is debilitated, combust, or placed
 * in a dusthana house (6, 8, 12).
 *
 * @param planets - Array of planet positions with dignity and house info
 * @returns Object with weakPlanets remedies and general recommendations
 */
function getRemedies(planets) {
    const weakPlanets = [];
    for (const planet of planets) {
        const reason = getAfflictionReason(planet);
        if (reason) {
            const remedy = PLANETARY_REMEDIES[planet.name];
            if (remedy) {
                weakPlanets.push({ planet: planet.name, reason, remedy });
            }
        }
    }
    // General remedies that apply to everyone
    const generalRemedies = [
        'Chant Gayatri Mantra daily for overall planetary harmony.',
        'Perform Surya Namaskar at sunrise for vitality and spiritual growth.',
        'Offer water to the Sun (Arghya) every morning facing east.',
        'Light a diya (lamp) with ghee every evening in the prayer room.',
        'Donate food to the needy on Saturdays for karmic balance.',
    ];
    // Add specific general advice based on afflictions found
    if (weakPlanets.some(wp => wp.planet === 'Saturn')) {
        generalRemedies.push('Feed crows on Saturdays to appease Saturn.');
    }
    if (weakPlanets.some(wp => wp.planet === 'Rahu')) {
        generalRemedies.push('Feed stray dogs to reduce Rahu affliction.');
    }
    if (weakPlanets.some(wp => wp.planet === 'Ketu')) {
        generalRemedies.push('Feed a multi-colored cow or donate blankets to appease Ketu.');
    }
    if (weakPlanets.some(wp => wp.planet === 'Mars')) {
        generalRemedies.push('Visit Hanuman temple on Tuesdays and offer sindoor.');
    }
    return { weakPlanets, generalRemedies };
}
exports.getRemedies = getRemedies;
/**
 * Get remedy data for a specific planet (regardless of affliction).
 * Useful for general reference.
 */
function getPlanetRemedy(planet) {
    return PLANETARY_REMEDIES[planet] ?? null;
}
exports.getPlanetRemedy = getPlanetRemedy;
