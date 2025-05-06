<script setup lang="ts">
import { useCesiumFps } from '@vesium/core';

const { fps, interval } = useCesiumFps({ delay: 300 });
</script>

<template>
  <div
    w="200px"
    p="10px"
    flex="~ col"
  >
    <span>FPS:{{ fps }}</span>
    <span>Interval:{{ interval }}ms</span>
  </div>
</template>
