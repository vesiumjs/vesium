---
subText: Geometry Algorithms
---

# Overview

`@vesium/geometry` is Vesium's geometry algorithm layer: pure functions that take `[lng, lat]` coordinate arrays and output transformed coordinate collections, with no Vue or Cesium dependencies.

## Basic Shapes

| Export        | Input    | Description                  |
| ------------- | -------- | ---------------------------- |
| `circle`      | >= 2 pts | Generate circle coordinates  |
| `ellipse`     | >= 2 pts | Generate ellipse coordinates |
| `sector`      | >= 3 pts | Generate sector coordinates  |
| `arc`         | >= 3 pts | Generate arc coordinates     |
| `lune`        | >= 2 pts | Generate lune coordinates    |
| `curve`       | >= 3 pts | Generate smooth curve        |
| `closedCurve` | >= 3 pts | Generate closed curve        |

## Tactical Arrows

| Export                           | Input    | Description                        |
| -------------------------------- | -------- | ---------------------------------- |
| `arrowStraight`                  | 2 pts    | Straight arrow                     |
| `arrowStraightFine`              | 2 pts    | Fine straight arrow                |
| `arrowStraightSharp`             | 2 pts    | Sharp-corner straight arrow        |
| `arrowClamped`                   | >= 3 pts | Clamped-to-ground arrow            |
| `arrowAttackDirection`           | >= 3 pts | Attack direction arrow             |
| `arrowAttackDirectionTailed`     | >= 3 pts | Tailed attack direction arrow      |
| `arrowUnitCombatOperation`       | >= 2 pts | Unit combat operation arrow        |
| `arrowUnitCombatOperationTailed` | >= 2 pts | Tailed unit combat operation arrow |
| `assemblingPlace`                | >= 3 pts | Assembling place arrow             |

## Utility Functions

| Export                         | Description                    |
| ------------------------------ | ------------------------------ |
| `mathDistance`                 | Distance between two points    |
| `mid`                          | Midpoint of two coordinates    |
| `getAzimuth`                   | Calculate azimuth angle        |
| `getCurveCoords`               | Interpolate curve points       |
| `getBezierCoords`              | Bezier curve                   |
| `getQBSplineCoords`            | Quadratic B-spline curve       |
| `getCubicValue`                | Cubic interpolation            |
| `getBisectorNormals`           | Angle bisector normals         |
| `getCircleCenterOfThreeCoords` | Circle center from 3 points    |
| `isClockWise`                  | Clockwise check                |
| `getIntersectCoord`            | Intersection of two lines      |
| `getThirdCoord`                | Third point via rotation       |
| `rectinclined1`                | Inclined rectangle algorithm 1 |
| `rectinclined2`                | Inclined rectangle algorithm 2 |
| `rectAngle`                    | Right-angle rectangle          |
| `getArcCoords`                 | Interpolate arc segment points |
