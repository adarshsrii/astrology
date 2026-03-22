export interface NakshatraResult {
    name: string;
    number: number;
    pada: number;
    lord: string;
    deity: string;
    progress: number;
    padaProgress: number;
}
export declare function calculateNakshatra(moonLongitude: number): NakshatraResult;
