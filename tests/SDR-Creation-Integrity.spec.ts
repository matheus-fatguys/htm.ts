import { Expect } from "alsatian";
import { Test } from "alsatian";
import { TestFixture } from "alsatian";
// tslint:disable-next-line:sort-imports
import { SDRBuilder } from "../src/SDRBuilder";

@TestFixture("SDR creation integrity")
export class SDRCreationIntegrityTestFixture {

    @Test("creating a SDR with w>n must throw an exception")
    public test_w_greater_than_n() {
        const w = 21;
        const n = 20;
        const activeBits = [0, 1];

        Expect(() => SDRBuilder.build(n, w, activeBits))
        .toThrowError(Error, "w:" + w + " must be less than n:" + n);
    }

    @Test("creating a SDR with active bits>w must throw an exception")
    public test_active_bits_different_from_w() {
        const w = 3;
        const n = 20;
        const activeBits = [0, 1, 2, 3, 4];

        Expect(() => SDRBuilder.build(n, w, activeBits))
        .toThrowError(Error, "active bits must be less than or equal to w:" + w);
    }

    @Test("creating a SDR with active bit<0 must throw an exception")
    public test_active_bit_less_than_0() {
        const w = 2;
        const n = 20;
        const bit = -10;
        const activeBits = [bit, 1];

        Expect(() => SDRBuilder.build(n, w, activeBits))
        .toThrowError(Error, "bit " + bit + " out of bounds [0-" + (n - 1) + "]");
    }

    @Test("creating a SDR with active bit>n-1 must throw an exception")
    public test_active_bit_greater_than_n_minus_1() {
        const w = 2;
        const n = 20;
        const bit = 20;
        const activeBits = [0, bit];

        Expect(() => SDRBuilder.build(n, w, activeBits))
        .toThrowError(Error, "bit " + bit + " out of bounds [0-" + (n - 1) + "]");
    }

    @Test("creating a valid SDR")
    public test_creating_a_valid_SDR() {
        const w = 2;
        const n = 20;
        const activeBits = [0, 1];

        const sdr = SDRBuilder.build(n, w, activeBits);
        Expect(sdr.n).toBe(n);
        Expect(sdr.w).toBe(w);
        Expect(sdr.activeBits).toBe(activeBits);
    }

    @Test("creating a valid SDR with unsorted active bis array must result in a SDR with a sorted active bits array")
    public test_creating_a_valid_SDR_with_unsorted_active_bits() {
        const w = 5;
        const n = 20;
        const activeBits = [0, 2, 1, 4, 3];
        const sortedActiveBits = activeBits.sort();
        const sdr = SDRBuilder.build(n, w, activeBits);
        Expect(sdr.activeBits)
        .toBe(sortedActiveBits);
    }

}
