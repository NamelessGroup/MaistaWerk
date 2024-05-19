<!-- Lists the modules of a Wahlbereich and provides selection methods. Should enforce restrictions. Does not add any decor. -->
<template>

</template>

<script setup lang="ts">
import { PropType } from 'vue';
import Wahlbereich from '../../../model/Wahlbereich';


defineProps({
  wahlbereich: {
    type: Object as PropType<Wahlbereich>,
    required: true
  } 
})
</script>