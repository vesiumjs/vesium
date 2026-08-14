---
sort: 0
subText: Plot System
---

# Overview

The `@vesium/plot` package is Vesium's plotting layer; instead of rendering raw Cesium primitives directly, it composes a plotting session, reusable plot definitions, interaction skeletons, and measurement helpers into a single workflow that can be created, edited, restored, and measured.

- `usePlot` owns the active plotting session: creation, restoration, cleanup, and updates.
- `scheme` defines what a plot looks like, how it completes, and which skeletons it uses.
- `skeleton` defines how the user edits a plot on the scene.
- `measure` packages distance and area measurement into ready-to-use schemes.

## How the pieces fit together

| Layer      | What it really owns                                                                                                    | Common collaborators                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `usePlot`  | The session state: plot list, timeline, `operate()` call, restoration, cancellation, and cleanup                       | `PlotScheme`, `PlotSkeleton`, `PlotFeature`, `SampledPlotProperty`, `@vesium/core` |
| `scheme`   | The visual and logical definition of a plot: initial entities, per-frame updates, completion rules, attached skeletons | `@vesium/geometry`, `@vesium/shared`, `skeleton`                                   |
| `skeleton` | Editing affordances: vertex dragging, midpoint insertion, translation, and keyboard nudging                            | Cesium scene picking, coordinate conversion helpers                                |
| `measure`  | Distance and area measurement schemes                                                                                  | `scheme`, `skeleton`, `distance`, `area`, `lerpArray`                              |

## Typical flow

```ts
import { PlotSchemePolygon, schemeMeasureDistance, usePlot } from 'vesium';

const { operate } = usePlot();
await operate(PlotSchemePolygon);
await operate(schemeMeasureDistance);
```

1. `usePlot()` creates or restores a plot session.
2. A `PlotScheme` describes the plot's visual and logical behavior, including when it is complete.
3. `PlotSkeleton` instances expose the handles users can drag, insert, or move.
4. Measurement helpers compute distances, areas, and clamped positions.

## Related packages

- `@vesium/core` provides the viewer lifecycle used by plot interactions.
- `@vesium/shared` provides coordinate conversion, throttling, and runtime helpers.
- `@vesium/geometry` provides polygon and tactical-arrow geometry generators used by some schemes.
