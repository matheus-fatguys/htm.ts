import { CategoryEncoder } from "./CategoryEncoder";

export class CategoryEncoderBuilder {
    public static build(n: number, w: number, intersection: number, categories: string[]): CategoryEncoder {
        return new CategoryEncoder(n, w, intersection, categories);
    }
}
