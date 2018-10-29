import { SDRBuilder } from "./SDRBuilder";

export interface ISDR {
    n: number;
    w: number;
    activeBits: number[];
    getSparsity(): number;
    union(otherSDR: ISDR): ISDR;
    overlap(otherSDR: ISDR): ISDR;
    overlapScore(otherSDR: ISDR): number;
    concatenate(otherSDR: ISDR): ISDR;
}

export class SDRImpl implements ISDR {
    public n: number;
    public w: number;
    public activeBits: number[];

    public constructor(n: number, w: number, activeBits: number[]) {
        this.verify(n, w, activeBits);
        this.n = n;
        this.w = w;
        this.activeBits = activeBits.sort((n1, n2) => n1 - n2);

    }

    public getSparsity(): number {
        return this.w / this.n;
    }

    public union(otherSDR: ISDR): ISDR {
        // const bits = this.activeBits
        // .filter((b) => otherSDR.activeBits.findIndex((o: number) => b !== o) < 0)
        // .concat(otherSDR.activeBits);
        let bits = [];
        this.activeBits.forEach((bit) => {
            if (otherSDR.activeBits.findIndex((o) => o === bit) < 0) {
                bits.push(bit);
            }
        });
        bits = bits.concat(otherSDR.activeBits);
        const n = this.n > otherSDR.n ? this.n : otherSDR.n;
        const w = bits.length;
        return SDRBuilder.build(n, w, bits);
    }

    public overlap(otherSDR: ISDR): ISDR {
        const bits = this.activeBits
        .map((bit: number) => {
            return otherSDR.activeBits.findIndex((otherBit: number) => bit === otherBit);
        })
        .filter((bit: number) => bit >= 0)
        .map((index) => otherSDR.activeBits[index]);
        const n = this.n > otherSDR.n ? this.n : otherSDR.n;
        const w = bits.length;
        return SDRBuilder.build(n, w, bits);
    }

    public overlapScore(otherSDR: ISDR): number {
        return this.overlap(otherSDR).activeBits.length;
    }

    public concatenate(otherSDR: ISDR): ISDR {
        const n = this.n + otherSDR.n;
        const w = this.w + otherSDR.w;
        const reindexedBits = otherSDR.activeBits.map((bit) => bit + this.n);
        const concatenation = this.activeBits.concat(reindexedBits);
        return SDRBuilder.build(n, w, concatenation);
    }

    private verify(n: number, w: number, activeBits: number[]): void {
        if (w > n) {
            throw new Error("w:" + w + " must be less than n:" + n);
        }

        if (activeBits.length > w) {
            throw new Error("active bits must be less than or equal to w:" + w);
        }
        const bit = activeBits.findIndex(( b: number) => b > (n - 1) || b < 0 );
        if (bit >= 0) {
            throw new Error("bit " + activeBits[bit] + " out of bounds [0-" + (n - 1) + "]");
        }
    }

}
