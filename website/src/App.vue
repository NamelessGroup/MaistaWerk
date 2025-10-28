<template>
  <div class="absolute text-white top-0 left-0 right-0 bottom-0 max-h-screen min-h-screen overflow-hidden grid bg-primary-950 grid-rows-[auto_1fr] grid-cols-1 md:grid-rows-1 md:grid-cols-[1fr_auto]" :class="{
    'grid-rows-1': !sidebarCollapsed
  }">
    <RouterView class="h-full row-start-2 col-start-1 md:row-start-1 md:col-start-1 overflow-hidden p-2" :class="{
      'hidden md:flex': !sidebarCollapsed,
    }" />
    <SideBarComponent class="row-start-1 col-start-1 md:row-start-1 md:col-start-2" v-model:collapsed="sidebarCollapsed" />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SideBarComponent from './components/SideBarComponent.vue';
import { ref } from 'vue';
import { router } from './router';
import { isMobile } from './utils/uiUtils';

const sidebarCollapsed = ref(isMobile());

// collapse sidebar on mobile when changing views
router.afterEach(() => {
  if (isMobile()) {
    sidebarCollapsed.value = true;
  }
});
</script>