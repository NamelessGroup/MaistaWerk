<template>
  <ModulleList
    v-if="wahlbereicheCount == 1"
    :wahlbereich-index="0"
    :slot="slot"
    :remaining-lp="remainingLp"
      :filter="filter"
  />
  <div v-else>
    <WahlbereichDisplay
      v-for="index in wahlbereicheCount"
      :wahlbereich-index="index - 1"
      :slot="slot"
      :filter="filter"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import ModulleList from "./ModulleList.vue";
import WahlbereichDisplay from "./WahlbereichDisplay.vue";
import FachSlotNames from "../model/FachSlotNames";
import state from "../store/store";
import { FilterState } from "../model/ui/FilterState";

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true,
  },
  filter: {
    type: Object as PropType<FilterState>,
    required: true,
  }
});

const wahlbereicheCount = computed(
  () => state().getFach(props.slot)?.wahlbereiche.length ?? 0
);
const remainingLp = computed(() =>
  Math.min(
    state().getMaximumLP - state().getTotalChosenLP,
    (state().getFach(props.slot)?.maxLP ?? 0) -
      (state()
        .getFach(props.slot)
        ?.wahlbereiche.flatMap((_, i) =>
          state()
            .getChosenFromWahlbereichAndFach(props.slot, i)
            .map((i) => state().getModulById(i).lp)
        )
        .reduce((a, b) => a + b, 0) ?? 0)
  )
);
</script>
