<script setup lang="ts">
import * as Cesium from 'cesium';
import { useEntity, useScenePick, useScreenSpaceEventHandler } from 'vesium';
import { computed, shallowRef } from 'vue';

const cursorPosition = shallowRef<Cesium.Cartesian2>();

// track mouse move to get screen position
useScreenSpaceEventHandler(Cesium.ScreenSpaceEventType.MOUSE_MOVE, (movement: { endPosition: Cesium.Cartesian2 }) => {
  cursorPosition.value = movement.endPosition.clone();
});

// use scene pick to pick entity at cursor
const pick = useScenePick(cursorPosition, {
  width: 3,
  height: 3,
});

// show pick result
const pickInfo = computed(() => {
  if (!pick.value)
    return 'No object picked';
  if (pick.value.id instanceof Cesium.Entity) {
    return `Picked Entity: ${pick.value.id.name || 'unnamed'}`;
  }
  if (pick.value.primitive) {
    return `Picked Primitive: ${(pick.value.primitive as any).id?.name || 'unnamed'}`;
  }
  return `Picked: ${JSON.stringify(pick.value)}`;
});

// add some entities for picking
const _entity1 = useEntity(new Cesium.Entity({
  name: 'Red Box',
  position: Cesium.Cartesian3.fromDegrees(120, 30, 100),
  box: {
    dimensions: new Cesium.Cartesian3(1000, 1000, 1000),
    material: Cesium.Color.RED,
  },
}));

const _entity2 = useEntity(new Cesium.Entity({
  name: 'Blue Box',
  position: Cesium.Cartesian3.fromDegrees(120.01, 30, 100),
  box: {
    dimensions: new Cesium.Cartesian3(1000, 1000, 1000),
    material: Cesium.Color.BLUE,
  },
}));
</script>

<template>
  <div style="position: fixed; top: 10px; left: 10px; padding: 8px; color: white; background: rgb(0 0 0 / 70%); border-radius: 4px;">
    {{ pickInfo }}
  </div>
</template>
