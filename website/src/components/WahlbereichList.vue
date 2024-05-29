<template>
  <ModulleList v-if="wahlbereicheCount == 1" :wahlbereich-index="0" :slot="slot" :remaining-lp="fachMaxLP" />
  <div v-else>
    <WahlbereichDisplay v-for="index in wahlbereicheCount" :wahlbereich-index="index - 1" :slot="slot" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import ModulleList from './ModulleList.vue';
import WahlbereichDisplay from './WahlbereichDisplay.vue';
import FachSlotNames from '../model/FachSlotNames';
import state from '../store/store';

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  }
})

const wahlbereicheCount = computed(() => state().getFach(props.slot)?.wahlbereiche.length ?? 0)
const fachMaxLP = computed(() => state().getFach(props.slot)?.maxLP ?? 0)

</script>