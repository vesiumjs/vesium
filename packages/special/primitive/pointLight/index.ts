// import type { Cartesian3, PostProcessStage, Scene } from 'cesium';
// import { Camera, Primitive, ShadowMap } from 'cesium';
// import { LightPostProcessStage } from './LightPostProcessStage';

// export interface PointLightConstructorOptions {
//   position: Cartesian3;
//   radius: number;
//   depthBiasStep?: number;
// }

// export class PointLight extends Primitive {
//   constructor(options: PointLightConstructorOptions) {
//     const { position, radius, depthBiasStep = 1 } = options;

//     super();

//     this._position = position;
//     this._radius = radius;
//     this._depthBiasStep = depthBiasStep;
//   }

//   /**
//    * @internal
//    */
//   private _dirty: boolean = true;

//   /**
//    * @internal
//    */
//   private _position: Cartesian3;

//   get position(): Cartesian3 {
//     return this._position;
//   }

//   set position(value: Cartesian3) {
//     if (!value?.equals(this._position)) {
//       this._dirty = true;
//     }
//     this.position = value;
//   }

//   /**
//    * @internal
//    */
//   private _radius: number;

//   get radius(): number {
//     return this._radius;
//   }

//   set radius(value: number) {
//     if (value !== this._radius) {
//       this._radius = value;
//       this._dirty = true;
//     }
//   }

//   /**
//    * @internal
//    */
//   private _depthBiasStep: number;

//   get depthBiasStep(): number {
//     return this._depthBiasStep;
//   }

//   set depthBiasStep(value: number) {
//     if (value !== this._depthBiasStep) {
//       this._depthBiasStep = value;
//       this._dirty = true;
//     }
//   }

//   /**
//    * @internal
//    */
//   private _scene?: Scene;

//   /**
//    * @internal
//    */
//   private _camera?: Camera;

//   get camera(): Camera | undefined {
//     return this._camera;
//   }

//   /**
//    * @internal
//    */
//   private _shadowMap?: ShadowMap & Record<string, any>;

//   get shadowMap(): ShadowMap & Record<string, any> | undefined {
//     return this._shadowMap;
//   }

//   /**
//    * @internal
//    */
//   private _stage?: PostProcessStage;

//   destroy(): void {
//     this._stage && this._scene?.postProcessStages.remove(this._stage);
//     this._shadowMap?.destroy();
//     super.destroy();
//   }

//   // @ts-expect-error ignore
//   update(frameState: any): void {
//     if (this._dirty) {
//       this._dirty = false;

//       this._scene ??= frameState.camera._scene;

//       // camera
//       this._camera ??= new Camera(this._scene!);
//       this._camera.position = this._position;

//       // shadowMap
//       this._shadowMap?.destroy();

//       // @ts-expect-error ignore
//       this._shadowMap = new ShadowMap({
//         context: Reflect.get(this._scene!, 'context'),
//         lightCamera: this._camera,
//         isPointLight: true,
//         enable: true,
//         pointLightRadius: this.radius,
//       });
//       this._stage && this._scene?.postProcessStages.remove(this._stage);

//       this._stage = new LightPostProcessStage({ shadowMap: this._shadowMap });
//       this._scene!.postProcessStages.add(this._stage);
//     }
//     // @ts-expect-error ignore
//     super.update(frameState);

//     if (this._shadowMap!.enabled) {
//       const shadowMaps = frameState.shadowMaps as any[];
//       this._shadowMap.update(frameState);
//       shadowMaps.push(this._shadowMap);
//     }
//   }
// }
