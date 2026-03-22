/**
 * Chart Layout Generator
 * Produces North Indian, South Indian, and Western chart box layouts.
 */
import { HouseInfo, ChartLayout } from '../types';
/**
 * Generate all three chart layouts from house data.
 */
export declare function generateChartLayouts(houses: HouseInfo[]): {
    northIndian: ChartLayout;
    southIndian: ChartLayout;
    western: ChartLayout;
};
