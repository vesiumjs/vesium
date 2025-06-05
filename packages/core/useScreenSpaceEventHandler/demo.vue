<script setup lang="ts">
import * as Cesium from 'cesium';
import { useScreenSpaceEventHandler } from 'vesium';
import { ref } from 'vue';

const coord = ref<Record<any, any>>({});

Object.values(Cesium.ScreenSpaceEventType).forEach((type: any) => {
  useScreenSpaceEventHandler(type, (ctx: any) => coord.value[type] = JSON.stringify(ctx));
});
</script>

<template>
  <div
    w="200px"
    bg="[var(--vp-c-bg)]"
    p="10px"
    flex="~ col gap-5px"
  >
    <span v-for="(value, key) in Cesium.ScreenSpaceEventType" :key="key">
      {{ key }} : {{ coord[value] || '--' }}
    </span>
  </div>
</template>
