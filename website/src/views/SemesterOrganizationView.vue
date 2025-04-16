<template>
    <div class="flex flex-col gap-y-5 w-full h-full">
        <div class="min-h-3/4 max-h-3/4 h-3/4 max-w-full overflow-x-auto flex gap-x-5">
            <DraggableRegion 
                v-for="i in semesterCount"
                :key="i"
                :id="i"
                class="min-w-80" 
            />
            <button class="flex items-center w-fit border rounded-md border-primary-500 bg-primary-800 py-1 px-2 gap-2 h-fit whitespace-nowrap" @click="semesterCount++">Semester hinzufügen</button>
        </div>
        <ModuleBaseListe class="max-w-full w-full flex-1" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DraggableRegion from '../components/organizer/DraggableRegion.vue';
import ModuleBaseListe from '../components/organizer/ModuleBaseListe.vue';
import state from '../store/store';

const semesterCount = ref(Math.max(4, ...state().choices.semesterToModulListe.keys()))
</script>