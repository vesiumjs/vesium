import type { Cartesian3, Entity } from 'cesium';
import type { Nullable } from 'vesium';
import type { CSSProperties } from 'vue';
import type { PlotSkeleton } from './PlotSkeleton';
import type { SampledPlotPackable } from './SampledPlotProperty';
import { assert } from '@vueuse/core';
import { assertError } from 'vesium';

export interface PlotRenderResult {
  entities?: Entity[];
  primitives?: any[];
  groundPrimitives?: any[];
}

export interface PlotRenderOptions<D = any> {
  packable: SampledPlotPackable<D>;
  defining: boolean;
  mouse?: Cartesian3;
  previous: PlotRenderResult;
}

export interface PlotSchemeConstructorOptions {
  type: string;

  complete?: (packable: SampledPlotPackable) => boolean;

  forceComplete?: (packable: SampledPlotPackable) => boolean;

  /**
   * @default 'crosshair'
   */
  definingCursor?: Nullable<CSSProperties['cursor']> | ((packable: SampledPlotPackable) => Nullable<CSSProperties['cursor']>);

  skeletons?: (() => PlotSkeleton) [];

  initEntites?: () =>(Entity[] | undefined);

  initPrimitives?: () =>(any[] | undefined);

  initGroundPrimitives?: () =>(any[] | undefined);

  render?: (options: PlotRenderOptions) => PlotRenderResult | Promise<PlotRenderResult>;
}

export class PlotScheme {
  constructor(options: PlotSchemeConstructorOptions) {
    this.type = options.type;
    this.complete = options.complete;
    this.forceComplete = options.forceComplete;
    this.definingCursor = options.definingCursor ?? 'crosshair';
    this.skeletons = options.skeletons?.map(item => item()) ?? [];
    this.initEntites = options.initEntites;
    this.initPrimitives = options.initPrimitives;
    this.initGroundPrimitives = options.initGroundPrimitives;
    this.render = options.render;
  }

  type: string;

  /**
   * 是否立即执行完成标绘操作
   *
   * 每次控制点发生变变化时，执行该回调函数，如果返回`true`则标绘完成
   */
  complete?: (packable: SampledPlotPackable) => boolean;

  /**
   * 双击时，是否执行完成标绘操作
   */
  forceComplete?: (packable: SampledPlotPackable) => boolean;

  /**
   * @default 'crosshair'
   */
  definingCursor?: Nullable<CSSProperties['cursor']> | ((packable: SampledPlotPackable) => Nullable<CSSProperties['cursor']>);

  skeletons: PlotSkeleton [];

  initEntites?: () =>(Entity[] | undefined);

  initPrimitives?: () =>(any[] | undefined);

  initGroundPrimitives?: () =>(any[] | undefined);

  render?: (options: PlotRenderOptions) => PlotRenderResult | Promise<PlotRenderResult>;

  private static _record = new Map<string, PlotScheme>();

  static getCacheTypes(): string[] {
    return [...this._record.keys()];
  }

  static getCache(type: string): PlotScheme | undefined {
    return PlotScheme._record.get(type);
  }

  static setCache(scheme: PlotScheme): void {
    assertError(!scheme.type, '`scheme.type` is required');
    PlotScheme._record.set(scheme.type, scheme);
  }

  static resolve(maybeScheme: string | PlotScheme | PlotSchemeConstructorOptions): PlotScheme {
    if (typeof maybeScheme === 'string') {
      const _scheme = PlotScheme.getCache(maybeScheme);
      assert(!!_scheme, `scheme ${maybeScheme} not found`);
      return _scheme!;
    }
    else if (!(maybeScheme instanceof PlotScheme)) {
      return new PlotScheme(maybeScheme);
    }
    else {
      return maybeScheme;
    }
  }
}
