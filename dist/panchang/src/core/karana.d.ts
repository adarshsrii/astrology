export interface KaranaResult {
    name: string;
    number: number;
    progress: number;
}
export declare function calculateKarana(sunLongitude: number, moonLongitude: number): KaranaResult;
