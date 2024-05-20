<!-- Lists the modules of a Wahlbereich and provides selection methods. Should enforce restrictions. Does not add any decor. -->
<template>
  <ModuleDisplay v-for="m in modulList" :key="m.id" :modul="m" />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import Wahlbereich from '../../../model/Wahlbereich';
import ModuleDisplay from './ModuleDisplay.vue';
import tempJson from '../data/temp.json';
import Modul from '../../../model/Module';


defineProps({
  wahlbereich: {
    type: Object as PropType<Wahlbereich>,
    required: true
  } 
})


const modulList = tempJson as unknown as Modul[]
console.log(modulList.length)

</script>