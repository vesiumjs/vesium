import { GeometryInstance, Material, Primitive, RectangleGeometry, VertexFormat } from 'cesium';

import waveNoiseTexture from './assets/waveNoise.png';

export class WaveNoise extends Primitive {
}

// 加载噪点图纹理
const noiseTextureUrl = 'path/to/noise-texture.png'; // 替换为实际路径

// 创建矩形几何体
const rectangleGeometry = new RectangleGeometry({
  rectangle,
  vertexFormat: VertexFormat.POSITION_AND_TEXTURE_COORDINATES,
  height: 0, // 初始高度
});

// 创建Primitive并应用自定义Shader
export const a = new Primitive({
  geometryInstances: new GeometryInstance({
    geometry: rectangleGeometry,
  }),
  appearance: new PerInstanceColorAppearance({
    material: new Material({
      fabric: {
        type: 'CustomShaderMaterial',
        uniforms: {
          u_noiseTexture: noiseTextureUrl,
        },
      },
    }),
    uniforms: {
      u_noiseTexture: {
        type: 'sampler2D',
        value: waveNoiseTexture,
      },
      u_time: {
        type: 'float',
        value: 0.0,
      },
      u_waveHeight: {
        type: 'float',
        value: 10000.0, // 波浪高度（单位：米）
      },
    },
    vertexShaderText: `
        uniform sampler2D u_noiseTexture;
        uniform float u_time;
        uniform float u_waveHeight;

        void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
          // 采样噪点图纹理
          vec2 noiseUV = vsInput.attributes.texCoord_0.xy; // 纹理坐标
          float noiseValue = texture(u_noiseTexture, noiseUV).r;

          // 根据噪点值和时间调整顶点高度
          float waveOffset = sin(noiseValue * 10.0 + u_time) * u_waveHeight;
          vsOutput.positionMC.y += waveOffset; // 调整Y轴高度
        }
      `,
    fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          // 设置波浪颜色
          material.diffuse = vec3(0.1, 0.5, 0.8); // 蓝色波浪
          material.alpha = 0.8; // 半透明
        }
      `,
  }),
});

// 动态更新时间参数
viewer.clock.onTick.addEventListener(() => {
  customShader.uniforms.u_time = performance.now() / 1000.0;
});
