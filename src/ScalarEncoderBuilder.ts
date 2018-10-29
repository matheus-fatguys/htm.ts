import { ScalarEncoder } from "./ScalarEncoder";

export class ScalarEncoderBuilder {
    public static build(n: number, w: number, min: number, max: number, rotative?: boolean): ScalarEncoder {
        return new ScalarEncoder(n, w, min, max, rotative);
    }
}
