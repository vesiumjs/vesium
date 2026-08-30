<script setup lang="ts">
import * as Cesium from 'cesium';
import { useScreenSpaceEventHandler } from 'vesium';
import { computed, ref } from 'vue';

const coord = ref<Record<any, any>>({});

Object.values(Cesium.ScreenSpaceEventType).forEach((type: any) => {
  useScreenSpaceEventHandler(type, (ctx: any) => coord.value[type] = JSON.stringify(ctx));
});
const hitCount = computed(() => Object.values(coord.value).filter(Boolean).length);
</script>

<template>
  <div class="p-10px bg-[var(--vp-c-bg)] flex flex-col gap-5px h-full max-w-320px overflow-auto">
    <div data-testid="hitCount">
      hits: {{ hitCount }}
    </div>
    <span v-for="(value, key) in Cesium.ScreenSpaceEventType" :key="key">
      {{ key }} : {{ coord[value] || '--' }}
    </span>
  </div>
</template>
