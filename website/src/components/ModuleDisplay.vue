<template>
  <ModuleBase :name="modul.name" :semester="modul.turnus" :language="modul.sprache" @click="visible = true">
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
    <ModulPopUp :modul="modul" v-if="visible" @close="visible = false" />
  </ModuleBase>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import Modul from '../../../model/Module';
import ModuleBase from './ModuleBase.vue';
import ModulPopUp from './ModulPopUp.vue';

defineProps({
  modul: {
    type: Object as PropType<Modul>,
    required: true
  }
});

defineEmits(['remove']);

const visible = ref(false);
</script>