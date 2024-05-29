<template>
  <ModuleBase
    :name="modul.name"
    :semester="modul.turnus"
    :language="modul.sprache"
    @click="setVisible()"
    :chosen-state="chosenState"
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
    <ModulPopUp :modul="modul" v-if="visible" @close="visible = false" />
  </ModuleBase>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import Modul from "../../../model/Module";
import ModuleBase from "./ModuleBase.vue";
import ModulPopUp from "./ModulPopUp.vue";
import ModuleChosenState from "../model/ui/ModuleChosenState";

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

const visible = ref(false);

function setVisible() {
  if (props.chosenState != ModuleChosenState.CHOSEN_IN_OTHER) visible.value = true
}

function clickedActionButton(e: MouseEvent) {
  e.stopPropagation();
  if (props.chosenState == ModuleChosenState.CHOSABLE) emit("add");
  if (props.chosenState == ModuleChosenState.CHOSEN_IN_THIS) emit("remove");
}

function getActionButtonSource() {
  if (props.chosenState == ModuleChosenState.CHOSABLE) return "src/assets/plus-solid.svg";
  if (props.chosenState == ModuleChosenState.CHOSEN_IN_THIS) return "src/assets/minus-solid.svg";
  if (props.chosenState == ModuleChosenState.CHOSEN_IN_OTHER) return "src/assets/circle-exclamation-solid.svg";
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
      return '/src/assets/united-kingdom.png'
    case Lang.DE:
      return '/src/assets/germany.png'
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
      return '/src/assets/snowflake-solid.svg'
    case Semester.SoSe:
      return '/src/assets/sun-solid.svg'
    default:
      return ''
  }
}

function getDozentName() {
  const r = /(PD|Prof\.) Dr. (.* )?(.*)/.exec(props.modul.verantwortlicher)
  if (r) return r[3]
  return props.modul.verantwortlicher
}
</script>
