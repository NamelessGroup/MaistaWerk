<template>
  <div class="absolute text-white top-0 left-0 right-0 bottom-0 max-h-screen min-h-screen overflow-hidden gap-5 flex bg-slate-900">
    <div class="flex-1 bg-black h-full">
      <ModuleDisplay :modul="modul" class="m-2" />
    </div>
    <div class="flex-1 bg-black h-full"></div>
    <div class="flex-1 bg-black h-full"></div>
    <div class="flex-1 bg-black h-full"></div>
    <SideBarComponent />
  </div>
</template>

<script setup lang="ts">
import Modul from '../../model/Module';
import ModuleDisplay from './components/ModuleDisplay.vue';
import SideBarComponent from './components/SideBarComponent.vue';

const modul: Modul = {
  name: 'Module 1',
  turnus: 'Jedes Wintersemester',
  sprache: 'Deutsch',
  lp: 5,
  link: '',
  dauer: 1,
  wahlbereiche: [],
  id: '',
  verantwortlicher: 'Prof. Dr. Max Mustermann'
};
</script>