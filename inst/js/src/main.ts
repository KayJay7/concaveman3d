"use strict";
import { Vec3 } from "gl-matrix";
import { default as quickHull3d, Face } from "quickhull3d";
import { clamp } from "./utils";
import Queue from "tinyqueue";

type Point = [number, number, number];
type OutFace = [Point, Point, Point];
const vec3 = () => new Vec3([0, 0, 0]);

export function concaveman3dInterop(inputPoints: Point[], concavity: number, lengthThreshold: number): OutFace[] {
    const points = inputPoints.map(point => new Vec3(point));
    const concaveHull = concaveman3d(points, concavity, lengthThreshold);
    return concaveHull.map(face => [inputPoints[face[0]], inputPoints[face[1]], inputPoints[face[2]]]);
}

export function concaveman3d(points: Vec3[], concavity: number, lengthThreshold: number, checkAllFaces = true): Face[] {
    // a relative measure of concavity; higher value means simpler hull
    concavity = Math.max(0, concavity == undefined ? 2 : concavity);
    const sqConcavity = concavity ** 2;

    // when a segment goes below this length threshold, it won't be drilled down further
    lengthThreshold = lengthThreshold || 0;
    const sqLenThreshold = lengthThreshold ** 2;

    // start with a convex hull of the points
    const hullFaces = quickHull3d(points);
    const facesQueue = new Queue(hullFaces);
    const allFaces = new Set(hullFaces);

    const hullVertices = new Set<number>();
    const pointAdjacentFaces = points.map(() => new Set<Face>());

    for (const face of hullFaces) {
        for (const point of face) {
            hullVertices.add(point);
            pointAdjacentFaces[point].add(face);
        }
    }
    const internalPoints = (new Set(points.keys())).difference(hullVertices);

    const concaveHull: Face[] = [];
    while (facesQueue.length > 0) {
        const face = facesQueue.pop()!;

        const point = findPoint(face, points, checkAllFaces, allFaces, internalPoints, pointAdjacentFaces);
        if (point != null && decision(face, point, sqConcavity, sqLenThreshold, points)) {
            const newFaces = dig(face, point, hullVertices, allFaces, internalPoints, pointAdjacentFaces);

            for (const face of newFaces) {
                facesQueue.push(face);
            }
        } else {
            concaveHull.push(face);
        }
    }

    return concaveHull;
}

function dig(
    face: Face,
    point: number,
    hullVertices: Set<number>,
    allFaces: Set<Face>,
    internalPoints: Set<number>,
    pointAdjacentFaces: Set<Face>[],
): Face[] {
    pointAdjacentFaces[face[0]].delete(face);
    pointAdjacentFaces[face[1]].delete(face);
    pointAdjacentFaces[face[2]].delete(face);

    const newFaces = [
        [face[0], face[1], point],
        [face[1], face[2], point],
        [face[2], face[0], point],
    ];

    allFaces.delete(face);
    for (const face of newFaces) {
        for (const point of face) {
            pointAdjacentFaces[point].add(face);
            allFaces.add(face);
        }
    }

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

    return (sqAvg / sqDd > sqConcavity) && (sqAvg > sqLenThreshold);
}

function findPoint(
    face: Face,
    points: Vec3[],
    checkAllFaces: boolean,
    allFaces: Set<Face>,
    internalPoints: Set<number>,
    pointAdjacentFaces: Set<Face>[],
): number | null {
    const v1 = points[face[0]];
    const v2 = points[face[1]];
    const v3 = points[face[2]];

    let closestPoint: number | null = null;
    let sqMinDist = 0;

    const toCheck = Array.from(
        (checkAllFaces
            ? allFaces
            : (pointAdjacentFaces[face[0]].union(pointAdjacentFaces[face[1]]).union(pointAdjacentFaces[face[2]])))
            .difference(new Set(face))
            .values()
            .map(face => [points[face[0]], points[face[1]], points[face[2]]]));

    for (const candidate of internalPoints) {
        const p = points[candidate];
        const sqDist = dTriangle(v1, v2, v3, p);
        if ((closestPoint == null || sqDist < sqMinDist) && toCheck.every(
            face => dTriangle(face[0], face[1], face[2], p) >= sqDist)) {
            closestPoint = candidate;
            sqMinDist = sqDist;
        }
    }

    return closestPoint;
}

function dTriangle(v1: Vec3, v2: Vec3, v3: Vec3, p: Vec3) {
    // prepare data
    const v12 = Vec3.sub(vec3(), v2, v1) as Vec3; const p1 = Vec3.sub(vec3(), p, v1) as Vec3;
    const v23 = Vec3.sub(vec3(), v3, v2) as Vec3; const p2 = Vec3.sub(vec3(), p, v2) as Vec3;
    const v31 = Vec3.sub(vec3(), v1, v3) as Vec3; const p3 = Vec3.sub(vec3(), p, v3) as Vec3;
    const nor = Vec3.cross(vec3(), v12, v31) as Vec3;

    if (Math.sign(Vec3.dot(Vec3.cross(vec3(), v12, nor), p1))
        + Math.sign(Vec3.dot(Vec3.cross(vec3(), v23, nor), p2))
        + Math.sign(Vec3.dot(Vec3.cross(vec3(), v31, nor), p3)) < 2) {
        // 3 edges
        return Math.min(
            v12.scale(clamp(v12.dot(p1) / Vec3.squaredLength(v12), 0, 1)).sqrDist(p1),
            v23.scale(clamp(v23.dot(p2) / Vec3.squaredLength(v23), 0, 1)).sqrDist(p2),
            v31.scale(clamp(v31.dot(p3) / Vec3.squaredLength(v31), 0, 1)).sqrDist(p3));
    } else {
        // 1 face
        return nor.dot(p1) * (nor.dot(p1) / Vec3.squaredLength(nor));
    }
}
