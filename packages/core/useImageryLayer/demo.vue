<script setup lang="ts">
import * as Cesium from 'cesium';
import { useImageryLayer, useViewer } from 'vesium';
import { ref, watchPostEffect } from 'vue';

const isActive = ref(true);

const imageryLayer = useImageryLayer(
  async () => new Cesium.ImageryLayer(new Cesium.GridImageryProvider({})),
  {
    isActive,
    destroyOnRemove: false,
    index: 9999,
  },
);

const viewer = useViewer();
watchPostEffect(() => {
  if (imageryLayer.value) {
    viewer.value?.flyTo(
      imageryLayer.value,
      {
        duration: 1,
      },
    );
  }
});
</script>

<template>
  <div
    p="10px"
  >
    <button @click="isActive = !isActive">
      visible:{{ isActive }}
    </button>
  </div>
</template>
