<template>
  <div 
    class="border rounded-md p-1 border-primary-500 bg-primary-700 space-y-2"
    :class="{
      'border-red-500 bg-primary-500 opacity-80': chosenState == ModuleChosenState.CHOSEN_IN_OTHER,
    }"
  >
    <div class="flex flex-wrap gap-2">
      <h1 class="flex-1 font-bold">{{ name }}</h1> <span><img v-if="!isComleted" class="h-4" src="../assets/triangle-exclamation-solid.svg"/></span>
    </div>
    <div class="text-xs">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ModuleChosenState from '../model/ui/ModuleChosenState';


defineProps({
  name: {
    type: String,
    required: true
  },
  chosenState: {
    type: Number as PropType<ModuleChosenState>,
    required: false,
    default: ModuleChosenState.PFLICHT
  },
  isComleted: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>