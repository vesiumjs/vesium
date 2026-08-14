# useDataSource

Reactively adds Cesium `DataSource` instances (`GeoJsonDataSource`, `KmlDataSource`, `CzmlDataSource`, etc.) to a `DataSourceCollection` (defaults to `viewer.dataSources`). Data sources are typically the entry point for asynchronously loading external geographic data: pass an async getter directly — the data source is added once loaded, removed when the data changes or the component unmounts, and the loading state is exposed via `evaluating`. Removal keeps the instance by default — when `destroyOnRemove` is unspecified it passes `undefined` through and Cesium's `remove` treats it as `false`; pass `true` explicitly to destroy and release resources.

## Usage

:::demo src="./demo.vue"
:::

```ts
import * as Cesium from 'cesium';
import { useDataSource } from 'vesium';

// Async getter: added once loaded
const dataSource = useDataSource(() => Cesium.GeoJsonDataSource.load('/data/city.geojson'));

// Sync instance: pass it directly
const custom = useDataSource(new Cesium.CustomDataSource('my-data'));

// Options: isActive controls activation, destroyOnRemove controls destruction on removal
const controlled = useDataSource(new Cesium.CustomDataSource('controlled'), {
  isActive: true, // When false, the data source is not added
  destroyOnRemove: true, // Not destroyed by default; pass true to release resources
});
```

## Options

- `collection` - The target `DataSourceCollection`; defaults to `useViewer().value.dataSources`.
- `isActive` - Whether active, defaults to `true`.
- `evaluating` - A ref receiving the async evaluation state; `true` while loading.
- `destroyOnRemove` - Second argument of `dataSources.remove`; no default set (`undefined` passed through), Cesium treats it as `false` (kept by default); pass `true` to destroy.

## Return Value

- A single value (or getter/ref/async getter) returns `ComputedRef<T | undefined>`.
- An array returns `ComputedRef<T[] | undefined>`.

## Notes

- Cleanup first checks `!collection.isDestroyed()` and skips removal when the collection is destroyed.
- Use it inside the component tree provided by `createViewer`: the data source is not added while the viewer is unavailable.

## Type Definitions

:::dts ./index.ts
:::
