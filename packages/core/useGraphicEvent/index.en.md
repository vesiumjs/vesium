# useGraphicEvent

Handle graphic event listeners and cursor styles for Cesium graphics.
You don't need to overly worry about memory leaks from the function, as it automatically cleans up internally.

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
