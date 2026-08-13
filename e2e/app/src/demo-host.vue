<script setup lang="ts">
import type { Component } from 'vue';
import CesiumContainer from '../../../packages/.vitepress/theme/components/cesium-container.vue';
import ViewerProbe from './viewer-probe.vue';

defineProps<{
  demo: Component;
}>();
</script>

<template>
  <CesiumContainer e2e>
    <div class="demo-panel">
      <ViewerProbe>
        <component :is="demo" />
      </ViewerProbe>
    </div>
  </CesiumContainer>
</template>
