<template>
  <div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col overflow-hidden">
    <div class="flex p-2">
      <input v-model="name" class="flex-1 outline-none bg-transparent border-none" placeholder="Name">
      <span>{{ lps }} LP</span>
    </div>

    <div class="overflow-y-auto flex-grow">
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

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

const name = ref('Semester ' + props.id)

const list = ref<string[]>([])

const lps = computed(() => list.value.map(id => state().getModulById(id).lp).reduce((a, b) => a + b, 0))

watch(list, (newList) => {
  state().choices.semesterToModulListe.set(props.id, newList)
}, { deep: true })

watch(() => state().choices.semesterToModulListe.get(props.id), (newList) => {
  list.value = newList ?? []
}, { immediate: true })
</script>