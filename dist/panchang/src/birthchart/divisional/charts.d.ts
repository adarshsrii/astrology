/**
 * Shodashvarga Chart Definitions
 * Configuration and metadata for all 16 divisional charts.
 */
export interface VargaChartInfo {
    division: number;
    name: string;
    shortName: string;
    description: string;
}
export declare const SHODASHVARGA_CHARTS: VargaChartInfo[];
/**
 * Look up chart info by division number.
 */
export declare function getChartInfo(division: number): VargaChartInfo | undefined;
