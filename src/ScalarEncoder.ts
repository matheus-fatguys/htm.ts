import { EncoderBase } from "./Encoder";
import { ISDR } from "./SDR";
import { SDRBuilder } from "./SDRBuilder";

export class  ScalarEncoder extends EncoderBase {

    public static getNforRadius(radius: number, w: number, min: number, max: number): number {
        const range = max - min;
        return (range / radius) + w - 1;
    }

    public static getNforPrecision(precision: number, w: number, min: number, max: number, rotative?: boolean): number {
        let n: number;
        console.log("rotative: " + rotative);
        if (rotative == null || rotative === false) {
            n = (((max - min) / precision) + 1 ) * w;
        } else {
            n = (((max - min) / precision) - 1 / w ) * w + 1;
        }
        return n;
    }

    public max: number;
    public min: number;
    public rotative: boolean;
    public buckets: number[];
    public bucketIndexes: number[];
    public bucketSize: number;

    public constructor(n: number, w: number, min: number, max: number, rotative?: boolean) {
        super(n, w);
        this.verifyRange(min, max);
        this.max = max;
        this.min = min;
        this.rotative = rotative != null ? rotative : false;
        this.defineBuckets(n, w);
    }

    public encode(signal: any): ISDR {
        let num: number = signal as number;
        if (num < this.min) {
            num = this.min;
        } else if (num > this.max) {
            num = this.max;
        }

        let bucket = Number.MAX_VALUE;
        let dist = (bucket - num) * (bucket - num);
        this.buckets.forEach((bucketValue) => {
            const currDist = (bucketValue - num) * (bucketValue - num);
            if (currDist <= dist) {
                dist = currDist;
                bucket = bucketValue;
            }
        });
        const bucketIndex = this.bucketIndexes[this.buckets.findIndex((b) => b === bucket)];
        const bits = [];
        for (let i = 0; i < this.w; i++) {
            bits.push(bucketIndex + i);
        }
        return  SDRBuilder.build(this.n, this.w, bits);

    }

    private defineBuckets(n: number, w: number): void {
        const numberOfBuckets = this.rotative ? n : n - w + 1;
        this.bucketSize = ((this.max - this.min) / numberOfBuckets);
        this.buckets = [];
        this.bucketIndexes = [];
        let bucketValue: number = this.min + this.bucketSize / 2;
        let bucketIndex: number = 0;
        for (let i = 0; i < numberOfBuckets; i++) {
            this.buckets.push(bucketValue);
            bucketValue += this. bucketSize;
            this.bucketIndexes.push(bucketIndex);
            bucketIndex += 1;
        }
    }

    private verifyRange(min: number, max: number): void {
        if (min >= max) {
            throw new Error("min:" + min + " must be less than max:" + max);
        }
    }

}
