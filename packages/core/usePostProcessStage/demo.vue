<script setup lang="ts">
import * as Cesium from 'cesium';
import { usePostProcessStage } from 'vesium';
import { ref } from 'vue';

// create a bloom post process stage
const bloomStage = new Cesium.PostProcessStage({
  name: 'bloom',
  fragmentShader: `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    void main() {
      vec4 color = texture2D(colorTexture, v_textureCoordinates);
      float brightness = (color.r + color.g + color.b) / 3.0;
      gl_FragColor = vec4(color.rgb * (1.0 + brightness * 0.5), 1.0);
    }
  `,
});

// use the stage
const _stage = usePostProcessStage(bloomStage);

// control active state
const isActive = ref(true);

const _stageControlled = usePostProcessStage(bloomStage, {
  isActive,
});
</script>

<template>
  <div p="10px">
    <button @click="isActive = !isActive">
      PostProcessStage: {{ isActive ? 'ON' : 'OFF' }}
    </button>
  </div>
</template>
