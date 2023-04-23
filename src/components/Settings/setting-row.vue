<template>
  <v-row style="position: relative;">
    <v-col cols="12" class="pa-0 ma-0 mt-3">
      <v-divider/>
    </v-col>
    <v-col cols="12" md="6" class="mt-0 pt-1">
      <div class="text-subtitle-1 font-weight-medium text--primary pl-1 pl-md-3">{{ label }}</div>
      <div class="text-caption text--secondary pl-1 pl-md-3">{{ description }}</div>
    </v-col>
    <v-col cols="12" md="6" align-self="center" class="pr-1 pr-md-3 mt-0 pt-1">
      <div class="expansion-panel pa-1" :class="{'max-h-200': expanded && !expand}">
        <slot/>
      </div>
      <div
          v-if="expanded"
          class="d-flex justify-space-around expand-bg"
          :class="{'expand-bg-up': expand, 'expand-bg-down': !expand}"
          @click="expand = !expand"
      >
        <v-icon class="icon">mdi-chevron-down</v-icon>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "setting-row",
  props: {
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expand: false
    }
  }
}
</script>

<style scoped lang="scss">

.expand-bg {
  position: absolute;
  height: 40px;
  left: -16px;
  right: -16px;
  bottom: -16px;
  cursor: pointer;
  transition: .15s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-image: linear-gradient(0deg, #9f9f9f55, #ffffff00);
    transition: .15s ease-in-out;
  }

  &:hover {
    &::after {
      top: 20px;
    }
  }

  &-up {
    padding-top: 15px;
  }

  &-up:hover {
    padding-bottom: 10px;
  }

  &-down:hover {
    padding-top: 20px;
  }

  & i {
    transition: .7s ease-in-out;
  }

  &-up i {
    transform: rotate(180deg);
  }

}


.expansion-panel {
  max-height: 500px;
  transition: max-height 0.7s ease-out;
  overflow: hidden;
}

.max-h-200 {
  max-height: 100px;
}
</style>