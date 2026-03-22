"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNakshatra = void 0;
const constants_1 = require("./constants");
function calculateNakshatra(moonLongitude) {
    const lon = (0, constants_1.normalizeAngle)(moonLongitude);
    const nakshatraIndex = Math.floor(lon / constants_1.DEGREES_PER_NAKSHATRA);
    const posInNakshatra = lon - (nakshatraIndex * constants_1.DEGREES_PER_NAKSHATRA);
    const pada = Math.min(Math.floor(posInNakshatra / constants_1.DEGREES_PER_PADA) + 1, 4);
    const posInPada = posInNakshatra - ((pada - 1) * constants_1.DEGREES_PER_PADA);
    const nk = constants_1.NAKSHATRAS[nakshatraIndex];
    const progress = (posInNakshatra / constants_1.DEGREES_PER_NAKSHATRA) * 100;
    const padaProgress = (posInPada / constants_1.DEGREES_PER_PADA) * 100;
    return {
        name: nk.name, number: nakshatraIndex + 1, pada,
        lord: nk.lord, deity: nk.deity,
        progress: Math.round(progress * 10) / 10,
        padaProgress: Math.round(padaProgress * 10) / 10,
    };
}
exports.calculateNakshatra = calculateNakshatra;
