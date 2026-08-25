<script setup lang="ts">
import * as Cesium from 'cesium';
import { useEntity, useSceneDrillPick, useScreenSpaceEventHandler, useViewer } from 'vesium';
import { computed, shallowRef, watchEffect } from 'vue';

const cursorPosition = shallowRef<Cesium.Cartesian2>();

// track mouse move
useScreenSpaceEventHandler(Cesium.ScreenSpaceEventType.MOUSE_MOVE, (movement: { endPosition: Cesium.Cartesian2 }) => {
  cursorPosition.value = movement.endPosition.clone();
});

// use scene drill pick to pick multiple objects at cursor
const drillPick = useSceneDrillPick(cursorPosition, {
  width: 5,
  height: 5,
  limit: 10,
});

// show all picked objects
const pickInfo = computed(() => {
  if (!drillPick.value || drillPick.value.length === 0) {
    return 'No object picked';
  }
  const names = drillPick.value.map((item: any, index: number) => {
    if (item.id instanceof Cesium.Entity) {
      return `${index + 1}. Entity: ${item.id.name || 'unnamed'}`;
    }
    if (item.primitive) {
      return `${index + 1}. Primitive: ${item.primitive.id?.name || 'unnamed'}`;
    }
    return `${index + 1}. Unknown`;
  });
  return names.join('\n');
});

// three boxes stacked at the same ground position — hover the center to drill all layers
const entities = useEntity([
  new Cesium.Entity({
    name: 'Layer 1 - Red',
    position: Cesium.Cartesian3.fromDegrees(120, 30, 500),
    box: {
      dimensions: new Cesium.Cartesian3(4000, 4000, 1000),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.6)),
    },
  }),
  new Cesium.Entity({
    name: 'Layer 2 - Green',
    position: Cesium.Cartesian3.fromDegrees(120, 30, 1200),
    box: {
      dimensions: new Cesium.Cartesian3(2600, 2600, 800),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.GREEN.withAlpha(0.6)),
    },
  }),
  new Cesium.Entity({
    name: 'Layer 3 - Blue',
    position: Cesium.Cartesian3.fromDegrees(120, 30, 1800),
    box: {
      dimensions: new Cesium.Cartesian3(1400, 1400, 600),
      material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.6)),
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
  <div class="text-12px p-10px whitespace-pre-wrap">
    {{ pickInfo }}
  </div>
</template>
