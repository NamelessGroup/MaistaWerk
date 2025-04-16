<template>
  <div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col overflow-y-auto p-2">
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
import { computed } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import state from '../../store/store';
import DraggableModule from './DraggableModule.vue';


const allAssigned = computed(() => Array.from(state().choices.semesterToModulListe.values()).flat())
const modulIdListe = computed(() => state().getAllChosenModule.filter(m => !allAssigned.value.includes(m)))
</script>