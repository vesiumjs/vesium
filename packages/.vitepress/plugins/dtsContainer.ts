import type MarkdownIt from 'markdown-it';
import type { MarkdownEnv } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import mdContainer from 'markdown-it-container';
import { VITEPRESS_BUILD_TYPES_PATH, VITEPRESS_PACKAGE_PATH } from '../path';

// eslint-disable-next-line regexp/no-super-linear-backtracking
const DTS_RE = /^dts\s*(.*)$/;
const TS_EXT_RE = /\.ts$/;

export function markdownDtsContainer(md: MarkdownIt) {
  mdContainer(md, 'dts', {
    validate(params) {
      return !!params.trim().match(DTS_RE);
    },
    render(tokens: any, idx: any, options: any, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1;

      if (opening) {
        const srcs = tokens[idx].info.trim().match(DTS_RE)?.[1] ?? '';
        const paths = [...new Set(srcs.split(' ').filter(src => !!src))];

        const data = paths.map((src) => {
          const realPath = path.resolve(env.realPath!, '../', src);
          const relativePath = path.relative(VITEPRESS_PACKAGE_PATH, realPath);
          const fullTypesPath = path.resolve(VITEPRESS_BUILD_TYPES_PATH, relativePath).replace(TS_EXT_RE, '.d.ts');
          const code = fs.readFileSync(fullTypesPath, 'utf-8').toString();
          return md.render(`\`\`\`typescript\n${code}\n\`\`\``);
        });

        return data.join('\n');
      }
      else {
        return '';
      }
    },
  });
}
