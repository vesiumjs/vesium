---
subText: 叠加实体
---

# useEntity

用于响应式加载 Cesium `Entity`。当数据发生变化或组件卸载时，它会自动移除并重载 entity 实例。

## Usage

:::demo src="./demo.vue"
:::

```ts
import { useEntity } from 'vesium'

// 加载单项实例
const entity = useEntity(entityInstance);

// 加载数组实例
const entities = useEntity([entity1, entity2]);

const isActive = ref(true);
const isLoading = ref(true);

// 使用配置项
const activeEntities = useEntity(entities, {
  collection: viewer.entities, // 目标实体集合，默认使用 useViewer().entities
  isActive, // 是否激活（控制实体是否添加到集合）
  evaluating: isLoading // 加载状态引用
});
```

## Type Definitions

:::dts ./index.ts
