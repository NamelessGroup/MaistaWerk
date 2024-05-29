<template>
  <div class="space-y-3">
    <div v-for="wahlbereich in wahlbereiche">
      <div class="font-bold">
        <span v-if="wahlbereich.p">Pflichtbereich</span>
        <div v-else>
          <div>Wahlbereich</div>
          <div>{{ getRestrictionString(wahlbereich.w, wahlbereich.t.map(i => state().getTeilleistungById(i).lp)) }}</div>
        </div>
      </div>

      <div v-for="t in wahlbereich.w.modulliste" class="space-x-1">
        <input
          type="checkbox"
          :id="t"
          :checked="getCheckboxState(t, wahlbereich)"
          @input="(e) => check(t, wahlbereich, (e?.target as unknown as CustomEventTargetObject)?.checked ?? false)"
          :disabled="shouldBeDisabled(t, wahlbereich)"
        />
        <label :for="t"
          >{{ state().getTeilleistungById(t).name }} ({{
            state().getTeilleistungById(t).lp
          }}
          LP)</label
        >
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
import { canAcceptChoice } from "../utils/choiceManagement";

const props = defineProps({
  modul: {
    type: Object as PropType<Modul>,
    required: true,
  },
});

type CustomEventTargetObject = {checked: boolean} | undefined;

interface Wahlbereich2 {
  w: Wahlbereich;
  p: boolean;
  t: string[],
  i: number
}

const wahlbereiche = computed(() => {
  return props.modul.wahlbereiche.map((wb, idx) => {
    return {
      w: wb,
      i: idx,
      p: isPflichtbereich(wb, state().getTeilleistungById),
      t: state().getChosenTeilleistungenForModul(props.modul.id, idx),
    };
  });
});

function getCheckboxState(teilleistungId: string, wahlbereich: Wahlbereich2) {
  return wahlbereich.p || wahlbereich.t.includes(teilleistungId);
};

function shouldBeDisabled(teilleistungId: string, wahlbereich: Wahlbereich2) {
  if (wahlbereich.p) return true
  if (!state().getAllChosenModule.includes(props.modul.id)) return true
  if (wahlbereich.t.includes(teilleistungId)) return false
  
  const remainingLP = props.modul.lp - wahlbereiche.value.map(
      wb => Math.min(wb.w.maxLP, wb.t.map(t => state().getTeilleistungById(t).lp).reduce((a, b) => a + b, 0))
    ).reduce((a, b) => a + b, 0);
  const teilleistung = state().getTeilleistungById(teilleistungId);
  return !canAcceptChoice(teilleistung.lp, wahlbereich.t.map(t => state().getTeilleistungById(t).lp), wahlbereich.w, remainingLP)

}

function check(teilleistungId: string, wahlbereich: Wahlbereich2, val: boolean) {
  if (wahlbereich.p) return;
  if (val) {
    state().addTeilleistung(props.modul.id, teilleistungId, wahlbereich.i)
  } else {
    state().removeTeilleistung(props.modul.id, teilleistungId);
  }
}
</script>
