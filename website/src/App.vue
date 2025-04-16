<template>
  <div class="absolute text-white top-0 left-0 right-0 bottom-0 max-h-screen min-h-screen overflow-hidden gap-5 flex bg-primary-950">
    <RouterView class="h-full flex-1 flex gap-5 overflow-hidden p-2" />
    <SideBarComponent />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import SideBarComponent from './components/SideBarComponent.vue';

</script>