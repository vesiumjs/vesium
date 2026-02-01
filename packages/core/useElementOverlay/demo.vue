<script lang="ts" setup>
import * as Cesium from 'cesium';
import { useElementOverlay, useEntity, useViewer } from 'vesium';
import { shallowRef, watchEffect } from 'vue';

const viewer = useViewer();
const position = shallowRef(Cesium.Cartesian3.fromDegrees(113.4413435972336, 22.069678948462606, 0));

useEntity(new Cesium.Entity({
  position: position.value,
  point: {
    pixelSize: 10,
    color: Cesium.Color.YELLOW,
  },
}));

watchEffect(() => {
  viewer.value?.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(113.4413435972336, 22.069678948462606, 100000),
  });
});

const elRef = shallowRef<HTMLDivElement>();

const { x, y, style } = useElementOverlay(elRef, position, {
  offset: { x: 0, y: -20 },
  clampToGround: true,
});
</script>

<template>
  <teleport v-if="viewer" :to="viewer?.container">
    <div ref="elRef" class="position-absolute bg-#000/50 p-20px text-#fff">
      <h4>useElementOverlay</h4>
      <pre>{{ JSON.stringify({ x: x.toFixed(2), y: y.toFixed(2), style }, undefined, 2) }}</pre>
    </div>
  </teleport>
</template>
