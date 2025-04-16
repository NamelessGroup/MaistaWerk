<template>
    <div class="flex flex-col gap-y-5 w-full h-full">
        <div class="min-h-3/4 max-h-3/4 h-3/4 max-w-full overflow-x-auto flex gap-x-5">
            <DraggableRegion 
                v-for="i in semesterCount"
                :key="i"
                :id="i"
                class="min-w-80" 
            />
            <button class="flex items-center min-w-48 border rounded-md border-primary-500 bg-primary-800 p-1 gap-2 h-fit whitespace-nowrap" @click="semesterCount++">
                <img class="h-5" src="../assets/plus-solid-white.svg" />
                <div>Semester hinzufügen</div>
            </button>
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