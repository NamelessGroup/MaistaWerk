<template>
<div class="bg-slate-800 rounded-md border border-slate-500 flex flex-col overflow-hidden">
  <div class="p-2">
    <h1 class="font-bold text-xl">{{ slot }}</h1>
    <slot></slot>
  </div>
  <div class="overflow-y-auto flex-grow">
    <WahlbereichList :wahlbereiche="fach?.wahlbereiche ?? []" />
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import state from '../store/store';
import WahlbereichList from './WahlbereichList.vue';
import FachSlotNames from '../model/FachSlotNames';

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  }
})

const fach = computed(() => {
  return undefined//state().getFach(props.slot)
})
</script>