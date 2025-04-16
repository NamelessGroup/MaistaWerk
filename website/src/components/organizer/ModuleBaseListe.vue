<template>
  <div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col overflow-y-auto p-2 gap-y-2">
    <div class="flex w-full items-center">
      <div class="flex-1">
        Ausgewählte Module:
        <span class="text-primary-400">Drag'n'drop die Module auf das gewünschte Semester</span>
      </div>
      <button class="w-36 h-fit bg-primary-700 rounded-md border border-primary-500 flex items-center p-1 gap-2" @click="showCustomModulePopUp = true">
      <img class="h-5" src="../../assets/plus-solid-white.svg" />
      <div>Custom Modul</div>
    </button>
    <CustomModulPopUp v-if="showCustomModulePopUp" @save="c => customModule.push(c)" @close="showCustomModulePopUp = false"/>
    </div>
    <VueDraggableNext :list="modulIdListe" class="flex flex-wrap gap-2" :group="{name: 'draggable', put: true, pull: true}">
      <DraggableModule
        v-for="i in modulIdListe"
        :key="i"
        :id="i"
      />
    </VueDraggableNext>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import state from '../../store/store';
import DraggableModule from './DraggableModule.vue';
import CustomModulPopUp from './CustomModulPopUp.vue';
import { customMasterArbeit, modulToString } from '../../utils/CustomModul';

const customModule = ref<string[]>([])
const allAssigned = computed(() => Array.from(state().choices.semesterToModulListe.values()).flat())
const modulIdListe = computed(() => {
  const hasMasterarbeit = allAssigned.value.includes(modulToString(customMasterArbeit))
  return [
    ...customModule.value,
    ...state().getAllChosenModule.filter(m => !allAssigned.value.includes(m)),
    ...(hasMasterarbeit ? [] : [modulToString(customMasterArbeit)]),
  ]
})

const showCustomModulePopUp = ref(false)
</script>