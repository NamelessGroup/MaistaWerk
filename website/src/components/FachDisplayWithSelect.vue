<template>
  <FachDisplay :slot="slot">
    <select v-model="selectedFach" class="w-full max-w-full rounded-sm bg-primary-900 px-2">
      <option disabled selected :value="undefined">---</option>
      <option v-for="fach in faecher" :key="fach.name" :value="fach">{{ fachNameBuilder(fach) }}</option>
    </select>
  </FachDisplay>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import Fach from '../../../model/Fach';
import FachDisplay from './FachDisplay.vue';
import FachSlotNames from '../model/FachSlotNames';
import fachNameBuilder from '../utils/fachNameBuilder';

defineProps({
  faecher: {
    type: Array<Fach>,
    required: true
  },
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  }
})

const selectedFach = ref<Fach>({} as Fach)

</script>