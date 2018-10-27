import { Expect } from "alsatian";
import { Test } from "alsatian";
import { TestFixture } from "alsatian";
// tslint:disable-next-line:sort-imports
import { SDRBuilder } from "./../src/SDRBuilder";

@TestFixture("SDR creation integrity")
export class SDROperationsTestFixture {

    @Test("Overlaping 2 non overlapping SDRs overlapping bits must have overlapScore  = 0")
    public test_no_overlaping_score() {
        // 1110000000
        // overlap
        // 0001110000
        //  =
        // 0000000000
        const w = 3;
        const n = 10;
        const activeBits1 = [0, 1, 2];

        const activeBits2 = [3, 4, 5];

        const sdr1  =  SDRBuilder.build(n, w, activeBits1);
        const sdr2  =  SDRBuilder.build(n, w, activeBits2);

        let overlapScore  =  sdr1.overlap(sdr2).activeBits.length;

        Expect(overlapScore).toBe(0);

        overlapScore  =  sdr2.overlap(sdr1).activeBits.length;

        Expect(overlapScore).toBe(0);
    }

    @Test("Overlaping 2 non overlapping SDRs must have an overlapping score of 0")
    public test_no_overlaping_score_must_be_0() {
        // 1110000000
        // overlap
        // 0001110000
        //  =
        // 0000000000
        const w = 3;
        const n = 10;
        const activeBits1 = [0, 1, 2];

        const activeBits2 = [3, 4, 5];

        const sdr1  =  SDRBuilder.build(n, w, activeBits1);
        const sdr2  =  SDRBuilder.build(n, w, activeBits2);
        const overlap = sdr2.overlap(sdr1);
        Expect(overlap.activeBits.length).toBe(0);
        Expect(overlap.n).toBe(n);
        Expect(overlap.getSparsity()).toBe(0);
        Expect(sdr1.overlapScore(sdr2)).toBe(0);
        Expect(sdr2.overlapScore(sdr1)).toBe(0);
    }

    @Test("Overlaping 2 indentical SDRs must be equal to both of them")
    public test_overlaping_2_identical_SDRs() {
        // 1110000000
        // overlap
        // 1110000000
        //  =
        // 1110000000
        const w = 3;
        const n = 10;
        const activeBits = [0, 1, 2];

        const sdr1  =  SDRBuilder.build(n, w, activeBits);
        const sdr2  =  SDRBuilder.build(n, w, activeBits);

        const overlap =  sdr1.overlap(sdr2);

        Expect(overlap.n).toBe(n);
        Expect(overlap.w).toBe(w);

        Expect(overlap.activeBits.length).toBe(sdr1.activeBits.length);
        Expect(overlap.activeBits
                    .map((bit) => sdr1.activeBits.findIndex((bitS) => bit === bitS))
                    .filter((bit) => bit < 0).length)
                .toBe(0);

    }

    @Test("Overlaping 2 indentical SDRs must have overlap score equal to w")
    public test_overlaping_2_identical_SDRs_must_have_overlap_score_equal_to_w() {
        // 1110000000
        // overlap
        // 1110000000
        //  =
        // 1110000000
        const w = 3;
        const n = 10;
        const activeBits = [0, 1, 2];

        const sdr1  =  SDRBuilder.build(n, w, activeBits);
        const sdr2  =  SDRBuilder.build(n, w, activeBits);

        Expect(sdr1.overlapScore(sdr2)).toBe(w);

    }

    @Test("Overlaping 2 SDRs with just the second bit overlapping must result in active bits equal to [1]")
    public test_overlaping_2_SDRs_with_just_the_second_bit_overlapping() {
        // 1110000000
        // overlap
        // 0011100000
        //  =
        // 0010000000
        const w = 3;
        const n = 10;
        const activeBits1 = [0, 1, 2];
        const activeBits2 = [2, 3, 4];

        const sdr1  =  SDRBuilder.build(n, w, activeBits1);
        const sdr2  =  SDRBuilder.build(n, w, activeBits2);

        const overlap =  sdr1.overlap(sdr2);
        Expect(overlap.n).toBe(n);
        Expect(overlap.w).toBe(1);
        Expect(overlap.activeBits).toEqual([2]);

    }

    @Test("Overlaping 2 SDRs with just one overlapping bit must have ovelrap score equal to 1")
    public test_overlaping_2_SDRs_with_just_1_overlapping_bit_must_have_overlap_score_equal_to_1() {
        // 1110000000
        // overlap
        // 0011100000
        //  =
        // 0010000000
        const w = 3;
        const n = 10;
        const activeBits1 = [0, 1, 2];
        const activeBits2 = [2, 3, 4];

        const sdr1  =  SDRBuilder.build(n, w, activeBits1);
        const sdr2  =  SDRBuilder.build(n, w, activeBits2);

        const overlapScore =  sdr1.overlapScore(sdr2);

        Expect(overlapScore).toBe(1);

    }

    @Test("Concatenating 2 SDRs must have w = w1+w2 n = n1+n2 and all bits must be present")
    public test_concatenating_non_overlaping_SDRs() {
        // [0, 1, 2]=1110000000
        // [3, 4, 5, 6]=00011110000
        // 1110000000+00011110000
        //  =
        // 111000000000011110000
        // [0, 1, 2, 13, 14, 15, 16]
        const w1 = 3;
        const n1 = 10;
        const activeBits1 = [0, 1, 2];

        const w2 = 4;
        const n2 = 20;
        const activeBits2 = [3, 4, 5, 6];

        const sdr1  =  SDRBuilder.build(n1, w1, activeBits1);
        const sdr2  =  SDRBuilder.build(n2, w2, activeBits2);

        const concatenation  =  sdr1.concatenate(sdr2);

        Expect(concatenation.n).toBe(n1 + n2);
        Expect(concatenation.w).toBe(w1 + w2);
        Expect(concatenation.activeBits.length).toBe(activeBits1.length + activeBits2.length);

        // checking if all bits are present in the concatenation
        Expect(concatenation.activeBits
            .map((b) => sdr1.activeBits.find((b2) => b === b2))
            .filter((b3) => b3 >= 0))
        .toEqual(activeBits1);

        // checking if all bits are present in the concatenation
        Expect(concatenation.activeBits
            .map((b) => sdr2.activeBits.find((b2) => b === n1 + b2))
            .filter((b3) => b3 >= 0 )
            .map((b) => n1 + b))
        .toEqual(activeBits2.map((b) => n1 + b));
    }

    // tslint:disable-next-line:max-line-length
    @Test(`Uniting 2 SDRs with no overlapping bits must have n = n,
     w = 2*w, 2*n active bits and overlaping score with both SDRs  =  n`)
    public test_union_no_overlaping_SDRs_must_have() {
        // 1110000000
        // union
        // 0001110000
        //  =
        // 1111110000
        const w = 3;
        const n = 10;
        const activeBits1 = [0, 1, 2];

        const activeBits2 = [3, 4, 5];

        const sdr1  =  SDRBuilder.build(n, w, activeBits1);
        const sdr2  =  SDRBuilder.build(n, w, activeBits2);

        const union  =  sdr1.union(sdr2);

        Expect(union.activeBits).toEqual(activeBits1.concat(activeBits2));
        Expect(union.n).toBe(n);
        Expect(union.w).toBe(2 * w);
        Expect(union.activeBits.length).toBe(2 * w);
        Expect(union.overlapScore(sdr1)).toBe(w);
        Expect(union.overlapScore(sdr2)).toBe(w);
    }

    // tslint:disable-next-line:max-line-length
    @Test(`Uniting 2 SDRs with just 1 overlapping bit must have n = n,
    w = 2 * w - 1, 2 * w - 1 active bits and overlaping score with both SDRs  =  w`)
   public test_union_just_1_bit_overlaping_SDRs_must_have() {
       // 1110000000
       // union
       // 0011100000
       //  =
       // 1111100000
       const w = 3;
       const n = 10;
       const activeBits1 = [0, 1, 2];

       const activeBits2 = [2, 3, 4];

       const sdr1  =  SDRBuilder.build(n, w, activeBits1);
       const sdr2  =  SDRBuilder.build(n, w, activeBits2);

       const union  =  sdr1.union(sdr2);

       Expect(union.activeBits).toEqual([0, 1, 2, 3, 4]);
       Expect(union.n).toBe(n);
       Expect(union.w).toBe(2 * w - 1);
       Expect(union.activeBits.length).toBe(2 * w - 1);
       Expect(union.overlapScore(sdr1)).toBe(w);
       Expect(union.overlapScore(sdr2)).toBe(w);
   }

    @Test("Uniting 2 identical SDRs must have n = n, w = w, n active bits and overlaping score  =  w")
    public test_union_identical_SDRs_must_have() {
        //  1110000000
        //  union
        //  1110000000
        //   =
        //  1110000000
        const w = 3;
        const n = 10;
        const activeBits = [0, 1, 2];

        const sdr1  =  SDRBuilder.build(n, w, activeBits);
        const sdr2  =  SDRBuilder.build(n, w, activeBits);

        const union  =  sdr1.union(sdr2);

        Expect(union.activeBits).toEqual(activeBits);
        Expect(union.n).toBe(n);
        Expect(union.w).toBe(w);
        Expect(union.activeBits.length).toBe(w);
        Expect(union.overlapScore(sdr1)).toBe(w);
        Expect(union.overlapScore(sdr2)).toBe(w);
    }

}
