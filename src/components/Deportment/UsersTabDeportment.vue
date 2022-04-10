<template>
  <div>
    <v-row v-if="users">
      <v-col class="py-0 pt-3" cols="12">
        <div class="float-start">
          <icon-btn-with-tip
              :icon="filterIcon"
              @click="filterExtension =!filterExtension"
          >
            Фильтр
          </icon-btn-with-tip>
          <v-menu offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
              >
                <v-icon v-if="selectedSortItem.desc">mdi-sort-descending</v-icon>
                <v-icon v-else>mdi-sort-ascending</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item v-for="(sortItem, id) in sortItems"
                           :key="id" link
                           class="justify-space-between"
                           @click="selectedSortItem = sortItem">
                <v-list-item-title>{{ sortItem.title }}
                </v-list-item-title>
                <v-icon v-if="sortItem.desc">mdi-sort-descending</v-icon>
                <v-icon v-else>mdi-sort-ascending</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>
          <label>
            {{ selectedSortItem.title }}
          </label>
        </div>
        <v-expand-transition>
          <v-row v-show="filterExtension">
            <v-col class="pb-0" cols="12" md="4">
              <v-select v-model="selectedPost"

                        :items="[allItem,...posts, noneItem ]"
                        item-text="title"
                        item-value="id"
                        label="Должность">

              </v-select>
            </v-col>
            <v-col :class="{'pt-0': $vuetify.breakpoint.smAndDown}" class="pb-0" cols="12" md="4">
              <v-select v-model="selectedTeam"
                        :items="[allItem,...teams, noneItem ]"
                        item-text="title"
                        item-value="id"
                        label="Команда"
              >

              </v-select>

            </v-col>
            <v-col :class="{'pt-0': $vuetify.breakpoint.smAndDown}" class="pb-0" cols="12" md="4">
              <v-select v-model="selectedTask"
                        :items="[allItem,...tasks, noneItem ]"
                        item-text="title"
                        item-value="id"
                        label="Задачи">

              </v-select>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-col>
      <v-col cols="12" lg="10" md="9">
        <v-list :dense="$vuetify.breakpoint.mdAndDown">
          <v-data-iterator
              :custom-filter="userFilter"
              :items="Object.values(users)"
              :search="JSON.stringify({selectedTeam, selectedTask, selectedPost})"
              :sort-desc="selectedSortItem.desc"
              :sort-by="selectedSortItem.id"
          >
            <template v-slot:header>
            </template>
            <template v-slot:default="{ items }">
              <user-item
                  v-for="(user, id) in items"
                  :key="id"
                  :draggingEl="draggingEl"
                  :items="items"
                  :on-delete-user="onDeleteUser"
                  :on-edit="onEdit"
                  :user="user"/>
            </template>
          </v-data-iterator>
        </v-list>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="3" lg="2">
        <v-chip
            v-for="(task, id) in tasks"
            :key="id"
            :small="$vuetify.breakpoint.mdAndDown"
            class="ma-1 v-chip--clickable"
            draggable
            label
            @dragend="onDragEnd"
            @dragstart="onDragStart(task.id)"
        >
          {{ task.title }}
        </v-chip>
      </v-col>
    </v-row>
    <span v-else> Не добавлено ни одного сотрудника </span>
    <AlertModal
        :show="isAlertShow"
        @cancel="closeModal"
        @submit="onSubmitDeleteUser(deleatingUser)"
    >
      Пользователь будет перемещён в архив.<br>
      Все его данные будут сохранены. Продолжить?
    </AlertModal>
  </div>
</template>

<script>
import {posts, tasks, teams, users} from "@/mixins/computedData";
import UserItem from "@/components/Deportment/UserItemUsersTabDeportment";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AlertModal from "@/components/Modals/Alert"
import {userData} from "@/mixins/workspaceHelper";

export default {
  mixins: [users, tasks, teams, posts, userData],
  components: {
    IconBtnWithTip,
    UserItem,
    AlertModal
  },
  data: () => ({
    selectedTeam: 'all',
    selectedTask: 'all',
    selectedPost: 'all',
    noneItem: {id: 'none', title: "Не назначена"},
    allItem: {id: 'all', title: "Все"},
    filterExtension: false,
    sortItems: [
      {id: 'fullName', title: 'По алфавиту', desc: false},
      {id: 'fullName', title: 'По алфавиту', desc: true},
      {id: 'role', title: 'По ролям', desc: false},
      {id: 'role', title: 'По ролям', desc: true},
      {id: 'post', title: 'По должностям', desc: false},
      {id: 'post', title: 'По должностям', desc: true},
      {id: 'team', title: 'По командам', desc: false},
      {id: 'team', title: 'По командам', desc: true},
    ],
    selectedSortItem: {id: 'fullName', title: 'По алфавиту', desc: false},
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
  computed: {
    filterIcon() {
      let append = ([this.selectedTeam, this.selectedPost, this.selectedTask].every(x => x ==
          'all')) ? '-outline' : ''
      return (!this.filterExtension ? 'mdi-filter-menu' : 'mdi-filter') + append
    }
  },
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
    userFilter(items, json) {
      const {selectedPost, selectedTeam, selectedTask} = JSON.parse(json)

      return items.filter(function (item) {
        return (item.post && item.post == selectedPost ||
                !item.post && selectedPost == 'none' ||
                selectedPost == 'all') &&
            (item.team && item.team == selectedTeam ||
                !item.team && selectedTeam == 'none' ||
                selectedTeam == 'all') &&
            (item.tasks && item.tasks.some(task => task == selectedTask) ||
                !item.tasks && selectedTask == 'none' ||
                selectedTask == 'all')
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
      this.mixMoveUserToArchive(uid)
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

<style scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */
{
  transform: translateX(10px);
  opacity: 0;
}
</style>