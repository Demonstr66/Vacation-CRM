<template>
  <app-base-sheet>
    <v-tabs v-model="currentTab">
      <v-tab v-for="tab in tabs" :key="tab.name">
        {{ tab.title }}
      </v-tab>
    </v-tabs>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet"

export default {
  name: 'app-tabs-nav',
  components: {AppBaseSheet},
  props: {
    value: {
      type: Number,
      default: -1
    },
    tabs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tab: 0
    }
  },
  computed: {
    currentTab: {
      set: function (val) {
        if (this.value !== -1) {
          return this.$emit('input', val)
        }

        this.tab = val
      },
      get: function () {
        return this.value !== -1 ? this.value : this.tab
      }
    }
  },
  created() {
    const currentRouteName = this.$route.name
    const currentViewId = this.tabs.findIndex(v => v.name === currentRouteName)

    if (currentViewId) {
      this.currentTab = currentViewId
    }
  },
  watch: {
    currentTab(id) {
      const name = this.tabs[id].name
      if (this.$route.name !== name) {
        this.$router.replace({name})
      }
    },
  }
}
</script>