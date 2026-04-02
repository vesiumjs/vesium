---
text: scheme
subText: 预置标绘方案
sort: 1
---

# scheme

这里的每个导出都是一个预配置好的 `PlotScheme` 实例，可直接传给 `usePlot().operate({ scheme })`。

## 快速开始

```ts
import { PlotSchemeRectangle, usePlot } from '@vesium/plot';

const { operate } = usePlot();
operate({ scheme: PlotSchemeRectangle });
```

## 基础图形

- `PlotSchemeBillboard` 生成单点 billboard。示例：`operate({ scheme: PlotSchemeBillboard })`。
- `PlotSchemeBillboardPinBuilder` 生成 pin 风格标记。示例：`operate({ scheme: PlotSchemeBillboardPinBuilder })`。
- `PlotSchemePoint` 生成红色点实体。示例：`operate({ scheme: PlotSchemePoint })`。
- `PlotSchemeLabel` 生成单点文字标签。示例：`operate({ scheme: PlotSchemeLabel })`。
- `PlotSchemeCylinder` 生成由两点定义的圆柱。示例：`operate({ scheme: PlotSchemeCylinder })`。
- `PlotSchemeEllipse` 生成由两点定义的圆形椭圆。示例：`operate({ scheme: PlotSchemeEllipse })`。
- `PlotSchemeRectangle` 生成由两个角点定义的矩形。示例：`operate({ scheme: PlotSchemeRectangle })`。
- `PlotSchemePolyline` 生成可编辑折线。示例：`operate({ scheme: PlotSchemePolyline })`。
- `PlotSchemePolylineCurve` 生成平滑折线。示例：`operate({ scheme: PlotSchemePolylineCurve })`。
- `PlotSchemePolygon` 生成闭合填充面。示例：`operate({ scheme: PlotSchemePolygon })`。
- `PlotSchemePolygonSmooth` 生成平滑闭合面。示例：`operate({ scheme: PlotSchemePolygonSmooth })`。

## 面状图形

- `PlotSchemePolygonArc` 生成弓形面。示例：`operate({ scheme: PlotSchemePolygonArc })`。
- `PlotSchemePolygonAssemblingPlace` 生成集结地面。示例：`operate({ scheme: PlotSchemePolygonAssemblingPlace })`。

## 箭头图形

- `PlotSchemePolygonArrowClamped` 生成贴地箭头。示例：`operate({ scheme: PlotSchemePolygonArrowClamped })`。
- `PlotSchemePolygonArrowStraight` 生成直箭头。示例：`operate({ scheme: PlotSchemePolygonArrowStraight })`。
- `PlotSchemePolygonArrowStraightSharp` 生成尖头直箭头。示例：`operate({ scheme: PlotSchemePolygonArrowStraightSharp })`。
- `PlotSchemePolygonArrowAttackDirection` 生成攻击方向箭头。示例：`operate({ scheme: PlotSchemePolygonArrowAttackDirection })`。
- `PlotSchemePolygonArrowAttackDirectionTailed` 生成燕尾攻击方向箭头。示例：`operate({ scheme: PlotSchemePolygonArrowAttackDirectionTailed })`。
- `PlotSchemePolygonArrowUnitCombatOperation` 生成分队战斗行动箭头。示例：`operate({ scheme: PlotSchemePolygonArrowUnitCombatOperation })`。
- `PlotSchemePolygonArrowUnitCombatOperationTailed` 生成燕尾分队战斗箭头。示例：`operate({ scheme: PlotSchemePolygonArrowUnitCombatOperationTailed })`。

## Type Definitions

:::dts ./index.ts
