<template>
  <v-list-item
      :class="{ dropable: draggingEl.is }"
      :data-user="user.uid"
      @dragenter="onDrugEnter"
      @dragleave="onDrugLeave"
      @dragover="onDrugOver"
      @drop="onDrop"
  >
    <v-list-item-content>
      <v-row justify="space-between" no-gutters>
        <v-col cols="10" lg="10" md="9">
          <v-row no-gutters>
            <v-col cols="12" sm="9">
              <v-list-item-title class="subtitle-1">
                {{ user.fullName }}
                <v-chip
                    :color="
                    user.role != 'admin'
                      ? user.role != 'owner'
                        ? user.role == 'leader'
                          ? 'warning'
                          : 'accent'
                        : 'success'
                      : ''
                    "
                    class="ml-2"
                    label
                    outlined
                    x-small
                >
                  {{ user.role }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle :title="postTitle(user.post)" class="mt-1">
                <div style="overflow: hidden; white-space: initial;text-overflow: ellipsis">
                <span class="font-weight-bold">
                  Должность:
                </span>
                  <span class="font-weight-regular">{{ postTitle(user.post) }}</span></div>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="mt-1">
                <span class="font-weight-bold">
                  Команда:
                </span>
                <span class="font-weight-regular">{{ teamTitle(user.team) }}</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle
                  :href="'mailto:' + user.email"
                  class="mt-1"
                  tag="a"
              >
                {{ user.email }}
              </v-list-item-subtitle>
            </v-col>
            <v-col cols="12" sm="3">
              <div v-if="tempTask(user.uid).length !== 0"
                   class="d-flex flex-wrap justify-start justify-md-end mt-2 mt-md-0">
                <v-chip
                    v-for="(task, index) in tempTask(user.uid)"
                    :key="index"
                    :color="
                      task.status != 'repeat'
                        ? task.status != 'new'
                          ? ''
                          : 'info'
                        : 'success'
                    "
                    class="mb-1 mr-1"
                    close
                    label
                    small
                    @click:close="onDeleteTask(task.id)"
                >
                  <v-list-item-subtitle>{{ taskTitle(task.id) }}</v-list-item-subtitle>
                </v-chip>
              </div>
              <small v-else>Задач нет</small>
            </v-col>
          </v-row>
        </v-col>
        <v-spacer></v-spacer>
        <v-divider
            v-if="$vuetify.breakpoint.mdAndUp"
            vertical
        ></v-divider>
        <v-col align-self="center" cols="auto">
          <v-menu
              v-if="$vuetify.breakpoint.smAndDown"
              content-class="nosheet"
              offset-y
              top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <main-tools
                :active="user.active"
                :fab="true"
                :vertical="true"
                @delete="onDeleteUser(user.uid)"
                @edit="onEdit(user.uid)"
            ></main-tools>
          </v-menu>

          <main-tools
              v-else
              :active="user.active"
              @delete="onDeleteUser(user.uid)"
              @edit="onEdit(user.uid)"
          ></main-tools>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import MainTools from "../user/tools/main.vue"
import {posts, tasks, teams} from "@/mixins/computedData";

export default {
  name: 'user-item',
  mixins: [teams, tasks, posts],
  components: {MainTools},
  props: {
    user: {},
    draggingEl: {},
    items: {},
    onDeleteUser: {},
    onEdit: {},
  },
  methods: {
    taskTitle(id) {
      const task = this.tasks.find((t) => t.id == id);
      return task ? task.title : "Без названия";
    },
    postTitle(id) {
      if (id == undefined) return 'Не назначена'
      const post = this.posts.find((t) => t.id == id);
      return post ? post.title : "Без названия";
    },
    teamTitle(id) {
      if (id == undefined) return 'Не назначена'
      const team = this.teams.find((t) => t.id == id);
      return team ? team.title : "Без названия"
    },
    tempTask(uid) {
      let res = this.user.tasks || [];
      res = res.map((r) => ({status: "active", id: r}));

      if (this.draggingEl.uid == uid) {
        let index = res.findIndex((r) => r.id == this.draggingEl.item);

        if (index != -1) res[index].status = "repeat";
        else res.push({id: this.draggingEl.item, status: "new"});
      }

      return res;
    },
    onDeleteTask(taskId) {
      this.$store.dispatch("workspace/db/removeTaskFromUser", {
        uid: this.user.uid,
        taskId,
      });
    },
    onDrugEnter(e) {
      const persID = e.target.getAttribute("data-user");
      if (!persID) return;

      e.target.classList.add("select");
      this.draggingEl.uid = persID;
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
      this.draggingEl.uid = null;
    },
    onDrop(e) {
      const persID = e.target.getAttribute("data-user");
      if (!persID) return;

      e.target.classList.remove("select");

      if (
          this.user.tasks &&
          this.user.tasks.some((t) => t == this.draggingEl.item)
      )
        return;

      this.$store.dispatch("workspace/db/addTaskToUser", {
        uid: persID,
        taskId: this.draggingEl.item,
      });
    },
  }
}
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

@keyframes running-contour {
  from {
    background-position: 0 0, 16px 100%, 0 16px, 100% 0;
  }
  to {
    background-position: 16px 0, 0 100%, 0 0, 100% 16px;
  }
}
</style>