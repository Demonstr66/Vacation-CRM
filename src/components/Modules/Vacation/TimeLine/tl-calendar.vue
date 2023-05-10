<template>
  <tl-empty v-if="!items || !items.length"/>
  <tl-content
      v-else
      :items="items"
      :year="year"
  >
    <template v-slot:top>
      <slot name="top"/>
    </template>
    <template v-slot:corner>
      <slot name="corner"/>
    </template>
    <template v-slot:footer>
      <slot name="footer"/>
    </template>
  </tl-content>
</template>

<script>

import TlContent from "@/components/Modules/Vacation/TimeLine/tl-content";
import TlEmpty from "@/components/Modules/Vacation/TimeLine/tl-empty";

export default {
  name: "tl-calendar",
  components: {TlContent, TlEmpty},
  props: {
    items: {
      type: Array
    },
    year: {
      type: [String, Number]
    },
    filters: {}
  },
  computed: {
    dateStart() {
      return new Date(`01-01-${this.year}`)
    },
    dateEnd() {
      return new Date(`12-31-${this.year}`)
    }
  }
}
</script>