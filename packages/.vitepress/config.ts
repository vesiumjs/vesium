import { fileURLToPath, URL } from 'node:url';
import { withPwa } from '@vite-pwa/vitepress';
import { getPackageInfoSync } from 'local-pkg';
import { defineConfig } from 'vitepress';
import { badgeTransform } from './plugins/badge';
import { markdownDemoContainer } from './plugins/demoContainer';
import { markdownDtsContainer } from './plugins/dtsContainer';
import { generateSidebar } from './utils/generateSidebar';

const CESIUM_VERSION = (getPackageInfoSync('cesium'))!.version;

let transformHtml = `
<script> window.CESIUM_BASE_URL="https://esm.sh/cesium@${CESIUM_VERSION}/Build/Cesium/";</script>
<script type="importmap">${
  JSON.stringify(
    {
      imports: {
        cesium: `https://esm.sh/cesium@${CESIUM_VERSION}/Source/Cesium.js?standalone`,
      },
    },
  )
}</script>`;

// baidu统计
transformHtml += `<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?11594e19495496996d5bf28bf9e89220";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
`;

// https://vitepress.dev/reference/site-config
export default withPwa(defineConfig({
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'script-defer',
    includeAssets: ['favicon.svg'],
    manifest: {
      name: 'Vesium',
      short_name: 'Vesium',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/favicon.svg',
          sizes: '64x64',
          type: 'image/svg',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
    },

    experimental: {
      includeAllowlist: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      resolveTempFolder: () => fileURLToPath(new URL('./dev-dist', import.meta.url)),
    },
  },
  srcDir: './',
  vite: { configFile: fileURLToPath(new URL('vite.config.ts', import.meta.url)) },
  title: 'Vesium',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],
  rewrites: {
    '(.*).en.md': '(.*).md',
    '(.*).zh.md': 'zh/(.*).md',
  },
  markdown: {
    config(md) {
      badgeTransform(md);
      md.use(markdownDemoContainer);
      md.use(markdownDtsContainer);
    },
  },
  locales: {
    root: {
      link: '/',
      label: 'English',
      lang: 'en',
      titleTemplate: 'Vesium',
      title: 'A CesiumJS toolkit based on Vue composition',
      description: 'Aimed at making the use of CesiumJS in Vue simpler and smoother',
      themeConfig: {
        siteTitle: 'Vesium',
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Start', link: '/start' },
        ],
        sidebar: generateSidebar({
          base: '/',
          filter: path => path.endsWith('.en.md'),
        }),
        lastUpdated: {
          text: 'Last Updated',
        },
        editLink: {
          text: 'Suggest changes to this page',
          pattern: (payload) => {
            return `https://github.com/vesiumjs/vesium/blob/main/packages/${payload.relativePath.replace(/\.md$/, '.en.md')}`;
          },
        },
      },
    },
    zh: {
      link: '/zh',
      label: '简体中文',
      lang: 'zh',
      titleTemplate: 'Vesium',
      title: 'Vue3 与 CesiumJS 的优雅集成方案',
      description: 'Vue3 与 CesiumJS 的优雅集成方案',
      themeConfig: {
        siteTitle: 'Vesium',
        nav: [
          { text: '首页', link: '/zh' },
          { text: '开始使用', link: '/zh/start' },
        ],
        sidebar: generateSidebar({
          base: '/zh',
          filter: path => path.endsWith('.zh.md'),
        }),
        sidebarMenuLabel: '列表',
        langMenuLabel: '更换语言',
        returnToTopLabel: '返回顶部',
        skipToContentLabel: '跳至内容',
        darkModeSwitchLabel: '切换主题',
        darkModeSwitchTitle: '切换暗黑模式',
        lightModeSwitchTitle: '切换明亮模式',
        outline: {
          label: '目录',
        },
        lastUpdated: {
          text: '最后更新于',
        },
        notFound: {
          title: '找不到页面',
          linkLabel: '返回首页',
          quote: '无法找到这个页面，请检查URL是否正确',
          linkText: '返回首页',
        },
        editLink: {
          text: '对此页面提出建议或帮助改进',
          pattern: (payload) => {
            return `https://github.com/vesiumjs/vesium/blob/main/packages/${payload.relativePath.replace('zh', '').replace(/\.md$/, '.zh.md')}`;
          },
        },

      },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vesiumjs/vesium' },
    ],
    logo: {
      src: '/favicon.svg',
    },
  },
  transformHtml(html) {
    return html.replace('<head>', `<head>${transformHtml}`);
  },
}));
