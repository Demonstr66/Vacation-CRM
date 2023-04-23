<template>
  <div
      :class="{'droppable': dragging}"
      @drop="onDrop"
      @dragleave.prevent="onDragLeave"
      @dragover.prevent="onDragOver"
  >
    <div
        v-if="tasks && tasks.length !== 0"
        class="d-flex flex-wrap mt-2 mt-md-1 justify-start justify-md-end"
    >
      <v-chip
          v-for="task in tasks"
          :key="task"
          :close="editable"
          :title="getTaskTitle(task)"
          class="mb-1 mr-1"
          label
          small
          style="max-width: 150px"
          @click:close="onDeleteTask(task)"
      >
        <span class="text-truncate">
          {{ getTaskTitle(task) }}
        </span>
      </v-chip>
    </div>
    <div v-else>
      <small class="text--secondary font-italic">
        Задач нет
      </small>
    </div>
  </div>
</template>
<script>
import {Task} from "@/plugins/servises/Task";

export default {
  name: 'employee-tasks',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    dragging: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getTaskTitle(id) {
      return Task.getTitle(id)
    },
    onDrop(e) {
      const id = e.dataTransfer.getData('id')
      this.$emit('add', id)
    },
    onDragOver(e) {
      e.target.classList.add('droppable--active')
    },
    onDragLeave(e) {
      e.target.classList.remove('droppable--active')
    },
    onDeleteTask(id) {
      this.$emit('remove', id)
    },
  }
}
</script>