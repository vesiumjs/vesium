import type { AppState } from './state';
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './app.vue';
import DemoHost from './demo-host.vue';
import { demoRoutes } from './demos';

window.__app = {} satisfies AppState;

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/core/useEntity' },
    ...demoRoutes.map(route => ({
      path: route.path,
      component: route.host ? DemoHost : route.component,
      props: route.host ? { demo: route.component } : undefined,
    })),
  ],
});

createApp(App).use(router).mount('#app');
