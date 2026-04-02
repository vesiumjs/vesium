---
text: measure utils
subText: Measurement helpers
sort: 1
---

# measure utils

Geometry and numeric helpers used by the measurement schemes. You can also reuse them in custom plotting workflows.

## Sample Data

```ts
import { Cartesian3 } from 'cesium';

const points = [
  Cartesian3.fromDegrees(120.12, 30.12),
  Cartesian3.fromDegrees(120.18, 30.12),
  Cartesian3.fromDegrees(120.15, 30.18),
];
```

## Length and Area

- `distance(positions, options)` returns staged segment lengths and the total length. Example: `await distance(points)`.
- `area(positions, options)` returns the polygon area. Example: `await area(points)`.

## Sampling

- `lerpArray(options)` interpolates between two positions and optionally clamps the result to ground. Example: `await lerpArray({ start: points[0], end: points[1], count: 10 })`.
- `clampToHeightMostDetailedByTilesetOrTerrain(options)` clamps positions against 3D Tiles first, then terrain, and finally keeps the original position. Example: `await clampToHeightMostDetailedByTilesetOrTerrain({ scene, positions: points })`.

## Triangulation

- `tesselate(positions)` triangulates a polygon into `[p0, p1, p2]` tuples. Example: `tesselate(points)`.
- `triangleGrid(positions, options)` builds a denser triangle grid and can clamp it to ground. Example: `await triangleGrid(points, { density: 20 })`.

## Type Definitions

:::dts ./index.ts
