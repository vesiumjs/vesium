---
subText: 几何算法库
---

# Overview

`@vesium/geometry` 是 Vesium 的几何算法层。

它提供了一系列纯函数，接收 `[lng, lat]` 坐标数组作为输入，输出经过几何变换后的坐标集合。这些函数不包含 Vue 或 Cesium 依赖，可以在任何环境中独立使用。

## 算法分类

### 基础图形

| 导出          | 输入要求  | 作用         |
| ------------- | --------- | ------------ |
| `circle`      | >= 2 个点 | 生成圆形坐标 |
| `ellipse`     | >= 2 个点 | 生成椭圆坐标 |
| `sector`      | >= 3 个点 | 生成扇形坐标 |
| `arc`         | >= 3 个点 | 生成弓形弧线 |
| `lune`        | >= 2 个点 | 生成新月形   |
| `curve`       | >= 3 个点 | 生成平滑曲线 |
| `closedCurve` | >= 3 个点 | 生成闭合曲面 |

### 战术箭头

| 导出                             | 输入要求 | 作用           |
| -------------------------------- | -------- | -------------- |
| `arrowStraight`                  | 2 个点   | 直箭头         |
| `arrowStraightFine`              | 2 个点   | 精细直箭头     |
| `arrowStraightSharp`             | 2 个点   | 尖角直箭头     |
| `arrowClamped`                   | 2 个点   | 贴地箭头       |
| `arrowAttackDirection`           | >= 3 点  | 攻击方向箭头   |
| `arrowAttackDirectionTailed`     | >= 3 点  | 带尾部攻击箭头 |
| `arrowUnitCombatOperation`       | >= 3 点  | 作战单元箭头   |
| `arrowUnitCombatOperationTailed` | >= 3 点  | 带尾部作战单元 |
| `assemblingPlace`                | >= 3 点  | 集结地         |

### 辅助工具

| 导出                           | 作用               |
| ------------------------------ | ------------------ |
| `mathDistance`                 | 计算两点距离       |
| `mid`                          | 求两点中点         |
| `getAzimuth`                   | 计算方位角         |
| `getCurveCoords`               | 插值曲线点         |
| `getBezierCoords`              | 贝塞尔曲线         |
| `getQBSplineCoords`            | 二次 B 样条曲线    |
| `getCubicValue`                | 立方插值           |
| `getBisectorNormals`           | 角平分线法向量     |
| `getCircleCenterOfThreeCoords` | 三点定圆心         |
| `isClockWise`                  | 判断顺时针         |
| `getIntersectCoord`            | 两线交点           |
| `getThirdCoord`                | 通过旋转获取第三点 |
| `rectinclined1`                | 倾斜矩形算法 1     |
| `rectinclined2`                | 倾斜矩形算法 2     |
| `rectAngle`                    | 直角矩形           |
| `getArcCoords`                 | 插值弓形线段点     |

## 用法

```ts
import { arrowStraight, circle, ellipse, toCartesian3 } from 'vesium';

const circleCoords = [[116.0, 39.0], [116.05, 39.0]];
const circleResult = circle(circleCoords);

const ellipseCoords = [[116.1, 39.0], [116.2, 39.1]];
const ellipseResult = ellipse(ellipseCoords);

// 转为 Cesium Cartesian3
const positions = circleResult.map(c => toCartesian3(c));
```

## 与标绘层的关系

`@vesium/geometry` 本身是纯算法层。`@vesium/plot` 的 `scheme` 模块会调用这些几何函数来生成图形，并配合 Cesium Entity 完成渲染。

```ts
// 在 scheme 中使用 geometry
import { arrowStraight } from '@vesium/geometry';

const coords = points.map(e => toCoord(e));
const arrowCoords = arrowStraight(coords);
const positions = arrowCoords.map(c => toCartesian3(c));
```

## 类型定义

:::dts ./index.ts
:::
