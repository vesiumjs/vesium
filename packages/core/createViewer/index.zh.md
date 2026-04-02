---
sort: 1
subText: 创建实例
---

# createViewer

初始化一个Viewer或重用现有实例，在当前组件及其后代组件中可以通过`useViewer`访问。

## 用法

:::demo src="./demo.vue" :cesium="false"
:::

:::warning 注意
如果在同一个组件中使用`useViewer`和`createViewer`：

- `useViewer`应在`createViewer`之后调用

- `useViewer`将优先使用`createViewer`在当前组件中创建的实例
  :::

## 行为

- 传入已有的 `Viewer` 实例时，只会复用它，不会在卸载时销毁。
- 传入 DOM 元素和配置时，会创建新的 `Viewer`，并在组件作用域结束时自动销毁。
- 当 canvas 被从 DOM 移除时，注入的 `viewer` 引用会被清空，避免继续使用失效实例。

```ts
// 重载1：创建一个新实例，该实例在组件卸载时会自动销毁
const viewer = createViewer(elRef, {
  // ...options
});

// 重载2：注入一个现有实例，该实例在组件卸载时不会自动销毁
const viewer = createViewer(window.viewer);

// 创建实例后，当前组件及其后代组件可以使用useViewer访问该实例
const viewer = useViewer();
```
