---
sort: 2
text: Measure
---

# Measure

Utilities and preset schemes for interactive distance and area measurement.

This module is split into two layers:

- ready-made plotting schemes for distance and area measurement
- low-level helpers that you can reuse in a custom measurement workflow

The preset schemes are convenience wrappers. The helpers are the reusable core when you want to build your own measurement interaction.

## Exports

| Export                                        | Purpose                                      |
| --------------------------------------------- | -------------------------------------------- |
| `schemeMeasureDistance`                       | Interactive distance measurement plot scheme |
| `schemeMeasureArea`                           | Interactive area measurement plot scheme     |
| `distance`                                    | Measure the length of a polyline             |
| `area`                                        | Measure the area of a polygon                |
| `lerpArray`                                   | Interpolate points between two positions     |
| `clampToHeightMostDetailedByTilesetOrTerrain` | Clamp positions to 3D Tiles or terrain       |
| `tesselate`                                   | Split a polygon into triangles               |
| `triangleGrid`                                | Build a triangle grid for area sampling      |

## What each part does

- `schemeMeasureDistance` renders a polyline, updates per-segment labels, and keeps the total length in sync while the user is still drawing.
- `schemeMeasureArea` renders a polygon, updates the area label, and works with closed shapes that need midpoint editing.
- `distance()` returns both the individual segment lengths and the accumulated total, so you can use it without the preset scheme.
- `area()` computes polygon area from Cartesian positions and can optionally clamp the polygon to 3D Tiles or terrain first.
- `lerpArray()`, `clampToHeightMostDetailedByTilesetOrTerrain()`, `tesselate()`, and `triangleGrid()` are support utilities used by the presets and available for custom workflows too.

## Usage

```ts
const { operate } = usePlot();

await operate(schemeMeasureDistance);
```

```ts
const distanceResult = await distance(positions, {
  clampToGround: true,
});
```

```ts
const areaResult = await area(positions, {
  clampToGround: true,
});
```

## Type Definitions

:::dts ./index.ts
