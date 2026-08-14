---
subText: 叠加实体
---

# useEntity

将 Cesium `Entity` 实例（点、标注、模型等）响应式地加入 `EntityCollection`（默认 `viewer.entities`）。数据变化或组件卸载时，上一批实体自动移出、新数据自动加入，无需手动跟踪增删；支持值、getter、ref、异步 getter 与数组等输入。移除时只调用 `collection.remove(entity)`，不会销毁实例——`Entity` 是描述性对象，不直接持有 GPU 资源，移除后仍可复用、可再次加入（与 `usePrimitive` 默认销毁不同）。

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useEntity } from 'vesium';

// 单项：实例由你创建和持有，hook 只负责加入/移出集合
const entity = useEntity(new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(150, 10),
  label: { text: 'entity instance' },
}));

// getter 每次求值重建实例；也支持 ref、异步 getter 与数组
const dynamic = useEntity(() => new Cesium.Entity({ /* ... */ }));
```

## 配置项

- `collection` - 目标 `EntityCollection`，默认 `useViewer().value.entities`。
- `isActive` - 是否激活，默认 `true`；在 `true`/`false` 间切换自动添加/移除。
- `evaluating` - 接收异步求值状态的 ref，求值期间为 `true`。

## 返回值

- 传入单个值（或 getter/ref/异步 getter）返回 `ComputedRef<T | undefined>`。
- 传入数组返回 `ComputedRef<T[] | undefined>`。

## 注意事项

- 返回值由 `computedAsync` 驱动，初始值为 `[]`——空数组为真值，判断"是否有实体"时不要依赖 truthy 检查。
- 数组输入会被整体替换：内容变化时旧的一批全部移除、新的一批全部加入。

## Type Definitions

:::dts ./index.ts
:::
