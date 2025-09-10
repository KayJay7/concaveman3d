"use strict";
// import RBush from 'rbush';
import { Vec3 } from "gl-matrix";
import { RBush3D } from "rbush-3d";
import { default as quickHull3d, Face } from "quickhull3d";
import Queue from "tinyqueue";
import { orient2d } from "robust-predicates";
import { clamp, dotSquare } from "./utils";

type Point = [number, number, number];
type OutFace = [Point, Point, Point];
const vec3 = () => new Vec3([0, 0, 0]);

export default function concaveman(inputPoints: Point[], concavity: number, lengthThreshold: number): OutFace[] {
    // a relative measure of concavity; higher value means simpler hull
    concavity = Math.max(0, concavity == undefined ? 2 : concavity);
    const sqConcavity = concavity ** 2;

    // when a segment goes below this length threshold, it won't be drilled down further
    lengthThreshold = lengthThreshold || 0;
    const sqLenThreshold = lengthThreshold ** 2;

    const points = inputPoints.map(point => new Vec3(point));

    // start with a convex hull of the points
    const faces = quickHull3d(points);

    const hullVertices = new Set<number>();
    const pointAdjacentFaces = points.map(() => new Set<Face>());

    faces.forEach((face) => {
        face.forEach((point) => {
            hullVertices.add(point);
            pointAdjacentFaces[point].add(face);
        });
    });
    const internalPoints = (new Set(points.keys())).difference(hullVertices);

    const concaveHull: OutFace[] = [];
    while (faces.length > 0) {
        const face = faces.shift()!;

        const point = findPoint(face, points, internalPoints, pointAdjacentFaces);
        if (point != null && decision(face, point, sqConcavity, sqLenThreshold, points)) {
            const newFaces = dig(face, point, hullVertices, internalPoints, pointAdjacentFaces);
            faces.concat(newFaces);
        } else {
            concaveHull.push([inputPoints[face[0]], inputPoints[face[1]], inputPoints[face[2]]]);
        }
    }

    return concaveHull;
}

function dig(
    face: Face,
    point: number,
    hullVertices: Set<number>,
    internalPoints: Set<number>,
    pointAdjacentFaces: Set<Face>[],
): Face[] {
    face.forEach((point) => {
        pointAdjacentFaces[point].delete(face);
    });

    const newFaces = [
        [face[0], face[1], point],
        [face[1], face[2], point],
        [face[2], face[0], point],
    ];

    newFaces.forEach((face) => {
        face.forEach((point) => {
            pointAdjacentFaces[point].add(face);
        });
    });

    internalPoints.delete(point);
    hullVertices.add(point);

    return newFaces;
}

function decision(
    face: Face,
    point: number,
    sqConcavity: number,
    sqLenThreshold: number,
    points: Vec3[],
): boolean {
    const v1 = points[face[0]];
    const v2 = points[face[1]];
    const v3 = points[face[2]];
    const p = points[point];

    const sqL12 = v2.sqrDist(v1);
    const sqL23 = v3.sqrDist(v2);
    const sqL31 = v1.sqrDist(v3);
    const sqD1 = p.sqrDist(v1);
    const sqD2 = p.sqrDist(v2);
    const sqD3 = p.sqrDist(v3);

    const sqAvg = (sqL12 + sqL23 + sqL31) / 3;
    const sqDd = Math.min(sqD1, sqD2, sqD3);

    return (sqDd <= sqAvg / sqConcavity) && (sqAvg >= sqLenThreshold);
}

function findPoint(
    face: Face,
    points: Vec3[],
    internalPoints: Set<number>,
    pointAdjacentFaces: Set<Face>[],
): number | null {
    const v1 = points[face[0]];
    const v2 = points[face[1]];
    const v3 = points[face[2]];

    let closestPoint: number | null = null;
    let sqMinDist = 0;

    const adjacent = Array.from(
        pointAdjacentFaces[face[0]]
            .union(pointAdjacentFaces[face[1]])
            .union(pointAdjacentFaces[face[2]])
            .difference(new Set(face))
            .values()
            .map(face => [points[face[0]], points[face[1]], points[face[2]]]));

    internalPoints.forEach((candidate) => {
        const p = points[candidate];
        const sqDist = dTriangle(v1, v2, v3, p);
        if ((closestPoint == null || sqDist < sqMinDist) && adjacent.every(
            face => dTriangle(face[0], face[1], face[2], p) >= sqDist)) {
            closestPoint = candidate;
            sqMinDist = sqDist;
        }
    });

    return closestPoint;
}

function dTriangle(v1: Vec3, v2: Vec3, v3: Vec3, p: Vec3) {
    // prepare data
    const v12 = v2.sub(v1); const p1 = p.sub(v1);
    const v23 = v3.sub(v2); const p2 = p.sub(v2);
    const v31 = v1.sub(v3); const p3 = p.sub(v3);
    const nor = Vec3.cross(vec3(), v12, v31) as Vec3;

    if (Math.sign(Vec3.dot(Vec3.cross(vec3(), v12, nor), p1))
        + Math.sign(Vec3.dot(Vec3.cross(vec3(), v23, nor), p2))
        + Math.sign(Vec3.dot(Vec3.cross(vec3(), v31, nor), p3)) < 2) {
        // 3 edges
        return Math.min(
            dotSquare(v12.scale(clamp(v12.dot(p1) / dotSquare(v12), 0, 1)).sub(p1)),
            dotSquare(v23.scale(clamp(v23.dot(p2) / dotSquare(v23), 0, 1)).sub(p2)),
            dotSquare(v31.scale(clamp(v31.dot(p3) / dotSquare(v31), 0, 1)).sub(p3)));
    } else {
        // 1 face
        return nor.dot(p1) * nor.dot(p1) / dotSquare(nor);
    }
}
