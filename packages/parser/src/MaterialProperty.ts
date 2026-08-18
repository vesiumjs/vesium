import type { JulianDate, MaterialProperty } from 'cesium';
import { z } from 'zod';
import { MaterialDefinitionZodSchema, MaterialGetProgram, MaterialGetPrograms } from './Material';

/**
 * `Cesium.MaterialProperty` JSON ZodSchema
 */
export function MaterialPropertyZodSchema() {
  return z.object({
    parser: z.literal('MaterialProperty'),
    value: MaterialDefinitionZodSchema(),
  });
}

export type MaterialPropertyJSON = z.infer<ReturnType<typeof MaterialPropertyZodSchema>>;

/**
 * Converts Cesium MaterialProperty into a semantic JSON representation.
 */
export function MaterialPropertyToJSON(instance?: MaterialProperty, time?: JulianDate): MaterialPropertyJSON | undefined {
  if (!instance) {
    return undefined;
  }
  const program = [...MaterialGetPrograms()].find(item => item.materialProperty?.predicate(instance));
  if (!program?.materialProperty) {
    throw new TypeError('Unsupported Cesium MaterialProperty. Register a MaterialProgram first.');
  }
  const content = program.contentSchema.parse(program.materialProperty.toContent(instance, time));
  return MaterialPropertyZodSchema().parse({
    parser: 'MaterialProperty',
    value: { type: program.type, content },
  });
}

/**
 * Converts semantic JSON into a Cesium MaterialProperty.
 */
export function MaterialPropertyFromJSON(json?: MaterialPropertyJSON): MaterialProperty | undefined {
  if (!json) {
    return undefined;
  }
  const parsed = MaterialPropertyZodSchema().parse(json);
  const program = MaterialGetProgram(parsed.value.type);
  if (!program?.materialProperty) {
    throw new TypeError(`Unsupported Cesium MaterialProperty type: ${parsed.value.type}. Register a MaterialProgram first.`);
  }
  return program.materialProperty.fromContent(program.contentSchema.parse(parsed.value.content));
}
