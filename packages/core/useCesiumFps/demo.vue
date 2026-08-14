<script setup lang="ts">
import { useCesiumFps } from 'vesium';

const { fps, interval } = useCesiumFps({ delay: 100 });
</script>

<template>
  <div class="p-10px flex flex-col w-200px">
    <span>FPS:{{ fps?.toFixed(2) }}</span>
    <span>Interval:{{ interval?.toFixed(2) }}ms</span>
  </div>
</template>
