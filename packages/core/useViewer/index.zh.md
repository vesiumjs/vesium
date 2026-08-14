---
sort: 2
subText: 获取实例
---

# useViewer

获取当前组件或其祖先组件通过 `createViewer` 注入的 `Viewer` 实例。任何层级的组件都能直接取回同一个实例，无需层层传参；未注入时抛出明确的 `Error` 提示，而非静默返回 `undefined`。

## Usage

:::warning
若 `useViewer` 与 `createViewer` 同时在同一组件内使用，`useViewer` 需在 `createViewer` 之后调用，并优先使用当前组件创建的实例。
:::

```ts
import { createViewer, useViewer } from 'vesium';
import { ref } from 'vue';

const elRef = ref<HTMLElement>();
createViewer(elRef);
// 必须在 `createViewer` 之后调用，否则可能取到祖先组件注入的实例
const viewer = useViewer();
```

```vue
<script setup lang="ts">
import { useViewer } from 'vesium';

const viewer = useViewer();
</script>
```

## 返回值

- `Readonly<ShallowRef<Viewer | undefined>>` - 只读的 `Viewer` 引用，与创建它的 `createViewer` 指向同一个 `Viewer` 实例；实例销毁后为 `undefined`。

## 注意事项

- 当前组件及所有祖先组件都没有注入时抛出 `Error`，提示是否调用了 `createViewer`。
- 返回的是只读引用，不能直接赋值。

## Type Definitions

:::dts ./index.ts
:::
