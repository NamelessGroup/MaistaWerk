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
        v-for="m in chosableModules"
        :key="m.id"
        :modul="m"
        :chosen-state="ModuleChosenState.CHOSABLE"
        @add="state().addModul(slot, m.id, wahlbereichIndex)"
      />
      <ModuleDisplay
        v-for="m in chosenInOtherModules"
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

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true,
  },
  wahlbereichIndex: {
    type: Number,
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
const chosableModules = computed(() =>
  chosableIds.value.map((id) => state().getModulById(id))
);
</script>
