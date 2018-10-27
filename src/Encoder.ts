import { ISDR } from "./SDR";

export interface IEncoder {
    n: number;
    w: number;
    encode(signal: any): ISDR;
}

export abstract class EncoderBase implements IEncoder {

    public n: number;
    public w: number;

    public constructor(n: number, w: number) {
        this.verify(n, w);
        this.n = n;
        this.w = w;
    }

    public abstract encode(signal: any): ISDR;

    private verify(n: number, w: number): void {
        if (w > n) {
            throw new Error("w:" + w + " must be less than n:" + n);
        }
    }
}
