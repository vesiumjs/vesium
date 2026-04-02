---
text: geometry
subText: Geometry helpers
sort: 1
---

# geometry

Cesium geometry helpers for plotting and geometric construction.

Most functions in this package accept `CoordArray` or `CoordArray[]` and return a new coordinate list that can be fed into Cesium entities or your own render pipeline.

## Sample Data

```ts
import type { CoordArray } from '@vesium/shared';

const points: CoordArray[] = [
  [120.12, 30.12],
  [120.18, 30.12],
  [120.15, 30.18],
];
```

## Shape Builders

- `arc(points)` builds an arc polyline. Example: `arc(points)`.
- `circle(points)` builds a circle-like ring. Example: `circle(points)`.
- `ellipse(points)` builds an ellipse-like ring. Example: `ellipse(points)`.
- `curve(points)` builds a smooth open curve. Example: `curve(points)`.
- `closedCurve(points)` builds a smooth closed curve. Example: `closedCurve(points)`.
- `lune(points)` builds a lune shape. Example: `lune(points)`.
- `rectAngle(points)` builds a right-angle rectangle. Example: `rectAngle(points)`.
- `rectinclined1(points)` builds an inclined rectangle from three points. Example: `rectinclined1(points)`.
- `rectinclined2(points)` builds another inclined rectangle variant. Example: `rectinclined2(points)`.
- `sector(points)` builds a sector shape. Example: `sector(points)`.
- `assemblingPlace(points)` builds an assembling-place polygon. Example: `assemblingPlace(points)`.

## Arrow Builders

- `arrowAttackDirection(points, options)` builds a sharp curved attack arrow. Example: `arrowAttackDirection(points)`.
- `arrowAttackDirectionTailed(points, options)` builds a tailed curved attack arrow. Example: `arrowAttackDirectionTailed(points)`.
- `arrowClamped(points)` builds a clamped arrow polygon. Example: `arrowClamped(points)`.
- `arrowStraight(points)` builds a straight arrow polygon. Example: `arrowStraight(points)`.
- `arrowStraightFine(points)` builds a finer straight arrow polygon. Example: `arrowStraightFine(points)`.
- `arrowStraightSharp(points, options)` builds a sharp straight arrow polygon. Example: `arrowStraightSharp(points)`.
- `arrowUnitCombatOperation(points, options)` builds a combat-operation arrow. Example: `arrowUnitCombatOperation(points)`.
- `arrowUnitCombatOperationTailed(points, options)` builds a tailed combat-operation arrow. Example: `arrowUnitCombatOperationTailed(points)`.
- `getArrowCoords(coord1, coord2, coord3, clockWise, options)` returns interpolated arrow coordinates. Example: `getArrowCoords(points[0], points[1], points[2], true)`.
- `getArrowHeadCoords(points, options)` returns the arrow head control points. Example: `getArrowHeadCoords(points, { headWidthFactor: 0.3 })`.
- `getArrowBodyCoords(points, neckLeft, neckRight, tailWidthFactor)` returns the arrow body control points. Example: `getArrowBodyCoords(points, neckLeft, neckRight, 0.1)`.
- `getTempCoord4(lineCoord1, lineCoord2, coord)` returns a mirrored helper point. Example: `getTempCoord4(points[0], points[1], points[2])`.

## Geometry Helpers

- `mathDistance(coord1, coord2)` returns the 2D distance between two points. Example: `mathDistance(points[0], points[1])`.
- `wholeDistance(points)` returns the total polyline length. Example: `wholeDistance(points)`.
- `mid(coord1, coord2)` returns the midpoint between two coordinates. Example: `mid(points[0], points[1])`.
- `getCircleCenterOfThreeCoords(coord1, coord2, coord3)` returns the circumcenter of three points. Example: `getCircleCenterOfThreeCoords(points[0], points[1], points[2])`.
- `getIntersectCoord(coordA, coordB, coordC, coordD)` returns the intersection of two lines. Example: `getIntersectCoord(points[0], points[1], points[1], points[2])`.
- `getAzimuth(startCoord, endCoord)` returns the heading angle from `startCoord` to `endCoord`. Example: `getAzimuth(points[0], points[1])`.
- `getAngleOfThreeCoords(coordA, coordB, coordC)` returns the angle at `coordB`. Example: `getAngleOfThreeCoords(points[0], points[1], points[2])`.
- `isClockWise(coord1, coord2, coord3)` tests orientation of three points. Example: `isClockWise(points[0], points[1], points[2])`.
- `getCoordOnLine(t, startCoord, endCoord)` linearly interpolates a point on a segment. Example: `getCoordOnLine(0.5, points[0], points[1])`.
- `getCubicValue(t, startCoord, coord1, coord2, endCoord)` samples a cubic Bezier-like curve. Example: `getCubicValue(0.5, points[0], points[0], points[1], points[2])`.
- `getThirdCoord(startCoord, endCoord, angle, distance, clockWise?)` derives a third point from a direction and distance. Example: `getThirdCoord(points[0], points[1], Math.PI / 6, 1000, true)`.
- `getArcCoords(center, radius, startAngle, endAngle)` generates sampled arc coordinates. Example: `getArcCoords(points[0], 1000, 0, Math.PI / 2)`.
- `getBisectorNormals(t, coord1, coord2, coord3)` returns the left and right bisector normals. Example: `getBisectorNormals(0.3, points[0], points[1], points[2])`.
- `getNormal(coord1, coord2, coord3)` returns the combined normal vector of three points. Example: `getNormal(points[0], points[1], points[2])`.
- `getLeftMostControlCoord(controlCoords, t)` returns the first curve control point. Example: `getLeftMostControlCoord(points, 0.3)`.
- `getRightMostControlCoord(controlCoords, t)` returns the last curve control point. Example: `getRightMostControlCoord(points, 0.3)`.
- `getCurveCoords(t, controlCoords)` returns a fitted smooth curve. Example: `getCurveCoords(0.3, points)`.
- `getBezierCoords(points)` returns a Bezier-interpolated polyline. Example: `getBezierCoords(points)`.
- `getFactorial(n)` returns `n!`. Example: `getFactorial(5)`.
- `getBinomialFactor(n, index)` returns the binomial coefficient. Example: `getBinomialFactor(5, 2)`.
- `getQBSplineCoords(points)` returns QBSpline-interpolated coordinates. Example: `getQBSplineCoords(points)`.
- `getQuadricBSplineFactor(k, t)` returns the basis factor used by `getQBSplineCoords()`. Example: `getQuadricBSplineFactor(1, 0.5)`.

## Type Definitions

:::dts ./index.ts
