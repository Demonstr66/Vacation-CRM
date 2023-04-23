<template>
  <span v-if="id">
      {{ title }}
 </span>
  <small v-else class="text--secondary font-italic">
    Не назнчена
  </small>
</template>
<script>
import {Post} from "@/plugins/servises/Post";

export default {
  name: 'employee-post-title',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    title() {
      return Post.getTitle(this.id)
    }
  }
}
</script>