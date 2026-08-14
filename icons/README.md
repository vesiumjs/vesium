# Custom SVG icons

This directory holds the custom SVG icons exposed by the `custom` icon collection
(`i-custom-*` utilities) configured in [`uno.config.ts`](../uno.config.ts) via
`presetIcons` → `generateIconCollection`.

Drop an SVG file here (e.g. `logo.svg`) to make `i-custom-logo` available in the
docs site. Multi-color SVGs are transformed into CSS color variables
(`--icon-custom-color-*`) by `internals/icon/svgTransform`.
