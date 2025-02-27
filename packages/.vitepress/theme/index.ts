// https://vitepress.dev/guide/custom-theme

import type { Theme as VitePressTheme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './components/layout.vue';
import 'uno.css';
import './styles/theme.css';
import '@unocss/reset/tailwind.css';

export default <VitePressTheme> {
  extends: DefaultTheme,
  Layout,
};
