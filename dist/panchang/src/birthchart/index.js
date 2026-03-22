"use strict";
/**
 * Birth Chart (Kundli) Module — Public API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanetRemedy = exports.getRemedies = exports.NAKSHATRA_SYLLABLES = exports.getNameSuggestions = exports.calculateShodashvarga = exports.getChartInfo = exports.SHODASHVARGA_CHARTS = exports.calculateDivisionalChart = exports.NAKSHATRA_LORDS = exports.DASHA_SEQUENCE = exports.DASHA_YEARS = exports.calculateVimshottariDasha = exports.analyzeGandanta = exports.analyzeGandaMoola = exports.analyzeKaalSarp = exports.analyzeManglik = exports.calculateShadBala = exports.calculateAspects = exports.NATURAL_FRIENDSHIPS = exports.calculateCompoundFriendships = exports.calculateTemporalFriendships = exports.calculateFriendships = exports.calculateTattvaBalance = exports.generateChartLayouts = exports.populateHousePlanets = exports.assignPlanetsToHouses = exports.calculateHouses = exports.getDignitySymbol = exports.determineCombustion = exports.determineDignity = exports.ALL_GRAHAS = exports.calculateBirthChart = void 0;
// Main function
var birthchart_1 = require("./birthchart");
Object.defineProperty(exports, "calculateBirthChart", { enumerable: true, get: function () { return birthchart_1.calculateBirthChart; } });
var types_1 = require("./types");
Object.defineProperty(exports, "ALL_GRAHAS", { enumerable: true, get: function () { return types_1.ALL_GRAHAS; } });
// Sub-modules (for advanced usage)
var states_1 = require("./core/states");
Object.defineProperty(exports, "determineDignity", { enumerable: true, get: function () { return states_1.determineDignity; } });
Object.defineProperty(exports, "determineCombustion", { enumerable: true, get: function () { return states_1.determineCombustion; } });
Object.defineProperty(exports, "getDignitySymbol", { enumerable: true, get: function () { return states_1.getDignitySymbol; } });
var houses_1 = require("./core/houses");
Object.defineProperty(exports, "calculateHouses", { enumerable: true, get: function () { return houses_1.calculateHouses; } });
Object.defineProperty(exports, "assignPlanetsToHouses", { enumerable: true, get: function () { return houses_1.assignPlanetsToHouses; } });
Object.defineProperty(exports, "populateHousePlanets", { enumerable: true, get: function () { return houses_1.populateHousePlanets; } });
var chart_layout_1 = require("./layout/chart-layout");
Object.defineProperty(exports, "generateChartLayouts", { enumerable: true, get: function () { return chart_layout_1.generateChartLayouts; } });
// Analysis modules
var tattva_1 = require("./analysis/tattva");
Object.defineProperty(exports, "calculateTattvaBalance", { enumerable: true, get: function () { return tattva_1.calculateTattvaBalance; } });
var friendships_1 = require("./analysis/friendships");
Object.defineProperty(exports, "calculateFriendships", { enumerable: true, get: function () { return friendships_1.calculateFriendships; } });
Object.defineProperty(exports, "calculateTemporalFriendships", { enumerable: true, get: function () { return friendships_1.calculateTemporalFriendships; } });
Object.defineProperty(exports, "calculateCompoundFriendships", { enumerable: true, get: function () { return friendships_1.calculateCompoundFriendships; } });
Object.defineProperty(exports, "NATURAL_FRIENDSHIPS", { enumerable: true, get: function () { return friendships_1.NATURAL_FRIENDSHIPS; } });
var aspects_1 = require("./analysis/aspects");
Object.defineProperty(exports, "calculateAspects", { enumerable: true, get: function () { return aspects_1.calculateAspects; } });
var shadbala_1 = require("./analysis/shadbala");
Object.defineProperty(exports, "calculateShadBala", { enumerable: true, get: function () { return shadbala_1.calculateShadBala; } });
var dosha_1 = require("./analysis/dosha");
Object.defineProperty(exports, "analyzeManglik", { enumerable: true, get: function () { return dosha_1.analyzeManglik; } });
Object.defineProperty(exports, "analyzeKaalSarp", { enumerable: true, get: function () { return dosha_1.analyzeKaalSarp; } });
Object.defineProperty(exports, "analyzeGandaMoola", { enumerable: true, get: function () { return dosha_1.analyzeGandaMoola; } });
Object.defineProperty(exports, "analyzeGandanta", { enumerable: true, get: function () { return dosha_1.analyzeGandanta; } });
// Dasha module
var dasha_1 = require("./dasha");
Object.defineProperty(exports, "calculateVimshottariDasha", { enumerable: true, get: function () { return dasha_1.calculateVimshottariDasha; } });
Object.defineProperty(exports, "DASHA_YEARS", { enumerable: true, get: function () { return dasha_1.DASHA_YEARS; } });
Object.defineProperty(exports, "DASHA_SEQUENCE", { enumerable: true, get: function () { return dasha_1.DASHA_SEQUENCE; } });
Object.defineProperty(exports, "NAKSHATRA_LORDS", { enumerable: true, get: function () { return dasha_1.NAKSHATRA_LORDS; } });
// Divisional charts (Varga)
var divisional_1 = require("./divisional");
Object.defineProperty(exports, "calculateDivisionalChart", { enumerable: true, get: function () { return divisional_1.calculateDivisionalChart; } });
Object.defineProperty(exports, "SHODASHVARGA_CHARTS", { enumerable: true, get: function () { return divisional_1.SHODASHVARGA_CHARTS; } });
Object.defineProperty(exports, "getChartInfo", { enumerable: true, get: function () { return divisional_1.getChartInfo; } });
Object.defineProperty(exports, "calculateShodashvarga", { enumerable: true, get: function () { return divisional_1.calculateShodashvarga; } });
// Recommendations (Names & Remedies)
var recommendations_1 = require("./recommendations");
Object.defineProperty(exports, "getNameSuggestions", { enumerable: true, get: function () { return recommendations_1.getNameSuggestions; } });
Object.defineProperty(exports, "NAKSHATRA_SYLLABLES", { enumerable: true, get: function () { return recommendations_1.NAKSHATRA_SYLLABLES; } });
Object.defineProperty(exports, "getRemedies", { enumerable: true, get: function () { return recommendations_1.getRemedies; } });
Object.defineProperty(exports, "getPlanetRemedy", { enumerable: true, get: function () { return recommendations_1.getPlanetRemedy; } });
