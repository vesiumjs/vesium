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
const graphicEvent = useGraphicEvent();

graphicEvent.add(primitive, 'LEFT_CLICK', (params) => {});

graphicEvent.add(entity, 'DRAG', (params) => {});

graphicEvent.add(dataSource, 'DRAG', (params) => {});

graphicEvent.add('global', 'DRAG', (params) => {});
```

## Type Definitions

:::dts ./index.ts
