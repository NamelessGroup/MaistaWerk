<template>
<div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col overflow-hidden">
  <div class="p-2">
    <h1 class="font-bold text-xl">{{ slot }}</h1>
    <div>{{getRestrictionString(fach ?? {}, lpListForFach)}}</div>
    <slot></slot>
  </div>
  <div class="overflow-y-auto flex-grow">
    <div class="min-h-6" v-if="!$slots.default"><!--Empty space--></div>
    <WahlbereichList :slot="slot" />
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import state from '../store/store';
import WahlbereichList from './WahlbereichList.vue';
import FachSlotNames from '../model/FachSlotNames';
import getRestrictionString from '../utils/choiceRestrictionStringBuilder';

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  }
})

const fach = computed(() => state().getFach(props.slot))

const lpListForFach = computed(() => {
  if (!fach.value) return []
  return fach.value.wahlbereiche.flatMap((_,idx) => state().getChosenFromWahlbereichAndFach(props.slot, idx).map(i => state().getModulById(i).lp))
})
</script>