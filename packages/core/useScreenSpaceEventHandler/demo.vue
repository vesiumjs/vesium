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
  <div class="p-10px bg-[var(--vp-c-bg)] flex flex-col gap-5px w-200px">
    <span v-for="(value, key) in Cesium.ScreenSpaceEventType" :key="key">
      {{ key }} : {{ coord[value] || '--' }}
    </span>
  </div>
</template>
