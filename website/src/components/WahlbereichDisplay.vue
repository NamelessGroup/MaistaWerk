<template>
  <div>
    <h1 class="text-lg font-bold px-2">{{name}}</h1>
    <p class="font-bold px-2" v-if="name != 'Pflichtbereich'">{{getRestrictionString(wahlbereich)}}</p>
    <ModulleList :slot="slot" :wahlbereich-index="wahlbereichIndex" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import Wahlbereich from '../../../model/Wahlbereich';
import getRestrictionString from '../utils/choiceRestrictionStringBuilder';
import ModulleList from './ModulleList.vue';
import FachSlotNames from '../model/FachSlotNames';
import state from '../store/store';

const props = defineProps({
  wahlbereichIndex: {
    type: Number,
    required: true
  },
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
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
</script>