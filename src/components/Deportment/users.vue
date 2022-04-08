<template>
  <div>
    <v-row v-if="users">
      <v-col cols="12">
        <v-toolbar>
          <v-select :items="[allItem,...teams, noneItem ]" item-value="id" item-text="title"
                    v-model="selectedTeam">

          </v-select>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="9" lg="10">
        <v-list :dense="$vuetify.breakpoint.mdAndDown">
          <v-data-iterator
              :items="Object.values(users)"
              :custom-filter="userFilter"
              :search="selectedTeam"
          >
            <template v-slot:header>
            </template>
            <template v-slot:default="{ items }">
              <user-item
                  v-for="(user, id) in items"
                  :key="id"
                  :user="user"
                  :draggingEl="draggingEl"
                  :items="items"
                  :on-delete-user="onDeleteUser"
                  :on-edit="onEdit"/>
            </template>
          </v-data-iterator>
        </v-list>
      </v-col>
      <v-col cols="3" lg="2" v-if="$vuetify.breakpoint.mdAndUp">
        <v-chip
            draggable
            class="ma-1 v-chip--clickable"
            :small="$vuetify.breakpoint.mdAndDown"
            v-for="(task, id) in tasks"
            :key="id"
            @dragstart="onDragStart(task.id)"
            @dragend="onDragEnd"
            label
        >
          {{ task.title }}
        </v-chip>
      </v-col>
    </v-row>
    <span v-else> Не добавлено ни одного сотрудника </span>
  </div>
</template>

<script>
import {tasks, users, teams} from "../../mixins/computedData";
import UserItem from "@/components/Deportment/UserItem";

export default {
  mixins: [users, tasks, teams],
  components: {
    UserItem,
  },
  data: () => ({
    selectedTeam: 'all',
    noneItem: {id: 'none', title: "Не назначена"},
    allItem: {id: 'all', title: "Все"},
    expand: true,
    draggingEl: {
      is: false,
      item: null,
      uid: null,
    },
    isAlertShow: false,
    deleatingUser: null,
    userEditor: {
      show: false,
      options: {},
    },
  }),
  methods: {
    onDragStart(id) {
      this.draggingEl.is = true;
      this.draggingEl.item = id;
    },
    onDragEnd() {
      this.draggingEl.is = false;
      this.draggingEl.item = null;
      this.draggingEl.uid = null;
    },
    onEdit(uid) {
      this.$emit("editUser", this.getUserById(uid));
    },
    getUserById(uid) {
      return this.users[uid] || {};
    },
    userFilter(items, search) {
      console.log('search by ', search)
      console.log(items)
      return items.filter(function (item) {
        return item.team && item.team == search ||
            !item.team && search == 'none' ||
            search == 'all'
      })
    },
    closeModal() {
      this.showImportModal = false;
      this.showExportModal = false;
      this.userEditor.show = false;
      this.isAlertShow = false;
    },
    showEditorModal() {
      this.userEditor.show = true;
    },
    showAlert() {
      this.isAlertShow = true;
    },
    onDeleteUser(uid) {
      this.deleatingUser = uid;
      this.showAlert();
    },
    onSubmitDeleteUser(uid) {
      this.removeUser(uid);
      this.closeModal();
      this.deleatingUser = null;
    },
    removeUser(uid) {
      this.$store
          .dispatch("deleteUser", uid)
          .then(
              this.$store.dispatch("setMessage", {
                type: "success",
                text: "Пользователь перемещён в архив",
              })
          )
          .catch((err) =>
              this.$store.dispatch("setMessage", {
                type: "error",
                code: err.code,
                text: err.message,
              })
          );
    },
    onRecover(uid) {
      this.$store
          .dispatch("restoreUser", uid)
          .then(
              this.$store.dispatch("setMessage", {
                type: "success",
                text: "Пользователь восстановлен",
              })
          )
          .catch((err) =>
              this.$store.dispatch("setMessage", {
                type: "error",
                code: err.code,
                text: err.message,
              })
          );
    },
  },
};
</script>