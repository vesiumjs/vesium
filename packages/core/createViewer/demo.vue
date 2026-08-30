<script setup lang="ts">
import { createViewer } from 'vesium';
import { shallowRef } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

const elRef = shallowRef<HTMLElement>();

createViewer(elRef, {
// ... options
});
</script>

<template>
  <div ref="elRef" class="inset-0 absolute" />
  <!-- Readiness signal for e2e tests; visually hidden via inline styles
       because the e2e host app has no UnoCSS utilities (e.g. `sr-only`). -->
  <div
    v-if="elRef"
    data-testid="viewer-ready"
    style="position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap;"
  >
    ready
  </div>
</template>
