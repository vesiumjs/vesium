import { fileURLToPath, URL } from 'node:url';
import { getPackageInfoSync } from 'local-pkg';
import { defineConfig } from 'vitepress';
import { badgeTransform } from './plugins/badge';
import { markdownDemoContainer } from './plugins/demoContainer';
import { markdownDtsContainer } from './plugins/dtsContainer';
import { generateSidebar } from './utils/generateSidebar';

const CESIUM_VERSION = (getPackageInfoSync('cesium'))!.version;

const importmap = `
<script> window.CESIUM_BASE_URL="https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VERSION}/Build/Cesium/";</script>
<script type="importmap">${
  JSON.stringify(
    {
      imports: {
        cesium: `https://cdn.jsdelivr.net/npm/cesium@${CESIUM_VERSION}/+esm`,
      },
    },
  )
}</script>`;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './',
  vite: { configFile: fileURLToPath(new URL('vite.config.ts', import.meta.url)) },
  title: 'Vesium',
  description: 'A VitePress Site',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],
  rewrites: {
    '(.*).en-US.md': '(.*).md',
    '(.*).zh-CN.md': 'zh-CN/(.*).md',
  },
  markdown: {
    config(md) {
      badgeTransform(md);
      md.use(markdownDemoContainer);
      md.use(markdownDtsContainer);
    },
  },
  locales: {
    'root': {
      link: '/',
      label: 'English',
      lang: 'en-US',
      titleTemplate: 'Elegant Vue3 Integration for Cesium',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide' },
        ],
        sidebar: generateSidebar({
          base: '/',
          filter: path => path.endsWith('.en-US.md'),
        }),
        lastUpdated: {
          text: 'Last Updated',
        },
        editLink: {
          text: 'Edit this page on GitHub',
          pattern: (payload) => {
            return `https://github.com/GeoVueJS/vesium/edit/main/packages/${payload.relativePath}`;
          },
        },
      },
    },
    'zh-CN': {
      link: '/zh-CN',
      label: '简体中文',
      lang: 'zh-CN',
      titleTemplate: 'Vue3与Cesium的优雅集成方案',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh-CN' },
          { text: '引导', link: '/zh-CN/guide' },
        ],
        sidebar: generateSidebar({
          base: '/zh-CN',
          filter: path => path.endsWith('.zh-CN.md'),
        }),
        lastUpdated: {
          text: '最后更新于',
        },
        editLink: {
          text: '在github中编辑此页',
          pattern: (payload) => {
            return `https://github.com/GeoVueJS/vesium/edit/main/packages/${payload.relativePath.replace('zh-CN/', '')}`;
          },
        },
      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GeoVueJS/vesium' },
    ],
    logo: {
      src: '/favicon.svg',
    },
  },
  transformHtml(html) {
    return html.replace('<head>', `<head>${importmap}`);
  },
});
