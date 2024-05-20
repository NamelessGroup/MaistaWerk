<template>
  <div class="space-y-3">
    <div v-for="wahlbereich in wahlbereiche" >
      <div class="font-bold">
        <span v-if="wahlbereich.p">Pflichtbereich</span>
        <div v-else>
          <div>Wahlbereich</div>
          <div>{{ getRestrictionString(wahlbereich.w) }}</div>
        </div>
      </div>

      <div v-for="t in wahlbereich.w.modulliste" class="space-x-1">
        <input type="checkbox" :id="t" :checked="getCheckboxState(t,wahlbereich)" @input="" :disabled="wahlbereich.p" />
        <label :for="t">{{ state().getTeilleistungById(t).name }} ({{ state().getTeilleistungById(t).lp }} LP)</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import Modul from "../../../model/Module";
import isPflichtbereich from "../utils/PflichtbereichChecker.ts";
import state from "../store/store.ts";
import getRestrictionString from "../utils/choiceRestrictionStringBuilder";
import Wahlbereich from "../../../model/Wahlbereich";

const props = defineProps({
  modul: {
    type: Object as PropType<Modul>,
    required: true,
  },
});

interface Wahlbereich2 {
  w: Wahlbereich;
  p: boolean;
  t: string[];
}

const wahlbereiche = computed(() => {
  return props.modul.wahlbereiche.map((wb, idx) => {
    return {
      w: wb,
      p: isPflichtbereich(wb, state().getTeilleistungById),
      t: [] as string[]//state().getChosenTeilleistungenForModul(props.modul.id, idx),
    };
  });
});

function getCheckboxState(teilleistungId: string, wahlbereich: Wahlbereich2) {
  return wahlbereich.p || wahlbereich.t.includes(teilleistungId);
};
</script>
