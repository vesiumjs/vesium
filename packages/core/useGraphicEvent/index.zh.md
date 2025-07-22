---
subText: 图元手势事件
---

# useGraphicEvent

处理Cesium图形的图形事件监听器和指针样式。
无需过度担心该函数的内存泄漏，因为它会自动在内部清理。

## Usage

:::demo src="./demo.vue"
:::

```ts
const { addGraphicEvent } = useGraphicEvent();

addGraphicEvent(primitive, 'LEFT_CLICK', (params) => {});

addGraphicEvent(entity, 'DRAG', (params) => {});

addGraphicEvent(dataSource, 'DRAG', (params) => {});

addGraphicEvent('global', 'DRAG', (params) => {});
```

## Type Definitions

:::dts ./index.ts
