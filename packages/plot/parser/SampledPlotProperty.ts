import type { Cartesian3 } from 'cesium';
import type { SampledPlotPackable, SampledPlotProperty } from '../usePlot';
import { Cartesian3FromJSON, Cartesian3ToJSON, Cartesian3ZodSchema, JulianDateFromJSON, JulianDateToJSON, JulianDateZodSchema, readPrivate } from '@vesium/parser';
import { JulianDate } from 'cesium';
import { z } from 'zod';
import { SampledPlotProperty as SampledPlotPropertyClass, SampledPlotStrategy } from '../usePlot';

const jsonValueSchema = z.json();

export type JSONValue = z.infer<typeof jsonValueSchema>;

export interface SampledPlotDerivativeCodec<D, TJSON extends JSONValue = JSONValue> {
  schema: z.ZodType<TJSON>;
  toJSON: (value: D) => TJSON;
  fromJSON: (value: TJSON) => D;
}

export interface SampledPlotPropertySerializationOptions<D, TJSON extends JSONValue = JSONValue> {
  derivative?: SampledPlotDerivativeCodec<D, TJSON>;
}

/**
 * 标绘采样数据点的 JSON 结构，与 `SampledPlotPackable` 入参对齐
 */
export function SampledPlotPackableZodSchema() {
  return z.object({
    derivative: jsonValueSchema.optional(),
    positions: z.array(Cartesian3ZodSchema()),
    time: JulianDateZodSchema().optional(),
  });
}

export type SampledPlotPackableJSON = z.infer<ReturnType<typeof SampledPlotPackableZodSchema>>;

/**
 * `SampledPlotProperty` 的 JSON 结构
 * `value` 与 `SampledPlotPropertyConstructorOptions` 入参对齐（interpolationAlgorithm 为函数，不序列化）
 */
export function SampledPlotPropertyZodSchema() {
  return z.object({
    parser: z.literal('SampledPlotProperty'),
    value: z.object({
      packables: z.array(SampledPlotPackableZodSchema()),
      strategy: z.nativeEnum(SampledPlotStrategy),
    }),
  });
}

export type SampledPlotPropertyJSON = z.infer<ReturnType<typeof SampledPlotPropertyZodSchema>>;

/**
 * Convert `SampledPlotProperty` instance to JSON
 */
export function SampledPlotPropertyToJSON<D, TJSON extends JSONValue = JSONValue>(
  instance?: SampledPlotProperty<D>,
  options?: SampledPlotPropertySerializationOptions<D, TJSON>,
): SampledPlotPropertyJSON | undefined {
  if (!instance) {
    return undefined;
  }
  z.instanceof(SampledPlotPropertyClass).parse(instance);
  // 采样数据存储于内部字段
  const times = readPrivate<JulianDate[]>(instance, '_times') ?? [];
  const sampleds = readPrivate<Cartesian3[][]>(instance, '_sampleds') ?? [];
  const derivatives = readPrivate<unknown[]>(instance, '_derivatives') ?? [];
  return SampledPlotPropertyZodSchema().parse({
    parser: 'SampledPlotProperty',
    value: {
      strategy: instance.strategy,
      // 过滤无点位的空样本（构造器 seed 的占位样本无序列化意义）；
      // JulianDate(0, 0)（未设置时间轴时的默认时间）无法被 ISO 8601 往返，同样省略
      packables: times
        .map((time, index) => ({
          time: JulianDate.equals(time, new JulianDate(0, 0)) ? undefined : JulianDateToJSON(time),
          positions: (sampleds[index] ?? []).map(item => Cartesian3ToJSON(item)!),
          derivative: serializeDerivative(derivatives[index] as D | undefined, options?.derivative),
        }))
        .filter(item => item.positions.length > 0),
    },
  });
}

/**
 * Convert JSON to `SampledPlotProperty` instance
 * @param json - A JSON containing instance data
 */
export function SampledPlotPropertyFromJSON<D = JSONValue, TJSON extends JSONValue = JSONValue>(
  json?: SampledPlotPropertyJSON,
  options?: SampledPlotPropertySerializationOptions<D, TJSON>,
): SampledPlotProperty<D> | undefined {
  if (!json) {
    return undefined;
  }
  const { strategy, packables } = SampledPlotPropertyZodSchema().parse(json).value;
  return new SampledPlotPropertyClass<D>({
    strategy,
    packables: packables.map(item => ({
      time: JulianDateFromJSON(item.time),
      positions: (item.positions ?? []).map(position => Cartesian3FromJSON(position)!),
      derivative: deserializeDerivative(item.derivative, options?.derivative),
    }) as SampledPlotPackable<D>),
  });
}

function serializeDerivative<D, TJSON extends JSONValue>(
  value: D | undefined,
  codec?: SampledPlotDerivativeCodec<D, TJSON>,
): JSONValue | undefined {
  if (value === undefined) {
    return undefined;
  }
  const serialized = codec ? codec.toJSON(value) : value;
  const parsed = jsonValueSchema.parse(serialized);
  if (codec) {
    codec.schema.parse(parsed);
  }
  return parsed;
}

function deserializeDerivative<D, TJSON extends JSONValue>(
  value: JSONValue | undefined,
  codec?: SampledPlotDerivativeCodec<D, TJSON>,
): D | JSONValue | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!codec) {
    return value;
  }
  return codec.fromJSON(codec.schema.parse(value));
}
