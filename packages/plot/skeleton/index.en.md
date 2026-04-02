---
text: skeleton
subText: Control-point behaviors
sort: 2
---

# skeleton

Skeleton factories define how editable control points behave inside `usePlot`.

## Quick Start

```ts
import { PlotScheme, control, interval, moved } from '@vesium/plot';

const scheme = new PlotScheme({
  type: 'Custom',
  skeletons: [moved, control, interval],
  initRender: () => ({ entities: [] }),
});
```

## Functions

- `control()` renders draggable blue control points and updates the selected point on drag or arrow-key nudge. Example: `control()`.
- `interval()` renders midpoint handles for closed shapes and inserts a new point while dragging. Example: `interval()`.
- `intervalNonclosed()` renders midpoint handles for open polylines and inserts a new point while dragging. Example: `intervalNonclosed()`.
- `moved()` renders a move handle that shifts the whole shape together. Example: `moved()`.

## Type Definitions

:::dts ./index.ts
