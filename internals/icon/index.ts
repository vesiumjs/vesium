import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import * as svgo from 'svgo';

const COLOR_RE = /#[\da-f]{3,8}/gi;
const SVG_TAG_RE = /^<svg /;

export interface SvgTransformOptions {
  /**
   * 若图标为多色图标，是否启用多css颜色变量注入
   * @default true
   */
  multiColor?: boolean;

  /**
   * css颜色变量注入的前缀，仅在multiColor===true时生效
   * 将生成 --icon-${varPrefix}-color-${index}
   * @default custom
   */
  varPrefix?: string;
}

/**
 * SVG图标转换工具类
 * @param svg
 * @param options
 */
export function svgTransform(svg: string, options?: SvgTransformOptions): string {
  const varPrefix = options?.varPrefix ?? 'custom';
  const multiColor = options?.multiColor ?? true;

  svg = svgo.optimize(svg, {
    plugins: [
      'removeDimensions',
      'convertColors',
      'cleanupIds',
      'reusePaths',
      'convertStyleToAttrs',
    ],
  }).data;
  const colors = [...new Set((svg.match(COLOR_RE) ?? []).map(color => color.toUpperCase()))];
  if (colors.length <= 1) {
    const color = colors[0];
    if (color) {
      svg = svg.replace(color, 'currentColor');
    }
    svg = svg.replace(SVG_TAG_RE, '<svg fill="currentColor" ');
  }

  if (multiColor && colors.length > 1) {
    // 进行排序，确保接近一致的不同svg之间的变量索引注入保持一致
    const colorIndexes = new Map([...colors].sort().map((color, index) => [color, index] as const));
    svg = svg.replace(COLOR_RE, (match) => {
      const color = match.toUpperCase();
      const index = colorIndexes.get(color);
      if (index === undefined) {
        return match;
      }
      return `var(--icon-${varPrefix}-color-${index},${match})`;
    });
  }
  return svg;
}

/**
 * unocss/unplugin-icons自定义icon工具类
 * @param dir
 * @param options
 */
export function generateIconCollection(dir: string, options?: SvgTransformOptions) {
  return FileSystemIconLoader(dir, svg => svgTransform(svg, options));
}
