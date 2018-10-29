import { Expect, TestFixture } from "alsatian";
import { Test } from "alsatian";
// tslint:disable-next-line:sort-imports
import { ScalarEncoder } from "../src/ScalarEncoder";
import { ScalarEncoderBuilder } from "./../src/ScalarEncoderBuilder";
@TestFixture("Scalar Encoder encoding")
export class ScalarEncoderEncodingTestFixture {

    @Test(`encoding 0, 7, 14 and 20 with min=0, max=21, n=21 and w=19 must result in
    111111111111111111100 -> [0 - 18]
    011111111111111111110 -> [1 - 19]
    001111111111111111111 -> [2 - 20]
    `)
    public test_encoding_0_21_21_9() {
        const w = 19;
        const n = 21;
        const max = 21;
        const min = 0;
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        Expect(encoder.bucketSize).toBe(7);
        Expect(encoder.buckets.length).toBe(3);
        Expect(encoder.buckets).toEqual([3.5, 10.5, 17.5]);
        Expect(encoder.encode(0).activeBits)
        .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        Expect(encoder.encode(0.1).activeBits)
        .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        Expect(encoder.encode(6.9).activeBits)
        .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
        Expect(encoder.encode(7).activeBits)
        .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
        Expect(encoder.encode(13.9).activeBits)
        .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
        Expect(encoder.encode(14).activeBits)
        .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        Expect(encoder.encode(14.1).activeBits)
        .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        Expect(encoder.encode(19.9).activeBits)
        .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        Expect(encoder.encode(20).activeBits)
        .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        Expect(encoder.encode(21).activeBits)
        .toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    }
    @Test(`encoding -1, 0, 7, 9, 10, 11 and 20 with n=10 and w=1 must result in
    100000000000000000000
    100000000000000000000
    000000010000000000000
    000000000100000000000
    000000000100000000000
    000000000100000000000
    000000000100000000000
    `)
    public test_encoding_10_1_0_10() {
        const w = 1;
        const n = 10;
        const max = 10;
        const min = 0;
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        Expect(encoder.bucketSize).toBe(1);
        Expect(encoder.buckets.length).toBe(10);
        Expect(encoder.buckets).toEqual([0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5]);
        Expect(encoder.encode(-1).activeBits)
        .toEqual([0]);
        Expect(encoder.encode(0).activeBits)
        .toEqual([0]);
        Expect(encoder.encode(0.1).activeBits)
        .toEqual([0]);
        Expect(encoder.encode(6.9).activeBits)
        .toEqual([6]);
        Expect(encoder.encode(7).activeBits)
        .toEqual([7]);
        Expect(encoder.encode(9).activeBits)
        .toEqual([9]);
        Expect(encoder.encode(10).activeBits)
        .toEqual([9]);
        Expect(encoder.encode(11).activeBits)
        .toEqual([9]);
        Expect(encoder.encode(14).activeBits)
        .toEqual([9]);
        Expect(encoder.encode(19.9).activeBits)
        .toEqual([9]);
        Expect(encoder.encode(20).activeBits)
        .toEqual([9]);
    }

    @Test(`encoding 0-11 with min=0, max=10, w=2 and radius=2 must result in
    00 - 11000000000
    01 - 01100000000
    02 - 00110000000
    03 - 00011000000
    04 - 00001100000
    05 - 00000110000
    06 - 00000011000
    07 - 00000001100
    08 - 00000000110
    09 - 00000000011
    10 - 00000000011
    `)
    public test_get_n_for_radius_1_and_encoding() {
        const w = 2;
        const radius = 1;
        const max = 10;
        const min = 0;
        const n = ScalarEncoder.getNforRadius(radius, w, min, max);
        Expect(n).toBe(11);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        Expect(encoder.bucketSize).toBe(radius);
        Expect(encoder.buckets.length).toBe(10);
        Expect(encoder.buckets).toEqual([0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5]);

        Expect(encoder.encode(-1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.5).activeBits)
            .toEqual([0, 1]);

        for (let i = 0; i < 12; i++) {
            const i1 = i >= max ? n - 2 : i;
            const i2 = i >= max ? n - 1 : i + 1;
            Expect(encoder.encode(i).activeBits)
            .toEqual([i1, i2]);
        }
    }
    @Test(`encoding 0-11 with min=0, max=10, w=2 and radius=2 must result in
    00 - 110000
    01 - 110000
    02 - 011000
    03 - 011000
    04 - 001100
    05 - 001100
    07 - 000110
    08 - 000110
    09 - 000011
    10 - 000011
    11 - 000011
    `)
    public test_get_n_for_radius_2_and_encoding() {
        const w = 2;
        const radius = 2;
        const max = 10;
        const min = 0;
        const n = ScalarEncoder.getNforRadius(radius, w, min, max);
        Expect(n).toBe(6);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        Expect(encoder.bucketSize).toBe(radius);
        Expect(encoder.buckets.length).toBe(5);
        Expect(encoder.buckets).toEqual([1, 3, 5, 7, 9]);

        Expect(encoder.encode(-1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.5).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(1.99).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(2).activeBits)
            .toEqual([1, 2]);
        Expect(encoder.encode(9.9).activeBits)
            .toEqual([4, 5]);
        Expect(encoder.encode(10.5).activeBits)
            .toEqual([4, 5]);
        Expect(encoder.encode(0).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(1).activeBits)
            .toEqual([0, 1]);
    }

@Test(`encoding 0-1 with min=0, max=1, w=2 and precision=0.1 must result in
    0.00 - 1100000000000000000000
    0.50 - 0110000000000000000000
    0.10 - 0011000000000000000000
    0.15 - 0001100000000000000000
    0.20 - 0000110000000000000000
    0.25 - 0000011000000000000000
    0.30 - 0000001100000000000000
    0.35 - 0000000110000000000000
    0.40 - 0000000011000000000000
    0.45 - 0000000001100000000000
    0.50 - 0000000000110000000000
    0.55 - 0000000000011000000000
    0.60 - 0000000000001100000000
    0.65 - 0000000000000110000000
    0.70 - 0000000000000011000000
    0.75 - 0000000000000001100000
    0.80 - 0000000000000000110000
    0.85 - 0000000000000000011000
    0.90 - 0000000000000000001100
    0.95 - 0000000000000000000110
    1.00 - 0000000000000000000011
    `)
    public test_get_n_for_precision_0_dot_1() {
        const w = 2;
        const precision = 0.1;
        const max = 1;
        const min = 0;
        const n = ScalarEncoder.getNforPrecision(precision, w, min, max);
        const expectedN = "0000000000000000000011".length;
        Expect(n).toBe(expectedN);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        const expectedTotalBuckets = 2 * (max - min) / precision + 1;
        Expect(encoder.buckets.length).toBe(expectedTotalBuckets);
        const expectedBucketSize = (max - min) / expectedTotalBuckets;
        Expect(encoder.bucketSize).toBe(expectedBucketSize);

        const expectedBuckets = [];
        let nextBucket = min + (expectedBucketSize / 2);
        expectedBuckets.push(nextBucket);
        for (let i = 1; i < expectedTotalBuckets; i++) {
            nextBucket += expectedBucketSize;
            expectedBuckets.push(nextBucket);
        }

        const buckets = encoder.buckets.map((bucketValue) => Number((bucketValue).toFixed(3)) );
        Expect(buckets).toEqual(expectedBuckets.map((b: number) => Number(b.toFixed(3))));

        Expect(encoder.encode(-1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.5).activeBits)
            .toEqual([0, 1]);
        let i1 = 0;
        let i2 = 1;
        for (let i = min; i < max; i += precision / 2) {
            Expect(encoder.encode(i).activeBits)
            .toEqual([i1, i2]);
            i1 += 1;
            i2 += 1;
        }
        Expect(encoder.encode(max).activeBits)
            .toEqual([n - 2, n - 1]);
    }
@Test(`encoding 0-1 with min=0, max=1, w=2 and precision=0.1 must result in
    0.00 - 110000
    0.25 - 011000
    0.50 - 001100
    0.75 - 000110
    1.00 - 000011
    `)
    public test_get_n_for_precision_0_dot_5() {
        const w = 2;
        const precision = 0.5;
        const max = 1;
        const min = 0;
        const n = ScalarEncoder.getNforPrecision(precision, w, min, max);
        const expectedN = "000011".length;
        Expect(n).toBe(expectedN);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        const expectedTotalBuckets = 2 * (max - min) / precision + 1;
        Expect(encoder.buckets.length).toBe(expectedTotalBuckets);
        const expectedBucketSize = (max - min) / expectedTotalBuckets;
        Expect(encoder.bucketSize).toBe(expectedBucketSize);

        const expectedBuckets = [];
        let nextBucket = min + (expectedBucketSize / 2);
        expectedBuckets.push(nextBucket);
        for (let i = 1; i < expectedTotalBuckets; i++) {
            nextBucket += expectedBucketSize;
            expectedBuckets.push(nextBucket);
        }

        const buckets = encoder.buckets.map((bucketValue) => Number((bucketValue).toFixed(3)) );
        Expect(buckets).toEqual(expectedBuckets.map((b: number) => Number(b.toFixed(3))));

        Expect(encoder.encode(-1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.5).activeBits)
            .toEqual([0, 1]);
        let i1 = 0;
        let i2 = 1;
        for (let i = min; i < max; i += precision / 2) {
            Expect(encoder.encode(i).activeBits)
            .toEqual([i1, i2]);
            i1 += 1;
            i2 += 1;
        }
        Expect(encoder.encode(max).activeBits)
            .toEqual([n - 2, n - 1]);
    }

    @Test(`encoding 0-10 with min=0, max=1, w=2 and precision=0.1 must result in
    0.00 - 110000
    2.50 - 011000
    5.00 - 001100
    7.50 - 000110
    10.0 - 000011
    `)
    public test_get_n_0_10_for_precision_0_dot_5() {
        const w = 2;
        const precision = 5;
        const max = 10;
        const min = 0;
        const n = ScalarEncoder.getNforPrecision(precision, w, min, max);
        const expectedN = "000011".length;
        Expect(n).toBe(expectedN);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        const expectedTotalBuckets = 2 * (max - min) / precision + 1;
        Expect(encoder.buckets.length).toBe(expectedTotalBuckets);
        const expectedBucketSize = (max - min) / expectedTotalBuckets;
        Expect(encoder.bucketSize).toBe(expectedBucketSize);

        const expectedBuckets = [];
        let nextBucket = min + (expectedBucketSize / 2);
        expectedBuckets.push(nextBucket);
        for (let i = 1; i < expectedTotalBuckets; i++) {
            nextBucket += expectedBucketSize;
            expectedBuckets.push(nextBucket);
        }

        const buckets = encoder.buckets.map((bucketValue) => Number((bucketValue).toFixed(3)) );
        Expect(buckets).toEqual(expectedBuckets.map((b: number) => Number(b.toFixed(3))));

        Expect(encoder.encode(-1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.1).activeBits)
            .toEqual([0, 1]);
        Expect(encoder.encode(-0.5).activeBits)
            .toEqual([0, 1]);
        let i1 = 0;
        let i2 = 1;
        for (let i = min; i < max; i += precision / 2) {
            Expect(encoder.encode(i).activeBits)
            .toEqual([i1, i2]);
            i1 += 1;
            i2 += 1;
        }
        Expect(encoder.encode(max).activeBits)
            .toEqual([n - 2, n - 1]);
    }

    @Test(`encoding -10-10 with min=0, max=1, w=2 and precision=0.1 must result in
    -10.00 - 110000000
    -07.50 - 0110000000
    -05.00 - 0011000000
    -02.50 - 0001100000
    +00.00 - 0000110000
    +02.50 - 0000011000
    +05.00 - 0000001100
    +07.50 - 0000000110
    +10.00 - 0000000011
    `)
    public test_get_n_0_minus10_to_10_for_precision_0_dot_5() {
        const w = 2;
        const precision = 5;
        const max = 10;
        const min = -10;
        const n = ScalarEncoder.getNforPrecision(precision, w, min, max);
        const expectedN = "0000000011".length;
        Expect(n).toBe(expectedN);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        const expectedTotalBuckets = 2 * (max - min) / precision + 1;
        Expect(encoder.buckets.length).toBe(expectedTotalBuckets);
        const expectedBucketSize = (max - min) / expectedTotalBuckets;
        Expect(encoder.bucketSize).toBe(expectedBucketSize);

        const expectedBuckets = [];
        let nextBucket = min + (expectedBucketSize / 2);
        expectedBuckets.push(nextBucket);
        for (let i = 1; i < expectedTotalBuckets; i++) {
            nextBucket += expectedBucketSize;
            expectedBuckets.push(nextBucket);
        }

        const buckets = encoder.buckets.map((bucketValue) => Number((bucketValue).toFixed(3)) );
        Expect(buckets).toEqual(expectedBuckets.map((b: number) => Number(b.toFixed(3))));

        let i1 = 0;
        let i2 = 1;
        for (let i = min; i < max; i += precision / 2) {
            Expect(encoder.encode(i).activeBits)
            .toEqual([i1, i2]);
            i1 += 1;
            i2 += 1;
        }
        Expect(encoder.encode(max).activeBits)
            .toEqual([n - 2, n - 1]);
    }

    @Test(`encoding -10-10 with min=0, max=1, w=2 and precision=0.1 must result in
    0.0 - 111000000000000000000000000000000
    0.1 - 000111000000000000000000000000000
    0.2 - 000000111000000000000000000000000
    0.3 - 000000000111000000000000000000000
    0.4 - 000000000000111000000000000000000
    0.5 - 000000000000000111000000000000000
    0.6 - 000000000000000000111000000000000
    0.7 - 000000000000000000000111000000000
    0.8 - 000000000000000000000000111000000
    0.9 - 000000000000000000000000000111000
    1.0 - 000000000000000000000000000000111
    `)
    public test_get_n_for_w_3_range_0_to_1_for_precision_0_dot_1() {
        const w = 3;
        const precision = 0.1;
        const max = 1;
        const min = 0;
        const n = ScalarEncoder.getNforPrecision(precision, w, min, max);
        const expectedN = "000000000000000000000000000000111".length;
        Expect(n).toBe(expectedN);
        const encoder = ScalarEncoderBuilder.build(n, w, min, max);
        const expectedTotalBuckets = w * (max - min) / precision + 1;
        Expect(encoder.buckets.length).toBe(expectedTotalBuckets);
        const expectedBucketSize = (max - min) / expectedTotalBuckets;
        Expect(encoder.bucketSize).toBe(expectedBucketSize);

        const expectedBuckets = [];
        let nextBucket = min + (expectedBucketSize / 2);
        expectedBuckets.push(nextBucket);
        for (let i = 1; i < expectedTotalBuckets; i++) {
            nextBucket += expectedBucketSize;
            expectedBuckets.push(nextBucket);
        }

        const buckets = encoder.buckets.map((bucketValue) => Number((bucketValue).toFixed(3)) );
        Expect(buckets).toEqual(expectedBuckets.map((b: number) => Number(b.toFixed(3))));

        let i1 = 0;
        let i2 = 1;
        let i3 = 2;
        for (let i = min; i < max; i += precision / 3) {
            Expect(encoder.encode(i).activeBits)
            .toEqual([i1, i2, i3]);
            i1 += 1;
            i2 += 1;
            i3 += 1;
        }
        Expect(encoder.encode(max).activeBits)
            .toEqual([n - 3, n - 2, n - 1]);
    }

    @Test(`encoding 0-1 with min=0, max=1, w=2, precision=0.1 and rotative=true must result in

    w=2, n=8, p=0.25, nb=4
    0.00 - 10000001    11 00
    0.25 - 01100000    00 11
    0.50 - 00011000    00 0011
    0.75 - 00000110    00 000011(6) + 2
    1.00 - 10000001(8) 00 00000011(8)     4

    w=2, n=8, p=0.2, nb=5
    0.00 - 100000001
    0.20 - 011000000    11
    0.40 - 000110000    0011
    0.60 - 000001100    000011
    0.80 - 000000011    00000011(8)+1
    1.00 - 100000001(9) 0000000011(10)    5

    w=2, n=19, p=0.1, nb=10
    0.0 - 1000000000000000001
    0.1 - 0110000000000000000
    0.2 - 0001100000000000000
    0.3 - 0000011000000000000
    0.4 - 0000000110000000000
    0.5 - 0000000001100000000
    0.6 - 0000000000011000000
    0.7 - 0000000000000110000
    0.8 - 0000000000000001100
    0.9 - 0000000000000000011     000000000000000011(18) + 1   10
    1.0 - 1000000000000000001(19) 00000000000000000011(20) 11

    w= 3, n=31, p=0.1, nb=30
    0.0 - 1100000000000000000100000000001
    0.1 - 0011100000000000000000000000000
    0.2 - 0000011100000000000000000000000
    0.3 - 0000000011100000000000000000000
    0.4 - 0000000000011100000000000000000
    0.5 - 0000000000000011100000000000000
    0.6 - 0000000000000000011100000000000
    0.7 - 0000000000000000000011100000000
    0.8 - 0000000000000000000000011100000
    0.9 - 0000000000000000000000000011100     000000000000000000000000111 (27) + 4 10
    1.0 - 1000000000000000000000000000011(31) 000000000000000000000000000111 (30)
    `)
    public test_get_n_for_w_2_range_0_to_1_for_precision_0_dot_1_rotative() {
        const w = 2;
        const precision = 0.1;
        const max = 1;
        const min = 0;
        const rotative = true;

        const n2 = ScalarEncoder.getNforPrecision(0.25, 2, min, max, rotative);
        const expectedN2 = "10000001".length;

        const n4 = ScalarEncoder.getNforPrecision(0.2, 2, min, max, rotative);
        const expectedN4 = "100000001".length;

        const n = ScalarEncoder.getNforPrecision(precision, w, min, max, rotative);
        const expectedN = "1000000000000000001".length;

        const n3 = ScalarEncoder.getNforPrecision(precision, 3, min, max, rotative);
        const expectedN3 = "1000000000000000000000000000011".length;
        Expect([n2, n4, n, n3]).toEqual([expectedN2, expectedN4, expectedN, expectedN3]);

        // const encoder = ScalarEncoderBuilder.build(n, w, min, max, rotative);
        // const expectedTotalBuckets = w * (max - min) / precision + 1;
        // Expect(encoder.buckets.length).toBe(expectedTotalBuckets);
        // const expectedBucketSize = (max - min) / expectedTotalBuckets;
        // Expect(encoder.bucketSize).toBe(expectedBucketSize);

        // const expectedBuckets = [];
        // let nextBucket = min + (expectedBucketSize / 2);
        // expectedBuckets.push(nextBucket);
        // for (let i = 1; i < expectedTotalBuckets; i++) {
        //     nextBucket += expectedBucketSize;
        //     expectedBuckets.push(nextBucket);
        // }

        // const buckets = encoder.buckets.map((bucketValue) => Number((bucketValue).toFixed(3)) );
        // Expect(buckets).toEqual(expectedBuckets.map((b: number) => Number(b.toFixed(3))));

        // let i1 = 0;
        // let i2 = 1;
        // let i3 = 2;
        // for (let i = min; i < max; i += precision / 3) {
        //     Expect(encoder.encode(i).activeBits)
        //     .toEqual([i1, i2, i3]);
        //     i1 += 1;
        //     i2 += 1;
        //     i3 += 1;
        // }
        // Expect(encoder.encode(max).activeBits)
        //     .toEqual([n - 3, n - 2, n - 1]);
    }

}
