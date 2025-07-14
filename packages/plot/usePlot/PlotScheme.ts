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

export interface PlotRenderContext<D = any> {
  /**
   * 当前标绘点位数据
   */
  packable: SampledPlotPackable<D>;

  /**
   * 当前是否处于定义态
   */
  defining: boolean;

  /**
   * 当前鼠标位置，若当前标绘不处于定义态时，`mouse`为`undefined`
   */
  mouse?: Cartesian3;

  /**
   * 上一次的渲染结果
   */
  previous: PlotRenderResult;
}

export interface PlotSchemeConstructorOptions {
  /**
   * 标绘类型。应当是全局唯一的字符串，会作为键名缓存
   */
  type: string;

  /**
   * 判断是否立即完成标绘.
   * 每次控制点发生变变化时，执行该回调函数，返回`true`则完成标绘
   */
  complete?: (packable: SampledPlotPackable) => boolean;

  /**
   * 判断是否允许手动完成标绘。
   * 每次控制点发生变变化时，执行该回调函数，返回`true`则后续左键双击即完成标绘
   */
  allowManualComplete?: (packable: SampledPlotPackable) => boolean;

  /**
   * 处于定义态时鼠标的样式
   * @default 'crosshair'
   */
  definingCursor?: Nullable<CSSProperties['cursor']> | ((packable: SampledPlotPackable) => Nullable<CSSProperties['cursor']>);

  /**
   * 当前标绘的框架点数据
   */
  skeletons?: (() => PlotSkeleton) [];

  /**
   * 初始化时创建的render，创建后会作为配置项传入`render`中
   */
  initRender: () => PlotRenderResult;

  /**
   * 当标绘数据变化时，会触发`render`回调，返回的数据会被添加到cesium中
   */
  render?: (context: PlotRenderContext) => PlotRenderResult | Promise<PlotRenderResult>;
}

export class PlotScheme {
  constructor(options: PlotSchemeConstructorOptions) {
    this.type = options.type;
    this.complete = options.complete;
    this.allowManualComplete = options.allowManualComplete;
    this.definingCursor = options.definingCursor ?? 'crosshair';
    this.skeletons = options.skeletons?.map(item => item()) ?? [];
    this.initRender = options.initRender;
    this.render = options.render;
  }

  /**
   * 标绘类型。应当是全局唯一的字符串，会作为键名缓存
   */
  type: string;

  /**
   * 判断是否立即完成标绘.
   * 每次控制点发生变变化时，执行该回调函数，返回`true`则完成标绘
   */
  complete?: (packable: SampledPlotPackable) => boolean;

  /**
   * 判断是否允许手动完成标绘。
   * 每次控制点发生变变化时，执行该回调函数，返回`true`则后续左键双击即完成标绘
   */
  allowManualComplete?: (packable: SampledPlotPackable) => boolean;

  /**
   * 处于定义态时鼠标的样式
   * @default 'crosshair'
   */
  definingCursor?: Nullable<CSSProperties['cursor']> | ((packable: SampledPlotPackable) => Nullable<CSSProperties['cursor']>);

  /**
   * 当前标绘的框架点数据
   */
  skeletons: PlotSkeleton[];

  /**
   * 初始化时创建贴地`Primitive`的函数，创建后的`Primitive`会作为配置项传入`render`中
   */
  initRender?: () => PlotRenderResult;

  /**
   * 当标绘数据变化时，会触发`render`回调，返回的数据会被添加到cesium中
   */
  render?: (options: PlotRenderContext) => PlotRenderResult | Promise<PlotRenderResult>;

  private static _record = new Map<string, PlotScheme>();

  /**
   * 标绘方案缓存。
   * 每次标绘时都会将`PlotScheme.type`作为键名缓存，
   * 后续可用过`PlotScheme.getCache(type)`获取完整的`PlotScheme`配置。
   */
  static getCacheTypes(): string[] {
    return [...this._record.keys()];
  }

  /**
   * 通过`PlotScheme.type`获取缓存中的`PlotScheme`配置。
   */
  static getCache(type: string): PlotScheme | undefined {
    return PlotScheme._record.get(type);
  }

  /**
   * 缓存标绘方案。
   */
  static setCache(scheme: PlotScheme): void {
    assertError(!scheme.type, '`scheme.type` is required');
    PlotScheme._record.set(scheme.type, scheme);
  }

  /**
   * 解析传入的maybeScheme，maybeScheme可能是一个完整的PlotScheme，也可能是缓存中的`PlotScheme.type`，并返回 PlotScheme 实例。
   * 若传入的是`PlotScheme.type`字符串，并且缓存中不存在该标绘方案，则抛出错误。
   */
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
