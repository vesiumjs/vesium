# usePlot

Manage a Cesium plotting session with a single composable.

It keeps a reactive list of plots, coordinates the active plot being defined, and wires the render/skeleton/sample pipelines together for you.

## Usage

:::demo src="./demo.vue"
:::

## Returns

- `plots` - reactive list of plots in the current session
- `time` - the shared plotting timeline
- `operate` - create a new plot or restore an existing one
- `remove` - remove a plot from the session
- `cancel` - abort the current `operate()` call when one is active
