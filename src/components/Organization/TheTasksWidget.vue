<template>
  <div>
    <list-with-add
      :items="Object.values(tasks)"
      :action="$can('manage', 'Task')"
      title="Задачи"
      @delete="onDelete"
      @save="onSave"
      @create="onCreate"
      @edit="onEdit"
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
    <app-popup ref="listPopup2" title="Задача">
      <template v-slot:default="{data, setResData, setSubmitDisable}">
        <v-form v-if="data" @input="(val) => setSubmitDisable(!val)">
          <v-text-field
              :rules="[blankCheck]"
              :value="data.title"
              dense
              flat
              placeholder="Название"
              single-line

              @change="(val) => setResData('title', val)"
          ></v-text-field>
        </v-form>
      </template>
    </app-popup>
  </div>
</template>

<script>
import {tasks} from "@/mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {Task} from "@/plugins/servises/Task";
import AppPopup from "@/components/AppPopup";
import {Post} from "@/plugins/servises/Post";
import {inputValidations} from "@/mixins/InputValidations";

export default {
  mixins: [tasks, inputValidations],
  components: {
    AppPopup,
    ListWithAdd
  },
  methods: {
    onSave(item) {
      if (!item.id) Task.create(item)
      else Task.update(item)
    },
    async onCreate() {
      let result = await this.$refs.listPopup2.open({title: ''})

      if (result) {
        Task.create(result.data)
      }
    },
    async onEdit(id) {
      let task = this.tasks[id]
      let result = await this.$refs.listPopup2.open(task)

      if (result) {
        Task.update(Object.assign(task, result.data))
      }
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
