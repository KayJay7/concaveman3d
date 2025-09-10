import { Vec3 } from "gl-matrix";
// import * as quickhull3d from "quickhull3d";

export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function dotSquare(v: Vec3) {
    return v.dot(v);
}

// export function min3(a: number, b: number, c: number) {
//     return Math.min(a, Math.min(b, c));
// }
