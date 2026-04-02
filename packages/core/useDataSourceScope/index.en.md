---
sort: 99
subText: Scoped data source operations
tip: Internal
---

# useDataSourceScope

Scope `DataSourceCollection` mutations so created data sources are removed automatically when the component unmounts.

:::warning
This is a low-level helper used by `useDataSource`. Prefer `useDataSource` unless you need custom collection management.
:::

## Usage

```ts
import { CustomDataSource } from 'cesium';
import { useDataSourceScope } from 'vesium';

const { add, remove } = useDataSourceScope({
  destroyOnRemove: true,
});

const dataSource = add(new CustomDataSource('demo'));

// Async creation is also supported.
add(Promise.resolve(new CustomDataSource('async-demo')));
```

## Notes

- The target collection defaults to `useViewer().value.dataSources`.
- `destroyOnRemove` is forwarded to `dataSources.remove(dataSource, destroyOnRemove)`.
- `add` accepts promises and adds the resolved data source to the collection.

## Type Definitions

:::dts ./index.ts
