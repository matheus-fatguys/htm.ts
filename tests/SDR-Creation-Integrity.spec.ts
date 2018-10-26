import { Expect } from 'alsatian';
import { Test } from 'alsatian';
import { TestFixture } from 'alsatian';
import { SDR, SDRBuilder } from './../sdr/SDR';

@TestFixture("SDR creation integrity")
export class SDRCreationIntegrityTestFixture {

    @Test("creating a SDR with w>n must throw an exception")
    public test_w_greater_than_n() {
        let w=21
        let n=20
        let activeBits=[0,1];

        Expect(() => SDRBuilder.build(w,n, activeBits)).toThrowError(Error, "w:"+w+" must be less than n:"+n);
    }

    @Test("creating a SDR with active bits>w must throw an exception")
    public test_active_bits_different_from_w() {
        let w=3
        let n=20
        let activeBits=[0, 1, 2, 3, 4];

        Expect(() => SDRBuilder.build(w,n, activeBits)).toThrowError(Error, "active bits must be less than or equal to w:"+w);
    }

    @Test("creating a SDR with active bit<0 must throw an exception")
    public test_active_bit_less_than_0() {
        let w=2
        let n=20
        let bit = -1
        let activeBits=[bit, 1];

        Expect(() => SDRBuilder.build(w,n, activeBits)).toThrowError(Error, "bit "+bit+" out of bounds [0-"+(n-1)+"]");
    }

    @Test("creating a SDR with active bit>n-1 must throw an exception")
    public test_active_bit_greater_than_n_minus_1() {
        let w=2
        let n=20
        let bit = 20
        let activeBits=[0, bit];

        Expect(() => SDRBuilder.build(w,n, activeBits)).toThrowError(Error, "bit "+bit+" out of bounds [0-"+(n-1)+"]");
    }

    @Test("creating a valid SDR")
    public test_creating_a_valid_SDR() {
        let w=2
        let n=20
        let activeBits=[0, 1];

        let sdr = SDRBuilder.build(w,n, activeBits);
        Expect(sdr.n).toBe(n);
        Expect(sdr.w).toBe(w);
        Expect(sdr.activeBits).toBe(activeBits);
    }

    @Test("creating a valid SDR with unsorted active bis array must result in a SDR with a sorted active bits array")
    public test_creating_a_valid_SDR_with_unsorted_active_bits() {
        let w=5
        let n=20
        let activeBits=[0, 2, 1, 4, 3];

        let sdr = SDRBuilder.build(w,n, activeBits);
        Expect(sdr.activeBits).toBe([0, 1, 2, 3, 4]);
    }

}
