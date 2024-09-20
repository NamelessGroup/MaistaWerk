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
        {{ getDozentName() }}
      </div>
      <div class="row-start-1 row-span-2 col-start-2 flex items-center gap-x-5">
        <img v-if="compLanguage != Lang.UNKNOWN" class="h-6 grayscale" :src="getLangImage(compLanguage)" />
        <img v-if="compSemester != Semester.UNKNOWN" class="h-6 opacity-80" :src="getSemesterImage(compSemester)" />
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
import sunSVG from '../assets/sun-solid.svg'
import snowflakeSVG from '../assets/snowflake-solid.svg'
import plusSVG from '../assets/plus-solid.svg'
import errorSVG from '../assets/circle-exclamation-solid.svg'
import minusSVG from '../assets/minus-solid.svg'
import germanyFlag from '../assets/germany.png'
import ukFlag from '../assets/united-kingdom.png'
import { areRestrictionFulfilled } from "../utils/choiceManagement";
import state from "../store/store";

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

enum Lang {
  EN, DE, UNKNOWN
}

enum Semester {
  WiSe, SoSe, UNKNOWN
}

const compLanguage = computed(() => {
  if (props.modul.sprache.toLocaleLowerCase() == 'englisch') {
    return Lang.EN
  } else if (props.modul.sprache.toLocaleLowerCase() == 'deutsch') {
    return Lang.DE
  } else {
    return Lang.UNKNOWN
  }
})

function getLangImage(lang: Lang) {
  switch (lang) {
    case Lang.EN:
      return ukFlag
    case Lang.DE:
      return germanyFlag
    default:
      return ''
  }
}

const compSemester = computed(() => {
  if (props.modul.turnus.toLocaleLowerCase().includes("winter")) {
    return Semester.WiSe
  } else if (props.modul.turnus.toLocaleLowerCase().includes("sommer")) {
    return Semester.SoSe
  } else {
    return Semester.UNKNOWN
  }
})

function getSemesterImage(semester: Semester) {
  switch (semester) {
    case Semester.WiSe:
      return snowflakeSVG
    case Semester.SoSe:
      return sunSVG
    default:
      return ''
  }
}

function getDozentName() {
  const r = /((Prof|Dr|PD|TT-Prof|rer|nat|Dipl)\.?)+[ -](.* )([^ ]*)$/i.exec(props.modul.verantwortlicher)
  if (r) return r[r.length - 1]
  return props.modul.verantwortlicher
}
</script>
