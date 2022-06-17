<template>
  <list-with-add
      title="Команды"
      :items="Object.values(teams)"
      @save="onSave"
      @delete="onDelete"
  >
    <template v-slot:subtitle="{item}">
      <v-list-item-subtitle>
        Лидер: {{item.leaderId ? getUserNameById(item.leaderId) : 'Не назначен'}}
      </v-list-item-subtitle>
      <v-list-item-subtitle v-if="item.tempLeaderId">
        ИО лидера: {{item.tempLeaderId ? getUserNameById(item.tempLeaderId) : 'Не назначен'}}
      </v-list-item-subtitle>
    </template>
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
import {teams} from '@/mixins/ComputedData';
import {teamMethods} from '@/mixins/workspaceHelper';
import ListWithAdd from "@/components/Administration/BaseListWidget";
import {getUserNameById} from "@/mixins/dataHelper";

export default {
  mixins: [teams, teamMethods, getUserNameById],
  components: {
    ListWithAdd
  },
  methods: {
    onSave(item) {
      const team = defTeam(item);
      this.saveTeam(!!!team.id, team);
    },
    onDelete(id) {
      this.deleteTeam(id);
    },
  },
};
</script>
