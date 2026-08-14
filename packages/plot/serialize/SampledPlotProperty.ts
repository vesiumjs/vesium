import type { Cartesian3JSON, JulianDateJSON } from '@vesium/parser';
import type { Cartesian3 } from 'cesium';
import type { SampledPlotPackable, SampledPlotProperty } from '../usePlot';
import { Cartesian3FromJSON, Cartesian3ToJSON, JulianDateFromJSON, JulianDateToJSON, readPrivate } from '@vesium/parser';
import { JulianDate } from 'cesium';
import { SampledPlotProperty as SampledPlotPropertyClass, SampledPlotStrategy } from '../usePlot';

/**
 * 标绘采样数据点的 JSON 结构，与 `SampledPlotPackable` 入参对齐
 */
export interface SampledPlotPackableJSON {
  time?: JulianDateJSON;
  positions: Cartesian3JSON[];
  derivative?: any;
}

/**
 * `SampledPlotProperty` 的 JSON 结构
 * `value` 与 `SampledPlotPropertyConstructorOptions` 入参对齐（interpolationAlgorithm 为函数，不序列化）
 */
export interface SampledPlotPropertyJSON {
  parser: 'SampledPlotProperty';
  value: {
    strategy: SampledPlotStrategy;
    packables: SampledPlotPackableJSON[];
  };
}

/**
 * Convert `SampledPlotProperty` instance to JSON
 */
export function SampledPlotPropertyToJSON<D>(instance?: SampledPlotProperty<D>): SampledPlotPropertyJSON | undefined {
  if (!instance) {
    return undefined;
  }
  // 采样数据存储于内部字段
  const times = readPrivate<JulianDate[]>(instance, '_times') ?? [];
  const sampleds = readPrivate<Cartesian3[][]>(instance, '_sampleds') ?? [];
  const derivatives = readPrivate<unknown[]>(instance, '_derivatives') ?? [];
  return {
    parser: 'SampledPlotProperty',
    value: {
      strategy: instance.strategy,
      // 过滤无点位的空样本（构造器 seed 的占位样本无序列化意义）；
      // JulianDate(0, 0)（未设置时间轴时的默认时间）无法被 ISO 8601 往返，同样省略
      packables: times
        .map((time, index) => ({
          time: JulianDate.equals(time, new JulianDate(0, 0)) ? undefined : JulianDateToJSON(time),
          positions: (sampleds[index] ?? []).map(item => Cartesian3ToJSON(item)!),
          derivative: derivatives[index],
        }))
        .filter(item => item.positions.length > 0),
    },
  };
}

/**
 * Convert JSON to `SampledPlotProperty` instance
 * @param json - A JSON containing instance data
 */
export function SampledPlotPropertyFromJSON(json?: SampledPlotPropertyJSON): SampledPlotProperty | undefined {
  if (!json) {
    return undefined;
  }
  const { strategy, packables } = json.value;
  return new SampledPlotPropertyClass({
    strategy: strategy ?? SampledPlotStrategy.NEAR,
    packables: packables.map(item => ({
      time: JulianDateFromJSON(item.time),
      positions: (item.positions ?? []).map(position => Cartesian3FromJSON(position)!),
      derivative: item.derivative,
    }) as SampledPlotPackable),
  });
}
