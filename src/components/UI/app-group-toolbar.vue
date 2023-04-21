<template>
  <div class="d-flex justify-space-between my-2 align-center">
    <div class="d-flex flex-row align-center text-body-1" :style="!$vuetify.breakpoint.smAndUp ? 'width: 100%' : ''">
      <template v-if="$vuetify.breakpoint.smAndUp">
        <span class="mr-1 text-subtitle-2">{{ label }}</span>
        <span
            v-for="(group, idx) in groups"
            :key="idx"
            :class="{
            'info--text': group.value === value
          }"
            class="ml-2 font-weight-light text-subtitle-2"
            role="button"
            @click.prevent="onInput(group.value)"
        >
          {{ group.text }}
        </span>
      </template>
      <template v-else>
        <v-select
            :items="groups"
            :value="value"
            @change="onInput"

            class="mx-4 font-weight-bold"
            :label="label"
            chips
            small-chips
            dense
            clearable
        />
      </template>
    </div>
    <slot/>
  </div>
</template>

<script>
const DEFAULT_GROUPS = [
  {value: 'post', text: 'Должноcтям'},
  {value: 'team', text: 'Командам'},
  {value: 'active', text: 'Статусу'}
]

export default {
  name: "app-group-toolbar",
  props: {
    groups: {
      type: Array,
      default: () => DEFAULT_GROUPS
    },
    value: {
      type: String
    },
    label: {
      type: String,
      default: 'Группировать по'
    }
  },
  methods: {
    onInput(val) {
      this.$emit('input', val !== this.value ? val : null)
    }
  }
}
</script>

<style scoped>

</style>