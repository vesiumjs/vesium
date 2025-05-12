// https://vitepress.dev/guide/custom-theme

import type { Theme as VitePressTheme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Layout from './components/layout.vue';
import '@unocss/reset/tailwind.css';
import './styles/theme.scss';
import 'uno.css';

export default <VitePressTheme> {
  extends: DefaultTheme,
  Layout,
};
