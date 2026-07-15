<script setup lang="ts">
import { useCameraState } from 'vesium';

const {
  position,
  direction,
  up,
  right,
  positionCartographic,
  positionWC,
  directionWC,
  upWC,
  rightWC,
  viewRectangle,
  heading,
  pitch,
  roll,
  level,
} = useCameraState();
</script>

<template>
  <div class="p-10px flex flex-col gap-y-10px h-250px overflow-scroll">
    <pre> {{ { position, direction, up, right, positionCartographic, positionWC, directionWC, upWC, rightWC, viewRectangle, heading, pitch, roll, level } }}</pre>
  </div>
</template>
