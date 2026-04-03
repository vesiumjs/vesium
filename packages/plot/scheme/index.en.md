---
sort: 3
text: Scheme
---

# Scheme

Preset plotting schemes for common graphics and tactical arrows.

Each export in this module is a `PlotScheme` object that can be passed directly to `usePlot().operate()`.

That means a scheme is not just a shape. It also defines:

- the initial Cesium entity or entities to render
- how the shape updates while the mouse moves
- when the plot is considered complete
- which skeletons are attached for editing the sampled positions

## Exports

### Basic graphics

| Export                          | Purpose                    |
| ------------------------------- | -------------------------- |
| `PlotSchemePoint`               | Point marker scheme        |
| `PlotSchemeBillboard`           | Billboard marker scheme    |
| `PlotSchemeBillboardPinBuilder` | Pin-style billboard scheme |
| `PlotSchemeLabel`               | Label scheme               |
| `PlotSchemeCylinder`            | Cylinder scheme            |
| `PlotSchemeEllipse`             | Ellipse scheme             |
| `PlotSchemeRectangle`           | Rectangle scheme           |

### Paths and polygons

| Export                    | Purpose                   |
| ------------------------- | ------------------------- |
| `PlotSchemePolyline`      | Straight polyline scheme  |
| `PlotSchemePolylineCurve` | Curved polyline scheme    |
| `PlotSchemePolygon`       | Filled polygon scheme     |
| `PlotSchemePolygonSmooth` | Smooth polygon scheme     |
| `PlotSchemePolygonArc`    | Arc-shaped polygon scheme |

### Tactical arrows

| Export                                            | Purpose                                   |
| ------------------------------------------------- | ----------------------------------------- |
| `PlotSchemePolygonArrowAttackDirection`           | Attack-direction arrow scheme             |
| `PlotSchemePolygonArrowAttackDirectionTailed`     | Tailed attack-direction arrow scheme      |
| `PlotSchemePolygonArrowClamped`                   | Clamped arrow scheme                      |
| `PlotSchemePolygonArrowStraight`                  | Straight arrow scheme                     |
| `PlotSchemePolygonArrowStraightSharp`             | Sharp straight arrow scheme               |
| `PlotSchemePolygonArrowUnitCombatOperation`       | Unit-combat-operation arrow scheme        |
| `PlotSchemePolygonArrowUnitCombatOperationTailed` | Tailed unit-combat-operation arrow scheme |
| `PlotSchemePolygonAssemblingPlace`                | Assembling-place arrow scheme             |

## How to think about them

- Basic graphics are the simplest schemes. They usually create one entity and keep it in sync with the sampled position or positions.
- Paths and polygons add vertex editing, midpoint insertion, and shape closure logic on top of the base render loop.
- Tactical arrow schemes lean on `@vesium/geometry` to turn sampled coordinates into more specialized polygon shapes.
- If you need interaction, pair a scheme with the skeletons it exports or composes internally.

## Usage

```ts
const { operate } = usePlot();

await operate(PlotSchemePolygon);
await operate(PlotSchemePolygonArrowStraight);
```

## Type Definitions

:::dts ./index.ts
