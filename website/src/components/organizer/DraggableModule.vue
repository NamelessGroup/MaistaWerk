<template>
  <ModuleBase
    :name="modul.name"
  >
  <div class="grid grid-rows-[auto_auto] grid-cols-[auto_1fr] gap-x-5">
    <div class="row-start-1 col-start-1">{{ modul.lp }} LP</div>
      <div class="row-start-2 col-start-1">
        {{ getDozentName(modul) }}
      </div>
      <div class="row-start-1 row-span-2 col-start-2 flex items-center gap-x-5">
        <img v-if="getLanguage(modul) != Lang.UNKNOWN" class="h-6 grayscale" :src="getLangImage(getLanguage(modul))" />
        <img v-if="getSemester(modul) != Semester.UNKNOWN" class="h-6 opacity-80" :src="getSemesterImage(getSemester(modul))" />
      </div>
    </div>
  </ModuleBase>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ModuleBase from '../ModuleBase.vue';
import state from '../../store/store';
import { getDozentName, getLanguage, getSemester, Lang, Semester, getLangImage, getSemesterImage } from "../../utils/ModulExtractor";
import { customId, extendToModul, stringToModul } from '../../utils/CustomModul';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const modul = computed(() => {
  if (props.id.startsWith(customId)) {
    return extendToModul(stringToModul(props.id))
  }
  return state().getModulById(props.id)
})

</script>