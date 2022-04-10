<template>
  <v-card :outlined="outlined" :elevation="isMobile ? 2 : 0" class="pa-0" :class="{ 'ma-3': isMobile }">
    <v-card-title v-if="title != ''" class="justify-center pb-0">{{ title }}
    </v-card-title>
    <v-card-text class="justify-center pb-0">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
export default {
  components: {IconBtnWithTip},
  props: {
    title: {
      type:String,
      dafault:"",
    },
    outlined: {
      type: Boolean,
      default: true
    }

  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
};
</script>

<style lang="scss" scoped>


</style>