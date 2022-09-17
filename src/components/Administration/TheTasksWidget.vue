<template>
  <div>
    <list-with-add
      :items="Object.values(tasks)"
      :action="$can('manage', 'Task')"
      title="Задачи"
      @delete="onDelete"
      @save="onSave"
    />
    <app-popup ref="listPopup">
      <template v-slot:default="{data}">
        <div>
          Задача
          <span class="font-weight-medium font-italic">
            {{ data }}
          </span>
          будет удалена.<br>Продолжить?
        </div>
      </template>
    </app-popup>
  </div>
</template>

<script>
import {tasks} from "@/mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {Task} from "@/plugins/servises/Task";
import AppPopup from "@/components/AppPopup";

export default {
  mixins: [tasks],
  components: {
    AppPopup,
    ListWithAdd
  },
  methods: {
    onSave(item) {
      if (!item.id) Task.create(item)
      else Task.update(item)
    },
    async onDelete(id) {
      const task = this.tasks[id]
      let result = await this.$refs.listPopup.open(task.title)

      if (result) {
        Task.delete(id)
      }
    },
  },
};
</script>
