"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTithi = void 0;
const constants_1 = require("./constants");
// Bare tithi names (without paksha prefix) for both halves.
// Index 0–14: Shukla Paksha tithis; index 15–29: Krishna Paksha tithis.
// Purnima (index 14) and Amavasya (index 29) have no paksha prefix.
const BARE_TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];
function calculateTithi(sunLongitude, moonLongitude) {
    const diff = (0, constants_1.normalizeAngle)(moonLongitude - sunLongitude);
    const tithiIndex = Math.floor(diff / constants_1.DEGREES_PER_TITHI);
    const progress = ((diff % constants_1.DEGREES_PER_TITHI) / constants_1.DEGREES_PER_TITHI) * 100;
    const isShukla = tithiIndex < 15;
    const paksha = isShukla ? 'Shukla' : 'Krishna';
    const pakshaNumber = isShukla ? tithiIndex + 1 : tithiIndex - 15 + 1;
    const baseName = BARE_TITHI_NAMES[tithiIndex];
    // Purnima and Amavasya are standalone names; all others get paksha prefix.
    const name = (baseName === 'Purnima' || baseName === 'Amavasya')
        ? baseName
        : `${paksha} ${baseName}`;
    return {
        name,
        number: pakshaNumber,
        tithiIndex: tithiIndex + 1,
        paksha,
        progress: Math.round(progress * 10) / 10,
    };
}
exports.calculateTithi = calculateTithi;
