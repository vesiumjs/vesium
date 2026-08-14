---
subText: 图元手势事件
---

# useGraphicEvent

为 Cesium 图形（Entity、Primitive、DataSource 等）统一处理点击、悬停、拖拽事件与鼠标指针样式：内部自动 `scene.pick`，只在命中目标图形时触发回调。监听器存于 `WeakMap`，图形被回收或组件卸载时自动释放，无需担心内存泄漏。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useEntity, useGraphicEvent } from 'vesium';

const graphicEvent = useGraphicEvent();
useEntity(() => {
  const entity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(140, 10),
    point: { pixelSize: 15 }, // 有图形的实体才能被 scene.pick 命中
  });
  graphicEvent.add(entity, 'LEFT_CLICK', ({ pick }) => {
    console.log('clicked', pick.id);
  });
  graphicEvent.add(entity, 'HOVER', ({ hovering }) => {
    entity.point!.color = new Cesium.ConstantProperty(hovering ? Cesium.Color.RED : Cesium.Color.WHITE);
  });
  return entity;
});
```

## 配置项（add 的 options）

- `cursor` - 悬停时的指针样式，默认 `'pointer'`；可为字符串或 `(event: GraphicHoverEvent) => string | null | undefined` 函数。
- `dragCursor` - 拖拽中的指针样式，默认 `'crosshair'`（仅 `DRAG` 事件生效，且只在拖拽中显示）。

## 返回值

- `add(graphic, type, listener, options?)` - 注册监听并返回移除函数；`graphic` 传 `'global'` 表示任意图形命中都触发，`type` 为 `'HOVER'`、`'DRAG'` 或位置事件（如 `'LEFT_CLICK'`，完整列表见类型定义）。
- `remove` / `clear` - 移除 / 清空指定图形的监听；`clear` 的 `type` 传 `'all'` 清空该图形全部监听。
- 事件载荷：位置事件为 `{ event, pick }`；`HOVER` 增加 `hovering: boolean`；`DRAG` 增加 `dragging: boolean` 与 `lockCamera()`。

## 注意事项

- `graphic` 可为任意能被 `scene.pick` 命中的对象（`Entity`、`Primitive`、`DataSource` 等）；`'global'` 使用内部符号存储，需通过 `remove`/`clear` 或 `add` 返回的移除函数显式清理。无需担心内存泄漏：图形被回收后 `WeakMap` 中对应监听自动释放，内部屏幕事件随组件卸载自动停止。

## Type Definitions

:::dts ./index.ts
:::
