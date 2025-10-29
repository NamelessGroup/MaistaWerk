<template>
  <div
    class="bg-primary-900 border rounded border-primary-500 z-10 p-2 space-y-2"
  >
    <input
      type="text"
      placeholder="Modulname/Dozent"
      v-model="searchString"
      class="w-80"
    />
    <div class="flex space-x-2">
      <label for="minLP">LP min:</label>
      <input type="number" id="minLP" v-model="minEcts" class="w-14 cursor-text" min="0" :max="maxEcts-1" />
      <label for="maxLP">max:</label>
      <input type="number" id="maxLP" v-model="maxEcts" class="w-14 cursor-text" :min="minEcts+1" max="25" />
    </div>
    <div class="flex space-x-2">
      <label for="stammmoduleOnly">Nur Stammmodule:</label>
      <input
        class="cursor-pointer"
        type="checkbox"
        id="stammmoduleOnly"
        v-model="stammmoduleOnly"
      />
    </div>
    <div class="grid gap-2 w-fit">
      <img
        :src="snowflakeSVG"
        class="h-6 row-start-1 col-start-1 cursor-pointer"
        :class="
          filterState.semester.includes('WiSe') ? 'opacity-100' : 'opacity-50'
        "
        @click="changeSemester('WiSe')"
      />
      <img
        :src="sunSVG"
        class="h-6 row-start-1 col-start-2 cursor-pointer"
        :class="
          filterState.semester.includes('SoSe') ? 'opacity-100' : 'opacity-50'
        "
        @click="changeSemester('SoSe')"
      />
      <img
        :src="questionSVG"
        class="h-6 row-start-1 col-start-3 cursor-pointer"
        :class="
          filterState.semester.includes('unknown')
            ? 'opacity-100'
            : 'opacity-50'
        "
        @click="changeSemester('unknown')"
      />

      <img
        :src="germanFlag"
        class="h-6 row-start-2 col-start-1 cursor-pointer"
        :class="
          filterState.language.includes('De') ? 'grayscale-[40%] opacity-100' : 'grayscale opacity-50'
        "
        @click="changeLanguage('De')"
      />
      <img
        :src="ukFlag"
        class="h-6 grayscale row-start-2 col-start-2 cursor-pointer"
        :class="
          filterState.language.includes('Eng') ? 'grayscale-[40%] opacity-100' : 'grayscale opacity-50'
        "
        @click="changeLanguage('Eng')"
      />
      <img
        :src="questionSVG"
        class="h-6 row-start-2 col-start-3 cursor-pointer"
        :class="
          filterState.language.includes('unknown')
            ? 'opacity-100'
            : 'opacity-50'
        "
        @click="changeLanguage('unknown')"
      />
    </div>
    <div class="flex space-x-2">
      <label for="sorting">Sort by:</label>
      <select id="sorting" v-model="sortBy" class="cursor-pointer">
        <option v-for="option in sortingOptions" :value="option">
          {{ option }}
        </option>
      </select>
      <button @click="sortingDirection  = ((sortingDirection*(-1)) as 1|-1)">
        <img :src="arrowDownSVG" class="h-4" v-if="sortingDirection == 1" />
        <img :src="arrowUpSVG" class="h-4" v-else />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, Ref, ref } from "vue";
import { FilterState, Language, Semester } from "../model/ui/FilterState";
import sunSVG from "../assets/sun-solid.svg";
import snowflakeSVG from "../assets/snowflake-solid.svg";
import germanFlag from "../assets/germany.png";
import ukFlag from "../assets/united-kingdom.png";
import questionSVG from "../assets/question-solid.svg";
import arrowDownSVG from "../assets/arrow-down-1-9-solid.svg";
import arrowUpSVG from "../assets/arrow-up-9-1-solid.svg";
import { SortingOptions, SortingState } from "../model/ui/SortingState";

const props = defineProps({
  filter: {
    type: Object as PropType<FilterState>,
    required: true,
  },
  sorting: {
    type: Object as PropType<SortingState>,
    required: true,
  },
});


const emit = defineEmits(["update:filter", "update:sorting"]);

const _filterState = ref({} as Partial<FilterState>);
const filterState = computed({
  get: () => {
    return {
      searchString:
        _filterState.value.searchString ?? props.filter.searchString,
      minEcts: _filterState.value.minEcts ?? props.filter.minEcts,
      maxEcts: _filterState.value.maxEcts ?? props.filter.maxEcts,
      stammmoduleOnly:
        _filterState.value.stammmoduleOnly ?? props.filter.stammmoduleOnly,
      semester: _filterState.value.semester ?? props.filter.semester,
      language: _filterState.value.language ?? props.filter.language,
    };
  },
  set: (val: FilterState) => {
    _filterState.value = val;
    emit("update:filter", val);
  },
});
const searchString = computed({
  get: () => filterState.value.searchString,
  set: (val: string) => {
    _filterState.value.searchString = val;
    emit("update:filter", filterState.value);
  },
});
const minEcts = computed({
  get: () => filterState.value.minEcts,
  set: (val: number) => {
    _filterState.value.minEcts = val;
    emit("update:filter", filterState.value);
  },
});
const maxEcts = computed({
  get: () => filterState.value.maxEcts,
  set: (val: number) => {
    _filterState.value.maxEcts = val;
    emit("update:filter", filterState.value);
  },
});
const stammmoduleOnly = computed({
  get: () => filterState.value.stammmoduleOnly,
  set: (val: boolean) => {
    _filterState.value.stammmoduleOnly = val;
    emit("update:filter", filterState.value);
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

const sortingOptions = [SortingOptions.NAME, SortingOptions.ECTS, SortingOptions.DOZENT, SortingOptions.SEMSTER, SortingOptions.SPRACHE];
const _sortBy: Ref<SortingOptions | undefined> = ref(undefined); 
const sortBy = computed({
  get: () => {
    return _sortBy.value ?? props.sorting.sortBy;
  },
  set: (val: SortingOptions) => {
    _sortBy.value = val;
    emit("update:sorting", {
      sortBy: val,
      direction: sortingDirection.value
    });
  }
});
const _sortingDirection: Ref<1 | -1 | undefined> = ref(undefined);
const sortingDirection = computed({
  get: () => {
    return _sortingDirection.value ?? props.sorting.direction;
  },
  set: (val: 1 | -1) => {
    _sortingDirection.value = val;
    emit("update:sorting", {
      sortBy: sortBy.value,
      direction: val
    });
  }
});
</script>

<style scoped>
input, select, button {
  @apply bg-primary-800 text-white rounded-sm px-2;
}
</style>
