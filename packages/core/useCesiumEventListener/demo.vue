<script setup lang="ts">
import * as Cesium from 'cesium';
import { useCesiumEventListener, useViewer } from 'vesium';
import { ref } from 'vue';

const viewer = useViewer();

const changedSymbol = ref('no change');

useCesiumEventListener(() => viewer.value?.camera.moveStart, () => {
  changedSymbol.value = 'moveStart';
});

useCesiumEventListener(() => viewer.value?.camera.moveEnd, () => {
  changedSymbol.value = 'moveEnd';
});
</script>

<template>
  <div class="p-10px flex flex-col gap-y-10px">
    <div>Camera Changed : {{ changedSymbol }}</div>
    <button @click="viewer?.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(0, 0, 2000000), duration: 1 })">
      Fly
    </button>
  </div>
</template>
