<template>
  <div
    class="absolute top-0 left-0 right-0 bottom-0 max-h-screen h-screen overflow-hidden p-10 z-10 flex items-center justify-center align-middle backdrop-blur-sm"
    @click="$emit('close')"
  >
    <div
      class="bg-primary-900 relative border rounded border-primary-500 z-20 h-full w-full p-2"
      @click="(e) => e.stopPropagation()"
    >
      <div
        class="grid grid-cols-2 grid-rows-[auto_1fr] gap-5 h-full overflow-hidden max-h-full"
      >
        <h1 class="col-span-2 col-start-1 row-start-1 text-xl font-bold">
          {{ modul.id }} - {{ modul.name }}
        </h1>
        <table class="col-start-1 row-start-2 h-fit">
          <tr>
            <td class="font-bold">LP:</td>
            <td>{{ modul.lp }}</td>
          </tr>
          <tr>
            <td class="font-bold">Verantwortlicher:</td>
            <td>{{ modul.verantwortlicher }}</td>
          </tr>
          <tr>
            <td class="font-bold">Sprache:</td>
            <td>{{ modul.sprache }}</td>
          </tr>
          <tr>
            <td class="font-bold">Turnus:</td>
            <td>{{ modul.turnus }}</td>
          </tr>
          <tr>
            <td class="font-bold">Dauer:</td>
            <td>{{ modul.dauer }} Semester</td>
          </tr>
        </table>

        <div class="col-start-2 row-start-2 overflow-auto">
          <TeilleistungPicker :modul="modul" />
        </div>
      </div>

      <div class="absolute right-0 top-0">
        <div
          class="relative cursor-pointer text-xl font-bold border rounded-full border-primary-500 w-8 h-8 flex items-center justify-center align-middle text-center bg-primary-900"
          @click="$emit('close')"
        >
          <img src="../assets/xmark-solid.svg" class="h-6 w-6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import Modul from "../../../model/Module";
import TeilleistungPicker from "./TeilleistungPicker.vue";

defineProps({
  modul: {
    type: Object as PropType<Modul>,
    required: true,
  },
});

defineEmits(["close"]);
</script>
