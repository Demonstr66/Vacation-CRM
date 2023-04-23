<template>
  <app-base-sheet>
    <slot name="header" :headerText="headerText">
      <v-card-title class="justify-center">{{ headerText }}</v-card-title>
    </slot>
    <v-select
        v-for="filter in usedFilters"
        :key="filter.key"
        v-model="selectedFilters[filter.key]"
        :items="filter.items"
        :item-text="filter.text"
        :item-value="filter.value"
        class="mt-8"
        dense
        hide-details
        :label="filter.label"

    />
    <v-btn
        block
        class="mt-2"
        color="secondary"
        left
        small
        text
        @click="reset"
    >
      сброс
    </v-btn>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";
import {Task} from "@/plugins/servises/Task";
import {Post} from "@/plugins/servises/Post";
import {Team} from "@/plugins/servises/Team";


const FILTERS = [
  {
    items: [{label: 1, id: '1'}, {label: 2, id: '2'}],
    key: 'vacationStatus',
    label: 'Статус',
    text: 'label',
    value: 'id'
  },
  {items: Team.getAll(), key: 'userTeam', label: 'Команда', text: 'title', value: 'id'},
  {items: Post.getAll(), key: 'userPost', label: 'Должность', text: 'title', value: 'id'},
  {items: Task.getAll(), key: 'userTasks', label: 'Задача', text: 'title', value: 'id'},
]

const selectedFilters = {}
FILTERS.forEach(item => selectedFilters[item.key] = undefined)

export default {
  name: "app-filters",
  components: {AppBaseSheet},
  props: {
    headerText: {
      type: String,
      default: "Фильтры"
    },
    hideFilters: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => FILTERS
    },
    showFilters: {
      type: Array,
      default: () => []
    },
    value: {}
  },
  data() {
    return {
      selectedFilters: selectedFilters
    }
  },
  mounted() {
    console.log('##########CREATED')
    const query = this.$route.query
    const keys = Object.keys(query)
    console.log('##########', query)
    console.log('##########', keys)
    if (keys.length) {
      keys.forEach(key => {
        this.selectedFilters[key] = query[key]
      })
    }
  },
  computed: {
    usedFilters() {
      if (this.hideFilters.length) {
        return this.filters.filter(f => this.hideFilters.indexOf(f.key) === -1)
      }
      if (this.showFilters.length) {
        return this.filters.filter(f => this.showFilters.indexOf(f.key) !== -1)
      }
      return this.filters
    }
  },
  methods: {
    reset() {
      Object.keys(this.selectedFilters).forEach(key => {
        this.selectedFilters[key] = undefined
      })
    }
  },
  watch: {
    selectedFilters: {
      deep: true,
      handler() {
        console.log('#########SELECTED', this.selectedFilters)
        this.$emit('input', this.selectedFilters)
      }
    }
  }
}
</script>

<style scoped>

</style>