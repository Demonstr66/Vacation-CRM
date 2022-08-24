<template>
  <list-with-add
    :items="Object.values(tasks)"
    title="Задачи"
    :action="$can('mange', 'Post')"
    @delete="onDelete"
    @save="onSave"
  >
    <template v-slot:alert="{item}">
      <span>
      Задача
      <span class="font-weight-medium font-italic">
          {{ item ? item.title : '' }}
        </span>
      будет удалена у всех пользователей.<br/>Продолжить?
        </span>
    </template>
  </list-with-add>
</template>

<script>
import {defTask} from "@/plugins/schema";
import {tasks} from "@/mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {TaskMethods} from "@/mixins/TaskMethods";

export default {
  mixins: [tasks, TaskMethods],
  components: {
    ListWithAdd
  },
  methods: {
    onSave(item) {
      const task = defTask(item);

      if (!task.id) this.createTask(task).catch(err => {})
      else this.updateTask(task).catch(err => {})
    },
    onDelete(id) {
      this.deleteTask(id);
    },
  },
};
</script>
