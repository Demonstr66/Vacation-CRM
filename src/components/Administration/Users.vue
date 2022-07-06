<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" lg="10" md="9">
        <v-data-table
          :custom-filter="userFilter"
          :group-by="groupBy"
          :headers="headers"
          :item-class="() => 'dropRow'"
          :items="usersArray"
          :search="JSON.stringify({selectedTeam, selectedTask, selectedPost})"
          dense
          item-key="uid"
        >
          <template v-slot:top>
            <div class="text-end">
              <small>Группировать по</small>
              <a
                v-for="(gh, idx) in groupHeaders"
                :key="idx"
                :class="{'text--secondary': gh.value !== groupBy}"
                class="ml-2"
                @click.prevent="toogleGroup(gh.value)"
              >
                <small>{{ gh.text }}</small>
              </a>
            </div>
          </template>
          <template v-slot:group.header="{toggle, isOpen,groupBy, group, remove}">
            <td :colspan="headers.length">
              <v-btn icon small @click="toggle">
                <v-icon v-if="isOpen">mdi-minus</v-icon>
                <v-icon v-else>mdi-plus</v-icon>
              </v-btn>
              <span>
                {{ getGroupHeaderText(group, groupBy) }}
              </span>
              <v-btn icon small @click="remove && toogleGroup(groupBy[0])">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </td>
          </template>
          <template v-slot:item.fullName="{item}">
            <div class="d-flex flex-column justify-start fill-height">
              <span class="subtitle-1 text-truncate font-weight-medium">
                {{ item.fullName }}

                <span v-if="item.uid === currentUID" class="font-italic">(Вы)</span>
              </span>
              <span
                v-if="$vuetify.breakpoint.mdAndDown"
                class="text--secondary"
              >
                <span class="font-weight-bold">Должность: </span>
                <span>
                  {{ postTitle(item.post) }}
                </span>
              </span>
              <span
                v-if="$vuetify.breakpoint.smAndDown"
                class="text--secondary"
              >
                <span class="font-weight-bold">Команда: </span>
                <span>
                  {{ teamTitle(item.team) }}
                </span>
              </span>
              <span class="text--secondary">
                <span class="font-weight-bold">Email: </span>
                <a :href="'mailto:'+item.email" class="text--secondary">
                  {{ item.email }}
                </a>
              </span>
            </div>
          </template>
          <template v-slot:item.post="{item}">
            {{ postTitle(item.post) }}
          </template>
          <template v-slot:item.team="{item}">
            {{ teamTitle(item.team) }}
          </template>
          <template v-slot:item.tasks="{item}">
            <div
              :class="{droppable: isDrag}"
              @dragleave="onDragLeave(item.uid, $event)"
              @dragover="onDragOver(item.uid, $event)"
              @drop="onDrop(item.uid, $event)"
            >
              <div
                v-if="item.tasks && item.tasks.length !== 0"
                class="d-flex flex-wrap mt-2 mt-md-1 justify-start justify-md-end"
              >
                <v-chip
                  v-for="(task, index) in item.tasks"
                  :key="index"
                  class="mb-1 mr-1"
                  close
                  label
                  small
                  @click:close="onDeleteTask(item.uid, task)"
                >
                  <span>{{ taskTitle(task) }}</span>
                </v-chip>
              </div>
              <div v-else>
                <small>Задач нет</small>
              </div>
            </div>
          </template>
          <template v-slot:item.active="{item}">
            <icon-btn-with-tip
              v-if="item.active"
              color="success"
              icon="mdi-check-decagram"
            >
              Зарегистрирован
            </icon-btn-with-tip>
            <icon-btn-with-tip
              v-else
              color="primary"
              icon="mdi-account-plus"
              @click="$emit('invite')"
            >
              Пригласить
            </icon-btn-with-tip>
          </template>
          <template v-slot:item.action="{item}">
            <v-menu
              v-if="$vuetify.breakpoint.mdAndDown"
              content-class="no-sheet"
              offset-y
              top

            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn depressed icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <main-tools
                :active="item.active"
                :disable="{'delete': item.uid === currentUID}"
                :fab="true"
                :vertical="true"
                @delete="onDeleteUser(item.uid)"
                @edit="onEdit(item.uid)"
                @goto="gotoUser(item.uid)"
              ></main-tools>
            </v-menu>

            <main-tools
              v-else
              :active="item.active"
              :disable="{'delete': item.uid === currentUID}"
              @delete="onDeleteUser(item.uid)"
              @edit="onEdit(item.uid)"
              @goto="gotoUser(item.uid)"
            ></main-tools>
          </template>
        </v-data-table>
      </v-col>
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="3" lg="2">
        <div class="d-flex flex-column fill-height ml-2">
          <v-btn
            color="primary"
            outlined
            text
            @click="onAddUser"
          >
            Добавить
          </v-btn>
          <div>
            <icon-btn-with-tip
              :icon="filterIcon"
              @click="filterExtension =!filterExtension"
            >
              Фильтр
            </icon-btn-with-tip>
            <label>Фильтры</label>
          </div>
          <v-expand-transition>
            <div v-show="filterExtension">
              <v-select
                v-model="selectedPost"
                :items="[allItem,...Object.values(posts), noneItem ]"
                class="mt-5"
                dense
                hide-details
                item-text="title"
                item-value="id"
                label="Должность"
              >
              </v-select>
              <v-select
                v-model="selectedTeam"
                :items="[allItem,...Object.values(teams), noneItem ]"
                class="mt-5"
                dense
                hide-details
                item-text="title"
                item-value="id"
                label="Команда"
              >
              </v-select>
              <v-select
                v-model="selectedTask"
                :items="[allItem,...Object.values(tasks), noneItem ]"
                class="mt-5"
                dense
                hide-details
                item-text="title"
                item-value="id"
                label="Задачи"
              >
              </v-select>
              <v-btn
                block
                class="mt-1"
                color="info"
                small
                text
                @click="resetFilter"
              >
                сбросить
              </v-btn>
            </div>
          </v-expand-transition>
          <div class="mt-4">
            <v-chip
              v-for="(task, id) in tasks"
              :key="id"
              :small="$vuetify.breakpoint.mdAndDown"
              class="ma-1 v-chip--clickable"
              draggable
              label
              @dragend="onDragEnd"
              @dragstart="onDragStart(task.id, $event)"
            >
              {{ task.title }}
            </v-chip>
          </div>
        </div>
      </v-col>
    </v-row>
    <AlertModal
      :show="isAlertShow"
      @cancel="closeModal"
      @submit="onSubmitDeleteUser(deleatingUser)"
    >
      Пользователь будет перемещён в архив. Все его данные будут сохранены.<br>Продолжить?
    </AlertModal>
    <PersonEditorModal
      :show="editor.show"
      :user="editor.user"
      @close="editor = {user: {}, show: false}"
    />
  </div>
</template>

<script>
import {currentUID, posts, tasks, teams, user, users} from "@/mixins/ComputedData";
import UserItem from "@/components/Administration/UsersTabUserItem";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AlertModal from "@/components/Modals/Alert"
import PersonEditorModal from "@/components/Modals/UserEditor";
import {mapGetters} from "vuex";
import MainTools from "@/components/user/tools/main";
import {UserMethods} from "@/mixins/UserMethods";
import {defUser} from "@/plugins/schema";

export default {
  name: 'UserTab',
  mixins: [users, tasks, teams, posts, user, UserMethods, currentUID],
  components: {
    IconBtnWithTip,
    UserItem,
    AlertModal,
    PersonEditorModal,
    MainTools
  },
  data: () => ({
    testUser: {},
    defaultHeaders: [
      {
        text: 'Имя',
        value: 'fullName',
        cellClass: 'pa-0 px-2',
        class: 'text-no-wrap',
        align: 'start',
        groupable: false
      },
      {
        text: 'Должность',
        value: 'post',
        class: 'text-no-wrap',
        align: 'center',
      },
      {
        text: 'Команда',
        value: 'team',
        class: 'text-no-wrap',
        align: 'center',
      },
      {
        text: 'Задачи',
        value: 'tasks',
        align: 'center',
        class: 'text-no-wrap',
        groupable: false
      },
      {
        text: 'Статус',
        value: 'active',
        align: 'center',
        class: 'pa-0 text-no-wrap',
        cellClass: 'fit-content',
      },
      {
        text: '',
        value: 'action',
        align: 'end',
        cellClass: 'px-0 fit-content border-left',
        sortable: false,
        groupable: false
      },
    ],
    groupHeaders: [
      {value: 'post', text: 'Должноcтям'},
      {value: 'team', text: 'Командам'},
      {value: 'active', text: 'Статусу'}
    ],
    isDrag: false,
    groupBy: null,
    editor: {
      show: false,
      user: {},
    },
    selectedTeam: 'all',
    selectedTask: 'all',
    selectedPost: 'all',
    noneItem: {id: 'none', title: "Не назначена"},
    allItem: {id: 'all', title: "Все"},
    filterExtension: false,
    draggingEl: {
      is: false,
      item: null,
      uid: null,
    },
    isAlertShow: false,
    deleatingUser: null,
    userEditor: {
      show: false,
      options: {}
    },
    dataIterator: {}
  }),
  computed: {
    headers() {
      let h = this.defaultHeaders
      if (this.$vuetify.breakpoint.mdAndDown) h = h.filter(x => x.value !== 'post')
      if (this.$vuetify.breakpoint.smAndDown) h = h.filter(x => x.value !== 'team')

      return h
    },
    filterIcon() {
      let append = ([this.selectedTeam, this.selectedPost, this.selectedTask].every(x => x ==
        'all')) ? '-outline' : ''
      return (!this.filterExtension ? 'mdi-filter-menu' : 'mdi-filter') + append
    },
    ...mapGetters('users', {usersIsReady: 'isReady'}),
    usersArray() {
      if (!this.users) return []
      let users = Object.values(this.users || {})

      return users
    }
  },
  methods: {
    console(v) {
      console.log(v);
      return 'myClassName'
    },
    toogleGroup(val) {
      let gby = this.groupBy

      this.groupBy = gby === val ? null : val
    },
    getGroupHeaderText(val, groupBy) {
      const gby = groupBy[0]

      switch (gby) {
        case 'active':
          return val ? 'Зарегистрирован' : 'Не зарегистрирован';
        case 'team':
          return this.teamTitle(val);
        case 'post':
          return this.postTitle(val);
      }
    },
    taskTitle(id) {
      return this.getTitle(id, this.tasks)
    },
    postTitle(id) {
      return this.getTitle(id, this.posts)
    },
    teamTitle(id) {
      return this.getTitle(id, this.teams)
    },
    getTitle(id, items) {
      if (!id) return 'Не назначена'
      if (items === undefined) return 'Без названия'

      const item = items[id]
      return item ? item.title : "Без названия";
    },
    onDeleteTask(uid, id) {
      this.$store.dispatch("users/deleteTaskFromUser", {
        uid,
        id,
      });
    },
    gotoUser(uid) {
      this.$router.push({name: 'User', params: {uid}})
    },
    onDragStart(id, e) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('id', id)
      this.isDrag = true
    },
    onDragEnd(id, e) {
      this.isDrag = false
    },
    onDrop(uid, e) {
      const id = e.dataTransfer.getData('id')
      if (this.users[uid].tasks && this.users[uid].tasks.indexOf(id) !== -1) return

      this.$store.dispatch("users/addTaskToUser", {
        uid: uid,
        id
      });
    },
    onDragOver(uid, e) {
      e.preventDefault()
      e.target.classList.add('droppable--active')
    },
    onDragLeave(uid, e) {
      e.preventDefault()
      e.target.classList.remove('droppable--active')
    },
    resetFilter() {
      this.selectedTeam = 'all'
      this.selectedTask = 'all'
      this.selectedPost = 'all'
    },
    userFilter(value, json, item) {
      const {selectedPost, selectedTeam, selectedTask} = JSON.parse(json)

      return (item.post && item.post == selectedPost ||
          !item.post && selectedPost == 'none' ||
          selectedPost == 'all') &&
        (item.team && item.team == selectedTeam ||
          !item.team && selectedTeam == 'none' ||
          selectedTeam == 'all') &&
        (item.tasks && item.tasks.some(task => task == selectedTask) ||
          !item.tasks && selectedTask == 'none' ||
          selectedTask == 'all')
    },


    showEditor(user) {
      if (!!user) this.editor.user = {...user}
      else this.editor.user = defUser()

      this.editor.show = true;
    },
    onDataIteratorUpdateOptions(val) {
      this.dataIterator = val
    },
    onEdit(uid) {
      // this.$emit("editUser", this.getUserById(uid));
      this.showEditor(this.getUserById(uid))
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
      this.archiveUser(uid)
    },
    onAddUser() {
      this.showEditor();
    },
  },
};
</script>

<style lang="scss">
.no-sheet {
  box-shadow: none !important;
  overflow-x: initial !important;
  overflow-y: initial !important;
  contain: initial !important;
}

.dropRow {
  position: relative;
}

.fit-content {
  width: fit-content;
}

.border-left {
  border-left: thin solid #e0e0e0;
}

.droppable::after {
  content: "";
  position: absolute;
  box-sizing: border-box;
  margin: 3px;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: rgba(138, 255, 255, 0.1);
  border-radius: 5px;
  border-style: dashed;
  border-color: rgba(58, 247, 247, .5);
  z-index: 10;

  &:hover {
    background-color: rgba(138, 255, 255, 0.25);
  }
}

.droppable--active::after {
  content: "";
  position: absolute;
  box-sizing: border-box;
  margin: 3px;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-color: rgba(138, 255, 255, 0.25);
  border-radius: 5px;
  border-style: dashed;
  border-color: rgba(58, 247, 247, .5);
  z-index: 10;

  &:hover {
    background-color: rgba(138, 255, 255, 0.45);
  }
}
</style>