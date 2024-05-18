<template>
  <div class="border rounded-md border-slate-500 bg-slate-700 p-1 space-y-2">
    <div class="flex flex-wrap gap-2">
      <h1 class="flex-1 font-bold text-xl">{{ name }}</h1>
      <img v-if="compLanguage != Lang.UNKNOWN" class="h-6" :src="getLangImage(compLanguage)" />
      <img v-if="compSemester != Semester.UNKNOWN" class="h-6" :src="getSemesterImage(compSemester)" />
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps({
  name: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: false
  },
  language: {
    type: String,
    required: false
  }
})

enum Lang {
  EN, DE, UNKNOWN
}

enum Semester {
  WiSe, SoSe, UNKNOWN
}

const compLanguage = computed(() => {
  if (props.language?.toLocaleLowerCase() == 'englisch') {
    return Lang.EN
  } else if (props.language?.toLocaleLowerCase() == 'deutsch') {
    return Lang.DE
  } else {
    return Lang.UNKNOWN
  }
})

function getLangImage(lang: Lang) {
  switch (lang) {
    case Lang.EN:
      return '/src/assets/united-kingdom.png'
    case Lang.DE:
      return '/src/assets/germany.png'
    default:
      return ''
  }
}

const compSemester = computed(() => {
  if (props.semester?.toLocaleLowerCase().includes("winter")) {
    return Semester.WiSe
  } else if (props.semester?.toLocaleLowerCase().includes("sommer")) {
    return Semester.SoSe
  } else {
    return Semester.UNKNOWN
  }
})

function getSemesterImage(semester: Semester) {
  switch (semester) {
    case Semester.WiSe:
      return '/src/assets/snowflake-solid.svg'
    case Semester.SoSe:
      return '/src/assets/sun-solid.svg'
    default:
      return ''
  }
}
</script>