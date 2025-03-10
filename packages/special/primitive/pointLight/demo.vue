<script setup lang="ts">
import { PointLight } from '@vesium/special';
import * as Cesium from 'cesium';
import { useEntity, usePrimitive, useViewer } from 'vesium';
import { watchEffect } from 'vue';

const viewer = useViewer();

watchEffect(async () => {
  if (viewer.value) {
    viewer.value.terrainProvider = await Cesium.createWorldTerrainAsync();
    viewer.value.scene.globe.enableLighting = true;
    viewer.value.shadows = true;
    viewer.value.terrainShadows = Cesium.ShadowMode.ENABLED;
    viewer.value.scene.shadowMap.softShadows = true;
  }
});

const tileset = usePrimitive(() => {
  return Cesium.Cesium3DTileset.fromUrl(`https://cyyj.geovisearth.com/geovis-osgb/S/luoning3dtiles/tileset.json`);
});

watchEffect(() => {
  if (tileset.value) {
    viewer.value?.flyTo(tileset.value, { duration: 0.5 });
  }
});

usePrimitive(() => {
  return Array.from({ length: 5 }).map((item, index) => {
    const longitude = ((111.70245476825951 - 111.62358889628175) / 5) * (index + 1) + 111.62358889628175;
    const latitude = ((34.400350258146226 - 34.37477428427973) / 5) * (index + 1) + 34.37477428427973;

    return new PointLight({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 310),
      radius: 100,
    });
  });
});
useEntity(() => {
  return Array.from({ length: 5 }).map((item, index) => {
    const longitude = ((111.70245476825951 - 111.62358889628175) / 5) * (index + 1) + 111.62358889628175;
    const latitude = ((34.400350258146226 - 34.37477428427973) / 5) * (index + 1) + 34.37477428427973;

    return new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 310),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 5,
      },
    });
  });
},
);
</script>

<template>
  <div>
    packages/special/primitive/pointLight/demo.vue
  </div>
</template>
