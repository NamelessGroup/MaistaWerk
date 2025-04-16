<template>
  <ModuleBase
    class="cursor-pointer"
    :name="modul.name"
    :semester="modul.turnus"
    :language="modul.sprache"
    @click="setVisible()"
    :chosen-state="chosenState"
    :is-comleted="allChildrenFulfiled"
  >
    <div class="grid grid-rows-[auto_auto] grid-cols-[auto_1fr_auto] gap-x-5">
      <div class="row-start-1 col-start-1">{{ modul.lp }} LP</div>
      <div class="row-start-2 col-start-1">
        {{ getDozentName(modul) }}
      </div>
      <div class="row-start-1 row-span-2 col-start-2 flex items-center gap-x-5">
        <img v-if="getLanguage(modul) != Lang.UNKNOWN" class="h-6 grayscale" :src="getLangImage(getLanguage(modul))" />
        <img v-if="getSemester(modul) != Semester.UNKNOWN" class="h-6 opacity-80" :src="getSemesterImage(getSemester(modul))" />
      </div>
      <div class="row-start-1 row-span-2 col-start-3 flex items-center" @click="e => clickedActionButton(e)">
        <img
          :src="getActionButtonSource()"
          class="h-6 cursor-pointer"
        />
      </div>
    </div>
    <ModulPopUp :modul="modul" v-if="popUpVisible" @close="popUpVisible = false" />
  </ModuleBase>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import Modul from "../../../model/Module";
import ModuleBase from "./ModuleBase.vue";
import ModulPopUp from "./ModulPopUp.vue";
import ModuleChosenState from "../model/ui/ModuleChosenState";
import plusSVG from '../assets/plus-solid.svg'
import errorSVG from '../assets/circle-exclamation-solid.svg'
import minusSVG from '../assets/minus-solid.svg'
import { areRestrictionFulfilled } from "../utils/choiceManagement";
import state from "../store/store";
import { getDozentName, getLanguage, getSemester, Lang, Semester, getLangImage, getSemesterImage } from "../utils/ModulExtractor";

const props = defineProps({
  modul: {
    type: Object as PropType<Modul>,
    required: true,
  },
  chosenState: {
    type: Number as PropType<ModuleChosenState>,
    required: true,
  },
});

const emit = defineEmits(["add", "remove"]);

const popUpVisible = ref(false);

function setVisible() {
  if (props.chosenState != ModuleChosenState.CHOSEN_IN_OTHER) popUpVisible.value = true
}

const allChildrenFulfiled = computed(() => {
  if (props.chosenState != ModuleChosenState.CHOSEN_IN_THIS && props.chosenState != ModuleChosenState.PFLICHT) return true
  for (let i = 0; i < props.modul.wahlbereiche.length; i++) {
    if (!areRestrictionFulfilled(
      state().getChosenTeilleistungenForModul(props.modul.id, i).map(t => state().getTeilleistungById(t).lp),
      props.modul.wahlbereiche[i])
    ) {
      return false
    }
  }
  return true
})

function clickedActionButton(e: MouseEvent) {
  e.stopPropagation();
  if (props.chosenState == ModuleChosenState.CHOSABLE) emit("add");
  if (props.chosenState == ModuleChosenState.CHOSEN_IN_THIS) emit("remove");
}

function getActionButtonSource() {
  if (props.chosenState == ModuleChosenState.CHOSABLE) return plusSVG
  if (props.chosenState == ModuleChosenState.CHOSEN_IN_THIS) return minusSVG
  if (props.chosenState == ModuleChosenState.CHOSEN_IN_OTHER) return errorSVG
  return "";
}
</script>
