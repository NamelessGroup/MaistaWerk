<!-- Lists the modules of a Wahlbereich and provides selection methods. Should enforce restrictions. Does not add any decor. -->
<template>
  <div v-if="!pflichtbereichListe" class="space-y-5">
    <div class="space-y-5 px-2">
      <ModuleDisplay
        v-for="m in chosenModules"
        :key="m.id"
        :modul="m"
        :chosen-state="ModuleChosenState.CHOSEN_IN_THIS"
        @remove="state().removeModul(slot, m.id)"
      />
    </div>
    <hr class="border-primary-500" />
    <div class="space-y-5 px-2">
      <ModuleDisplay
        v-for="m in filteredChosableModules"
        :key="m.id"
        :modul="m"
        :chosen-state="exedsLimit(m) ? ModuleChosenState.OVER_LIMIT : ModuleChosenState.CHOSABLE"
        @add="addModul(m)"
      />
      <ModuleDisplay
        v-for="m in filteredChosenInOtherModules"
        key="m.id"
        :modul="m"
        :chosen-state="ModuleChosenState.CHOSEN_IN_OTHER"
      />
    </div>
  </div>

  <div v-else class="space-y-5 px-2">
    <ModuleDisplay
      v-for="m in chosenModules"
      :key="m.id"
      :modul="m"
      :chosen-state="ModuleChosenState.PFLICHT"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import ModuleDisplay from "./ModuleDisplay.vue";
import state from "../store/store";
import FachSlotNames from "../model/FachSlotNames";
import ModuleChosenState from "../model/ui/ModuleChosenState";
import isPflichtbereich from "../utils/PflichtbereichChecker";
import Modul from "../../../model/Module";
import { canAcceptChoice } from "../utils/choiceManagement";
import { FilterState } from "../model/ui/FilterState";
import Stammmodule from "../model/Stammmodule";
import { SortingOptions, SortingState } from "../model/ui/SortingState";

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true,
  },
  wahlbereichIndex: {
    type: Number,
    required: true,
  },
  remainingLp: {
    type: Number,
    required: false,
    default: Infinity,
  },
  filter: {
    type: Object as PropType<FilterState>,
    required: true,
  },
  sorting: {
    type: Object as PropType<SortingState>,
    required: true,
  },
});

const pflichtbereichListe = computed(() => {
  const fach = state().getFach(props.slot);
  if (!fach) return false;
  return isPflichtbereich(
    fach.wahlbereiche[props.wahlbereichIndex],
    state().getModulById
  );
});

const allIdsInWahlbereich = computed(
  () =>
    state().getFach(props.slot)?.wahlbereiche[props.wahlbereichIndex]
      .modulliste ?? []
);
const chosenModuleIds = computed(() =>
  state().getChosenFromWahlbereichAndFach(props.slot, props.wahlbereichIndex)
);
const allChosenIds = computed(() => state().getAllChosenModule);
const chosenInOtherModulesIds = computed(() =>
  allIdsInWahlbereich.value.filter(
    (id) =>
      allChosenIds.value.includes(id) && !chosenModuleIds.value.includes(id)
  )
);
const chosableIds = computed(() =>
  allIdsInWahlbereich.value.filter(
    (id) =>
      !chosenModuleIds.value.includes(id) &&
      !chosenInOtherModulesIds.value.includes(id)
  )
);
const chosenModules = computed(() =>
  chosenModuleIds.value.map((id) => state().getModulById(id))
);
const chosenInOtherModules = computed(() =>
  chosenInOtherModulesIds.value.map((id) => state().getModulById(id))
);
const filteredChosenInOtherModules = computed(() =>
  chosenInOtherModules.value.filter(applyFilter).sort((a, b) =>
    sort(a, b, props.sorting.sortBy) * props.sorting.direction
  )
);
const chosableModules = computed(() =>
  chosableIds.value.map((id) => state().getModulById(id))
);
const filteredChosableModules = computed(() =>
  chosableModules.value.filter(applyFilter).sort((a, b) =>
    sort(a, b, props.sorting.sortBy) * props.sorting.direction
  )
);

function exedsLimit(modul: Modul) {
  return !canAcceptChoice(
      modul.lp,
      chosenModules.value.map((i) => i.lp),
      state().getFach(props.slot)?.wahlbereiche[props.wahlbereichIndex] ?? {},
      props.remainingLp
    )
}

function addModul(modul: Modul) {
  state().addModul(props.slot, modul.id, props.wahlbereichIndex);
}

function applyFilter(modul: Modul) {
  if (props.filter.minEcts > modul.lp || props.filter.maxEcts < modul.lp) {
    return false;
  }
  if (props.filter.stammmoduleOnly && !Stammmodule.includes(modul.name.trim())) {
    return false;
  }

  // semesterfilter
  const isSoSe = modul.turnus.toLocaleLowerCase().includes("sose") || modul.turnus.toLocaleLowerCase().includes("ss") || modul.turnus.toLocaleLowerCase().includes("sommersemester");
  const isWiSe = modul.turnus.toLocaleLowerCase().includes("wise") || modul.turnus.toLocaleLowerCase().includes("ws") || modul.turnus.toLocaleLowerCase().includes("wintersemester");
  if (isSoSe && !props.filter.semester.includes("SoSe")) {
    return false;
  }
  if (isWiSe && !props.filter.semester.includes("WiSe")) {
    return false;
  }
  if (!isSoSe && !isWiSe && !props.filter.semester.includes("unknown")) {
    return false;
  }

  // languagefilter
  const isGerman = modul.sprache.toLocaleLowerCase().includes("german") || modul.sprache.toLocaleLowerCase().includes("deutsch");
  const isEnglish = modul.sprache.toLocaleLowerCase().includes("englisch") || modul.sprache.toLocaleLowerCase().includes("english");
  if (isGerman && !props.filter.language.includes("De")) {
    return false;
  }
  if (isEnglish && !props.filter.language.includes("Eng")) {
    return false;
  }
  if (!isGerman && !isEnglish && !props.filter.language.includes("unknown")) {
    return false;
  }

  if (props.filter.searchString == "") {
    return true;
  }
  const searchParts = props.filter.searchString.toLocaleLowerCase().split(" ");
  const nameParts = modul.name.toLocaleLowerCase().split(" ");
  return searchParts.some((searchPart) => {
    return nameParts.some(n => n.includes(searchPart));
  });
}

function sort(a: Modul, b: Modul, sorting: SortingOptions) {
  switch (sorting) {
    case SortingOptions.NAME:
      return a.name.localeCompare(b.name);
    case SortingOptions.ECTS:
      return a.lp - b.lp;
    case SortingOptions.DOZENT:
      return a.verantwortlicher.localeCompare(b.verantwortlicher);
    case SortingOptions.SEMSTER:
      return b.turnus.localeCompare(a.turnus);
    case SortingOptions.SPRACHE:
      return b.sprache.localeCompare(a.sprache);
    default:
      return 0;
  }
}
</script>
