<template>
  <list-with-add
    :items="Object.values(tasks)"
    action
    title="Задачи"
    @delete="onDelete"
    @save="onSave"
  >
    <template v-slot:alert="{data}">
      <span>
        Задача
        <span class="font-weight-medium font-italic">
          {{ data ? data.title : '' }}
        </span>
        будет удалена.<br>Продолжить?
      </span>
    </template>
  </list-with-add>
</template>

<script>
import {tasks} from "@/mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {Task} from "@/plugins/servises/Task";

export default {
  mixins: [tasks],
  components: {
    ListWithAdd
  },
  methods: {
    onSave(item) {
      if (!item.id) Task.create(item)
      else Task.update(item)
    },
    onDelete(id) {
      Task.delete(id)
    },
  },
};
</script>
