---
sort: 1
---

# usePlot

A composable for managing a Cesium plotting session — the entry point for creating, restoring, or removing plots. It maintains the reactive plot list, the shared timeline, the active plot, and the cancellation/cleanup lifecycle, while rendering and interaction are driven by `PlotScheme` and `PlotSkeleton`.

## Usage

:::demo src="./demo.vue"
:::

## Returns

### `plots`

A reactive snapshot of all plots in the current session (`ComputedRef<PlotFeature[]>`).

### `time`

The shared timeline for the session (`ShallowRef<JulianDate | undefined>`); pass one via `usePlot({ time })`.

### `operate`

Start or resume a `PlotFeature` (`(plot: PlotFeature | PlotFeatureConstructorOptions) => Promise<PlotFeature>`); resolves when definition completes, rejects on cancel or removal; before starting a new plot it first tries to force-complete the previous defining one (if it cannot complete, that plot is removed and its promise rejects).

### `remove`

Remove a plot from the session, returning whether it succeeded; aborts the pending `operate()` when the plot is being defined.

### `cancel`

Abort the pending `operate()` call; its returned promise rejects.
