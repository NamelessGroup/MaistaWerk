<template>
  <div>
    <h1 class="text-lg font-bold">{{name}}</h1>
    <p class="font-bold" v-if="name != 'Pflichtbereich'">{{getRestrictionString(wahlbereich)}}</p>
    <ModulleList :wahlbereich="wahlbereich" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import Wahlbereich from '../../../model/Wahlbereich';
import getRestrictionString from '../utils/choiceRestrictionStringBuilder';
import ModulleList from './ModulleList.vue';

const props = defineProps({
  wahlbereich: {
    type: Object as PropType<Wahlbereich>,
    required: true
  } 
})

const name = computed(() => {
  if (props.wahlbereich.maxBestandteile == props.wahlbereich.modulliste.length && props.wahlbereich.minBestandteile == props.wahlbereich.modulliste.length) {
    return "Pflichtbereich"
  } else {
    return "Wahlbereich"
  }
})
</script>