import { EncoderBase } from "./Encoder";
import { ISDR } from "./SDR";
import { SDRBuilder } from "./SDRBuilder";

export class  ScalarEncoder extends EncoderBase {
// export class  ScalarEncoder implements IEncoder {
    public max: number;
    public min: number;
    public buckets: number[];

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

        const bucket = this.buckets.find((b) => b > num);
        const bits = [];
        for (let i = 0; i < this.w; i++) {
            bits.push(bucket + i);
        }

        return SDRBuilder.build(this.n, this.w, bits);

    }

    private defineBuckets(n: number, w: number): void {
        const numberOfBuckets = n - w + 1;
        const bucketSize = (this.max - this.min) / numberOfBuckets;
        this.buckets = [];
        let bucketValue: number = this.min;
        for (let i = 0; i < numberOfBuckets; i++) {
            this.buckets.push(bucketValue);
            bucketValue += bucketSize;
        }
    }

    private verifyRange(min: number, max: number): void {
        if (min >= max) {
            throw new Error("min:" + min + " must be less than max:" + max);
        }
    }

}
