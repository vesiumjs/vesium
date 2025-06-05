<script setup lang="ts">
import * as Cesium from 'cesium';
import { useScaleBar, useViewer } from 'vesium';
import { watchEffect } from 'vue';

const viewer = useViewer();
watchEffect(() => {
  viewer.value?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(100, 0, 10000),
    duration: 3,

  });
});
const { pixelDistance, width, distance, distanceText } = useScaleBar();
</script>

<template>
  <div
    w="200px"
    p="10px"
    flex="~ col"
  >
    <div>pixelDistance: {{ pixelDistance?.toFixed(2) }}m</div>
    <div>distance: {{ distance }}m</div>
    <div b-b="#666 2px" :style="{ width: `${width}px` }">
      {{ distanceText }}
    </div>
  </div>
</template>
