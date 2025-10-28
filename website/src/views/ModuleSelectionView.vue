<template>
    <div class="gap-5 flex md:pr-2 flex-col md:flex-row overflow-scroll md:overflow-hidden">
      <FachDisplayWithSelect class="md:flex-1 md:h-full" :slot="FachSlotNames.VT1" :faecher="state().getAllVertiefungsfaecher" />
      <FachDisplayWithSelect class="md:flex-1 md:h-full" :slot="FachSlotNames.VT2" :faecher="state().getAllVertiefungsfaecher" />
      <FachDisplay class="md:flex-1 md:h-full" :slot="FachSlotNames.WAHL" />
      <FachDisplayWithSelect class="md:flex-1 md:h-full" :slot="FachSlotNames.EF" :faecher="state().getAllErgaenzungsfaecher" />
    </div>
</template>

<script setup lang="ts">
import state from '../store/store';
import FachDisplayWithSelect from '../components/FachDisplayWithSelect.vue';
import FachDisplay from '../components/FachDisplay.vue';
import FachSlotNames from '../model/FachSlotNames';
</script>