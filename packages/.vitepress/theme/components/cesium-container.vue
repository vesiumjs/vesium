<script lang="ts" setup>
import { Ion, ScreenSpaceEventType } from 'cesium';
import { createViewer } from 'vesium';
import { shallowRef, watchEffect } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

defineOptions({ name: 'CesiumContainer' });

const props = withDefaults(defineProps<{
  /**
   * E2E test mode:
   * - skips the Ion access token (no network base layer)
   * - disables the default base layer for deterministic offline rendering
   * - keeps the default input actions so tests can interact with the scene
   */
  e2e?: boolean;
}>(), {
  e2e: false,
});

if (!props.e2e) {
  Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxM2QxOTZmOC00NGEwLTRjOTMtODUzYi03ZmM3MmFhMDhmYjEiLCJpZCI6ODUxMDcsImlhdCI6MTcyNTI3NjU4NH0.ZmrKQrRWFRCQLRSUEuPvVa6kFYvJ_3othkPumVfvQmU';
}

const elRef = shallowRef<HTMLElement>();
const viewer = createViewer(elRef, {
  animation: false,
  timeline: false,
  infoBox: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  ...(props.e2e ? { baseLayer: false } : {}),
});
watchEffect(() => {
  if (viewer.value && !props.e2e) {
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
});
</script>

<template>
  <div ref="elRef" class="inset-0 absolute" />
  <slot />
</template>
