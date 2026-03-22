"use strict";
/**
 * Shodashvarga Chart Definitions
 * Configuration and metadata for all 16 divisional charts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartInfo = exports.SHODASHVARGA_CHARTS = void 0;
exports.SHODASHVARGA_CHARTS = [
    { division: 1, name: 'Rasi', shortName: 'D1', description: 'Birth chart — overall life' },
    { division: 2, name: 'Hora', shortName: 'D2', description: 'Wealth and finances' },
    { division: 3, name: 'Drekkana', shortName: 'D3', description: 'Siblings and courage' },
    { division: 4, name: 'Chaturthamsa', shortName: 'D4', description: 'Property and fortune' },
    { division: 7, name: 'Saptamsa', shortName: 'D7', description: 'Children and progeny' },
    { division: 9, name: 'Navamsa', shortName: 'D9', description: 'Marriage, dharma, spiritual life' },
    { division: 10, name: 'Dasamsa', shortName: 'D10', description: 'Career and profession' },
    { division: 12, name: 'Dwadasamsa', shortName: 'D12', description: 'Parents and ancestry' },
    { division: 16, name: 'Shodasamsa', shortName: 'D16', description: 'Vehicles and comforts' },
    { division: 20, name: 'Vimsamsa', shortName: 'D20', description: 'Spiritual progress and worship' },
    { division: 24, name: 'Chaturvimsamsa', shortName: 'D24', description: 'Education and learning' },
    { division: 27, name: 'Saptavimsamsa', shortName: 'D27', description: 'Physical strength and stamina' },
    { division: 30, name: 'Trimsamsa', shortName: 'D30', description: 'Misfortunes and challenges' },
    { division: 40, name: 'Khavedamsa', shortName: 'D40', description: 'Auspicious/inauspicious effects' },
    { division: 45, name: 'Akshavedamsa', shortName: 'D45', description: 'General indications, paternal legacy' },
    { division: 60, name: 'Shashtiamsa', shortName: 'D60', description: 'Past life karma, overall summary' },
];
/**
 * Look up chart info by division number.
 */
function getChartInfo(division) {
    return exports.SHODASHVARGA_CHARTS.find(c => c.division === division);
}
exports.getChartInfo = getChartInfo;
