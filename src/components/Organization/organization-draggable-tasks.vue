<template>
  <div>
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
  </div>
</template>
<script>
import {tasks} from "@/mixins/ComputedData";

export default {
  name: 'AdministrationDragItems',
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