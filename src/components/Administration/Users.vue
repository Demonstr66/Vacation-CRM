<template>
  <app-block-with-right-navbar>
    <template v-slot:main>
      <app-base-sheet>
        <v-data-table
          :custom-filter="customFilter"
          :group-by.sync="groupBy"
          :headers="headers"
          :item-class="() => 'dropRow'"
          :items="Object.values(users)"
          :search="JSON.stringify({filter})"
          dense
          item-key="uid"
        >
          <template v-slot:top>
            <group-tools
              v-model="groupBy"
              :groups="$options.GROUPS"
            />
          </template>
          <template v-slot:group.header="{toggle, isOpen,groupBy, group, remove, headers}">
            <td :colspan="headers.length">
              <v-btn icon small @click="toggle">
                <v-icon v-if="isOpen">mdi-minus</v-icon>
                <v-icon v-else>mdi-plus</v-icon>
              </v-btn>
              <span>
                {{ getGroupHeaderText(group, groupBy) }}
              </span>
              <v-btn icon small @click="remove">
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
              <span v-if="item.post">
                {{ getPostTitle(item.post) }}
              </span>
              <small v-else class="text--secondary font-italic">Не назнчена</small>
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
           <span v-if="item.post">
                {{ getPostTitle(item.post) }}
              </span>
            <small v-else class="text--secondary font-italic">Не назнчена</small>
          </template>
          <template v-slot:item.team="{item}">
          <span v-if="!!item.team">
            {{ getTeamTitle(item.team) }}
          </span>
            <small v-else class="text--secondary font-italic">Команды нет</small>
          </template>
          <template v-slot:item.tasks="{item}">
            <div
              :class="{'droppable': isDrag}"
              @drop="onDrop(item.uid, $event)"
              @dragleave.prevent="onDragLeave"
              @dragover.prevent="onDragOver"
            >
              <div
                v-if="item.tasks && item.tasks.length !== 0"
                class="d-flex flex-wrap mt-2 mt-md-1 justify-start justify-md-end"
              >
                <v-chip
                  v-for="(task, index) in item.tasks"
                  :key="index"
                  :close="$can('update', 'User')"
                  :title="getTaskTitle(task)"
                  class="mb-1 mr-1"
                  label
                  small
                  style="max-width: 150px"
                  @click:close="onDeleteTask(item.uid, task)"
                >
                  <span class="text-truncate">
                    {{ getTaskTitle(task) }}
                  </span>
                </v-chip>
              </div>
              <div v-else>
                <small class="text--secondary font-italic">
                  Задач нет
                </small>
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
              :disable="!$can('update', 'User')"
              color="primary"
              icon="mdi-account-plus"
              @click="$emit('invite')"
            >
              Пригласить
            </icon-btn-with-tip>
          </template>
          <template v-slot:item.action="{item}">
            <row-actions>
              <icon-btn-with-tip
                color="primary"
                icon="mdi-account-edit"
                @click="showEditor(item.uid)"
              >
                Редактировать
              </icon-btn-with-tip>
              <icon-btn-with-tip
                color="error"
                icon="mdi-delete"
                @click="onDeleteUser(item.uid)"
              >
                Удалить
              </icon-btn-with-tip>
              <icon-btn-with-tip
                color="info"
                icon="mdi-eye"
                @click="gotoUser(item.uid)"
              >
                Перейти в аккаунт
              </icon-btn-with-tip>
            </row-actions>
          </template>
        </v-data-table>
      </app-base-sheet>
      <app-popup
        ref="deleteUser"
      >
        Пользователь будет перемещён в архив. Все его данные будут сохранены.<br>Продолжить?
      </app-popup>
      <user-editor ref="userEditorModal"/>
      <import-modal ref="importModal"/>
    </template>
    <template v-slot:navbar>
      <app-base-sheet>
        <administration-right-sidebar
          :filter.sync="filter"
          @add="showEditor"
          @export=""
          @import="showImport"
        />
      </app-base-sheet>
      <app-base-sheet v-if="Object.values(tasks).length">
        <administration-drag-items
          :drag.sync="isDrag"
          :items="Object.values(tasks)"
        />
      </app-base-sheet>
    </template>
  </app-block-with-right-navbar>
</template>

<script>
import {currentUID, tasks, user, users} from "@/mixins/ComputedData";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import UserEditor from "@/components/Modals/UserEditor";
import AppPopup from "@/components/AppPopup";
import AdministrationRightSidebar from "@/components/Administration/AdministrationRightSidebar";
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";
import GroupTools from "@/components/ScheduleViewer/GroupTools";
import RowActions from "@/components/RowActions";
import AppBaseSheet from "@/layouts/AppBaseSheet";
import AdministrationDragItems from "@/components/Administration/AdministrationDragItems";
import Users from "@/plugins/TableHeaders/Users";
import ImportModal from "@/components/Modals/ImportModal";
import {Team} from "@/plugins/servises/Team";
import {Post} from "@/plugins/servises/Post";
import {Task} from "@/plugins/servises/Task";

export default {
  name: 'UserTab',
  mixins: [users, tasks, user, currentUID],
  components: {
    ImportModal,
    AdministrationDragItems,
    AppBaseSheet,
    RowActions,
    GroupTools,
    AppBlockWithRightNavbar,
    AdministrationRightSidebar,
    AppPopup,
    IconBtnWithTip,
    UserEditor,

  },
  GROUPS: [
    {value: 'post', text: 'Должноcтям'},
    {value: 'team', text: 'Командам'},
    {value: 'active', text: 'Статусу'}
  ],
  data: () => ({
    headers: Users,
    isDrag: false,
    groupBy: null,
    filter: {},
  }),
  methods: {
    getGroupHeaderText(val, [groupBy]) {
      switch (groupBy) {
        case 'active':
          return val ? 'Зарегистрирован' : 'Не зарегистрирован';
        case 'team':
          return this.getTeamTitle(id)
        case 'post':
          return this.getPostTitle(id)

        default:
          return groupBy
      }
    },
    getTeamTitle(id) {
      return Team.getTitle(id)
    },
    getPostTitle(id) {
      return Post.getTitle(id)
    },
    getTaskTitle(id) {
      return Task.getTitle(id)
    },
    onDeleteTask(uid, id) {
      this.users[uid].Task.remove(id)
    },
    gotoUser(uid) {
      this.$router.push({name: 'User', params: {uid}})
    },
    customFilter(value, json, item) {
      const {filter} = JSON.parse(json || "")

      if (!filter) return true

      return Object.entries(filter).every(([key, val]) => {
        if (val === 'all') return true
        if (val === 'none') return !!!item[key]

        let itemVal = item[key]

        if (Array.isArray(itemVal)) {
          return itemVal.some(x => x === val)
        }

        return itemVal === val
      })
    },
    onDragOver(e) {
      e.target.classList.add('droppable--active')
    },
    onDragLeave(e) {
      e.target.classList.remove('droppable--active')
    },
    onDrop(uid, e) {
      const id = e.dataTransfer.getData('id')
      this.users[uid].Task.add(id)
    },
    async onDeleteUser(uid) {
      let result = await this.$refs.deleteUser.open()

      if (result) {
        this.users[uid].delete()
      }
    },
    showEditor(uid) {
      this.$refs.userEditorModal.open(uid)
    },
    showImport() {
      this.$refs.importModal.open()
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

  background-color: rgba(138, 255, 255, 0.45);
  border-radius: 5px;
  border-style: dashed;
  border-color: rgba(58, 247, 247, .5);
  z-index: 10;

  &:hover {
    background-color: rgba(138, 255, 255, 0.45);
  }
}
</style>