<template>
  <v-tooltip
    :bottom="bottom"
    :color="tooltipcolor ? tooltipcolor : ''"
    transition="fade-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :class="btnClass"
        :color="fab ? 'white' : ''"
        :disabled="disable"
        :fab="fab"
        :icon="!fab"
        :loading="loading"
        :small="fab || small"
        v-bind="attrs"
        @click="$emit('click', $event)"
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
    }
  }
};
</script>
