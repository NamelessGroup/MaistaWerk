<template>
  <div class="grid grid-cols-2 grid-rows-[auto_auto_auto] gap-5 pr-2">
    <ErrorList
      heading="Einige Module/Teillesitungen wurden nicht gefunden:"
      :error-list="errorList"
      :to-string-function="(e) => e.toString"
      class="col-span-2"
    />

    <ErrorList
      heading="Modul Ids"
      :error-list="moduleErrors"
      :to-string-function="(e) => e.missingId"
      class="row-start-2 col-start-1 col-span-1"
    />
    <ErrorList
      heading="Teillesitung Ids"
      :error-list="teilleistungErrors"
      :to-string-function="(e) => e.missingId"
      class="row-start-2 col-start-2 col-span-1"
    />

    <ContainerComponent class="row-start-3 col-span-2">
      <template #header>Module entfernen und fortfahren</template>
      <template #default>
        <button
          v-if="!errorList.some(e => e.type === 'Teilleistung')"
          @click="fixErrors()"
          class="border rounded-md p-1 border-primary-500 bg-primary-700 space-y-2 w-full"
        >
          Automatisch Entfernen
        </button>
        <div v-else>
          Fehler mit fehlenden Teilleistungen können nicht behoben werden
        </div>
      </template>
    </ContainerComponent>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { router } from "../router";
import state from "../store/store";
import ErrorList from "../components/loadError/ErrorList.vue";
import ContainerComponent from "../components/loadError/ContainerComponent.vue";
import { removeErrors } from "../store/loadVerifier";

if (state().errors?.errors === undefined || state().errors?.errors?.length === 0) {
  router.push('/')
}


const errorList = computed(() => state().errors?.errors ?? []);
const moduleErrors = computed(() =>
  errorList.value.filter((e) => e.type === "Modul")
);
const teilleistungErrors = computed(() =>
  errorList.value.filter((e) => e.type === "Teilleistung")
);

function fixErrors() {
  state().choices = removeErrors(state().errors.errorFullChoices!, state().errors.errors!)
  router.push('/')
}

</script>
