<template>
  <v-list-item
    :class="{ droppable: draggingEl.is }"
    :data-user="user.uid"
    class="user-list-item"
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
                <span v-if="user.uid === currentUID">(Вы)</span>
                <v-chip
                  :color="
                    user.role !== 'admin'
                      ? user.role !== 'owner'
                        ? user.role === 'leader'
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
            <v-col align-self="center" cols="12" sm="3">
              <div v-if="user.tasks && user.tasks.length !== 0 || user.uid === draggingEl.uid"
                   class="d-flex flex-wrap mt-2 mt-md-0 justify-start justify-md-end">
                <v-chip
                  v-for="(task, index) in user.tasks"
                  :key="index"
                  :color="task === draggingEl.item && draggingEl.uid === user.uid ? 'success' : ''"
                  class="mb-1 mr-1"
                  close
                  label
                  small
                  @click:close="onDeleteTask(task)"
                >
                  <v-list-item-subtitle>{{ taskTitle(task) }}</v-list-item-subtitle>
                </v-chip>
                <v-chip
                  v-if="draggingEl.uid === user.uid &&
                  (!user.tasks || !user.tasks.some(task => task === draggingEl.item))"
                  class="mb-1 mr-1"
                  close
                  color="primary"
                  label
                  small
                >
                  <v-list-item-subtitle>{{ taskTitle(draggingEl.item) }}</v-list-item-subtitle>
                </v-chip>
              </div>
              <div v-else class="text-left text-md-right">
                <small>Задач нет</small>
              </div>
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
            content-class="no-sheet"
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
              :disable="{'delete': user.uid === currentUID}"
              :fab="true"
              :vertical="true"
              @delete="onDeleteUser(user.uid)"
              @edit="onEdit(user.uid)"
              @goto="gotoUser(user.uid)"
            ></main-tools>
          </v-menu>

          <main-tools
            v-else
            :active="user.active"
            :disable="{'delete': user.uid === currentUID}"
            @delete="onDeleteUser(user.uid)"
            @edit="onEdit(user.uid)"
            @goto="gotoUser(user.uid)"
          ></main-tools>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
import MainTools from "../user/tools/main.vue"
import {currentUID, posts, tasks, teams} from "@/mixins/ComputedData";

export default {
  name: 'user-item',
  mixins: [teams, tasks, posts, currentUID],
  components: {MainTools},
  props: {
    user: {},
    draggingEl: {},
    items: {},
    onDeleteUser: {},
    onEdit: {},
  },
  methods: {
    gotoUser(uid) {
      console.log(uid)
      this.$router.push({name: 'User', params: {uid}})
    },
    taskTitle(id) {
      const task = Object.values(this.tasks).find((t) => t.id === id);
      return task ? task.title : "Без названия";
    },
    postTitle(id) {
      if (id === undefined) return 'Не назначена'
      const post = Object.values(this.posts).find((t) => t.id === id);
      return post ? post.title : "Без названия";
    },
    teamTitle(id) {
      if (id === undefined) return 'Не назначена'
      const team = Object.values(this.teams).find((t) => t.id === id);
      return team ? team.title : "Без названия"
    },
    onDeleteTask(id) {
      this.$store.dispatch("users/deleteTaskFromUser", {
        uid: this.user.uid,
        id,
      });
    },
    onDrugEnter(e) {
      const uid = e.target.getAttribute("data-user");
      if (!uid) return;

      e.target.classList.add("select");
      this.draggingEl.uid = uid;
    },
    onDrugOver(e) {
      const uid = e.target.getAttribute("data-user");
      if (!uid) return;

      e.preventDefault();
    },
    onDrugLeave(e) {
      const uid = e.target.getAttribute("data-user");
      if (!uid) return;

      e.target.classList.remove("select");
      this.draggingEl.uid = null;
    },
    onDrop(e) {
      console.log('drop')
      const uid = e.target.getAttribute("data-user");
      if (!uid) return;
      console.log('uid')
      e.target.classList.remove("select");

      if (
        this.user.tasks &&
        this.user.tasks.some((t) => t === this.draggingEl.item)
      )
        return;

      this.$store.dispatch("users/addTaskToUser", {
        uid: uid,
        id: this.draggingEl.item,
      });
    },
  }
}
</script>
<style lang="scss" scoped>

.no-sheet {
  box-shadow: none !important;
  overflow-x: initial !important;
  overflow-y: initial !important;
  contain: initial !important;
}

.droppable::after {
  position: absolute;
  box-sizing: border-box;
  margin: 6px;

  top: 0;
  left: 0;

  width: 100%;
  width: -moz-available; /* WebKit игнор. */
  width: -webkit-fill-available; /* Mozilla игнор. */

  height: 100%;
  height: -moz-available; /* WebKit игнор. */
  height: -webkit-fill-available; /* Mozilla игнор. */

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

.user-list-item {
  background-color: rgb(25, 118, 210, 0);
  transition: background-color 0.5s ease-in-out;

  //&:hover {
  //  background-color: rgb(25, 118, 210, 0.12);
  //}
}
</style>