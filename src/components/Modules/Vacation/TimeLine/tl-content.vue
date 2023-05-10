<template>
  <div>
    <slot name="top"/>
    <tl-grid
        :items="items"
        :year="year"
    >
      <template v-slot:corner>
        <slot name="corner"/>
      </template>
    </tl-grid>
    <slot name="footer"/>
  </div>
</template>

<script>
import TlGrid from "@/components/Modules/Vacation/TimeLine/tl-grid";

export default {
  name: "tl-content",
  components: {TlGrid},
  props: {
    items: {
      type: Array
    },
    year: {
      type: [String, Number]
    },
  }
}
</script>

<style scoped>

</style>