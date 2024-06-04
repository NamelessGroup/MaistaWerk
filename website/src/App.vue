<template>
  <div class="absolute text-white top-0 left-0 right-0 bottom-0 max-h-screen min-h-screen overflow-hidden gap-5 flex bg-primary-950">
    <div class="h-full flex-1 flex gap-5 overflow-hidden p-2">
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.VT1" :faecher="state().getAllVertiefungsfaecher" />
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.VT2" :faecher="state().getAllVertiefungsfaecher" />
      <FachDisplay class="flex-1 h-full" :slot="FachSlotNames.WAHL" />
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.EF" :faecher="state().getAllErgaenzungsfaecher" />
    </div>
    <SideBarComponent />
  </div>
</template>

<script setup lang="ts">
import FachSlotNames from './model/FachSlotNames';
import SideBarComponent from './components/SideBarComponent.vue';
import state from './store/store';
import FachDisplayWithSelect from './components/FachDisplayWithSelect.vue';
import FachDisplay from './components/FachDisplay.vue';
</script>