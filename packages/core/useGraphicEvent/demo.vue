<script setup lang="ts">
import { canvasCoordToCartesian, toProperty } from '@vesium/shared';
import * as Cesium from 'cesium';
import { useEntity, useGraphicEvent, useViewer } from 'vesium';
import { watchEffect } from 'vue';

const viewer = useViewer();

watchEffect(() => {
  viewer.value?.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(150, 12.5, 9000000),
  });
});

const { addGraphicEvent } = useGraphicEvent();

// =========[CLICK]============
useEntity(() => {
  const entity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(140, 10),
    point: { pixelSize: 15 },
    label: {
      font: '14px sans-serif',
      pixelOffset: new Cesium.Cartesian2(0, 20),
      text: 'CLICK ME',
    },
  });
  addGraphicEvent(
    entity,
    'LEFT_CLICK',
    (_params) => {
      const color = new Cesium.ConstantProperty(Cesium.Color.RED);
      entity!.point!.color = color;
      entity!.label!.fillColor = color;
      entity!.label!.text = new Cesium.ConstantProperty('CLICKED');
    },
  );
  return entity;
});

// =========[HOVER]============
useEntity(() => {
  const entity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(150, 10),
    point: { pixelSize: 15 },
    label: {
      font: '14px sans-serif',
      pixelOffset: new Cesium.Cartesian2(0, 20),
      text: 'HOVER ME',
    },
  });
  addGraphicEvent(
    entity,
    'HOVER',
    (params) => {
      const color = params.hovering ? Cesium.Color.RED : undefined;
      entity!.point!.color = toProperty(color);
      entity!.label!.fillColor = toProperty(color);
      entity!.label!.text = toProperty(params.hovering ? 'HOVERING' : 'HOVER ME');
    },
  );
  return entity;
});

// =========[DRAG]============
useEntity(() => {
  const entity = new Cesium.Entity({
    position: Cesium.Cartesian3.fromDegrees(160, 10),
    point: { pixelSize: 15 },
    label: {
      font: '14px sans-serif',
      pixelOffset: new Cesium.Cartesian2(0, 20),
      text: 'DRAG ME',
    },
  });

  addGraphicEvent(
    entity,
    'DRAG',
    (params) => {
      const color = params.dragging ? Cesium.Color.RED : undefined;
      entity!.point!.color = toProperty(color);
      entity!.label!.fillColor = toProperty(color);
      entity!.label!.text = toProperty(params.dragging ? 'DRAGGING' : 'DRAG ME');
      // lock camera
      params.dragging && params.lockCamera();

      // update position
      const position = canvasCoordToCartesian(params.event.endPosition, viewer.value!.scene);
      if (position) {
        entity!.position = new Cesium.CallbackPositionProperty(() => position, false);
      }
    },
  );
  return entity;
});
</script>

<template>
  <div />
</template>
