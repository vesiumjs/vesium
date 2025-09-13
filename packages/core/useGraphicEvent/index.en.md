# useGraphicEvent

Handle graphic event listeners and cursor styles for Cesium graphics.
You don't need to overly worry about memory leaks from the function, as it automatically cleans up internally.

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
