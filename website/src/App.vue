<template>
  <div class="absolute text-white top-0 left-0 right-0 bottom-0 max-h-screen min-h-screen overflow-hidden gap-5 flex bg-slate-900">
    <div class="h-full flex-1 flex gap-5 overflow-hidden p-2">
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.VT1" :faecher="vtOptions" />
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.VT2" :faecher="vtOptions" />
      <FachDisplay class="flex-1 h-full" :slot="FachSlotNames.WAHL" />
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.EF" :faecher="efOptions" />
    </div>
    <SideBarComponent />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import FachSlotNames from './model/FachSlotNames';
import SideBarComponent from './components/SideBarComponent.vue';
import state from './store/store';
import FachDisplayWithSelect from './components/FachDisplayWithSelect.vue';
import FachDisplay from './components/FachDisplay.vue';

const vtOptions = computed(() => {
  const options = Array.from(state().getAllVertiefungsfaecher)
  const selectVT1 = state().getFach(FachSlotNames.VT1)
  const selectVT2 = state().getFach(FachSlotNames.VT2)
  return options.filter(fach => fach.name != selectVT1?.name && fach.name != selectVT2?.name)
})

const efOptions = computed(() => {
  const options = Array.from(state().getAllErgaenzungsfaecher)
  const selectEF = state().getFach(FachSlotNames.EF)
  return options.filter(fach => fach.name != selectEF?.name)
})
</script>