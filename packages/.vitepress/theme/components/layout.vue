<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { inBrowser, useData, useRouter } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { watch, watchEffect } from 'vue';
import HomeHeroBefore from './home-hero-image.vue';

/**
 * 非手动切换语言时，自动根据当前本地语言进行切换
 */
if (inBrowser) {
  const { site, lang, hash } = useData();
  const langStorage = useStorage('lang', '');

  watch(lang, (lang) => {
    langStorage.value = lang;
  });

  const router = useRouter();

  watchEffect(() => {
    if (!langStorage.value) {
      if (navigator.language.slice(0, 2) === 'zh') {
        langStorage.value = 'zh';
      }
      else {
        langStorage.value = 'en';
      }
    }
  });

  watch(langStorage, (langStorage) => {
    if (langStorage === lang.value) {
      return;
    }
    const locales = site.value.locales;
    const currentLocaleIndex = site.value.localeIndex;
    const nextLocaleIndex = Object.keys(locales).find(key => locales[key].lang === langStorage)!;
    if (nextLocaleIndex === undefined) {
      return;
    }
    // 确保`/`结尾
    const currentBase = `${locales[currentLocaleIndex!]?.link || '/'}/`.replaceAll('//', '/');

    const nextBase = `${locales[nextLocaleIndex!]?.link}/`.replaceAll('//', '/');
    router.go(router.route.path.replace(currentBase, nextBase) + hash.value);
  }, { immediate: true });
}
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-before>
      <client-only>
        <teleport to="#app">
          <div
            position="fixed inset-0"
            bg="#000"
            of="hidden"
            z--1
          />
        </teleport>
        <HomeHeroBefore />
      </client-only>
    </template>
  </DefaultTheme.Layout>
</template>
