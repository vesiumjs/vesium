<script setup lang="ts">
import { useViewer } from 'vesium';
import { watch } from 'vue';

const viewer = useViewer();
watch(viewer, (v) => {
  if (v) {
    window.__app.viewer = v;
  }
});
</script>

<template>
  <slot />
</template>
