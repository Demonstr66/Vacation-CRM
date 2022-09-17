<template>
  <div class="d-flex justify-space-between my-2 align-center">
    <div class="d-flex flex-row align-center text-body-1">
      <template v-if="$vuetify.breakpoint.smAndUp">
        <span class="mr-1 text-subtitle-2">Группировать по</span>
        <span
          v-for="(group, idx) in groups"
          :key="idx"
          :class="{
            'info--text': group.value === groupBy
          }"
          class="ml-2 font-weight-light text-subtitle-2"
          role="button"
          @click.prevent="toggleGroup(group.value)"
        >
          {{ group.text }}
        </span>
      </template>
      <template v-else>
        <v-select
          class="ml-1 font-weight-bold"
          hide-details
          label="Группировать по"
          v-model="groupBy"
          chips
          dense
          small-chips
          :items="groups"
        />
      </template>
    </div>
    <v-btn
      v-if="$vuetify.breakpoint.smAndDown"
      icon
      @click.stop="openRightSidebar"
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
  inject: ['openRightSidebar'],
  methods: {
    toggleGroup(val) {
      this.groupBy = this.groupBy === val ? null : val
    }
  }
}
</script>