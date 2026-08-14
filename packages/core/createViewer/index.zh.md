---
sort: 1
subText: 创建实例
---

# createViewer

初始化一个 `Viewer` 实例，或复用传入的已有实例，并通过依赖注入暴露给当前组件及其后代组件。封装了手动 `destroy()` 和层层传参的样板代码：由元素创建的实例会在组件作用域结束时自动销毁。

## Usage

:::demo src="./demo.vue" :cesium="false"
:::

:::warning 注意
如果在同一个组件中使用 `createViewer` 和 `useViewer`，`useViewer` 应在 `createViewer` 之后调用，并优先使用当前组件创建的实例。
:::

```ts
import { createViewer, useViewer } from 'vesium';
import { shallowRef } from 'vue';

const elRef = shallowRef<HTMLElement>();

// 传入 DOM 元素（或 ref）创建新实例，组件卸载时自动销毁
const viewer = createViewer(elRef, { /* ...options */ });

// 传入已有实例只复用，不接管生命周期
const sharedViewer = createViewer(window.viewer);
const injectedViewer = useViewer();
```

## 返回值

- `Readonly<ShallowRef<Viewer | undefined>>` - 只读的 `Viewer` 引用；实例销毁后为 `undefined`，与 `useViewer()` 指向同一个 `Viewer` 实例。

## 注意事项

- 通过 `MutationObserver` 监听 `body`：`canvas` 被移出 DOM（如被 `v-if` 移除）时清空引用，避免继续使用失效实例。
- 元素 ref 尚未绑定时不会创建实例，元素出现后自动补建。

## Type Definitions

:::dts ./index.ts
:::
