<script setup lang="ts">
import { schemeBillboard, schemeLabel, schemePolyline, usePlot } from '@vesium/plot';
import { schemeMeasureArea } from '../scheme/measureArea';
import { schemePolygon } from '../scheme/polygon';

const { operate } = usePlot();

const otpions = [
  {
    label: 'Lebel',
    scheme: schemeLabel,
  },
  {
    label: 'Billboard',
    scheme: schemeBillboard,
  },
  {
    label: 'Polyline',
    scheme: schemePolyline,
  },
  {
    label: 'Polygon',
    scheme: schemePolygon,
  },
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
