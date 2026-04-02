---
text: geometry
subText: 几何工具
sort: 1
---

# geometry

用于 Cesium 标绘和几何构造的纯函数工具集。

这个包里的大多数函数都接收 `CoordArray` 或 `CoordArray[]`，返回新的坐标数组，可直接用于 Cesium 实体或者你自己的渲染流程。

## 示例数据

```ts
import type { CoordArray } from '@vesium/shared';

const points: CoordArray[] = [
  [120.12, 30.12],
  [120.18, 30.12],
  [120.15, 30.18],
];
```

## 图形构造

- `arc(points)` 生成弧线。示例：`arc(points)`。
- `circle(points)` 生成圆形轮廓。示例：`circle(points)`。
- `ellipse(points)` 生成椭圆轮廓。示例：`ellipse(points)`。
- `curve(points)` 生成平滑的开放曲线。示例：`curve(points)`。
- `closedCurve(points)` 生成平滑的闭合曲线。示例：`closedCurve(points)`。
- `lune(points)` 生成弦月形。示例：`lune(points)`。
- `rectAngle(points)` 生成直角矩形。示例：`rectAngle(points)`。
- `rectinclined1(points)` 根据三个点生成斜矩形。示例：`rectinclined1(points)`。
- `rectinclined2(points)` 生成另一种斜矩形。示例：`rectinclined2(points)`。
- `sector(points)` 生成扇形。示例：`sector(points)`。
- `assemblingPlace(points)` 生成集结地形状。示例：`assemblingPlace(points)`。

## 箭头构造

- `arrowAttackDirection(points, options)` 生成尖曲箭头。示例：`arrowAttackDirection(points)`。
- `arrowAttackDirectionTailed(points, options)` 生成燕尾尖曲箭头。示例：`arrowAttackDirectionTailed(points)`。
- `arrowClamped(points)` 生成贴地箭头。示例：`arrowClamped(points)`。
- `arrowStraight(points)` 生成直箭头。示例：`arrowStraight(points)`。
- `arrowStraightFine(points)` 生成更细的直箭头。示例：`arrowStraightFine(points)`。
- `arrowStraightSharp(points, options)` 生成尖箭头。示例：`arrowStraightSharp(points)`。
- `arrowUnitCombatOperation(points, options)` 生成分队战斗行动箭头。示例：`arrowUnitCombatOperation(points)`。
- `arrowUnitCombatOperationTailed(points, options)` 生成燕尾分队战斗箭头。示例：`arrowUnitCombatOperationTailed(points)`。
- `getArrowCoords(coord1, coord2, coord3, clockWise, options)` 返回箭头插值坐标。示例：`getArrowCoords(points[0], points[1], points[2], true)`。
- `getArrowHeadCoords(points, options)` 返回箭头头部控制点。示例：`getArrowHeadCoords(points, { headWidthFactor: 0.3 })`。
- `getArrowBodyCoords(points, neckLeft, neckRight, tailWidthFactor)` 返回箭身控制点。示例：`getArrowBodyCoords(points, neckLeft, neckRight, 0.1)`。
- `getTempCoord4(lineCoord1, lineCoord2, coord)` 返回对称辅助点。示例：`getTempCoord4(points[0], points[1], points[2])`。

## 几何辅助

- `mathDistance(coord1, coord2)` 计算两个二维点的距离。示例：`mathDistance(points[0], points[1])`。
- `wholeDistance(points)` 计算折线总长度。示例：`wholeDistance(points)`。
- `mid(coord1, coord2)` 计算中点。示例：`mid(points[0], points[1])`。
- `getCircleCenterOfThreeCoords(coord1, coord2, coord3)` 计算三点外接圆圆心。示例：`getCircleCenterOfThreeCoords(points[0], points[1], points[2])`。
- `getIntersectCoord(coordA, coordB, coordC, coordD)` 计算两条直线的交点。示例：`getIntersectCoord(points[0], points[1], points[1], points[2])`。
- `getAzimuth(startCoord, endCoord)` 计算从起点指向终点的方位角。示例：`getAzimuth(points[0], points[1])`。
- `getAngleOfThreeCoords(coordA, coordB, coordC)` 计算中间点处的夹角。示例：`getAngleOfThreeCoords(points[0], points[1], points[2])`。
- `isClockWise(coord1, coord2, coord3)` 判断三点是否顺时针。示例：`isClockWise(points[0], points[1], points[2])`。
- `getCoordOnLine(t, startCoord, endCoord)` 线性插值一个线段上的点。示例：`getCoordOnLine(0.5, points[0], points[1])`。
- `getCubicValue(t, startCoord, coord1, coord2, endCoord)` 采样三次贝塞尔曲线。示例：`getCubicValue(0.5, points[0], points[0], points[1], points[2])`。
- `getThirdCoord(startCoord, endCoord, angle, distance, clockWise?)` 根据方向和距离求第三个点。示例：`getThirdCoord(points[0], points[1], Math.PI / 6, 1000, true)`。
- `getArcCoords(center, radius, startAngle, endAngle)` 生成采样弧线坐标。示例：`getArcCoords(points[0], 1000, 0, Math.PI / 2)`。
- `getBisectorNormals(t, coord1, coord2, coord3)` 返回角平分线法向点。示例：`getBisectorNormals(0.3, points[0], points[1], points[2])`。
- `getNormal(coord1, coord2, coord3)` 返回三点组合后的法向向量。示例：`getNormal(points[0], points[1], points[2])`。
- `getLeftMostControlCoord(controlCoords, t)` 返回曲线最左侧控制点。示例：`getLeftMostControlCoord(points, 0.3)`。
- `getRightMostControlCoord(controlCoords, t)` 返回曲线最右侧控制点。示例：`getRightMostControlCoord(points, 0.3)`。
- `getCurveCoords(t, controlCoords)` 返回平滑拟合曲线。示例：`getCurveCoords(0.3, points)`。
- `getBezierCoords(points)` 返回贝塞尔插值坐标。示例：`getBezierCoords(points)`。
- `getFactorial(n)` 返回阶乘。示例：`getFactorial(5)`。
- `getBinomialFactor(n, index)` 返回二项式系数。示例：`getBinomialFactor(5, 2)`。
- `getQBSplineCoords(points)` 返回 QBSpline 插值坐标。示例：`getQBSplineCoords(points)`。
- `getQuadricBSplineFactor(k, t)` 返回二次 B 样条基函数系数。示例：`getQuadricBSplineFactor(1, 0.5)`。

## Type Definitions

:::dts ./index.ts
