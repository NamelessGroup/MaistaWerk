<template>
    <div
    class="absolute top-0 left-0 right-0 bottom-0 max-h-screen h-screen overflow-hidden p-10 z-10 flex items-center justify-center align-middle backdrop-blur-sm"
    @click="e => close(e)"
  >
    <div
      class="bg-primary-900 relative border rounded border-primary-500 z-20 h-full w-full p-2 space-y-5"
      @click="(e) => e.stopPropagation()"
    >
      <h1 class="text-xl">{{ modul ? 'Modul bearbeiten' : 'Modul erstellen' }}</h1>
      <div class="grid grid-cols-[auto_1fr] gap-2">
        <label>Name:</label>
        <input
          type="text"
          v-model="editableModule.name"
          class="border border-primary-500 rounded-md p-1 bg-primary-700"
        >
        <label>LP:</label>
        <input
          type="number"
          v-model="editableModule.lp"
          class="border border-primary-500 rounded-md p-1 bg-primary-700"
        >
        <label>Turnus:</label>
        <select
          v-model="editableModule.turnus"
          class="border border-primary-500 rounded-md p-1 bg-primary-700"
        >
          <option value="unbekannt">unbekannt</option>
          <option value="Wintersemester">Wintersemester</option>
          <option value="Sommersemester">Sommersemester</option>
          <option value="Jedes Semester">Jedes Semester</option>
        </select>
        <label>Sprache:</label>
        <select
          v-model="editableModule.sprache"
          class="border border-primary-500 rounded-md p-1 bg-primary-700"
        >
          <option value="unbekannt">unbekannt</option>
          <option value="Deutsch">Deutsch</option>
          <option value="Englisch">Englisch</option>
        </select>
      </div>
      <div v-if="errorText != ''" class="text-red-400">{{ errorText }}</div>
      <div class="flex">
        <button
          class="border border-primary-500 rounded-md bg-primary-700 p-1 m-2" @click="save()"
          >Speichern</button>
      </div>
    </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue';
import { CustomModul, modulToString, seperator } from '../../utils/CustomModul';


const props = defineProps({
  modul: {
    type: Object as PropType<CustomModul>,
    required: false
  }
})

const errorText = ref("")

function getEditableModule(modul?: CustomModul) {
  return modul ?? {
    name: "",
    lp: 0,
    turnus: "unbekannt",
    sprache: "unbekannt"
  }
}

const editableModule = ref<CustomModul>(getEditableModule(props.modul))

function save() {
  if (editableModule.value.name === "") {
    errorText.value = "Bitte einen Namen angeben"
    return
  }
  if (editableModule.value.name.includes(seperator)) {
    errorText.value = `Der Name darf nicht "${seperator}" enthalten`
    return
  }
  if (editableModule.value.lp <= 0) {
    errorText.value = "Bitte eine Anzahl an LP angeben"
    return
  }
  errorText.value = ""
  emit("save", modulToString(editableModule.value))
  emit("close")
}

function reset() {
  editableModule.value = getEditableModule(undefined)
  errorText.value = ""
}

defineExpose({reset})

const emit = defineEmits(["close", "save"]);

function close(e: Event) {
  e.stopPropagation()
  emit("close")
}

watch(editableModule, (newValue) => {
  editableModule.value = getEditableModule(newValue)
}, { deep: true })
</script>