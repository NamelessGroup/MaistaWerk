<template>
  <div class="bg-slate-700 p-2">
    <button @click="collapsed = !collapsed"><img class="h-5" src="../assets/bars-solid.svg" /></button>
    <div v-if="!collapsed" class="space-y-5">
      <div>
      <p>{{ getTotalLP() }} / 120 LP</p>
      <p>WiSe: {{ getWiSeLP() }} LP</p>
      <p>SoSe: {{ getSoSeLP() }} LP</p>
    </div>
    <hr>
    <div>
      <p>Masterarbeit: 30 LP</p>
      <p>ÜQ select</p>
    </div>
  </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

function getTotalLP() {
  // TODO
  return 70;
}

function getWiSeLP() {
  // TODO
  return 40;
}

function getSoSeLP() {
  // TODO
  return 30
}

const collapsed = ref(false)

</script>
