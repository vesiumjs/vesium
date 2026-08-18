import type { Material as CesiumMaterial, MaterialProperty as CesiumMaterialProperty, JulianDate } from 'cesium';
import { CheckerboardMaterialProperty, ColorMaterialProperty, GridMaterialProperty, ImageMaterialProperty, Material, PolylineArrowMaterialProperty, PolylineDashMaterialProperty, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty, StripeMaterialProperty, StripeOrientation } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON, Cartesian2ZodSchema } from './Cartesian2';
import { ColorFromJSON, ColorToJSON, ColorZodSchema } from './Color';
import { imageToURL } from './image';

export interface MaterialAdapter<TContent> {
  predicate: (material: CesiumMaterial) => boolean;
  toContent: (material: CesiumMaterial) => TContent;
  fromContent: (content: TContent) => CesiumMaterial;
}

export interface MaterialPropertyAdapter<TContent> {
  predicate: (materialProperty: CesiumMaterialProperty) => boolean;
  toContent: (materialProperty: CesiumMaterialProperty, time?: JulianDate) => TContent;
  fromContent: (content: TContent) => CesiumMaterialProperty;
}

/**
 * A semantic material serialization program. It deliberately excludes Fabric and shader source.
 */
export interface MaterialProgram<TContent> {
  type: string;
  contentSchema: z.ZodType<TContent>;
  material?: MaterialAdapter<TContent>;
  materialProperty?: MaterialPropertyAdapter<TContent>;
}

const programs = new Map<string, MaterialProgram<any>>();

export function MaterialGetProgram(type: string) {
  return programs.get(type);
}

export function MaterialGetPrograms() {
  return programs.values();
}

export function MaterialSetProgram<TContent>(program: MaterialProgram<TContent>) {
  programs.set(program.type, program);
}

export function MaterialRemoveProgram(type: string) {
  programs.delete(type);
}

export function MaterialDefinitionZodSchema() {
  return z.object({
    type: z.string(),
    content: z.unknown(),
  });
}

export type MaterialDefinitionJSON = z.infer<ReturnType<typeof MaterialDefinitionZodSchema>>;

export function MaterialZodSchema() {
  return z.object({
    parser: z.literal('Material'),
    value: MaterialDefinitionZodSchema(),
  });
}

export type MaterialJSON = z.infer<ReturnType<typeof MaterialZodSchema>>;

function getProgramForMaterial(instance: CesiumMaterial) {
  return [...programs.values()].find(program => program.material?.predicate(instance));
}

function parseContent<TContent>(program: MaterialProgram<TContent>, content: unknown) {
  return program.contentSchema.parse(content);
}

/**
 * Converts a Cesium Material into a semantic JSON representation.
 */
export function MaterialToJSON(instance?: CesiumMaterial): MaterialJSON | undefined {
  if (!instance) {
    return undefined;
  }
  z.instanceof(Material).parse(instance);
  const program = getProgramForMaterial(instance);
  if (!program?.material) {
    throw new TypeError(`Unsupported Cesium Material type: ${instance.type}. Register a MaterialProgram first.`);
  }
  const content = parseContent(program, program.material.toContent(instance));
  return MaterialZodSchema().parse({
    parser: 'Material',
    value: { type: program.type, content },
  });
}

/**
 * Converts semantic JSON into a Cesium Material.
 */
export function MaterialFromJSON(json?: MaterialJSON): CesiumMaterial | undefined {
  if (!json) {
    return undefined;
  }
  const parsed = MaterialZodSchema().parse(json);
  const program = MaterialGetProgram(parsed.value.type);
  if (!program?.material) {
    throw new TypeError(`Unsupported Cesium Material type: ${parsed.value.type}. Register a MaterialProgram first.`);
  }
  return program.material.fromContent(parseContent(program, parsed.value.content));
}

const checkerboardSchema = z.object({
  evenColor: ColorZodSchema().optional(),
  oddColor: ColorZodSchema().optional(),
  repeat: Cartesian2ZodSchema().optional(),
});

MaterialSetProgram({
  type: Material.CheckerboardType,
  contentSchema: checkerboardSchema,
  material: {
    predicate: material => material.type === Material.CheckerboardType,
    toContent: material => ({
      evenColor: ColorToJSON(material.uniforms.lightColor),
      oddColor: ColorToJSON(material.uniforms.darkColor),
      repeat: Cartesian2ToJSON(material.uniforms.repeat),
    }),
    fromContent: content => Material.fromType(Material.CheckerboardType, {
      lightColor: ColorFromJSON(content.evenColor),
      darkColor: ColorFromJSON(content.oddColor),
      repeat: Cartesian2FromJSON(content.repeat),
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof CheckerboardMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as CheckerboardMaterialProperty;
      return {
        evenColor: ColorToJSON(toPropertyValue(instance.evenColor, time)),
        oddColor: ColorToJSON(toPropertyValue(instance.oddColor, time)),
        repeat: Cartesian2ToJSON(toPropertyValue(instance.repeat, time)),
      };
    },
    fromContent: content => new CheckerboardMaterialProperty({
      evenColor: ColorFromJSON(content.evenColor),
      oddColor: ColorFromJSON(content.oddColor),
      repeat: Cartesian2FromJSON(content.repeat),
    }),
  },
});

const colorSchema = z.object({
  color: ColorZodSchema().optional(),
});

MaterialSetProgram({
  type: Material.ColorType,
  contentSchema: colorSchema,
  material: {
    predicate: material => material.type === Material.ColorType,
    toContent: material => ({ color: ColorToJSON(material.uniforms.color) }),
    fromContent: content => Material.fromType(Material.ColorType, { color: ColorFromJSON(content.color) }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof ColorMaterialProperty,
    toContent: (materialProperty, time) => ({
      color: ColorToJSON(toPropertyValue((materialProperty as ColorMaterialProperty).color, time)),
    }),
    fromContent: content => new ColorMaterialProperty(ColorFromJSON(content.color)),
  },
});

const gridSchema = z.object({
  color: ColorZodSchema().optional(),
  cellAlpha: z.number().optional(),
  lineCount: Cartesian2ZodSchema().optional(),
  lineThickness: Cartesian2ZodSchema().optional(),
  lineOffset: Cartesian2ZodSchema().optional(),
});

MaterialSetProgram({
  type: Material.GridType,
  contentSchema: gridSchema,
  material: {
    predicate: material => material.type === Material.GridType,
    toContent: material => ({
      color: ColorToJSON(material.uniforms.color),
      cellAlpha: material.uniforms.cellAlpha,
      lineCount: Cartesian2ToJSON(material.uniforms.lineCount),
      lineThickness: Cartesian2ToJSON(material.uniforms.lineThickness),
      lineOffset: Cartesian2ToJSON(material.uniforms.lineOffset),
    }),
    fromContent: content => Material.fromType(Material.GridType, {
      color: ColorFromJSON(content.color),
      cellAlpha: content.cellAlpha,
      lineCount: Cartesian2FromJSON(content.lineCount),
      lineThickness: Cartesian2FromJSON(content.lineThickness),
      lineOffset: Cartesian2FromJSON(content.lineOffset),
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof GridMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as GridMaterialProperty;
      return {
        color: ColorToJSON(toPropertyValue(instance.color, time)),
        cellAlpha: toPropertyValue(instance.cellAlpha, time),
        lineCount: Cartesian2ToJSON(toPropertyValue(instance.lineCount, time)),
        lineThickness: Cartesian2ToJSON(toPropertyValue(instance.lineThickness, time)),
        lineOffset: Cartesian2ToJSON(toPropertyValue(instance.lineOffset, time)),
      };
    },
    fromContent: content => new GridMaterialProperty({
      color: ColorFromJSON(content.color),
      cellAlpha: content.cellAlpha,
      lineCount: Cartesian2FromJSON(content.lineCount),
      lineThickness: Cartesian2FromJSON(content.lineThickness),
      lineOffset: Cartesian2FromJSON(content.lineOffset),
    }),
  },
});

const imageSchema = z.object({
  image: z.string().optional(),
  repeat: Cartesian2ZodSchema().optional(),
  color: ColorZodSchema().optional(),
  transparent: z.boolean().optional(),
});

MaterialSetProgram({
  type: Material.ImageType,
  contentSchema: imageSchema,
  material: {
    predicate: material => material.type === Material.ImageType,
    toContent: material => ({
      image: imageToURL(material.uniforms.image),
      repeat: Cartesian2ToJSON(material.uniforms.repeat),
      color: ColorToJSON(material.uniforms.color),
    }),
    fromContent: content => Material.fromType(Material.ImageType, {
      image: content.image,
      repeat: Cartesian2FromJSON(content.repeat),
      color: ColorFromJSON(content.color),
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof ImageMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as ImageMaterialProperty;
      return {
        image: imageToURL(toPropertyValue(instance.image, time)),
        repeat: Cartesian2ToJSON(toPropertyValue(instance.repeat, time)),
        color: ColorToJSON(toPropertyValue(instance.color, time)),
        transparent: toPropertyValue(instance.transparent, time),
      };
    },
    fromContent: content => new ImageMaterialProperty({
      image: content.image,
      repeat: Cartesian2FromJSON(content.repeat),
      color: ColorFromJSON(content.color),
      transparent: content.transparent,
    }),
  },
});

const polylineArrowSchema = z.object({
  color: ColorZodSchema().optional(),
});

MaterialSetProgram({
  type: Material.PolylineArrowType,
  contentSchema: polylineArrowSchema,
  material: {
    predicate: material => material.type === Material.PolylineArrowType,
    toContent: material => ({ color: ColorToJSON(material.uniforms.color) }),
    fromContent: content => Material.fromType(Material.PolylineArrowType, { color: ColorFromJSON(content.color) }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof PolylineArrowMaterialProperty,
    toContent: (materialProperty, time) => ({
      color: ColorToJSON(toPropertyValue((materialProperty as PolylineArrowMaterialProperty).color, time)),
    }),
    fromContent: content => new PolylineArrowMaterialProperty(ColorFromJSON(content.color)),
  },
});

const polylineDashSchema = z.object({
  color: ColorZodSchema().optional(),
  gapColor: ColorZodSchema().optional(),
  dashLength: z.number().optional(),
  dashPattern: z.number().optional(),
});

MaterialSetProgram({
  type: Material.PolylineDashType,
  contentSchema: polylineDashSchema,
  material: {
    predicate: material => material.type === Material.PolylineDashType,
    toContent: material => ({
      color: ColorToJSON(material.uniforms.color),
      gapColor: ColorToJSON(material.uniforms.gapColor),
      dashLength: material.uniforms.dashLength,
      dashPattern: material.uniforms.dashPattern,
    }),
    fromContent: content => Material.fromType(Material.PolylineDashType, {
      color: ColorFromJSON(content.color),
      gapColor: ColorFromJSON(content.gapColor),
      dashLength: content.dashLength,
      dashPattern: content.dashPattern,
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof PolylineDashMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as PolylineDashMaterialProperty;
      return {
        color: ColorToJSON(toPropertyValue(instance.color, time)),
        gapColor: ColorToJSON(toPropertyValue(instance.gapColor, time)),
        dashLength: toPropertyValue(instance.dashLength, time),
        dashPattern: toPropertyValue(instance.dashPattern, time),
      };
    },
    fromContent: content => new PolylineDashMaterialProperty({
      color: ColorFromJSON(content.color),
      gapColor: ColorFromJSON(content.gapColor),
      dashLength: content.dashLength,
      dashPattern: content.dashPattern,
    }),
  },
});

const polylineGlowSchema = z.object({
  color: ColorZodSchema().optional(),
  glowPower: z.number().optional(),
  taperPower: z.number().optional(),
});

MaterialSetProgram({
  type: Material.PolylineGlowType,
  contentSchema: polylineGlowSchema,
  material: {
    predicate: material => material.type === Material.PolylineGlowType,
    toContent: material => ({
      color: ColorToJSON(material.uniforms.color),
      glowPower: material.uniforms.glowPower,
      taperPower: material.uniforms.taperPower,
    }),
    fromContent: content => Material.fromType(Material.PolylineGlowType, {
      color: ColorFromJSON(content.color),
      glowPower: content.glowPower,
      taperPower: content.taperPower,
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof PolylineGlowMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as PolylineGlowMaterialProperty;
      return {
        color: ColorToJSON(toPropertyValue(instance.color, time)),
        glowPower: toPropertyValue(instance.glowPower, time),
        taperPower: toPropertyValue(instance.taperPower, time),
      };
    },
    fromContent: content => new PolylineGlowMaterialProperty({
      color: ColorFromJSON(content.color),
      glowPower: content.glowPower,
      taperPower: content.taperPower,
    }),
  },
});

const polylineOutlineSchema = z.object({
  color: ColorZodSchema().optional(),
  outlineColor: ColorZodSchema().optional(),
  outlineWidth: z.number().optional(),
});

MaterialSetProgram({
  type: Material.PolylineOutlineType,
  contentSchema: polylineOutlineSchema,
  material: {
    predicate: material => material.type === Material.PolylineOutlineType,
    toContent: material => ({
      color: ColorToJSON(material.uniforms.color),
      outlineColor: ColorToJSON(material.uniforms.outlineColor),
      outlineWidth: material.uniforms.outlineWidth,
    }),
    fromContent: content => Material.fromType(Material.PolylineOutlineType, {
      color: ColorFromJSON(content.color),
      outlineColor: ColorFromJSON(content.outlineColor),
      outlineWidth: content.outlineWidth,
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof PolylineOutlineMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as PolylineOutlineMaterialProperty;
      return {
        color: ColorToJSON(toPropertyValue(instance.color, time)),
        outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
        outlineWidth: toPropertyValue(instance.outlineWidth, time),
      };
    },
    fromContent: content => new PolylineOutlineMaterialProperty({
      color: ColorFromJSON(content.color),
      outlineColor: ColorFromJSON(content.outlineColor),
      outlineWidth: content.outlineWidth,
    }),
  },
});

const stripeSchema = z.object({
  horizontal: z.boolean().optional(),
  evenColor: ColorZodSchema().optional(),
  oddColor: ColorZodSchema().optional(),
  offset: z.number().optional(),
  repeat: z.number().optional(),
});

MaterialSetProgram({
  type: Material.StripeType,
  contentSchema: stripeSchema,
  material: {
    predicate: material => material.type === Material.StripeType,
    toContent: material => ({
      horizontal: material.uniforms.horizontal,
      evenColor: ColorToJSON(material.uniforms.evenColor),
      oddColor: ColorToJSON(material.uniforms.oddColor),
      offset: material.uniforms.offset,
      repeat: material.uniforms.repeat,
    }),
    fromContent: content => Material.fromType(Material.StripeType, {
      horizontal: content.horizontal,
      evenColor: ColorFromJSON(content.evenColor),
      oddColor: ColorFromJSON(content.oddColor),
      offset: content.offset,
      repeat: content.repeat,
    }),
  },
  materialProperty: {
    predicate: materialProperty => materialProperty instanceof StripeMaterialProperty,
    toContent: (materialProperty, time) => {
      const instance = materialProperty as StripeMaterialProperty;
      return {
        horizontal: toPropertyValue(instance.orientation, time) !== StripeOrientation.VERTICAL,
        evenColor: ColorToJSON(toPropertyValue(instance.evenColor, time)),
        oddColor: ColorToJSON(toPropertyValue(instance.oddColor, time)),
        offset: toPropertyValue(instance.offset, time),
        repeat: toPropertyValue(instance.repeat, time),
      };
    },
    fromContent: content => new StripeMaterialProperty({
      orientation: content.horizontal === false ? StripeOrientation.VERTICAL : StripeOrientation.HORIZONTAL,
      evenColor: ColorFromJSON(content.evenColor),
      oddColor: ColorFromJSON(content.oddColor),
      offset: content.offset,
      repeat: content.repeat,
    }),
  },
});
