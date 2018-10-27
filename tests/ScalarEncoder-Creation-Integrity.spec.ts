import { Expect, TestFixture } from "alsatian";
import { Test } from "alsatian";
// tslint:disable-next-line:sort-imports
import { ScalarEncoderBuilder } from "../src/ScalarEncoderBuilder";

@TestFixture("Scalar Encoder creation integrity")
export class ScalarEncoderTestFixture {

    @Test("creating a ScalarEncoder with w>n must throw an exception")
    public test_w_greater_than_n() {
        const w = 21;
        const n = 20;
        const max = 0;
        const min = 20;

        Expect(() => ScalarEncoderBuilder.build(n, w, min, max))
        .toThrowError(Error, "w:" + w + " must be less than n:" + n);
    }

    @Test("creating a ScalarEncoder with min>=max must throw an exception")
    public test_min_not_less_than_max() {
        const w = 21;
        const n = 20;
        const max = 21;
        const min = 21;

        Expect(() => ScalarEncoderBuilder.build(n, w, min, max))
        .toThrowError(Error, "min:" + min + " must be less than max:" + max);
    }

}
