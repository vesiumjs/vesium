---
sort: 99
subText: 范围化操作图元
tip: 内部
---

# usePrimitiveScope

将 `PrimitiveCollection` 的增删操作限定在组件生命周期内：组件卸载时，自动移除所有通过 `add` 添加的图元。图元直接参与场景渲染，残留会造成重复绘制与 GPU 资源泄漏，因此移除时图元默认被销毁（`PrimitiveCollection` 默认 `destroyPrimitives: true`）；`collection` 支持传 `'ground'` 改用 `viewer.scene.groundPrimitives`，常见图元加载请优先使用 `usePrimitive`。

:::warning
这是一个底层辅助函数，用于自定义集合管理（`@vesium/plot` 内部即如此使用）。除非你需要自定义集合管理逻辑，否则优先使用高层 API（如 `usePrimitive`）。
:::

## Usage

```ts
import { Primitive } from 'cesium';
import { usePrimitiveScope } from 'vesium';

// collection: 'ground' 改用 viewer.scene.groundPrimitives
const { add } = usePrimitiveScope({ collection: 'ground' });
const primitive = add(new Primitive({ geometryInstances: [] }));
// 组件卸载时自动移除并销毁
```

## 返回值

- `add(instance, ...args)` - 添加图元，多余参数透传给 `PrimitiveCollection.add(instance, index)`；支持 Promise；集合不可用时抛出 `collection is not defined`
- `remove(instance)` - 移除图元；Cesium 的 `remove` 默认销毁实例，`destroyOnRemove` 只控制 hook 是否额外调用 `destroy()`
- `scope` - 已添加图元的只读响应式 `Set`

## 注意事项

- 目标集合默认 `useViewer().value.scene.primitives`；`collection: 'ground'` 切换到 `viewer.scene.groundPrimitives`（用于 `GroundPrimitive`）。
- `PrimitiveCollection.remove` 默认销毁图元（`destroyPrimitives: true`），`destroyOnRemove` 无法阻止；移除后实例不可复用，需要再次显示请创建新实例。

## Type Definitions

:::dts ./index.ts
