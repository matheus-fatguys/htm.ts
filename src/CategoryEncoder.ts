import { EncoderBase } from "./Encoder";
import { ISDR } from "./SDR";
import { SDRBuilder } from "./SDRBuilder";

export class  CategoryEncoder extends EncoderBase {

    public static getNforIntersection(intersection: number, w: number, categories: any[]): number {
        const numberOfCategories = categories.length;
        const nBitsIntersection = w * intersection;
        // return (numberOfCategories - intersection) * w;
        return  w + (w - nBitsIntersection) * (numberOfCategories - 1);
    }

    public categories: string[] = [];
    public bucketIndexes: number[] = [];
    public intersection: number;

    public constructor(n: number, w: number, intersection: number, categories: any[]) {
        super(n, w);
        this.verifyIntersection(n, w, intersection, categories);
        this.categories = categories;
        this.intersection = intersection;
        this.defineBuckets(w, intersection, categories);
    }

    public encode(signal: any): ISDR {
        const firstIndex  = this.bucketIndexes[signal];
        const activeBits = [];
        for (let i = 0; i < this.w; i++) {
            activeBits.push(firstIndex + i);
        }
        return SDRBuilder.build(this.n, this.w, activeBits);
    }

    private defineBuckets(w: number, intersection: number, categories: string[]) {
        let bit = 0;
        this.bucketIndexes[categories[0]] = bit;
        for (let i = 1; i < categories.length; i++) {
            bit += Math.round(w * (1 - intersection));
            this.bucketIndexes[categories[i]] = bit;
        }
    }

    private verifyIntersection(n: number, w: number, intersection: number, categories: string[]) {
        if (categories === null) {
            throw new Error("at least one category must be in categories list");
        }
        if (categories.length === 0) {
            throw new Error("at least one category must be in categories list");
        }
        if (intersection < 0 || intersection >= 1) {
            throw new Error("intersection: " + intersection + " must be in range [0-1)");
        }
        const nMin = CategoryEncoder.getNforIntersection(intersection, w, categories);
        if (n < nMin ) {
            throw new Error("n: " + n + " must be at least " + nMin);
        }
    }

}
