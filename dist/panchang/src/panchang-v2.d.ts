import { Lang } from './core/constants';
import { PanchangResult } from './types';
export declare function calculateFullPanchang(date: Date | string, latitude: number, longitude: number, timezone: string, lang?: Lang): PanchangResult;
