import { Vec3 } from "gl-matrix";
import { Face } from "quickhull3d";
type Point = [number, number, number];
type OutFace = [Point, Point, Point];
export declare function concaveman3dInterop(inputPoints: Point[], concavity: number, lengthThreshold: number): OutFace[];
export declare function concaveman3d(points: Vec3[], concavity: number, lengthThreshold: number, checkAllFaces?: boolean): Face[];
export {};
