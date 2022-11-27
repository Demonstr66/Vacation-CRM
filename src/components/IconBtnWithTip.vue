<template>
  <v-tooltip
    v-model="value"
    :bottom="bottom"
    :color="tooltipcolor ? tooltipcolor : ''"
    transition="fade-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          :tag="tag"
          :to="to"
        :class="btnClass"
        :color="fab ? 'white' : color"
        :disabled="disable"
        :fab="fab"
        :icon="!fab"
        :loading="loading"
        :small="fab || small"
        :tile="tile"
        :outlined="outlined"
        :rounded="rounded"
        :style="btnStyle"
        v-bind="attrs"
        @click="onClick"
        v-on="on"
      >
        <v-icon :color="color"> {{ icon }}</v-icon>
      </v-btn>
    </template>
    <span><slot></slot></span>
  </v-tooltip>
</template>

<script>

export default {
  props: {
    bottom: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    icon: String,
    color: String,
    tooltipcolor: String,
    btnClass: {
      type: String,
      default: "",
    },
    btnStyle: {
      type: String,
      default: "",
    },
    fab: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    },
    outlined: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'button'
    },
    to: {
      type: Object,
      default: () => {}
    },
    tile: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    value: false
  }),
  methods: {
    onClick(e) {
      this.value = false
      this.$emit('click', e)
    }
  }
};
</script>
