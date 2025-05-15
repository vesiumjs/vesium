<script setup lang="ts">
import { schemeMeasureArea, usePlot } from '@vesium/plot';

const { operate } = usePlot();

const otpions = [
  {
    label: 'measureArea',
    scheme: schemeMeasureArea,
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
