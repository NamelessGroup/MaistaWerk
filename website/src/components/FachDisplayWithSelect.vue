<template>
  <FachDisplay :slot="slot">
    <select v-model="selectedFach" class="w-full max-w-full rounded-sm bg-primary-900 px-2">
      <option disabled selected :value="undefined">---</option>
      <option v-for="fach in faecher" :disabled="shouldBeDisabled(fach)" :key="fach.name" :value="fach.name">{{ fachNameBuilder(fach) }}</option>
    </select>
  </FachDisplay>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import Fach from '../../../model/Fach';
import FachDisplay from './FachDisplay.vue';
import FachSlotNames from '../model/FachSlotNames';
import fachNameBuilder from '../utils/fachNameBuilder';
import state from '../store/store';

const props = defineProps({
  faecher: {
    type: Array<Fach>,
    required: true
  },
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  }
})

const selectedFach = ref('')

function shouldBeDisabled(fach: Fach) {
  return [FachSlotNames.VT1, FachSlotNames.VT2, FachSlotNames.EF].some(f => state().getFach(f)?.name == fach.name)
}

watch(selectedFach, (newVal) => {
  state().setFach(props.slot, props.faecher.filter(fach => fach.name === newVal)[0])
})
</script>