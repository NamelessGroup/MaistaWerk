<template>
  <ModuleBase :name="modul.name" :semester="modul.turnus" :language="modul.sprache">
    <div class="grid grid-rows-[1fr_1fr] grid-cols-[auto_auto]">
      <div class="row-start-1 col-start-1">
        {{ modul.lp }} LP
      </div>
      <div class="row-start-2 col-start-1">
        {{ modul.verantwortlicher }}
      </div>
      <div class="row-start-1 row-span-2 col-start-2 flex items-center">
        <img src="../assets/trash-can-solid.svg" class="h-6 text-red-700 cursor-pointer" @click="$emit('remove')" />
      </div>
    </div>
  </ModuleBase>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import Modul from '../../../model/Module';
import ModuleBase from './ModuleBase.vue';
defineProps({
  modul: {
    type: Object as PropType<Modul>,
    required: true
  }
});

defineEmits(['remove']);
</script>