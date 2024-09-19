<template>
  <div
    class="bg-primary-900 border rounded border-primary-500 z-20 p-2 space-y-2"
  >
    <input
      type="text"
      placeholder="Modulname/Dozent"
      v-model="searchString"
      class="w-80"
    />
    <div class="flex space-x-2">
      <label for="minLP">LP min:</label>
      <input type="number" id="minLP" v-model="minEcts" class="w-14" min="0" :max="maxEcts-1" />
      <label for="maxLP">max:</label>
      <input type="number" id="maxLP" v-model="maxEcts" class="w-14" :min="minEcts+1" max="25" />
    </div>
    <div class="flex space-x-2">
      <label for="stammmoduleOnly">Nur Stammmodule:</label>
      <input
        type="checkbox"
        id="stammmoduleOnly"
        v-model="stammmoduleOnly"
      />
    </div>
    <div class="grid gap-2 w-fit">
      <img
        :src="snowflakeSVG"
        class="h-6 row-start-1 col-start-1"
        :class="
          filterState.semester.includes('WiSe') ? 'opacity-100' : 'opacity-50'
        "
        @click="changeSemester('WiSe')"
      />
      <img
        :src="sunSVG"
        class="h-6 row-start-1 col-start-2"
        :class="
          filterState.semester.includes('SoSe') ? 'opacity-100' : 'opacity-50'
        "
        @click="changeSemester('SoSe')"
      />
      <img
        :src="questionSVG"
        class="h-6 row-start-1 col-start-3"
        :class="
          filterState.semester.includes('unknown')
            ? 'opacity-100'
            : 'opacity-50'
        "
        @click="changeSemester('unknown')"
      />

      <img
        :src="germanFlag"
        class="h-6 row-start-2 col-start-1"
        :class="
          filterState.language.includes('De') ? 'grayscale-[40%] opacity-100' : 'grayscale opacity-50'
        "
        @click="changeLanguage('De')"
      />
      <img
        :src="ukFlag"
        class="h-6 grayscale row-start-2 col-start-2"
        :class="
          filterState.language.includes('Eng') ? 'grayscale-[40%] opacity-100' : 'grayscale opacity-50'
        "
        @click="changeLanguage('Eng')"
      />
      <img
        :src="questionSVG"
        class="h-6 row-start-2 col-start-3"
        :class="
          filterState.language.includes('unknown')
            ? 'opacity-100'
            : 'opacity-50'
        "
        @click="changeLanguage('unknown')"
      />
    </div>
    <div class="flex space-x-2"></div>
    <div class="flex space-x-2"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { FilterState, Language, Semester } from "../model/ui/FilterState";
import sunSVG from "../assets/sun-solid.svg";
import snowflakeSVG from "../assets/snowflake-solid.svg";
import germanFlag from "../assets/germany.png";
import ukFlag from "../assets/united-kingdom.png";
import questionSVG from "../assets/question-solid.svg";

const props = defineProps({
  modelValue: {
    type: Object as PropType<FilterState>,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const _filterState = ref({} as Partial<FilterState>);
const filterState = computed({
  get: () => {
    return {
      searchString:
        _filterState.value.searchString ?? props.modelValue.searchString,
      minEcts: _filterState.value.minEcts ?? props.modelValue.minEcts,
      maxEcts: _filterState.value.maxEcts ?? props.modelValue.maxEcts,
      stammmoduleOnly:
        _filterState.value.stammmoduleOnly ?? props.modelValue.stammmoduleOnly,
      semester: _filterState.value.semester ?? props.modelValue.semester,
      language: _filterState.value.language ?? props.modelValue.language,
    };
  },
  set: (val: FilterState) => {
    _filterState.value = val;
    emit("update:modelValue", val);
  },
});
const searchString = computed({
  get: () => filterState.value.searchString,
  set: (val: string) => {
    _filterState.value.searchString = val;
    emit("update:modelValue", filterState.value);
  },
});
const minEcts = computed({
  get: () => filterState.value.minEcts,
  set: (val: number) => {
    _filterState.value.minEcts = val;
    emit("update:modelValue", filterState.value);
  },
});
const maxEcts = computed({
  get: () => filterState.value.maxEcts,
  set: (val: number) => {
    _filterState.value.maxEcts = val;
    emit("update:modelValue", filterState.value);
  },
});
const stammmoduleOnly = computed({
  get: () => filterState.value.stammmoduleOnly,
  set: (val: boolean) => {
    _filterState.value.stammmoduleOnly = val;
    emit("update:modelValue", filterState.value);
  }
});


function changeSemester(semester: Semester) {
  const idx = filterState.value.semester.indexOf(semester);
  if (idx === -1) {
    filterState.value.semester.push(semester);
  } else {
    filterState.value.semester.splice(idx, 1);
  }
}

function changeLanguage(language: Language) {
  const idx = filterState.value.language.indexOf(language);
  if (idx === -1) {
    filterState.value.language.push(language);
  } else {
    filterState.value.language.splice(idx, 1);
  }
}
</script>

<style scoped>
input {
  @apply bg-primary-800 text-white rounded-sm px-2;
}
</style>
