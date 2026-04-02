import type { FilterPattern } from 'vite';
import type { DefaultTheme } from 'vitepress';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import FastGlob from 'fast-glob';
import matter from 'gray-matter';
import { createFilter, normalizePath } from 'vite';
import { VITEPRESS_PACKAGE_PATH } from '../path';
import { escapeHtml } from './html';

const MARKDOWN_EXT_RE = /\.md$/;
const GENERIC_EXT_RE = /(\.(\w|-)*)$/;
const INDEX_SUFFIX_RE = /(\/?index)+$/;
const TRAILING_SLASH_RE = /\/$/;

export interface GenerateSidebarOptions {
  base: string;
  include?: FilterPattern;
  exclude?: FilterPattern;
  filter?: (path: string) => boolean;
}

interface TreeItem {
  isRoot?: boolean;
  file?: string;
  isGroup?: boolean;
  text?: string;
  link: string;
  parent?: string;
  sort: number;
}

function getParentLink(link: string): string | undefined {
  const parentIndex = link.lastIndexOf('/');
  return parentIndex === -1 ? undefined : link.slice(0, parentIndex);
}

function mergeTreeItem(current: TreeItem, next: TreeItem): TreeItem {
  if (next.file) {
    return {
      ...current,
      ...next,
      parent: next.parent ?? current.parent,
      isRoot: next.isRoot ?? current.isRoot,
      isGroup: next.isGroup ?? current.isGroup,
    };
  }

  return {
    ...current,
    text: current.text ?? next.text,
    parent: current.parent ?? next.parent,
    isRoot: current.isRoot ?? next.isRoot,
    isGroup: current.isGroup ?? next.isGroup,
    sort: Math.min(current.sort, next.sort),
  };
}

function ensureTreeItem(flatList: TreeItem[], next: TreeItem) {
  const exist = flatList.find(item => item.link === next.link);
  if (exist) {
    Object.assign(exist, mergeTreeItem(exist, next));
    return;
  }

  flatList.push(next);
}

function toSidebarItem(
  flatList: TreeItem[],
  item: TreeItem,
  base: string,
): (DefaultTheme.SidebarItem & { isRoot?: boolean; sort: number }) | null {
  const itemLink = item.link.replace(TRAILING_SLASH_RE, '');
  const children = flatList
    .filter(e => e.parent === itemLink)
    .map(child => toSidebarItem(flatList, child, base))
    .filter((child): child is DefaultTheme.SidebarItem & { isRoot?: boolean; sort: number } => child !== null);

  if (!item.file && children.length === 0) {
    return null;
  }

  return {
    base: item.isRoot ? base : undefined,
    text: item.text || 'index',
    link: item.file ? item.link : undefined,
    items: children.length > 0 ? children : undefined,
    // Keep every group expanded by default so the sidebar reads as a directory tree.
    collapsed: children.length > 0 ? false : undefined,
    isRoot: item.isRoot,
    sort: item.sort,
  };
}

export function generateSidebar(options: GenerateSidebarOptions): DefaultTheme.SidebarItem[] {
  let base = options.base || '/';
  if (!base.endsWith('/')) {
    base += '/';
  }

  // 使用 FastGlob 同步查找所有 Markdown 文件
  const data = FastGlob.sync(['**/*.md', '*.md'], {
    cwd: VITEPRESS_PACKAGE_PATH,
    ignore: ['**/node_modules/**', '**/dist/**', '.vitepress'],
  });

  // 创建过滤器以包含或排除特定文件
  const globFilter = createFilter(options.include, options.exclude);
  const filter = (path: string) => {
    return globFilter(path) && (options.filter?.(path) ?? true);
  };

  // 过滤并规范化文件路径
  const filePaths = data.filter(filter).map(filePath => normalizePath(filePath));

  let flatList: TreeItem[] = [];

  // 遍历每个文件路径以生成侧边栏项
  filePaths.forEach((filePath) => {
    const file = path.resolve(VITEPRESS_PACKAGE_PATH, filePath);
    const m = matter(readFileSync(file).toString());
    if (m.data.layout) {
      return;
    }

    // 生成链接、文本和其他属性
    const link = filePath
      .replace(MARKDOWN_EXT_RE, '')
      .replace(GENERIC_EXT_RE, '')
      .replace(INDEX_SUFFIX_RE, '');
    let text = escapeHtml(String(m.data.text || link.split('/').pop() || ''));
    m.data?.tip && (text += `<Badge type="tip" text="${escapeHtml(String(m.data.tip))}" />`);
    m.data?.subText && (text += `<span class="sub-text">${escapeHtml(String(m.data.subText))}</span>`);
    const item: TreeItem = {
      file,
      isGroup: false,
      text,
      link: `${link}/`,
      parent: getParentLink(link),
      isRoot: !link.includes('/'),
      sort: (m.data?.sort ?? Number.MAX_SAFE_INTEGER),
    };
    ensureTreeItem(flatList, item);

    // 处理父节点
    const parentNodes = link.split('/');
    parentNodes.pop();
    while (parentNodes.length) {
      const link = parentNodes.join('/');
      const item: TreeItem = {
        text: link.split('/').pop(),
        isGroup: true,
        parent: getParentLink(link),
        isRoot: !link.includes('/'),
        sort: Number.MAX_SAFE_INTEGER,
        link,
      };
      ensureTreeItem(flatList, item);
      parentNodes.pop();
    }
  });

  // 按排序字段对 flatList 进行排序
  flatList = flatList.sort((a, b) => a.sort - b.sort);

  // 生成侧边栏
  const sidebars = flatList
    .map(item => toSidebarItem(flatList, item, base))
    .filter((item): item is DefaultTheme.SidebarItem & { isRoot?: boolean; sort: number } => item !== null);
  return sidebars.filter(item => item.isRoot);
}
