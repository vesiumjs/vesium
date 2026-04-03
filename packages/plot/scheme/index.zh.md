---
sort: 3
text: Scheme
subText: 预设图形与战术箭头
---

# Scheme

常见图形和战术箭头的预设绘制方案。

这个模块里的每个导出都是一个可以直接传给 `usePlot().operate()` 的 `PlotScheme` 对象。

也就是说，`scheme` 不只是“图形模板”，它还同时定义了：

- 初始要创建哪些 Cesium entity
- 鼠标移动时图形怎样更新
- 什么时候判定当前标绘完成
- 会挂载哪些 skeleton 供后续编辑

## 导出

### 基础图形

| 导出                            | 作用                    |
| ------------------------------- | ----------------------- |
| `PlotSchemePoint`               | 点标绘方案              |
| `PlotSchemeBillboard`           | Billboard 标绘方案      |
| `PlotSchemeBillboardPinBuilder` | Pin 风格 Billboard 方案 |
| `PlotSchemeLabel`               | 文字标签方案            |
| `PlotSchemeCylinder`            | 圆柱体方案              |
| `PlotSchemeEllipse`             | 椭圆方案                |
| `PlotSchemeRectangle`           | 矩形方案                |

### 折线和多边形

| 导出                      | 作用           |
| ------------------------- | -------------- |
| `PlotSchemePolyline`      | 直线折线方案   |
| `PlotSchemePolylineCurve` | 曲线折线方案   |
| `PlotSchemePolygon`       | 填充多边形方案 |
| `PlotSchemePolygonSmooth` | 平滑多边形方案 |
| `PlotSchemePolygonArc`    | 弧形多边形方案 |

### 战术箭头

| 导出                                              | 作用                   |
| ------------------------------------------------- | ---------------------- |
| `PlotSchemePolygonArrowAttackDirection`           | 攻击方向箭头方案       |
| `PlotSchemePolygonArrowAttackDirectionTailed`     | 带尾部攻击方向箭头方案 |
| `PlotSchemePolygonArrowClamped`                   | 贴地箭头方案           |
| `PlotSchemePolygonArrowStraight`                  | 直线箭头方案           |
| `PlotSchemePolygonArrowStraightSharp`             | 尖角直线箭头方案       |
| `PlotSchemePolygonArrowUnitCombatOperation`       | 作战单元箭头方案       |
| `PlotSchemePolygonArrowUnitCombatOperationTailed` | 带尾部作战单元箭头方案 |
| `PlotSchemePolygonAssemblingPlace`                | 集结地箭头方案         |

## 如何理解这些方案

- 基础图形是最简单的一类方案，通常只维护一个实体，并把它和采样点位保持同步。
- 折线和多边形会在基础渲染循环之上增加顶点编辑、中点插入和闭合处理逻辑。
- 战术箭头方案则会借助 `@vesium/geometry`，把采样到的坐标转成更专业的多边形形状。
- 如果你需要交互编辑，一般会把方案和它内部用到的 skeleton 一起使用。

## 用法

```ts
const { operate } = usePlot();

await operate(PlotSchemePolygon);
await operate(PlotSchemePolygonArrowStraight);
```

## 类型定义

:::dts ./index.ts
