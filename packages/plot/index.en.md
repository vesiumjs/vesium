---
text: plot
subText: Plotting utilities
sort: 2
---

# plot

Cesium plotting utilities built on top of `usePlot`, prebuilt `scheme`s, reusable `skeleton`s, and measurement helpers.

## Quick Start

```ts
import { PlotSchemePolyline, usePlot } from '@vesium/plot';

const { operate } = usePlot();
operate({ scheme: PlotSchemePolyline });
```

## Modules

- `usePlot` manages a plotting session and its lifecycle.
- `scheme` provides ready-made plot schemes for graphics, arrows, and shapes.
- `skeleton` provides reusable control-point behaviors.
- `measure` provides measurement schemes and geometry helpers.

## Type Definitions

:::dts ./index.ts
