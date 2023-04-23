<template>
  <app-base-sheet v-if="Object.values(tasks).length">
    <v-chip
        v-for="task in tasks"
        :key="task.id"
        :small="$vuetify.breakpoint.mdAndDown"
        class="ma-1 v-chip--clickable"
        draggable
        @dragstart="onDragStart(task.id, $event)"
        @dragend="dragging = false"
        style="max-width: 150px"
        label
    >
      <span class="text-truncate">
        {{ task.title }}
        </span>
    </v-chip>
  </app-base-sheet>
</template>
<script>
import {tasks} from "@/mixins/ComputedData";
import AppBaseSheet from "@/components/UI/app-base-sheet";

export default {
  name: 'AdministrationDragItems',
  components: {AppBaseSheet},
  mixins: [tasks],
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dragging: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    onDragStart(id, e) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('id', id)
      this.dragging = true
    }
  }
}
</script>