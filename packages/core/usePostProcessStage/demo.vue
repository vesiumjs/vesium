<script setup lang="ts">
import * as Cesium from 'cesium';
import { usePostProcessStage } from 'vesium';
import { ref } from 'vue';

// Cesium dropped WebGL1: post-process shaders must be GLSL3
// (`in`/`out_FragColor`/`texture`), or shader compilation stops the render loop.
const bloomShader = `
  uniform sampler2D colorTexture;
  in vec2 v_textureCoordinates;
  void main() {
    vec4 color = texture(colorTexture, v_textureCoordinates);
    float brightness = (color.r + color.g + color.b) / 3.0;
    out_FragColor = vec4(color.rgb * (1.0 + brightness * 0.5), 1.0);
  }
`;

const bloomStage = new Cesium.PostProcessStage({
  name: 'bloom',
  fragmentShader: bloomShader,
});

// use the stage
const _stage = usePostProcessStage(bloomStage);

// control active state
const isActive = ref(true);

// `postProcessStages.remove()` destroys the removed stage, so re-activation
// needs a fresh instance: the getter re-evaluates on `isActive` changes.
const _stageControlled = usePostProcessStage(() => {
  if (!isActive.value)
    return undefined;
  return new Cesium.PostProcessStage({ name: 'bloomControlled', fragmentShader: bloomShader });
});
</script>

<template>
  <div class="p-10px">
    <button @click="isActive = !isActive">
      PostProcessStage: {{ isActive ? 'ON' : 'OFF' }}
    </button>
  </div>
</template>
