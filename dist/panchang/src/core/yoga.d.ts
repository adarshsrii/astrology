export interface YogaResult {
    name: string;
    number: number;
    progress: number;
}
export declare function calculateYoga(sunLongitude: number, moonLongitude: number): YogaResult;
