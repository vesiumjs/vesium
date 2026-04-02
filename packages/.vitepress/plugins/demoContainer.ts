import type MarkdownIt from 'markdown-it';
import type { MarkdownEnv } from 'vitepress';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import mdContainer from 'markdown-it-container';
import { escapeHtml } from '../utils/html';

// eslint-disable-next-line regexp/no-super-linear-backtracking
const DEMO_RE = /^demo\s*(.*)$/;
const SRC_RE = /src=['"](.*?)['"]/;
const SRC_ATTR_RE = /\s*src=(['"])(.*?)\1/;

export function markdownDemoContainer(md: MarkdownIt) {
  mdContainer(md, 'demo', {
    validate(params) {
      return !!params.trim().match(DEMO_RE);
    },
    render(tokens: any, idx: any, options: any, env: MarkdownEnv) {
      const opening = tokens[idx].nesting === 1;

      if (opening) {
        const props = tokens[idx].info.trim().match(DEMO_RE)?.[1] ?? '';
        const attributes = props.replace(SRC_ATTR_RE, '').trim();

        const src = props.trim().match(SRC_RE)?.[1];
        if (!src) {
          throw new Error(`demo src is not found in ${env.realPath}`);
        }
        const demoRealPath = path.resolve(env.realPath!, '../', src);
        const demoRelativePath = path.relative(process.cwd(), demoRealPath);
        const code = fs.readFileSync(demoRealPath, 'utf-8').toString();
        const codeHtml = md.render(`\`\`\`${path.extname(demoRealPath).slice(1)}\n${code}\n\`\`\``);
        const demoImport = escapeHtml(JSON.stringify(src));

        return `
<demo-container
${attributes ? `${attributes}\n` : ''}
:async-demo="() => import(${demoImport})"
path="${escapeHtml(demoRelativePath)}"
code="${escapeHtml(encodeURIComponent(code))}"
code-html="${escapeHtml(encodeURIComponent(codeHtml))}"
>
`;
      }
      else {
        return '</demo-container>\n';
      }
    },
  });
}
