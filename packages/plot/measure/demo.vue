<script setup lang="ts">
import { schemeMeasureArea, schemeMeasureDistance, usePlot } from '@vesium/plot';

const { operate } = usePlot();

const otpions = [
  {
    label: 'area',
    scheme: schemeMeasureArea,
  },
  {
    label: 'distance',
    scheme: schemeMeasureDistance,
  },
];
</script>

<template>
  <div p="10px">
    <button v-for="item in otpions" :key="item.label" @click="operate({ scheme: item.scheme })">
      {{ item.label }}
    </button>
  </div>
</template>
