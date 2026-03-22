"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRashi = void 0;
const constants_1 = require("./constants");
function calculateRashi(longitude) {
    const lon = (0, constants_1.normalizeAngle)(longitude);
    const rashiIndex = Math.floor(lon / constants_1.DEGREES_PER_RASHI);
    const degree = lon - (rashiIndex * constants_1.DEGREES_PER_RASHI);
    const rashi = constants_1.RASHIS[rashiIndex];
    return {
        name: rashi.name,
        lord: rashi.lord,
        degree: Math.round(degree * 10) / 10,
        number: rashiIndex + 1,
    };
}
exports.calculateRashi = calculateRashi;
