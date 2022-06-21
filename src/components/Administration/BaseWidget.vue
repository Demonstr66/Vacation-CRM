<template>
  <v-card
    :outlined="outlined"
    :elevation="isMobile ? 2 : 0"
    class="pa-0"
    :class="{ 'ma-3': isMobile }"
    :style="$vuetify.breakpoint.smAndUp ? '' : 'width: -webkit-fill-available'"
  >
    <v-card-title v-if="title != ''" class="justify-center pb-0" :title="title">
      {{ title | truncate }}
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
      default:"",
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
  filters: {
    truncate(val) {
      const max = 35
      if (val.length <= max) return val
      return val.slice(0, max-3) + '...'
    }
  }
};
</script>

<style lang="scss" scoped>


</style>