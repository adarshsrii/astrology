"use strict";
/**
 * Divisional Charts (Varga) — Public API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShodashvarga = exports.getChartInfo = exports.SHODASHVARGA_CHARTS = exports.calculateDivisionalChart = void 0;
var calculator_1 = require("./calculator");
Object.defineProperty(exports, "calculateDivisionalChart", { enumerable: true, get: function () { return calculator_1.calculateDivisionalChart; } });
var charts_1 = require("./charts");
Object.defineProperty(exports, "SHODASHVARGA_CHARTS", { enumerable: true, get: function () { return charts_1.SHODASHVARGA_CHARTS; } });
Object.defineProperty(exports, "getChartInfo", { enumerable: true, get: function () { return charts_1.getChartInfo; } });
var shodashvarga_1 = require("./shodashvarga");
Object.defineProperty(exports, "calculateShodashvarga", { enumerable: true, get: function () { return shodashvarga_1.calculateShodashvarga; } });
