<template>
  <div>
    <h1 class="text-lg font-bold px-2">{{name}}</h1>
    <p class="font-bold px-2" v-if="name != 'Pflichtbereich'">{{getRestrictionString(wahlbereich, lpList)}}</p>
    <ModulleList :slot="slot" :wahlbereich-index="wahlbereichIndex" :remaining-lp="remainingLp" :filter="filter" :sorting="sorting" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import Wahlbereich from '../../../model/Wahlbereich';
import getRestrictionString from '../utils/choiceRestrictionStringBuilder';
import ModulleList from './ModulleList.vue';
import FachSlotNames from '../model/FachSlotNames';
import state from '../store/store';
import { FilterState } from '../model/ui/FilterState';
import { SortingState } from '../model/ui/SortingState';

const props = defineProps({
  wahlbereichIndex: {
    type: Number,
    required: true
  },
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  },
  filter: {
    type: Object as PropType<FilterState>,
    required: true,
  },
  sorting: {
    type: Object as PropType<SortingState>,
    required: true,
  }
})

const wahlbereich = computed(() => state().getFach(props.slot)?.wahlbereiche[props.wahlbereichIndex] || {} as Wahlbereich)

const name = computed(() => {
  if (wahlbereich.value.maxBestandteile == wahlbereich.value.modulliste.length && wahlbereich.value.minBestandteile == wahlbereich.value.modulliste.length) {
    return "Pflichtbereich"
  } else {
    return "Wahlbereich"
  }
})

const lpList = computed(() => {
  return state().getChosenFromWahlbereichAndFach(props.slot, props.wahlbereichIndex).map(i => state().getModulById(i).lp)
})

const remainingLp = computed(() => {
  const fach = state().getFach(props.slot)
  if (!fach) return 0
  return fach.maxLP - fach.wahlbereiche.flatMap((_,i) => state().getChosenFromWahlbereichAndFach(props.slot, i).map(i => state().getModulById(i).lp)).reduce((a,b) => a+b, 0)
})
</script>