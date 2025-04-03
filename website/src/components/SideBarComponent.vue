<template>
  <div class="bg-primary-800 max-w-48 flex flex-col">
    <div class="flex p-2">
      <div v-if="!collapsed" class="flex-1 text-xl font-bold">
        Übersicht<!-- Placeholder -->
      </div>
      <button @click="collapsed = !collapsed">
        <img class="h-5" src="../assets/bars-solid.svg" />
      </button>
    </div>

    <div v-if="!collapsed" class="space-y-3 flex-grow flex flex-col">
      <div class="space-y-3 flex-grow">
        <ModuleBase class="m-2" :name="state().getTotalChosenLP + ' LP'">
          <div>
            <div>WiSe: {{ semesterLP.wiSe }} LP</div>
            <div>SoSe: {{ semesterLP.soSe }} LP</div>
          </div>
        </ModuleBase>

        <div class="space-y-3 p-2">
          <ModuleBase name="Masterarbeit">30 LP</ModuleBase>
          <ModuleBase class="max-w-44" name="Überfachliche Qualifikationen">
            <div class="w-full flex gap-1">
              <select
                v-model="ueQLP"
                class="flex-1 bg-primary-900 rounded-sm px-2"
              >
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

        <ModuleBase
          :name="chosenStammmodule.length + '/4 Stammodule'"
          class="m-2"
        >
          <div>
            <div v-for="modul in chosenStammmodule" :key="modul.name">
              {{ modul.name }}
            </div>
          </div>
        </ModuleBase>

        <ModuleBase
          name="Praktika & Seminare"
          class="m-2"
        >
          <div class="grid grid-cols-[auto_1fr_auto] gap-x-2">
            <span>Summe:</span><span>{{ chosenSeminareECTS + chosenPraktikaECTS }}</span><span class="text-primary-400">(min 12, max 18)</span>
            <span>Praktika:</span><span>{{ chosenPraktikaECTS }}</span><span class="text-primary-400">(min 6)</span>
            <span>Seminare:</span><span>{{ chosenSeminareECTS }}</span><span class="text-primary-400">(min 3)</span>
            <span class="text-primary-400 col-span-3 pt-3">Nur eine Schätzung: Mag Praktika und Seminare nicht korrekt erkennen.</span>
          </div>
        </ModuleBase>

        <div class="p-2 space-y-2">
          <button
            class="flex items-center w-full border rounded-md border-primary-500 bg-primary-700 p-1 gap-2"
            @click="downloadFile()"
          >
            <img class="h-5" src="../assets/download-solid.svg" />
            <div>Download</div>
          </button>

          <button
            class="flex items-center w-full border rounded-md border-primary-500 bg-primary-700 p-1 gap-2"
            @click="uploadFile()"
          >
            <img class="h-5" src="../assets/upload-solid.svg" />
            <div>Upload</div>
          </button>
        </div>
      </div>

      <div class="p-2 space-y-2">
        <a
          class="text-sm gap-1 text-link underline flex items-center cursor-pointer"
          href="https://github.com/NamelessGroup/MaistaWerk"
        >
          <img src="../assets/github.svg" class="max-h-4" />
          <span>GitHub</span>
        </a>

        <div class="text-xs text-primary-400 text-wrap">
          Alle angaben ohne Gewähr. Daten wurden automatisch aus dem
          <a
            class="underline text-link cursor-pointer"
            href="https://www.informatik.kit.edu/formulare.php#A"
            >Modulhandbuch</a
          >
          generiert. Einige Vorraussetzungen werden nicht automatisch geprüft.
          <br>
          Stand: {{ state().modulhandbuch.metaData.stand.split(' ')[1] }} / {{ shortenSemesterName(state().modulhandbuch.metaData.semester) }} / {{ state().modulhandbuch.metaData.spo }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ModuleBase from "./ModuleBase.vue";
import state from "../store/store";
import stammmodule from "../model/Stammmodule";

const allModule = computed(() =>
  state().getAllChosenModule.map((modul) => state().getModulById(modul))
);

const semesterLP = computed(() => {
  let soSe = 0
  let wiSe = 0
  for (const modul of allModule.value) {
    if (modul.turnus.toLocaleLowerCase().includes('sommer')) {
      soSe += modul.lp
    } else if (modul.turnus.toLocaleLowerCase().includes('winter')) {
      wiSe += modul.lp
    } else {
      for (let i = 0; i < modul.wahlbereiche.length; i++) {
        const teilleistungen = state().getChosenTeilleistungenForModul(modul.id, i).map(t => state().getTeilleistungById(t))
        for (const teilleistung of teilleistungen) {
          if (teilleistung.turnus.toLocaleLowerCase().includes('sommer')) {
            soSe += teilleistung.lp
          } else if (teilleistung.turnus.toLocaleLowerCase().includes('winter')) {
            wiSe += teilleistung.lp
          }
        }
      }
    }
  }
  return { soSe, wiSe }
})

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
      state().getModulById(modul).name .trim() == stamm
    )
  ).map((modul) => state().getModulById(modul)).slice(0, 4)
);

const chosenSeminareECTS = computed(() =>
  allModule.value.filter((modul) =>
    modul.name.toLocaleLowerCase().includes("seminar")
  ).reduce((acc, modul) => acc + modul.lp, 0)
);

const chosenPraktikaECTS = computed(() =>
  allModule.value.filter((modul) =>
    modul.name.toLocaleLowerCase().includes("praktikum")
  ).reduce((acc, modul) => acc + modul.lp, 0)
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

function shortenSemesterName(name: string) {
  return name.replace(/[Ww]intersemester/, "WiSe").replace(/[Ss]ommersemester/, "SoSe");
}
</script>
