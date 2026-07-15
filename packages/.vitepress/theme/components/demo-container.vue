<script lang="ts" setup>
import type { AsyncComponentLoader } from 'vue';
import { refAutoReset, useClipboard, useFullscreen } from '@vueuse/core';
import { defineAsyncComponent, ref, shallowRef } from 'vue';

const props = withDefaults(defineProps<{
  /**
   * Use Cesium container
   * @default true
   */
  cesium?: boolean;

  /**
   * Relative root path to demo file
   * - note: it's automatically generated
   */
  path: string;

  /**
   * Demo's asynchronous component loading function
   * - note: it's automatically generated
   */
  asyncDemo: AsyncComponentLoader;
  /**
   * content to demo file
   * - note: it's automatically generated
   */
  code: string;
}>(), {
  cesium: true,
});

const containerRef = shallowRef<HTMLDivElement>();
const { toggle } = useFullscreen(containerRef);

const reset = refAutoReset(true, 1);

const { copy, copied } = useClipboard({
  source: () => decodeURIComponent(props.code),
});
const sourceVisible = ref(false);

const demo = defineAsyncComponent(props.asyncDemo);

function openGithub() {
  window.open(`https://github.com/vesiumjs/vesium/blob/main/${props.path}`, '_blank', 'noopener,noreferrer');
}
</script>

<template>
  <div class="demo-container border border-[var(--vp-c-divider)] rounded-4px overflow-hidden">
    <client-only>
      <div ref="containerRef" class="demo-view text-12px min-h-550px relative">
        <Suspense v-if="reset">
          <component :is="defineAsyncComponent(() => import('./cesium-container.vue'))" v-if="cesium">
            <div class="bg-[var(--vp-c-bg)] bottom-0 right-0 absolute">
              <component :is="demo" />
            </div>
          </component>
          <component :is="demo" v-else />
          <template #fallback>
            <div class="flex items-center inset-0 justify-center absolute">
              <span class="i-svg-spinners:3-dots-scale text-50px text-[var(--vp-c-brand-1)] block" />
            </div>
          </template>
        </Suspense>
      </div>
    </client-only>
    <div class="handle-bar px-10px border-t border-t-[var(--vp-c-divider)] flex h-40px items-center justify-end children:mx-8px children:p-8px">
      <button
        type="button"
        class="i-tabler:arrows-maximize"
        aria-label="Toggle fullscreen"
        @click="toggle"
      />
      <button
        type="button"
        class="i-tabler:reload"
        aria-label="Reload demo"
        @click="reset = false"
      />
      <button
        type="button"
        class="i-tabler:brand-github"
        aria-label="Open source on GitHub"
        @click="openGithub"
      />
      <button
        type="button"
        :class="{ 'i-tabler:copy': !copied, 'i-tabler:check': copied }"
        aria-label="Copy source"
        @click="copy()"
      />
      <button
        type="button"
        class="i-tabler:code"
        aria-label="Toggle source code"
        @click="sourceVisible = !sourceVisible"
      />
    </div>

    <div
      class="preview-code-area"
      :class="{
        'preview-code-area--active': sourceVisible,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style>
  .preview-code-area {
  z-index: 1;
  position: relative;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;

  &.preview-code-area--active {
    border-top: 1px solid var(--vp-c-divider);
    max-height: 2000px;
  }

  div[class*='language-'] {
    margin: 0px;
    border-radius: 0;
  }
}
.demo-view {
  button {
    padding: 3px 15px;
    background-color: var(--vp-c-brand);
    border: none;
    outline: none;
    color: #fff;
    margin-right: 0.5em;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    vertical-align: middle;
    &:hover {
      background-color: var(--vp-c-brand-2);
    }
    &:last-child {
      margin-right: 0.5em;
    }
  }
}
</style>
