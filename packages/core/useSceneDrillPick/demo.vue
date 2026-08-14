<script setup lang="ts">
import * as Cesium from 'cesium';
import { useEntity, useSceneDrillPick, useScreenSpaceEventHandler } from 'vesium';
import { computed, shallowRef } from 'vue';

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

// add overlapping entities for drill pick demo
const _entity1 = useEntity(new Cesium.Entity({
  name: 'Layer 1 - Red',
  position: Cesium.Cartesian3.fromDegrees(120, 30, 100),
  box: {
    dimensions: new Cesium.Cartesian3(3000, 3000, 1000),
    material: new Cesium.ColorMaterialProperty(Cesium.Color.RED.withAlpha(0.6)),
  },
}));

const _entity2 = useEntity(new Cesium.Entity({
  name: 'Layer 2 - Green',
  position: Cesium.Cartesian3.fromDegrees(120, 30, 200),
  box: {
    dimensions: new Cesium.Cartesian3(2000, 2000, 1000),
    material: new Cesium.ColorMaterialProperty(Cesium.Color.GREEN.withAlpha(0.6)),
  },
}));

const _entity3 = useEntity(new Cesium.Entity({
  name: 'Layer 3 - Blue',
  position: Cesium.Cartesian3.fromDegrees(120, 30, 300),
  box: {
    dimensions: new Cesium.Cartesian3(1000, 1000, 1000),
    material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.6)),
  },
}));
</script>

<template>
  <div style="position: fixed; top: 10px; left: 10px; padding: 8px; font-size: 12px; color: white; white-space: pre-wrap; background: rgb(0 0 0 / 70%); border-radius: 4px;">
    {{ pickInfo }}
  </div>
</template>
