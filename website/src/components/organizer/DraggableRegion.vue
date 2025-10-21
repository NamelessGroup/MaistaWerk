<template>
  <div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col flex-shrink-0 overflow-hidden">
    <div class="flex p-2 gap-2 items-center" @click="switchCollapsed()">
      <img class="h-4 md:hidden" :src="collapsed ? chevronDownSvg : chevronUpSvg" >
      <input v-model="name" class="flex-1 outline-none bg-transparent border-none" placeholder="Name" @click="e => e.stopPropagation()">
      <span>{{ lps }} LP</span>
    </div>

    <div class="overflow-y-auto flex-grow mb-1" :class="{ 'max-h-6 min-h-4': collapsed,
      'min-h-10': !collapsed
     }">
      <VueDraggableNext 
        class="min-h-full space-y-2 px-1" 
        :list="list" 
        :group="{name: 'draggable', put: true, pull: true}"
      >
        <DraggableModule
          v-for="i in list"
          :key="i"
          :id="i"
        />
      </VueDraggableNext>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import state from '../../store/store';
import DraggableModule from './DraggableModule.vue';
import { customId, stringToModul } from '../../utils/CustomModul';
import chevronDownSvg from '../../assets/chevron-down-solid-full.svg';
import chevronUpSvg from '../../assets/chevron-up-solid-full.svg';
import { isMobile } from '../../utils/uiUtils';

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const collapsed = ref(false);
function switchCollapsed() {
  // Do not switch on large screen
  if (!isMobile()) return;
  collapsed.value = !collapsed.value;
}

const name = ref('Semester ' + props.id)

const list = ref<string[]>([])

const lps = computed(() => list.value.map(getLp).reduce((a, b) => a + b, 0))

function getLp(id: string) {
  if (id.startsWith(customId)) {
    return stringToModul(id).lp
  }
  return state().getModulById(id).lp
}

watch(list, (newList) => {
  state().choices.semesterToModulListe.set(props.id, newList)
}, { deep: true })

watch(() => state().choices.semesterToModulListe.get(props.id), (newList) => {
  list.value = newList ?? []
}, { immediate: true })
</script>