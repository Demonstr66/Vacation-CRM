<template>
  <v-tooltip :bottom="bottom" :color="tooltipcolor ? tooltipcolor : ''" transition="fade-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          :class="btnClass"
          :color="fab ? 'white' : ''"
          :disabled="disable"
          :fab="fab"
          :icon="!fab"
          :small="fab || small"
          v-bind="attrs"
          @click="onClick($event)"
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
  name: "IconBtnWithTip",
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
    }
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>
