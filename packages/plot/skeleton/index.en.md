---
sort: 4
text: Skeleton
---

# Skeleton

Interactive skeleton presets used by `PlotScheme`.

Skeletons do not render the final shape themselves.

Instead, they describe the interaction affordances that `PlotScheme` can attach to a shape: where handles appear, what happens when the user drags them, and how the sampled positions are mutated.

## Exports

| Export              | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `control`           | Draggable control point                      |
| `interval`          | Midpoints for closed shapes such as polygons |
| `intervalNonclosed` | Midpoints for open shapes such as polylines  |
| `moved`             | Move the whole shape as one unit             |

## Interaction patterns

- `control` is used when each vertex should be edited independently.
- `interval` is used for closed shapes. Dragging a midpoint inserts a new vertex between its neighbors and keeps editing that new point.
- `intervalNonclosed` is the open-shape version of `interval`. It behaves the same way, but it does not wrap the last point back to the first.
- `moved` is used when the whole figure should move together with one drag gesture.

## Usage

```ts
const skeletons = [moved, control, interval];
```

```ts
const scheme = new PlotScheme({
  type: 'Polygon',
  skeletons: [moved, control, interval],
});
```

## Type Definitions

:::dts ./index.ts
