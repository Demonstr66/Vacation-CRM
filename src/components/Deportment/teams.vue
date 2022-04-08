<template>
  <list-with-add
      title="Команды"
      :items="teams"
      @save="onSave"
      @delete="onDelete"
  >
    <template v-slot:alert="{item}">
      <span>
      Команда
      <span class="font-weight-medium font-italic">
          {{ item ? item.title : '' }}
        </span>
      будет расформирована и удалена.<br/>Продолжить?
        </span>
    </template>
  </list-with-add>
</template>

<script>
import {defTeam} from "@/plugins/schema";
import {teams} from '@/mixins/computedData';
import {teamMethods} from '@/mixins/workspaceHelper';
import ListWithAdd from "@/components/Deportment/listWithAdd";

export default {
  mixins: [teams, teamMethods],
  components: {
    ListWithAdd
  },
  methods: {

    onSave(item) {
      const team = defTeam(item);
      this.mixSaveTeam(!!!team.id, team);
    },
    onDelete(id) {
      this.mixDeleteTeam(id);
    },
  },
};
</script>
