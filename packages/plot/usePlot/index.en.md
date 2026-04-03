---
sort: 1
---

# usePlot

Manage a Cesium plotting session with a single composable.

It keeps the session state for the current plotting workflow, including the reactive plot list, the shared timeline, the active plot being defined, and the cleanup/cancellation lifecycle.

In practice, `usePlot()` is the entry point you use when you want to create, restore, or remove plots while letting the underlying `PlotScheme` and `PlotSkeleton` instances drive rendering and interaction.

## Usage

:::demo src="./demo.vue"
:::

## Returns

- `plots` - reactive list of plots in the current session
- `time` - the shared plotting timeline
- `operate` - create a new plot or restore an existing one
- `remove` - remove a plot from the session
- `cancel` - abort the current `operate()` call when one is active
