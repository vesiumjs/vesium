import type { JulianDate } from 'cesium';

import { notNullish } from '@vueuse/core';
import { CheckerboardMaterialProperty, ColorMaterialProperty, GridMaterialProperty, ImageMaterialProperty, MaterialProperty, PolylineArrowMaterialProperty, PolylineDashMaterialProperty, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty, StripeMaterialProperty } from 'cesium';
import { toPropertyValue } from 'vesium';
import { z } from 'zod';
import { Cartesian2Parse } from './Cartesian2';
import { ColorParse } from './Color';

/**
 * `MaterialProperty`相关类型的序列化程序
 */
export interface MaterialPropertyProgram<T extends MaterialProperty = any> {
  programName: string;
  predicate: (materialProperty: T) => boolean;
  toJSON: (instance?: T, time?: JulianDate) => Record<string, any>;
  fromJSON: (content?: Record<string, any>) => T | undefined;
}

export type MaterialPropertyJSON = z.infer<typeof MaterialPropertyParse.JsonSchema>;

/**
 * Serialize a `MaterialProperty` instance to JSON and deserialize from JSON
 */
export class MaterialPropertyParse {
  private constructor() {}

  /**
   * @internal
   */
  private static _programs = new Map<string, any>();

  static getProgram(programName: string) {
    this._programs.get(programName);
  }

  /**
   * 设置指定程序
   */
  static setProgram(program: MaterialPropertyProgram) {
    this._programs.set(program.programName, program);
  }

  /**
   * 删除指定的序列化程序
   */
  static removeProgram(programName: string) {
    this._programs.delete(programName);
  }

  /**
   * zod schema for validating JSON data
   */
  static readonly JsonSchema = z.object({
    name: z.string(),
    content: z.record(z.string(), z.any()),
  });

  /**
   * zod schema for validating instance data
   */
  static readonly InstanceSchema = z.instanceof(MaterialProperty);

  /**
   * Convert an instance to a JSON
   */
  static toJSON(instance?: MaterialProperty): MaterialPropertyJSON | undefined {
    if (!notNullish(instance)) {
      return undefined;
    }
    const program = [...this._programs.values()].find(item => item.predicate(instance));
    if (program) {
      return {
        name: program.programName,
        content: program.toJSON(instance),
      };
    };
  }

  /**
   * Convert a JSON to an instance
   * @param json - A JSON containing instance data
   */
  static fromJSON(json?: MaterialPropertyJSON): MaterialProperty | undefined {
    if (!notNullish(json)) {
      return undefined;
    }
    const program = [...this._programs.values()].find(item => item.programName === json.name);
    if (program) {
      return program.fromJSON(json?.content);
    }
  }
}

/**
 * preset `CheckerboardMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'CheckerboardMaterialProperty',
  predicate: materialProperty => materialProperty instanceof CheckerboardMaterialProperty,
  toJSON(instance, time) {
    return {
      evenColor: ColorParse.toJSON(toPropertyValue(instance.evenColor, time)),
      oddColor: ColorParse.toJSON(toPropertyValue(instance.oddColor, time)),
      repeat: Cartesian2Parse.toJSON(toPropertyValue(instance.repeat, time)),
    };
  },
  fromJSON(content) {
    return new CheckerboardMaterialProperty({
      evenColor: ColorParse.fromJSON(content?.evenColor),
      oddColor: ColorParse.fromJSON(content?.oddColor),
      repeat: Cartesian2Parse.fromJSON(content?.repeat),
    });
  },
});

/**
 * preset `ColorMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'ColorMaterialProperty',
  predicate: materialProperty => materialProperty instanceof ColorMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new ColorMaterialProperty(ColorParse.fromJSON(content?.color));
  },
});

/**
 * preset `GridMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'GridMaterialProperty',
  predicate: materialProperty => materialProperty instanceof GridMaterialProperty,
  toJSON(instance, time) {
    return {
      cellAlpha: toPropertyValue(instance.cellAlpha, time),
      lineCount: Cartesian2Parse.toJSON(toPropertyValue(instance.lineCount, time)),
      lineThickness: Cartesian2Parse.toJSON(toPropertyValue(instance.lineThickness, time)),
      lineOffset: Cartesian2Parse.toJSON(toPropertyValue(instance.lineOffset, time)),
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new GridMaterialProperty({
      color: ColorParse.fromJSON(content?.color),
      cellAlpha: content?.cellAlpha,
      lineCount: Cartesian2Parse.fromJSON(content?.lineCount),
      lineThickness: Cartesian2Parse.fromJSON(content?.lineThickness),
      lineOffset: Cartesian2Parse.fromJSON(content?.lineOffset),
    });
  },
});

/**
 * preset `ImageMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'ImageMaterialProperty',
  predicate: materialProperty => materialProperty instanceof ImageMaterialProperty,
  toJSON(instance, time) {
    return {
      image: toPropertyValue(instance.image, time),
      repeat: Cartesian2Parse.toJSON(toPropertyValue(instance.repeat, time)),
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      transparent: toPropertyValue(instance.transparent, time),
    };
  },
  fromJSON(content) {
    return new ImageMaterialProperty({
      image: content?.image,
      repeat: Cartesian2Parse.fromJSON(content?.repeat),
      color: ColorParse.fromJSON(content?.color),
      transparent: content?.transparent,
    });
  },
});

/**
 * preset `PolylineArrowMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'PolylineArrowMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineArrowMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
    };
  },
  fromJSON(content) {
    return new PolylineArrowMaterialProperty(ColorParse.fromJSON(content?.color));
  },
});

/**
 * preset `PolylineDashMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'PolylineDashMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineDashMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      gapColor: ColorParse.toJSON(toPropertyValue(instance.gapColor, time)),
      dashLength: toPropertyValue(instance.dashLength, time),
      dashPattern: toPropertyValue(instance.dashPattern, time),
    };
  },
  fromJSON(content) {
    return new PolylineDashMaterialProperty({
      color: ColorParse.fromJSON(content?.color),
      gapColor: ColorParse.fromJSON(content?.gapColor),
      dashLength: content?.dashLength,
      dashPattern: content?.dashPattern,
    });
  },
});

/**
 * preset `PolylineGlowMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'PolylineGlowMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineGlowMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      glowPower: toPropertyValue(instance.glowPower, time),
      taperPower: toPropertyValue(instance.taperPower, time),
    };
  },
  fromJSON(content) {
    return new PolylineGlowMaterialProperty({
      color: ColorParse.fromJSON(content?.color),
      glowPower: content?.glowPower,
      taperPower: content?.taperPower,
    });
  },
});

/**
 * preset `StripeMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'StripeMaterialProperty',
  predicate: materialProperty => materialProperty instanceof StripeMaterialProperty,
  toJSON(instance, time) {
    return {
      orientation: toPropertyValue(instance.orientation, time),
      evenColor: ColorParse.toJSON(toPropertyValue(instance.evenColor, time)),
      oddColor: ColorParse.toJSON(toPropertyValue(instance.oddColor, time)),
      offset: toPropertyValue(instance.offset, time),
      repeat: toPropertyValue(instance.repeat, time),
    };
  },
  fromJSON(content) {
    return new StripeMaterialProperty({
      orientation: content?.orientation,
      evenColor: ColorParse.fromJSON(content?.evenColor),
      oddColor: ColorParse.fromJSON(content?.oddColor),
      offset: content?.offset,
      repeat: content?.repeat,
    });
  },
});

/**
 * preset `PolylineOutlineMaterialProperty` serialize program
 */
MaterialPropertyParse.setProgram({
  programName: 'PolylineOutlineMaterialProperty',
  predicate: materialProperty => materialProperty instanceof PolylineOutlineMaterialProperty,
  toJSON(instance, time) {
    return {
      color: ColorParse.toJSON(toPropertyValue(instance.color, time)),
      outlineColor: ColorParse.toJSON(toPropertyValue(instance.outlineColor, time)),
      outlineWidth: toPropertyValue(instance.outlineWidth, time),
    };
  },
  fromJSON(content) {
    return new PolylineOutlineMaterialProperty({
      color: ColorParse.fromJSON(content?.color),
      outlineColor: ColorParse.fromJSON(content?.outlineColor),
      outlineWidth: content?.outlineWidth,
    });
  },
});
