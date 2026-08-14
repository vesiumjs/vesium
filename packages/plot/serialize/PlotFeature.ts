import type { PlotFeature } from '../usePlot';
import type { SampledPlotPropertyJSON } from './SampledPlotProperty';
import { PlotFeature as PlotFeatureClass } from '../usePlot';
import { SampledPlotPropertyFromJSON, SampledPlotPropertyToJSON } from './SampledPlotProperty';

/**
 * `PlotFeature` 的 JSON 结构
 * `value` 与 `PlotFeatureConstructorOptions` 入参对齐；
 * `scheme` 只保存 type 字符串，重建时通过 `PlotScheme.resolve(type)` 从全局缓存获取（需已注册）
 */
export interface PlotFeatureJSON {
  parser: 'PlotFeature';
  value: {
    id?: string;
    scheme: string;
    disabled?: boolean;
    sampled: SampledPlotPropertyJSON;
  };
}

/**
 * Convert `PlotFeature` instance to JSON
 */
export function PlotFeatureToJSON(instance?: PlotFeature): PlotFeatureJSON | undefined {
  if (!instance) {
    return undefined;
  }
  return {
    parser: 'PlotFeature',
    value: {
      id: instance.id,
      scheme: instance.scheme.type,
      disabled: instance.disabled,
      sampled: SampledPlotPropertyToJSON(instance.sampled)!,
    },
  };
}

/**
 * Convert JSON to `PlotFeature` instance
 * 恢复前提：`PlotFeatureJSON.value.scheme` 对应的标绘方案已通过 `PlotScheme.setCache` 注册
 * （内置方案在定义处惰性注册，导入对应模块即登记构造选项，首次使用时才实例化并缓存，
 * 如 `import '@vesium/plot/scheme/Point'`）
 * @param json - A JSON containing instance data
 */
export function PlotFeatureFromJSON(json?: PlotFeatureJSON): PlotFeature | undefined {
  if (!json) {
    return undefined;
  }
  return new PlotFeatureClass({
    id: json.value.id,
    scheme: json.value.scheme,
    disabled: json.value.disabled,
    sampled: SampledPlotPropertyFromJSON(json.value.sampled),
  });
}
