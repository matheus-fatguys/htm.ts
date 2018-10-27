import { EncoderBase } from "./Encoder";
import { ISDR } from "./SDR";
import { SDRBuilder } from "./SDRBuilder";

export class  ScalarEncoder extends EncoderBase {
// export class  ScalarEncoder implements IEncoder {
    public max: number;
    public min: number;
    public buckets: number[];
    public bucketIndexes: number[];
    public bucketSize: number;

    public constructor(n: number, w: number, min: number, max: number) {
        super(n, w);
        this.verifyRange(min, max);
        this.max = max;
        this.min = min;
        this.defineBuckets(n, w);
    }

    // tslint:disable-next-line:no-unused
    public encode(signal: any): ISDR {
        let num: number = signal as number;
        if (num < this.min) {
            num = this.min;
        } else if (num > this.max) {
            num = this.max;
        }

        // const bucketbottom = this.buckets.find((b) => num >= b);
        // const buckettop = this.buckets.find((b) => num < b);
        const bucket = this.buckets.find((b) => b <= num && num < b + this.bucketSize);
        const bits = [];
        // bits.push(num);
        // bits.push(bucket);
        for (let i = 0; i < this.w; i++) {
            bits.push(bucket + i);
        }

        return SDRBuilder.build(this.n, this.w, bits);

    }

    private defineBuckets(n: number, w: number): void {
        const numberOfBuckets = n - w + 1;
        this.bucketSize = ((this.max - this.min) / numberOfBuckets);
        this.buckets = [];
        this.bucketIndexes = [];
        let bucketValue: number = this.min;
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
