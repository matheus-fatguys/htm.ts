import { ISDR, SDRImpl } from "./SDR";

export class SDRBuilder {
    public static build(n: number, w: number, activeBits: number[]): ISDR {
        return new SDRImpl(n, w, activeBits);
    }
}
