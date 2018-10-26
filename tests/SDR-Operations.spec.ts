import { Expect } from 'alsatian';
import { Test } from 'alsatian';
import { TestFixture } from 'alsatian';
import { SDR, SDRBuilder } from './../sdr/SDR';

@TestFixture("SDR creation integrity")
export class SDROperationsTestFixture {

    @Test("Overlaping 2 SDRs with no overlapping bits must empty")
    public test_no_overlaping_score_must_be_empty() {
        //1110000000
        //and
        //0001110000
        //=
        //0000000000
        let w=3
        let n=10
        let activeBits1=[0, 1, 2];

        let activeBits2=[3, 4, 5];

        let sdr1 = SDRBuilder.build(w, n, activeBits1);
        let sdr2 = SDRBuilder.build(w, n, activeBits1);

        let overlapScore = sdr1.overlap(sdr2).activeBits.length;

        Expect(overlapScore).toBe(0);

        overlapScore = sdr2.overlap(sdr1).activeBits.length;

        Expect(overlapScore).toBe(0);
    }

    @Test("Overlaping 2 SDRs with no overlapping bits must have an overlapping score of 0")
    public test_no_overlaping_score_must_be_0() {
        //1110000000
        //and
        //0001110000
        //=
        //0000000000
        let w1=3
        let n1=10
        let activeBits1=[0, 1, 2];

        let w2=3
        let n2=10
        let activeBits2=[3, 4, 5];

        let sdr1 = SDRBuilder.build(w1, n1, activeBits1);
        let sdr2 = SDRBuilder.build(w1, n1, activeBits1);

        Expect(sdr1.overlapScore(sdr2)).toBe(0);
        Expect(sdr2.overlapScore(sdr1)).toBe(0);
    }

    @Test("Overlaping 2 indentical SDRs must be equal to both of them")
    public test_overlaping_2_identical_SDRs() {
        //1110000000
        //and
        //1110000000
        //=
        //1110000000
        let w=3
        let n=10
        let activeBits=[0, 1, 2];

        let sdr1 = SDRBuilder.build(n, w, activeBits);
        let sdr2 = SDRBuilder.build(n, w, activeBits);

        let overlap= sdr1.overlap(sdr2);

        Expect(overlap.n).toBe(n);
        Expect(overlap.w).toBe(w);

        Expect(overlap.activeBits.length).toBe(sdr1.activeBits.length);
        Expect(overlap.activeBits
                    .map(bit=>sdr1.activeBits.findIndex(bitS=>bit===bitS))
                    .filter(bit=>bit<0).length)
                .toBe(0);

    }

    @Test("Overlaping 2 indentical SDRs must have overlap score equal to w")
    public test_overlaping_2_identical_SDRs_must_have_overlap_score_equal_to_w() {
        //1110000000
        //and
        //1110000000
        //=
        //1110000000
        let w=3
        let n=10
        let activeBits=[0, 1, 2];

        let sdr1 = SDRBuilder.build(n, w, activeBits);
        let sdr2 = SDRBuilder.build(n, w, activeBits);

        Expect(sdr1.overlapScore(sdr2)).toBe(w);

    }

    @Test("Overlaping 2 SDRs with just the second bit overlapping must result in active bits equal to [1]")
    public test_overlaping_2_SDRs_with_just_the_second_bit_overlapping() {
        //1110000000
        //and
        //0011100000
        //=
        //0010000000
        let w=3
        let n=10
        let activeBits1=[0, 1, 2];
        let activeBits2=[2, 3, 4];

        let sdr1 = SDRBuilder.build(n, w, activeBits1);
        let sdr2 = SDRBuilder.build(n, w, activeBits2);

        let overlap= sdr1.overlap(sdr2);
        Expect(overlap.n).toBe(n);
        Expect(overlap.w).toBe(w);
        Expect(overlap.activeBits).toBe([2]);

    }

    @Test("Overlaping 2 SDRs with just one overlapping bit must have ovelrap score equal to 1")
    public test_overlaping_2_SDRs_with_just_1_overlapping_bit_must_have_overlap_score_equal_to_1() {
        //1110000000
        //and
        //0011100000
        //=
        //0010000000
        let w=3
        let n=10
        let activeBits1=[0, 1, 2];
        let activeBits2=[2, 3, 4];

        let sdr1 = SDRBuilder.build(n, w, activeBits1);
        let sdr2 = SDRBuilder.build(n, w, activeBits2);

        let overlapScore= sdr1.overlapScore(sdr2);

        Expect(overlapScore).toBe(1);

    }

    @Test("Concatenating 2 SDRs with no overlapping bits have w=w1+w2 n=n1+n2 and all bits must be present")
    public test_concatenating_non_overlaping_SDRs() {
        //1110000000+0011100000
        //=
        //11100000000011100000
        let w1=3
        let n1=10
        let activeBits1=[0,1,2];

        let w2=4
        let n2=20
        let activeBits2=[3, 4, 5, 6];

        let sdr1 = SDRBuilder.build(w1, n1, activeBits1);
        let sdr2 = SDRBuilder.build(w2, n2, activeBits2);

        let concatenation = sdr1.concatenate(sdr2);

        Expect(concatenation.n).toBe(n1+n2);
        Expect(concatenation.w).toBe(w1+w2);

        Expect(concatenation.activeBits.length).toBe(activeBits1.length+activeBits2.length);
        Expect(concatenation.activeBits
            .map(b=>sdr1.activeBits.findIndex(b2=>b===b2))
            .filter(b3=>b3<0).length)
        .toBe(0);
        Expect(concatenation.activeBits
            .map(b=>sdr2.activeBits.findIndex(b2=>b===n1+b2))
            .filter(b3=>b3<0).length)
        .toBe(0);
    }

    

}
