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

function fmtVec(v: { x: number; y: number; z: number } | undefined): string {
  return v ? `${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)}` : '--';
}
</script>

<template>
  <div class="text-12px p-10px bg-[var(--vp-c-bg)] flex flex-col gap-y-4px h-full max-w-320px overflow-auto">
    <span data-testid="heading">heading: {{ heading?.toFixed(3) }}</span>
    <span data-testid="pitch">pitch: {{ pitch?.toFixed(3) }}</span>
    <span data-testid="roll">roll: {{ roll?.toFixed(3) }}</span>
    <span data-testid="level">level: {{ level }}</span>
    <span data-testid="pos-lon">lon: {{ positionCartographic ? (positionCartographic.longitude * 180 / Math.PI).toFixed(3) : '--' }}</span>
    <span data-testid="pos-lat">lat: {{ positionCartographic ? (positionCartographic.latitude * 180 / Math.PI).toFixed(3) : '--' }}</span>
    <span data-testid="pos-height">height: {{ positionCartographic?.height?.toFixed(1) }}</span>
    <span data-testid="position">position: {{ fmtVec(position) }}</span>
    <span data-testid="position-wc">positionWC: {{ fmtVec(positionWC) }}</span>
    <span data-testid="direction">direction: {{ fmtVec(direction) }}</span>
    <span data-testid="direction-wc">directionWC: {{ fmtVec(directionWC) }}</span>
    <span data-testid="up">up: {{ fmtVec(up) }}</span>
    <span data-testid="up-wc">upWC: {{ fmtVec(upWC) }}</span>
    <span data-testid="right">right: {{ fmtVec(right) }}</span>
    <span data-testid="right-wc">rightWC: {{ fmtVec(rightWC) }}</span>
    <pre data-testid="cartographic-json" class="text-11px whitespace-pre-wrap">{{ JSON.stringify({ position: positionCartographic, viewRectangle }, null, 2) }}</pre>
  </div>
</template>
