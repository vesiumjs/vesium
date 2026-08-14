---
subText: 几何算法库
---

# Overview

`@vesium/geometry` 是 Vesium 的几何算法层：提供接收 `[lng, lat]` 坐标数组、输出变换后坐标集合的纯函数，无 Vue / Cesium 依赖。

## 基础图形

| 导出          | 输入要求  | 作用         |
| ------------- | --------- | ------------ |
| `circle`      | >= 2 个点 | 生成圆形坐标 |
| `ellipse`     | >= 2 个点 | 生成椭圆坐标 |
| `sector`      | >= 3 个点 | 生成扇形坐标 |
| `arc`         | >= 3 个点 | 生成弓形弧线 |
| `lune`        | >= 2 个点 | 生成新月形   |
| `curve`       | >= 3 个点 | 生成平滑曲线 |
| `closedCurve` | >= 3 个点 | 生成闭合曲线 |

## 战术箭头

| 导出                             | 输入要求  | 作用           |
| -------------------------------- | --------- | -------------- |
| `arrowStraight`                  | 2 个点    | 直箭头         |
| `arrowStraightFine`              | 2 个点    | 精细直箭头     |
| `arrowStraightSharp`             | 2 个点    | 尖角直箭头     |
| `arrowClamped`                   | >= 3 个点 | 贴地箭头       |
| `arrowAttackDirection`           | >= 3 点   | 攻击方向箭头   |
| `arrowAttackDirectionTailed`     | >= 3 点   | 带尾部攻击箭头 |
| `arrowUnitCombatOperation`       | >= 2 点   | 作战单元箭头   |
| `arrowUnitCombatOperationTailed` | >= 2 点   | 带尾部作战单元 |
| `assemblingPlace`                | >= 3 点   | 集结地         |

## 辅助工具

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
