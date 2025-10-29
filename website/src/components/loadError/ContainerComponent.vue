<template>
  <div class="bg-primary-800 rounded-md border border-primary-500 flex flex-col overflow-hidden">
    <div class="p-2">
      <div class="flex">
        <h1 class="font-bold text-xl flex-1"><slot name="header" /></h1>
      </div>
    </div>
    <div class="overflow-y-auto flex-grow px-5">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>