import { Expect, TestFixture } from "alsatian";
import { Test } from "alsatian";
// tslint:disable-next-line:sort-imports
import { CategoryEncoder } from "../src/CategoryEncoder";
import { CategoryEncoderBuilder } from "./../src/CategoryEncoderBuilder";
@TestFixture("Category Encoder encoding")
export class CategoryEncoderEncodingTestFixture {

    @Test(`encoding JAN, KEN, PO with w=3  and intersection=0 must result in
    111000000 -> JAN
    000111000 -> KEN
    000000111 -> PO
    `)
    public test_jan_ken_po_w_3_intersection_0() {
        const w = 3;
        const intersection = 0;
        const categories = ["JAN", "KEN", "PO"];
        const n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        const encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.encode("JAN").activeBits).toEqual([0, 1, 2]);
        Expect(encoder.encode("KEN").activeBits).toEqual([3, 4, 5]);
        Expect(encoder.encode("PO").activeBits).toEqual([6, 7, 8]);
    }

    @Test(`encoding JAN, KEN, PO with w=3  and intersection=2/3 must result in
    11100 -> JAN
    01110 -> KEN
    00111 -> PO
    `)
    public test_jan_ken_po_w_3_intersection_2_3() {
        const w = 3;
        const intersection = 2 / 3;
        const categories = ["JAN", "KEN", "PO"];
        const n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        const encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.encode("JAN").activeBits).toEqual([0, 1, 2]);
        Expect(encoder.encode("KEN").activeBits).toEqual([1, 2, 3]);
        Expect(encoder.encode("PO").activeBits).toEqual([2, 3, 4]);
    }

    @Test(`encoding JAN, KEN, PO with w=3  and intersection=1/3 must result in
    1110000 -> JAN
    0011100 -> KEN
    0000111 -> PO
    `)
    public test_jan_ken_po_w_3_intersection_1_3() {
        const w = 3;
        const intersection = 1 / 3;
        const categories = ["JAN", "KEN", "PO"];
        const n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        const encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.encode("JAN").activeBits).toEqual([0, 1, 2]);
        Expect(encoder.encode("KEN").activeBits).toEqual([2, 3, 4]);
        Expect(encoder.encode("PO").activeBits).toEqual([4, 5, 6]);
    }

    @Test(`encoding JAN, KEN, PO with w=2  and intersection=0 must result in
    110000 -> JAN
    001100 -> KEN
    000011 -> PO
    `)
    public test_jan_ken_po_w_2_intersection_0() {
        const w = 2;
        const intersection = 0;
        const categories = ["JAN", "KEN", "PO"];
        const n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        const encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.encode("JAN").activeBits).toEqual([0, 1]);
        Expect(encoder.encode("KEN").activeBits).toEqual([2, 3]);
        Expect(encoder.encode("PO").activeBits).toEqual([4, 5]);
    }

    @Test(`encoding JAN, KEN, PO with w=2  and intersection=0.5 must result in
    1100 -> JAN
    0110 -> KEN
    0011 -> PO
    `)
    public test_jan_ken_po_w_2_intersection_0_dot_5() {
        const w = 2;
        const intersection = 0.5;
        const categories = ["JAN", "KEN", "PO"];
        const n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        const encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.encode("JAN").activeBits).toEqual([0, 1]);
        Expect(encoder.encode("KEN").activeBits).toEqual([1, 2]);
        Expect(encoder.encode("PO").activeBits).toEqual([2, 3]);
    }

}
