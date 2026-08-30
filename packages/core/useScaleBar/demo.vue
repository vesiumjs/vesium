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
  <div class="p-10px flex flex-col w-200px">
    <div data-testid="pixelDistance">
      pixelDistance: {{ pixelDistance?.toFixed(2) }}m
    </div>
    <div data-testid="distance">
      distance: {{ distance }}m
    </div>
    <div data-testid="scalebar" class="border-b-2px border-b-#666" :style="{ width: `${width}px` }">
      {{ distanceText }}
    </div>
  </div>
</template>
