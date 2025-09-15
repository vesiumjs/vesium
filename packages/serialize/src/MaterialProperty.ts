import type { JulianDate, MaterialProperty } from 'cesium';
import { notNullish } from '@vueuse/core';
import { CheckerboardMaterialProperty, ColorMaterialProperty, GridMaterialProperty, ImageMaterialProperty, PolylineArrowMaterialProperty, PolylineDashMaterialProperty, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty, StripeMaterialProperty } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2FromJSON, Cartesian2ToJSON } from './Cartesian2';
import { ColorFromJSON, ColorToJSON } from './Color';

/**
 * `MaterialProperty`相关类型的序列化程序
 */
export interface MaterialPropertyProgram<T extends MaterialProperty = any> {
  programName: string;
  predicate: (materialProperty: T) => boolean;
  toJSON: (instance?: T, time?: JulianDate) => Record<string, any>;
  fromJSON: (content?: Record<string, any>) => T | undefined;
}

/**
 * @internal
 */
const _programs = new Map<string, any>();

export function MaterialPropertyGetProgram(programName: string) {
  _programs.get(programName);
}

/**
 * 设置指定程序
 */
export function MaterialPropertySetProgram(program: MaterialPropertyProgram) {
  _programs.set(program.programName, program);
}

/**
 * 删除指定的序列化程序
 */
export function MaterialPropertyRemoveProgram(programName: string) {
  _programs.delete(programName);
}

/**
 * `Cesium.MaterialProperty` JSON ZodSchema
 */
export function MaterialPropertyZodSchema() {
  return z.object({
    parser: z.literal('MaterialProperty'),
    value: z.object({
      name: z.string(),
      content: z.record(z.string(), z.any()),
    }),
  });
}

export type MaterialPropertyJSON = z.infer<ReturnType<typeof MaterialPropertyZodSchema>>;

/**
 * Convert `Cesium.MaterialProperty` instance to JSON
 */
export function MaterialPropertyToJSON(instance?: MaterialProperty): MaterialPropertyJSON | undefined {
  if (!notNullish(instance)) {
    return undefined;
  }
  const program = [..._programs.values()].find(item => item.predicate(instance));
  if (program) {
    return {
      name: program.programName,
      content: program.toJSON(instance),
    };
  };
}

/**
 * Convert JSON to `Cesium.MaterialProperty` instance
 * @param json - A JSON containing instance data
 */
export function MaterialPropertyFromJSON(json?: MaterialPropertyJSON): MaterialProperty | undefined {
  if (!notNullish(json)) {
    return undefined;
  }
  const program = [..._programs.values()].find(item => item.programName === json.value.name);
  if (program) {
    return program.fromJSON(json.value.content);
  }
}
/**
 * preset `CheckerboardMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'CheckerboardMaterialProperty',
  predicate: materialProperty => materialProperty instanceof CheckerboardMaterialProperty,
  toJSON(instance, time) {
    return {
      evenColor: ColorToJSON(toPropertyValue(instance.evenColor, time)),
      oddColor: ColorToJSON(toPropertyValue(instance.oddColor, time)),
      repeat: Cartesian2ToJSON(toPropertyValue(instance.repeat, time)),
    };
  },
  fromJSON(content) {
    return new CheckerboardMaterialProperty({
      evenColor: ColorFromJSON(content?.evenColor),
      oddColor: ColorFromJSON(content?.oddColor),
      repeat: Cartesian2FromJSON(content?.repeat),
    });
  },
});

/**
 * preset `ColorMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'ColorMaterialProperty',
  predicate: materialProperty => materialProperty instanceof ColorMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorToJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new ColorMaterialProperty(ColorFromJSON(content?.color));
  },
});

/**
 * preset `GridMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'GridMaterialProperty',
  predicate: materialProperty => materialProperty instanceof GridMaterialProperty,
  toJSON(instance, time) {
    return {
      cellAlpha: toPropertyValue(instance.cellAlpha, time),
      lineCount: Cartesian2ToJSON(toPropertyValue(instance.lineCount, time)),
      lineThickness: Cartesian2ToJSON(toPropertyValue(instance.lineThickness, time)),
      lineOffset: Cartesian2ToJSON(toPropertyValue(instance.lineOffset, time)),
      color: ColorToJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new GridMaterialProperty({
      color: ColorFromJSON(content?.color),
      cellAlpha: content?.cellAlpha,
      lineCount: Cartesian2FromJSON(content?.lineCount),
      lineThickness: Cartesian2FromJSON(content?.lineThickness),
      lineOffset: Cartesian2FromJSON(content?.lineOffset),
    });
  },
});

/**
 * preset `ImageMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'ImageMaterialProperty',
  predicate: materialProperty => materialProperty instanceof ImageMaterialProperty,
  toJSON(instance, time) {
    return {
      image: toPropertyValue(instance.image, time),
      repeat: Cartesian2ToJSON(toPropertyValue(instance.repeat, time)),
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      transparent: toPropertyValue(instance.transparent, time),
    };
  },
  fromJSON(content) {
    return new ImageMaterialProperty({
      image: content?.image,
      repeat: Cartesian2FromJSON(content?.repeat),
      color: ColorFromJSON(content?.color),
      transparent: content?.transparent,
    });
  },
});

/**
 * preset `PolylineArrowMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'PolylineArrowMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineArrowMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorToJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new PolylineArrowMaterialProperty(ColorFromJSON(content?.color));
  },
});

/**
 * preset `PolylineDashMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'PolylineDashMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineDashMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      gapColor: ColorToJSON(toPropertyValue(instance.gapColor, time)),
      dashLength: toPropertyValue(instance.dashLength, time),
      dashPattern: toPropertyValue(instance.dashPattern, time),
    };
  },
  fromJSON(content) {
    return new PolylineDashMaterialProperty({
      color: ColorFromJSON(content?.color),
      gapColor: ColorFromJSON(content?.gapColor),
      dashLength: content?.dashLength,
      dashPattern: content?.dashPattern,
    });
  },
});

/**
 * preset `PolylineGlowMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'PolylineGlowMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineGlowMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      glowPower: toPropertyValue(instance.glowPower, time),
      taperPower: toPropertyValue(instance.taperPower, time),
    };
  },
  fromJSON(content) {
    return new PolylineGlowMaterialProperty({
      color: ColorFromJSON(content?.color),
      glowPower: content?.glowPower,
      taperPower: content?.taperPower,
    });
  },
});

/**
 * preset `StripeMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'StripeMaterialProperty',
  predicate: materialProperty => materialProperty instanceof StripeMaterialProperty,
  toJSON(instance, time) {
    return {
      orientation: toPropertyValue(instance.orientation, time),
      evenColor: ColorToJSON(toPropertyValue(instance.evenColor, time)),
      oddColor: ColorToJSON(toPropertyValue(instance.oddColor, time)),
      offset: toPropertyValue(instance.offset, time),
      repeat: toPropertyValue(instance.repeat, time),
    };
  },
  fromJSON(content) {
    return new StripeMaterialProperty({
      orientation: content?.orientation,
      evenColor: ColorFromJSON(content?.evenColor),
      oddColor: ColorFromJSON(content?.oddColor),
      offset: content?.offset,
      repeat: content?.repeat,
    });
  },
});

/**
 * preset `PolylineOutlineMaterialProperty` serialize program
 */
MaterialPropertySetProgram({
  programName: 'PolylineOutlineMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineOutlineMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorToJSON(toPropertyValue(instance.color, time)),
      outlineColor: ColorToJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
    };
  },
  fromJSON(content) {
    return new PolylineOutlineMaterialProperty({
      color: ColorFromJSON(content?.color),
      outlineColor: ColorFromJSON(content?.outlineColor),
      outlineWidth: content?.outlineWidth,
    });
  },
});
