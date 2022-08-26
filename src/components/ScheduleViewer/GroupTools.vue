<template>
  <div class="d-flex justify-space-between">
    <div>
      <small>Группировать по</small>
      <a
        v-for="(group, idx) in groups"
        :key="idx"
        :class="{'text--secondary': group.value !== groupBy}"
        class="ml-2"
        @click.prevent="toggleGroup(group.value)"
      >
        <small>{{ group.text }}</small>
      </a>
    </div>
    <v-btn
      v-if="$vuetify.breakpoint.mdAndDown"
      icon
      @click.stop="$emit('clickFilter')"
    >
      <v-icon>mdi-tune-variant</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'groupTools',
  props: {
    groups: {
      type: Array,
      required: true
    },
    value: {
      type: String
    }
  },
  computed: {
    groupBy: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    toggleGroup(val) {
      this.groupBy = this.groupBy === val ? null : val
    }
  }
}
</script>