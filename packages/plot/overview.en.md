---
sort: 0
---

# Overview

The `@vesium/plot` package is Vesium's plotting layer.

It does not render raw Cesium primitives directly. Instead, it composes a plotting session, reusable plot definitions, interaction skeletons, and measurement helpers into a single workflow that can be restored, edited, and measured.

At a high level:

- `usePlot` owns the active plotting session and coordinates plot creation, restoration, cleanup, and updates.
- `scheme` defines what a plot looks like, how it completes, and which interaction skeletons it uses.
- `skeleton` defines how the user edits a plot after it appears on the scene.
- `measure` bundles ready-made measurement schemes and the low-level helpers that support them.

## How the pieces fit together

| Layer      | What it really owns                                                                                                                   | Common collaborators                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `usePlot`  | The session state: current plots, timeline, active `operate()` call, restoration, cancellation, and lifecycle cleanup                 | `PlotScheme`, `PlotSkeleton`, `PlotFeature`, `SampledPlotProperty`, `@vesium/core` |
| `scheme`   | The visual and logical definition of a plot: initial entity setup, per-frame render updates, completion rules, and attached skeletons | `@vesium/geometry`, `@vesium/shared`, `skeleton`                                   |
| `skeleton` | The editing affordances: vertex dragging, midpoint insertion, whole-shape translation, and keyboard nudging                           | Cesium scene picking, coordinate conversion helpers                                |
| `measure`  | Measurement-oriented schemes plus the distance/area/clamping helpers they rely on                                                     | `scheme`, `skeleton`, `distance`, `area`, `lerpArray`                              |

## Typical flow

```ts
import { PlotSchemePolygon, schemeMeasureDistance, usePlot } from 'vesium';

const { operate } = usePlot();

await operate(PlotSchemePolygon);
await operate(schemeMeasureDistance);
```

1. `usePlot()` creates or restores a plot session.
2. A `PlotScheme` describes the visual and logical behavior of the current plot, including when it is considered complete.
3. `PlotSkeleton` instances expose the handles the user can drag, insert, or move.
4. Measurement helpers compute distances, areas, and clamped positions when the plot needs numeric output.

## Related packages

- `@vesium/core` provides the viewer lifecycle used by plot interactions.
- `@vesium/shared` provides coordinate conversion, throttling, and runtime helpers.
- `@vesium/geometry` provides polygon and tactical-arrow geometry generators used by some schemes.

## Type Definitions

:::dts ./index.ts
