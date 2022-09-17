<template>
  <app-base-sheet>
    <v-card
      class="pa-0 d-flex flex-column justify-start"
      flat
      style="height: 100%"
    >
      <v-card-title v-if="title != ''" :title="title" class="justify-center pb-0">
        {{ title | truncate }}
      </v-card-title>
      <v-card-text class="justify-center pb-0">
        <slot></slot>
      </v-card-text>
      <v-card-actions class="mt-auto">
        <slot name="actions"/>
      </v-card-actions>
    </v-card>
  </app-base-sheet>
</template>

<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  components: {AppBaseSheet, IconBtnWithTip},
  props: {
    title: {
      type: String,
      default: "",
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
      return val.slice(0, max - 3) + '...'
    }
  }
};
</script>

<style lang="scss" scoped>


</style>