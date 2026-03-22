"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateKarana = void 0;
const constants_1 = require("./constants");
const DEGREES_PER_KARANA = 6;
function calculateKarana(sunLongitude, moonLongitude) {
    const diff = (0, constants_1.normalizeAngle)(moonLongitude - sunLongitude);
    const karanaIndex = Math.floor(diff / DEGREES_PER_KARANA);
    const posInKarana = diff - (karanaIndex * DEGREES_PER_KARANA);
    const progress = (posInKarana / DEGREES_PER_KARANA) * 100;
    let name;
    if (karanaIndex === 0) {
        name = 'Kimstughna';
    }
    else if (karanaIndex >= 57) {
        name = constants_1.KARANA_NAMES_FIXED[karanaIndex - 57];
    }
    else {
        name = constants_1.KARANA_NAMES_REPEATING[(karanaIndex - 1) % 7];
    }
    return { name, number: karanaIndex + 1, progress: Math.round(progress * 10) / 10 };
}
exports.calculateKarana = calculateKarana;
