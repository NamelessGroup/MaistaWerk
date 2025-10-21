<template>
<div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col md:overflow-hidden">
  <div class="p-2">
    <div class="flex">
      <h1 class="font-bold text-xl flex-1 flex gap-2 items-center" @click="switchCollapsed()">
        <img class="h-4 md:hidden" :src="collapsed ? chevronDownSvg : chevronUpSvg" >
        {{ slot }}
      </h1>
      <div>
        <img :src="filterSVG" class="h-6 cursor-pointer" @click="showFilter = !showFilter" ref="filterElement" />
        <FilterComponent v-if="showFilter" v-model:filter="filterState" v-model:sorting="sortingState" class="absolute" :class="showFilterLeft ? 'translate-x-[-19.5rem]' : ''" />
      </div>
    </div>
    <div>{{getRestrictionString(fach ?? {}, lpListForFach)}}</div>
    <slot></slot>
  </div>
  <div v-if="!collapsed" class="overflow-y-auto flex-grow">
    <div class="min-h-6" v-if="!$slots.default"><!--Empty space--></div>
    <WahlbereichList :slot="slot" :filter="filterState" :sorting="sortingState" />
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, PropType, Ref, ref } from 'vue';
import state from '../store/store';
import WahlbereichList from './WahlbereichList.vue';
import FachSlotNames from '../model/FachSlotNames';
import getRestrictionString from '../utils/choiceRestrictionStringBuilder';
import filterSVG from '../assets/filter-solid.svg';
import FilterComponent from './FilterComponent.vue';
import { FilterState } from '../model/ui/FilterState';
import { SortingOptions, SortingState } from '../model/ui/SortingState';
import chevronDownSvg from '../assets/chevron-down-solid-full.svg';
import chevronUpSvg from '../assets/chevron-up-solid-full.svg';
import { isMobile } from '../utils/uiUtils';

const props = defineProps({
  slot: {
    type: String as PropType<FachSlotNames>,
    required: true
  }
})

const collapsed = ref(isMobile());
function switchCollapsed() {
  // Do not switch on large screen
  if (!isMobile()) return;
  collapsed.value = !collapsed.value;
}

const fach = computed(() => state().getFach(props.slot))

const lpListForFach = computed(() => {
  if (!fach.value) return []
  return fach.value.wahlbereiche.flatMap((_,idx) => state().getChosenFromWahlbereichAndFach(props.slot, idx).map(i => state().getModulById(i).lp))
})

const showFilter = ref(false)

const filterState: Ref<FilterState> = ref({
  searchString: '',
  minEcts: 0,
  maxEcts: 25,
  stammmoduleOnly: false,
  semester: ['SoSe', 'WiSe', 'unknown'],
  language: ['De', 'Eng', 'unknown']
})

const sortingState: Ref<SortingState> = ref({
  sortBy: SortingOptions.NAME,
  direction: 1 as 1|-1
})

const windowWidth = computed(() => window.innerWidth)
const filterElement: Ref<HTMLElement | null> = ref(null)
const filterPosition = computed(() => filterElement.value?.getBoundingClientRect().x ?? 0)
const showFilterLeft = computed(() => filterPosition.value > windowWidth.value -350)
</script>