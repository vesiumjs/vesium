import type { MarkdownRenderer } from 'vitepress';

const TAG_RE = /^\^\(([^)]*)\)/;

export function badgeTransform(md: MarkdownRenderer): void {
  md.inline.ruler.before('emphasis', 'badge', (state, silent) => {
    const str = state.src.slice(state.pos, state.posMax);

    if (!TAG_RE.test(str))
      return false;
    if (silent)
      return true;

    const result = str.match(TAG_RE);

    if (!result)
      return false;

    const token = state.push('html_inline', '', 0);
    const value = result[1].trim();
    /**
     * Add styles for some special tags
     * vitepress/styles/content/tag-content.scss
     */
    const tagClass = ['beta', 'deprecated', 'a11y', 'required'].includes(value)
      ? value
      : '';
    token.content = `<span class="vp-tag ${tagClass}">${value}</span>`;
    token.level = state.level;
    state.pos += result[0].length;

    return true;
  });
}
