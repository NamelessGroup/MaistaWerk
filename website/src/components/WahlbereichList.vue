<template>
  <ModulleList :wahlbereich="{}"></ModulleList>
  <ModulleList v-if="wahlbereiche.length == 1" :wahlbereich="wahlbereiche[0]" />
  <div v-else>
    <WahlbereichDisplay v-for="wahlbereich in wahlbereiche" :wahlbereich="wahlbereich" />
  </div>
</template>

<script setup lang="ts">
import Wahlbereich from '../../../model/Wahlbereich';
import ModulleList from './ModulleList.vue';
import WahlbereichDisplay from './WahlbereichDisplay.vue';

defineProps({
  wahlbereiche: {
    type: Array<Wahlbereich>,
    required: true
  } 
})
</script>