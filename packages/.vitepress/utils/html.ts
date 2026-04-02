const HTML_ESCAPE_RE = /[&<>"']/g;

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(HTML_ESCAPE_RE, char => HTML_ESCAPE_MAP[char] ?? char);
}
