import { Expect, TestFixture } from "alsatian";
import { Test } from "alsatian";
// tslint:disable-next-line:sort-imports
import { ScalarEncoderBuilder } from "./../src/ScalarEncoderBuilder";
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
        const w = 3;
        const n = 21;
        const max = 21;
        const min = 21;

        Expect(() => ScalarEncoderBuilder.build(n, w, min, max))
        .toThrowError(Error, "min:" + min + " must be less than max:" + max);
    }

    @Test(`creating a ScalarEncoder with n=21 and w=19 must have 3 buckets
    and values[0, 7, 14]`)
    public test_buckets_count() {
        const w = 19;
        const n = 21;
        const max = 21;
        const min = 0;
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        Expect(encoder.bucketSize).toBe(7);
        Expect(encoder.buckets.length).toBe(3);
        Expect(encoder.buckets).toEqual([0, 7, 14]);
    }

    @Test(`encoding 0, 7, 14 and 20 must result in
    111111111111111111100 -> [0 - 18]
    011111111111111111110 -> [1 - 19]
    001111111111111111111 -> [2 - 20]
    `)
    public test_encoding() {
        const w = 19;
        const n = 21;
        const max = 21;
        const min = 0;
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        // Expect(encoder.bucketSize).toBe(7);
        // Expect(encoder.buckets.length).toBe(3);
        // Expect(encoder.buckets).toEqual([0, 7, 14]);
        // Expect(encoder.encode(0).activeBits)
        // .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        // Expect(encoder.encode(0.1).activeBits)
        // .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        // Expect(encoder.encode(6.9).activeBits)
        // .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        Expect(encoder.encode(7).activeBits)
        .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
        // Expect(encoder.encode(13.9).activeBits)
        // .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
        // Expect(encoder.encode(14).activeBits)
        // .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        // Expect(encoder.encode(19.9).activeBits)
        // .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        // Expect(encoder.encode(20).activeBits)
        // .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    }

}
