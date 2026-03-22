"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateYoga = void 0;
const constants_1 = require("./constants");
function calculateYoga(sunLongitude, moonLongitude) {
    const sum = (0, constants_1.normalizeAngle)(sunLongitude + moonLongitude);
    const yogaIndex = Math.floor(sum / constants_1.DEGREES_PER_YOGA);
    const posInYoga = sum - (yogaIndex * constants_1.DEGREES_PER_YOGA);
    const progress = (posInYoga / constants_1.DEGREES_PER_YOGA) * 100;
    return {
        name: constants_1.YOGA_NAMES[yogaIndex],
        number: yogaIndex + 1,
        progress: Math.round(progress * 10) / 10,
    };
}
exports.calculateYoga = calculateYoga;
