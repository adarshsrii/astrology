export interface TithiResult {
    name: string;
    number: number;
    tithiIndex: number;
    paksha: 'Shukla' | 'Krishna';
    progress: number;
}
export declare function calculateTithi(sunLongitude: number, moonLongitude: number): TithiResult;
