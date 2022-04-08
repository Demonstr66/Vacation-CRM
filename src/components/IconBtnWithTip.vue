<template>
  <v-tooltip :bottom="bottom">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="disable"
        :fab="fab"
        :icon="!fab"
        :color="fab ? 'white' : ''"
        v-bind="attrs"
        v-on="on"
        :small="fab"
        @click="onClick($event)"
        :class="btnClass"
      >
        <v-icon :color="color"> {{ icon }} </v-icon>
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
    btnClass: {
      type: String,
      default: "",
    },
    fab: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>
