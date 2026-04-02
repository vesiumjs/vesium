---
text: scheme
subText: Ready-made plot schemes
sort: 1
---

# scheme

Each export in this module is a preconfigured `PlotScheme` instance. Pass it directly to `usePlot().operate({ scheme })`.

## Quick Start

```ts
import { PlotSchemeRectangle, usePlot } from '@vesium/plot';

const { operate } = usePlot();
operate({ scheme: PlotSchemeRectangle });
```

## Basic Graphics

- `PlotSchemeBillboard` renders a billboard image at one point. Example: `operate({ scheme: PlotSchemeBillboard })`.
- `PlotSchemeBillboardPinBuilder` renders a billboard-style marker pin. Example: `operate({ scheme: PlotSchemeBillboardPinBuilder })`.
- `PlotSchemePoint` renders a red point entity. Example: `operate({ scheme: PlotSchemePoint })`.
- `PlotSchemeLabel` renders a text label anchored at one point. Example: `operate({ scheme: PlotSchemeLabel })`.
- `PlotSchemeCylinder` renders a cylinder defined by two points. Example: `operate({ scheme: PlotSchemeCylinder })`.
- `PlotSchemeEllipse` renders a circle-like ellipse from two points. Example: `operate({ scheme: PlotSchemeEllipse })`.
- `PlotSchemeRectangle` renders a rectangle from two corner points. Example: `operate({ scheme: PlotSchemeRectangle })`.
- `PlotSchemePolyline` renders an editable polyline. Example: `operate({ scheme: PlotSchemePolyline })`.
- `PlotSchemePolylineCurve` renders a smoothed polyline. Example: `operate({ scheme: PlotSchemePolylineCurve })`.
- `PlotSchemePolygon` renders a polygon with closed fill. Example: `operate({ scheme: PlotSchemePolygon })`.
- `PlotSchemePolygonSmooth` renders a smoothed closed polygon. Example: `operate({ scheme: PlotSchemePolygonSmooth })`.

## Polygon Shapes

- `PlotSchemePolygonArc` renders an arc-shaped polygon. Example: `operate({ scheme: PlotSchemePolygonArc })`.
- `PlotSchemePolygonAssemblingPlace` renders an assembling-place polygon. Example: `operate({ scheme: PlotSchemePolygonAssemblingPlace })`.

## Arrow Shapes

- `PlotSchemePolygonArrowClamped` renders a clamped arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowClamped })`.
- `PlotSchemePolygonArrowStraight` renders a straight arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowStraight })`.
- `PlotSchemePolygonArrowStraightSharp` renders a sharper straight arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowStraightSharp })`.
- `PlotSchemePolygonArrowAttackDirection` renders an attack-direction arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowAttackDirection })`.
- `PlotSchemePolygonArrowAttackDirectionTailed` renders a tailed attack-direction arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowAttackDirectionTailed })`.
- `PlotSchemePolygonArrowUnitCombatOperation` renders a unit-combat-operation arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowUnitCombatOperation })`.
- `PlotSchemePolygonArrowUnitCombatOperationTailed` renders a tailed unit-combat-operation arrow polygon. Example: `operate({ scheme: PlotSchemePolygonArrowUnitCombatOperationTailed })`.

## Type Definitions

:::dts ./index.ts
