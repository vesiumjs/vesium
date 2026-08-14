---
sort: 99
tip: Internal
---

# useDataSourceScope

Scopes `DataSourceCollection` mutations to the component lifecycle: when the component unmounts, every data source added through `add` is removed automatically. Data sources are usually loaded asynchronously and keep loading on the viewer if left unmanaged; `add` accepts a Promise (the resolved data source joins the collection automatically), and for declarative data source loading prefer `useDataSource`.

:::warning
This is a low-level helper for custom collection management. Prefer the high-level hook (`useDataSource`) unless you need custom collection management.
:::

## Usage

```ts
import { CustomDataSource } from 'cesium';
import { useDataSourceScope } from 'vesium';

const { add } = useDataSourceScope({
  destroyOnRemove: true, // Used for the unmount cleanup: destroy the data source on removal
});
const dataSource = add(new CustomDataSource('demo'));
add(Promise.resolve(new CustomDataSource('async-demo'))); // add accepts a Promise
```

## Return Value

- `add(instance)` - Adds a data source; accepts a Promise and joins the collection once it resolves; throws `collection is not defined` when no collection is available
- `remove(instance, destroy?)` - Removes the data source; `destroy` is forwarded to `dataSources.remove`; returns whether the removal succeeded
- `scope` - A readonly reactive `Set` of the added data sources

## Notes

- The target collection defaults to `useViewer().value.dataSources`; pass a custom `DataSourceCollection` via `collection` (accepts a ref or getter).
- `destroyOnRemove` is also used as the second argument of `dataSources.remove(dataSource, destroy)` during unmount cleanup.

## Type Definitions

:::dts ./index.ts
