import type { MarkdownEnv } from 'vitepress';
import path from 'node:path';
import mdContainer from 'markdown-it-container';
import { VITEPRESS_PACKAGE_PATH } from '../path.ts';
import { getDtsForSource } from '../utils/generateTypes.ts';

// eslint-disable-next-line regexp/no-super-linear-backtracking
const DTS_RE = /^dts\s*(.*)$/;

type MarkdownIt = Parameters<typeof mdContainer>[0];

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
          const realPath = path.resolve(env.filePath ?? env.realPath ?? '', '../', src);
          const relativePath = path.relative(VITEPRESS_PACKAGE_PATH, realPath);
          // Generated in-process from the current sources — always up to date in dev and build.
          const code = getDtsForSource(realPath);
          if (code === undefined) {
            return md.render(`> \`${relativePath}\` type definitions not found.`);
          }
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
