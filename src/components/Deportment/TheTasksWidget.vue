<template>
  <list-with-add
      title="Задачи"
      :items="tasks"
      @save="onSave"
      @delete="onDelete"
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
import {tasks} from "@/mixins/computedData";
import {taskMethods} from "../../mixins/workspaceHelper";
import ListWithAdd from "./BaseListWidget.vue";

export default {
  mixins: [tasks, taskMethods],
  components: {
    ListWithAdd
  },
  methods: {
    onSave(item) {
      const task = defTask(item);
      this.mixSaveTask(!!!task.id, task);
    },
    onDelete(id) {
      this.mixDeleteTask(id);
    },
  },
};
</script>
