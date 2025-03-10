<script setup lang="ts">
import * as Cesium from 'cesium';
import fragmentShaderSource from 'fs.glsl?raw';
import { usePrimitive, useViewer } from 'vesium';
import vertexShaderSource from 'vs.glsl?raw';
import { watchEffect } from 'vue';
import noiseTexture from './assets/waveNoise.png';

const viewer = useViewer();

const rectangle = Cesium.Rectangle.fromDegrees(110, 19.0, 110.1, 19.1); // 定义矩形范围

// 自定义材质

const primitive = usePrimitive(() => {
  return new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        height: 1000,
        rectangle,
        vertexFormat: Cesium.VertexFormat.POSITION_AND_ST, // 需要纹理坐标
      }),
      attributes: {
        noiseTexture: new Cesium.Texture({
          context: viewer.value?.scene.context,
          url: noiseTexture,
          sampler: new Cesium.Sampler({
            wrapS: Cesium.TextureWrap.REPEAT,
            wrapT: Cesium.TextureWrap.REPEAT,
          }),
        }),
        time: 0.0,
        amplitude: 0.1,
        frequency: 5.0,
      },
    }),
    appearance: new Cesium.Appearance({
      renderState: {
        blending: Cesium.BlendingState.ALPHA_BLEND,
      },
      vertexShaderSource,
      fragmentShaderSource,

    }),
  });
});

watchEffect(() => {
  viewer.value?.camera.flyTo({
    destination: rectangle,
    duration: 0.5,
  });
});
</script>

<template>
</template>
