<script setup lang="ts">
import { arrowStraight, circle, ellipse } from '@vesium/geometry';
import * as Cesium from 'cesium';
import { toCartesian3, useEntity, useViewer } from 'vesium';
import { watchPostEffect } from 'vue';

const viewer = useViewer();

// Circle - uses two points to define center and radius
const circleCoords = [[116.0, 39.0], [116.05, 39.0]];
const circleResult = circle(circleCoords);

// Ellipse - uses two points to define major and minor axes
const ellipseCoords = [[116.1, 39.0], [116.2, 39.1]];
const ellipseResult = ellipse(ellipseCoords);

// Straight arrow - uses two points to define direction and length
const arrowCoords = [[116.3, 38.9], [116.5, 39.1]];
const arrowResult = arrowStraight(arrowCoords);

// Render circle
const _circleEntity = useEntity(() => {
  const positions = circleResult.map(c => toCartesian3(c)!);
  return new Cesium.Entity({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(positions),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.5)),
    },
    label: {
      text: 'Circle',
      font: '14px Arial',
      pixelOffset: new Cesium.Cartesian2(0, -20),
    },
  });
});

// Render ellipse
const _ellipseEntity = useEntity(() => {
  const positions = ellipseResult.map(c => toCartesian3(c)!);
  return new Cesium.Entity({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(positions),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.5)),
    },
    label: {
      text: 'Ellipse',
      font: '14px Arial',
      pixelOffset: new Cesium.Cartesian2(0, -20),
    },
  });
});

// Render arrow
const _arrowEntity = useEntity(() => {
  const positions = arrowResult.map(c => toCartesian3(c)!);
  return new Cesium.Entity({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(positions),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.GREEN.withAlpha(0.6)),
    },
    label: {
      text: 'Arrow',
      font: '14px Arial',
      pixelOffset: new Cesium.Cartesian2(0, -20),
    },
  });
});

// Fly to geometry
watchPostEffect(() => {
  if (viewer.value) {
    viewer.value.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(116.3, 39.0, 100000),
      orientation: {
        heading: 0,
        pitch: -Cesium.Math.toRadians(45),
        roll: 0,
      },
    });
  }
});
</script>

<template>
  <div p="10px" flex="~ col" gap="8px">
    <p text-sm>
      @vesium/geometry provides geometry algorithms for plotting: circle, ellipse, arrows, curves, etc.
    </p>
  </div>
</template>
