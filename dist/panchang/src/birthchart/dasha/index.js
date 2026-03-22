"use strict";
/**
 * Dasha Module — Public API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAKSHATRA_LORDS = exports.DASHA_SEQUENCE = exports.DASHA_YEARS = exports.calculateVimshottariDasha = void 0;
var vimshottari_1 = require("./vimshottari");
Object.defineProperty(exports, "calculateVimshottariDasha", { enumerable: true, get: function () { return vimshottari_1.calculateVimshottariDasha; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "DASHA_YEARS", { enumerable: true, get: function () { return constants_1.DASHA_YEARS; } });
Object.defineProperty(exports, "DASHA_SEQUENCE", { enumerable: true, get: function () { return constants_1.DASHA_SEQUENCE; } });
Object.defineProperty(exports, "NAKSHATRA_LORDS", { enumerable: true, get: function () { return constants_1.NAKSHATRA_LORDS; } });
