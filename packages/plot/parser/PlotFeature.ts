import type { PlotFeature } from '../usePlot';
import { z } from 'zod';
import { PlotFeature as PlotFeatureClass } from '../usePlot';
import { SampledPlotPropertyFromJSON, SampledPlotPropertyToJSON, SampledPlotPropertyZodSchema } from './SampledPlotProperty';

/**
 * `PlotFeature` 的 JSON 结构
 * `value` 与 `PlotFeatureConstructorOptions` 入参对齐；
 * `scheme` 只保存 type 字符串，重建时通过 `PlotScheme.resolve(type)` 从全局缓存获取（需已注册）
 */
export function PlotFeatureZodSchema() {
  return z.object({
    parser: z.literal('PlotFeature'),
    value: z.object({
      disabled: z.boolean().optional(),
      id: z.string().optional(),
      sampled: SampledPlotPropertyZodSchema(),
      scheme: z.string(),
    }),
  });
}

export type PlotFeatureJSON = z.infer<ReturnType<typeof PlotFeatureZodSchema>>;

/**
 * Convert `PlotFeature` instance to JSON
 */
export function PlotFeatureToJSON(instance?: PlotFeature): PlotFeatureJSON | undefined {
  if (!instance) {
    return undefined;
  }
  instance = z.instanceof(PlotFeatureClass).parse(instance);
  return PlotFeatureZodSchema().parse({
    parser: 'PlotFeature',
    value: {
      id: instance.id,
      scheme: instance.scheme.type,
      disabled: instance.disabled,
      sampled: SampledPlotPropertyToJSON(instance.sampled)!,
    },
  });
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
  const value = PlotFeatureZodSchema().parse(json).value;
  return new PlotFeatureClass({
    id: value.id,
    scheme: value.scheme,
    disabled: value.disabled,
    sampled: SampledPlotPropertyFromJSON(value.sampled),
  });
}
