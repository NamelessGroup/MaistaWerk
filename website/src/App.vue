<template>
  <div class="absolute text-white top-0 left-0 right-0 bottom-0 max-h-screen min-h-screen overflow-hidden gap-5 flex bg-slate-900">
    <div class="flex-1 bg-black h-full">
      <ModuleBase name="Module 1" semester="Jedes Wintersemester" language="Deutsch" class="m-2" />
    </div>
    <div class="flex-1 bg-black h-full"></div>
    <div class="flex-1 bg-black h-full"></div>
    <div class="flex-1 bg-black h-full"></div>
    <SideBarComponent />
  </div>
</template>

<script setup lang="ts">
import ModuleBase from './components/ModuleBase.vue';
import SideBarComponent from './components/SideBarComponent.vue';
</script>