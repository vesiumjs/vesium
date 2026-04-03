---
sort: 99
tip: Internal
---

# useEntityScope

Scope `EntityCollection` mutations so created entities are removed automatically when the component unmounts.

:::warning
This is a low-level helper that powers `useEntity`. Prefer `useEntity` unless you need custom collection management.
:::

## Usage

```ts
import { Entity } from 'cesium';
import { useEntityScope } from 'vesium';

const { add, remove } = useEntityScope();

const entity = add(new Entity({
  id: 'demo',
}));

// Async creation is also supported.
add(Promise.resolve(new Entity({ id: 'async-demo' })));
```

## Notes

- The target collection defaults to `useViewer().value.entities`.
- `add` accepts promises and adds the resolved entity to the collection.
- Use `remove` when you need manual cleanup before unmounting.

## Type Definitions

:::dts ./index.ts
