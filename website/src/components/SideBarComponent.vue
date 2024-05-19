<template>
  <div class="bg-slate-800">
    <div class="flex p-2">
      <div class="flex-1"><!-- Placeholder --></div>
      <button @click="collapsed = !collapsed">
        <img class="h-5" src="../assets/bars-solid.svg" />
      </button>
    </div>

    <div v-if="!collapsed" class="space-y-5">
      <ModuleBase class="m-2" :name="state().getTotalChosenLP + ' LP'">
        <div>
          <div>WiSe: {{ wiSeLP }} LP</div>
          <div>SoSe: {{ soSeLP }} LP</div>
        </div>
      </ModuleBase>

      <div class="space-y-2 p-2">
        <ModuleBase name="Masterarbeit">30 LP</ModuleBase>
        <ModuleBase class="max-w-44" name="Überfachliche Qualifikationen">
          <div class="w-full flex gap-1">
            <select v-model="ueQLP" class="flex-1 bg-slate-800 rounded-sm px-2">
              <option
                v-for="i in maxUeQLP - minUeQLP + 1"
                :key="i"
                :value="i + minUeQLP - 1"
              >
                {{ i + minUeQLP - 1 }}
              </option>
            </select>
            <span>LP</span>
          </div>
        </ModuleBase>
      </div>

      <ModuleBase :name="chosenStammmodule.length + '/4 Stammodule'" class="m-2">
        <div>
          <div v-for="modul in chosenStammmodule" :key="modul.name">
            {{ modul.name }}
          </div>
        </div>
      </ModuleBase>

      <div class="p-2 space-y-2">
        <button
          class="flex items-center w-full border rounded-md border-slate-500 bg-slate-700 p-1 gap-2"
          @click="downloadFile()"
        >
          <img class="h-5" src="../assets/download-solid.svg" />
          <div>Download</div>
        </button>

        <button
          class="flex items-center w-full border rounded-md border-slate-500 bg-slate-700 p-1 gap-2"
          @click="uploadFile()"
        >
          <img class="h-5" src="../assets/upload-solid.svg" />
          <div>Upload</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ModuleBase from "./ModuleBase.vue";
import state from "../store/store";
import stammmodule from "../model/Stammmodule";
import Modul from "../../../model/Module";

const allModule = computed(() => state().getAllChosenModule.map((modul) => state().getModulById(modul)));

const soSeLP = computed(() =>
  getLPCount(allModule.value.filter(modul => modul.name.toLocaleLowerCase().includes("sommer")))
);

const wiSeLP = computed(() =>
  getLPCount(allModule.value.filter(modul => modul.name.toLocaleLowerCase().includes("winter")))
);

function getLPCount(module: Modul[]) {
  return module.reduce((acc, modul) => acc + modul.lp, 0);
}

const collapsed = ref(false);

const minUeQLP = 2;
const maxUeQLP = 6;
const ueQLP = computed({
  get: () => state().getUeQLp,
  set: (value) => state().setUeQLP(value),
});

const chosenStammmodule = computed(() =>
  state().getAllChosenModule.filter((modul) =>
    stammmodule.some((stamm) =>
      state().getModulById(modul).name.includes(stamm)
    )
  ).map((modul) => state().getModulById(modul)).slice(0, 4)
);

function downloadFile() {
  const data = state().getChoicesAsJsonString;
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const now = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace(/\..+/, "")
    .replace("T", "-");
  a.download = `choices-${now}.maista`;
  a.click();
  URL.revokeObjectURL(url);
}

function uploadFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".maista,.json";
  input.multiple = false;
  input.onchange = () => {
    const files = input.files;
    if (!files) {
      return;
    }
    const file = files.item(0);
    if (!file) {
      return;
    }
    if (
      confirm(
        "This will overwrite your current configuration. Do you want to continue?"
      )
    ) {
      file.text().then((text) => {
        state().loadChoicesFromJsonString(text);
      });
    }
  };
  input.click();
}
</script>
