<template>
  <div>
    <v-row v-if="users">
      <v-col cols="12" md="9" lg="10">
        <v-list :dense="$vuetify.breakpoint.mdAndDown">
          <v-data-iterator :items="Object.values(users)">
            <template v-slot:default="{ items }">
              <v-list-item
                  :class="{ dropable: drag.is }"
                  @drop="onDrop"
                  @dragover="onDrugOver($event)"
                  @dragenter="onDrugEnter"
                  @dragleave="onDrugLeave"
                  v-for="(user, id) in items"
                  :key="id"
                  :data-user="user.uid"
              >
                <v-list-item-content>
                  <v-row justify="space-between">
                    <v-col cols="10" md="9">
                      <v-row>
                        <v-col cols="12" sm="9">
                          <v-list-item-title
                          >{{ user.fullName }}

                            <v-chip
                                outlined
                                label
                                x-small
                                class="ml-2"
                                :color="
                                user.role != 'admin'
                                  ? user.role != 'owner'
                                    ? user.role == 'leader'
                                      ? 'warning'
                                      : 'accent'
                                    : 'success'
                                  : ''
                              "
                            >
                              {{ user.role }}
                            </v-chip>
                          </v-list-item-title>
                          <v-list-item-subtitle
                              tag="a"
                              :href="'mailto:' + user.email"
                          >
                            {{ user.email }}
                          </v-list-item-subtitle>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <div v-if="tempTask(user.uid).length !== 0">
                            <v-chip
                                v-for="(task, index) in tempTask(user.uid)"
                                :key="index"
                                class="mb-1 mr-1"
                                close
                                label
                                small
                                :color="
                                task.status != 'repeat'
                                  ? task.status != 'new'
                                    ? ''
                                    : 'info'
                                  : 'success'
                              "
                                @click:close="onDeleteTask(user.uid, task.id)"
                            >
                              {{ taskTitle(task.id) }}
                            </v-chip>
                          </div>
                          <small v-else>Задач нет</small>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-divider
                        vertical
                        v-if="$vuetify.breakpoint.mdAndUp"
                    ></v-divider>
                    <v-col cols="auto">
                      <v-menu
                          top
                          offset-y
                          content-class="nosheet"
                          v-if="$vuetify.breakpoint.smAndDown"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <main-tools
                            :vertical="true"
                            :fab="true"
                            :active="user.active"
                            @edit="onEdit(user.uid)"
                            @delete="onDeleteUser(user.uid)"
                        ></main-tools>
                      </v-menu>

                      <main-tools
                          v-else
                          :active="user.active"
                          @edit="onEdit(user.uid)"
                          @delete="onDeleteUser(user.uid)"
                      ></main-tools>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-list-item-content>
              </v-list-item>
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
            @dragstart="onDrugStart(task.id)"
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
import Alert from "../Modals/Alert.vue";
import IconBtnWithTip from "../IconBtnWithTip.vue";
import MainTools from "../user/tools/main.vue";

import {tasks, teams, users} from "../../mixins/computedData";

export default {
  mixins: [users, teams, tasks],
  components: {
    Alert,
    IconBtnWithTip,
    MainTools,
  },
  data: () => ({
    expand: true,
    drag: {
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
    taskTitle(id) {
      const task = this.tasks.find((t) => t.id == id);
      return task ? task.title : "Без названия";
    },
    tempTask(uid) {
      let res = this.users[uid].tasks || [];
      res = res.map((r) => ({status: "active", id: r}));

      if (this.drag.uid == uid) {
        let index = res.findIndex((r) => r.id == this.drag.item);

        if (index != -1) res[index].status = "repeat";
        else res.push({id: this.drag.item, status: "new"});
      }

      return res;
    },
    onEdit(uid) {
      this.$emit("editUser", this.getUserById(uid));
    },
    getUserById(uid) {
      return this.users[uid] || {};
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
    onDrugStart(id) {
      this.drag.is = true;
      this.drag.item = id;
    },
    onDragEnd() {
      this.drag.is = false;
      this.drag.item = null;
      this.drag.uid = null;
    },
    onDrugEnter(e) {
      const persID = e.target.getAttribute("data-user");
      if (!persID) return;

      e.target.classList.add("select");
      this.drag.uid = persID;
    },
    onDrugOver(e) {
      const persID = e.target.getAttribute("data-user");
      if (!persID) return;

      e.preventDefault();
    },
    onDrugLeave(e) {
      const persID = e.target.getAttribute("data-user");
      if (!persID) return;

      e.target.classList.remove("select");
      this.drag.uid = null;
    },
    onDrop(e) {
      const persID = e.target.getAttribute("data-user");
      if (!persID) return;

      e.target.classList.remove("select");

      if (
          this.users[persID].tasks &&
          this.users[persID].tasks.some((t) => t == this.drag.item)
      )
        return;

      this.$store.dispatch("workspace/db/addTaskToUser", {
        uid: persID,
        taskId: this.drag.item,
      });
    },
    onDeleteTask(uid, taskId) {
      this.$store.dispatch("workspace/db/removeTaskFromUser", {
        uid,
        taskId,
      });
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
<style lang="scss" scoped>
.nosheet {
  box-shadow: none !important;
  overflow-x: initial !important;
  overflow-y: initial !important;
  contain: initial !important;
}

.dropable::after {
  position: absolute;

  margin: 6px;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  width: -webkit-fill-available;
  height: -webkit-fill-available;

  background-color: rgba(138, 255, 255, 0.1);
  border-radius: 4px;

  background-image: linear-gradient(
          90deg,
          rgb(58, 247, 247) 50%,
          transparent 50%
  ),
  linear-gradient(90deg, rgb(58, 247, 247) 50%, transparent 50%),
  linear-gradient(0, rgb(58, 247, 247) 50%, transparent 50%),
  linear-gradient(0, rgb(58, 247, 247) 50%, transparent 50%);
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
  background-size: 16px 2px, 16px 2px, 2px 16px, 2px 16px;
  animation: running-contour 1s linear infinite;
  z-index: 0;
}

.select.dropable::after {
  background-color: rgba(102, 219, 219, 0.3);
  transition: background-color 0.3s ease-in-out;
}

@keyframes running-contour {
  from {
    background-position: 0 0, 16px 100%, 0 16px, 100% 0;
  }
  to {
    background-position: 16px 0, 0 100%, 0 0, 100% 16px;
  }
}
</style>