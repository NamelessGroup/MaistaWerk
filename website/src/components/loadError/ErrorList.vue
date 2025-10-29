<template>
  <ContainerComponent class="col-span-2">
      <template #header>{{ heading }}</template>

      <template #default>
        <div class="flex flex-col gap-2">
          <div
            v-for="error in errorList"
            :key="error.missingId"
          >{{ toStringFunction(error) }}</div>
        </div>
      </template>
    </ContainerComponent>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { LoadError } from '../../store/loadVerifier';
import ContainerComponent from './ContainerComponent.vue';

defineProps({
  heading: {
    type: String,
    required: true
  },
  errorList: {
    type: Array<LoadError>,
      required: true
  },
  toStringFunction: {
    type: Function as PropType<(e: LoadError) => string>,
    required: true
  }
})
</script>