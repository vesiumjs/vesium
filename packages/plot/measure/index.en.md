---
text: measure
subText: Measurement tools
sort: 2
---

# measure

Measurement schemes built on `usePlot`, plus the geometry helpers under `./utils/`.

## Usage

:::demo src="./demo.vue"
:::

```ts
import { schemeMeasureDistance, usePlot } from '@vesium/plot';

const { operate } = usePlot();
operate({ scheme: schemeMeasureDistance });
```

## Schemes

- `schemeMeasureDistance` measures polyline length and per-segment distances.
- `schemeMeasureArea` measures polygon area and places a dynamic label at the center.

## Utilities

- `distance`, `area`, `lerpArray`, `clampToHeightMostDetailedByTilesetOrTerrain`, `tesselate`, and `triangleGrid` live in `./utils/`.

## Type Definitions

:::dts ./index.ts
