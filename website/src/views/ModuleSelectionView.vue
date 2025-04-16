<template>
    <div>
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.VT1" :faecher="state().getAllVertiefungsfaecher" />
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.VT2" :faecher="state().getAllVertiefungsfaecher" />
      <FachDisplay class="flex-1 h-full" :slot="FachSlotNames.WAHL" />
      <FachDisplayWithSelect class="flex-1 h-full" :slot="FachSlotNames.EF" :faecher="state().getAllErgaenzungsfaecher" />
    </div>
</template>

<script setup lang="ts">
import state from '../store/store';
import FachDisplayWithSelect from '../components/FachDisplayWithSelect.vue';
import FachDisplay from '../components/FachDisplay.vue';
import FachSlotNames from '../model/FachSlotNames';
</script>