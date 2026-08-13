<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { demoRoutes } from './demos';
</script>

<template>
  <nav>
    <RouterLink v-for="item in demoRoutes" :key="item.path" :to="item.path">
      {{ item.label }}
    </RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
