<template>
  <v-tooltip :bottom="bottom">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="onClick" :class="btnClass">
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
    icon: String,
    color: String,
    btnClass: {
      type: String,
      default: "",
    },
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>
