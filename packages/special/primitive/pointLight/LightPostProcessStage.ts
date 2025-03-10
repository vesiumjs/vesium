// import type { ShadowMap } from 'cesium';
// import { Cartesian2, Cartesian4, PostProcessStage } from 'cesium';
// import fragmentShader from './shader.glsl?raw';

// export interface LightPostProcessStageConstructorOptions {
//   shadowMap: ShadowMap;
// }

// export class LightPostProcessStage extends PostProcessStage {
//   constructor(options: LightPostProcessStageConstructorOptions) {
//     super({
//       fragmentShader,

//       uniforms: {
//         shadowMap_textureCube: () => {
//           return Reflect.get(this.shadowMap, '_shadowMapTexture');
//         },
//         shadowMap_matrix: () => {
//           return Reflect.get(this.shadowMap, '_shadowMapMatrix');
//         },
//         shadowMap_lightPositionEC: () => {
//           return Reflect.get(this.shadowMap, '_lightPositionEC');
//         },
//         shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: () => {
//           const bias = this.shadowMap._pointBias;
//           const texelStepSize = new Cartesian2();
//           texelStepSize.x = 1.0 / this.shadowMap._textureSize.x;
//           texelStepSize.y = 1.0 / this.shadowMap._textureSize.y;

//           return Cartesian4.fromElements(
//             texelStepSize.x,
//             texelStepSize.y,
//             bias.depthBias,
//             bias.normalShadingSmooth,
//             new Cartesian4(),
//           );
//         },
//         shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: () => {
//           const bias = this.shadowMap._pointBias;

//           return Cartesian4.fromElements(
//             bias.normalOffsetScale,
//             this.shadowMap._distance,
//             this.shadowMap.maximumDistance,
//             this.shadowMap._darkness,
//             new Cartesian4(),
//           );
//         },

//       },
//     });

//     this._shadowMap = options.shadowMap;
//   }

//   /**
//    * @internal
//    */
//   private _shadowMap: ShadowMap;

//   get shadowMap(): ShadowMap {
//     return this._shadowMap;
//   }

//   set shadowMap(value: ShadowMap) {
//     this._shadowMap = value;
//   }
// }
