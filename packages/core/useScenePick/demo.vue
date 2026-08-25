<script setup lang="ts">
import * as Cesium from 'cesium';
import { useEntity, useScenePick, useScreenSpaceEventHandler, useViewer } from 'vesium';
import { computed, shallowRef, watchEffect } from 'vue';

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

const entities = useEntity([
  new Cesium.Entity({
    name: 'Red Box',
    position: Cesium.Cartesian3.fromDegrees(120, 30, 500),
    box: {
      dimensions: new Cesium.Cartesian3(2000, 2000, 800),
      material: Cesium.Color.RED,
    },
  }),
  new Cesium.Entity({
    name: 'Blue Box',
    position: Cesium.Cartesian3.fromDegrees(120.02, 30, 500),
    box: {
      dimensions: new Cesium.Cartesian3(2000, 2000, 800),
      material: Cesium.Color.BLUE,
    },
  }),
]);

const viewer = useViewer();
watchEffect(() => {
  if (viewer.value && entities.value) {
    viewer.value.flyTo(entities.value, { duration: 1 });
  }
});
</script>

<template>
  <div class="p-10px">
    {{ pickInfo }}
  </div>
</template>
