import { Expect, TestFixture } from "alsatian";
import { Test } from "alsatian";
// tslint:disable-next-line:sort-imports
import { CategoryEncoder } from "../src/CategoryEncoder";
import { CategoryEncoderBuilder } from "./../src/CategoryEncoderBuilder";

@TestFixture("Category Encoder creation integrity")
export class CategoryEncoderTestFixture {

    @Test("creating a CategoryEncoder with no categories at all")
    public test_no_categories() {
        const w = 2;
        const n = 20;
        const intersection = 1;
        Expect(() => CategoryEncoderBuilder.build(n, w, intersection, []))
        .toThrowError(Error, "at least one category must be in categories list");
    }

    @Test(`creating a CategoryEncoder with 100% intersection must throw an exception`)
    public test_total_intersection() {
        const w = 3;
        const n = 21;
        const categories = ["JAN", "KEN", "PO"];
        const intersection = 1;
        Expect(() => CategoryEncoderBuilder.build(n, w, intersection, categories))
        .toThrowError(Error, "intersection: " + intersection + " must be in range [0-1)");
    }

    @Test(`creating a CategoryEncoder with n less than minimal n`)
    public test_n_less_than_minimal() {
        const w = 3;
        const categories = ["JAN", "KEN", "PO"];
        const intersection = 0;
        const n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        Expect(() => CategoryEncoderBuilder.build(n - 1, w, intersection, categories))
        .toThrowError(Error, "n: " + (n - 1) + " must be at least " + n);
    }

    @Test(`getting n for different valid intersections`)
    public test_different_valid_intersections() {
        const categories = ["JAN", "KEN", "PO"];
        Expect(CategoryEncoder.getNforIntersection(0, 4, categories)).toBe(4 * categories.length);
        Expect(CategoryEncoder.getNforIntersection(0, 3, categories)).toBe(3 * categories.length);
        Expect(CategoryEncoder.getNforIntersection(0, 2, categories)).toBe(2 * categories.length);
        Expect(CategoryEncoder.getNforIntersection(0, 1, categories)).toBe(1 * categories.length);

        Expect(CategoryEncoder.getNforIntersection(0.5, 4, categories)).toBe(8);
        Expect(CategoryEncoder.getNforIntersection(1 / 3, 3, categories)).toBe(7);
        Expect(CategoryEncoder.getNforIntersection(2 / 3, 3, categories)).toBe(5);
        Expect(CategoryEncoder.getNforIntersection(0.5, 2, categories)).toBe(4);
        Expect(CategoryEncoder.getNforIntersection(0.5, 1, categories)).toBe(2);
    }
    @Test(`creating a CategoryEncoder with different valid intersections`)
    public test_different_valid_encoders() {
        const w = 3;
        const categories = ["JAN", "KEN", "PO"];
        let intersection = 0;

        let n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        let encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.bucketIndexes[categories[0]]).toBe(0);
        Expect(encoder.bucketIndexes[categories[1]]).toBe(3);
        Expect(encoder.bucketIndexes[categories[2]]).toBe(6);

        intersection = 2 / 3;
        n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.bucketIndexes[categories[0]]).toBe(0);
        Expect(encoder.bucketIndexes[categories[1]]).toBe(1);
        Expect(encoder.bucketIndexes[categories[2]]).toBe(2);

        intersection = 1 / 3;
        n = CategoryEncoder.getNforIntersection(intersection, w, categories);
        encoder = CategoryEncoderBuilder.build(n, w, intersection, categories);
        Expect(encoder.bucketIndexes[categories[0]]).toBe(0);
        Expect(encoder.bucketIndexes[categories[1]]).toBe(2);
        Expect(encoder.bucketIndexes[categories[2]]).toBe(4);
    }
}
