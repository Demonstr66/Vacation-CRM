<template>
  <app-block-with-right-navbar>
    <template v-slot:main>
      <app-base-sheet>
        <v-data-table
            :items="Object.values(users)"
            :search="JSON.stringify(filters)"
            :custom-filter="CUSTOM_USER_FILTER"

            :group-by.sync="groupBy"
            :headers="$options.headers"
            :item-class="() => 'dropRow'"
            class="th-xs-pa-0 table-d-block"
            dense
            item-key="uid"
        >
          <template v-slot:top>
            <app-group-toolbar v-model="groupBy">
              <btn-open-sidebar/>
            </app-group-toolbar>
          </template>
          <template v-if="!$vuetify.breakpoint.smAndUp" v-slot:item="{item}">
            <div style="max-width: 100%" class="d-flex justify-space-between align-center mt-2">
              <div style="max-width: 100%" class=" text-truncate">
                <div class="text-subtitle-2 text-no-wrap px-2">
                  <span class=" font-weight-bold">{{ item.fullName }}</span>
                  <span v-if="item.uid === currentUID" class="font-italic">(Вы)</span>
                </div>
                <div class="text-body-2 text-no-wrap px-2">
                  <span class="font-weight-medium text--secondary">Должность:</span>
                  <span class="ml-1" v-if="item.post">{{ getPostTitle(item.post) }}</span>
                  <span class="ml-1 grey--text lighten-2 font-italic" v-else>Не назначена</span>
                </div>
                <div class="text-body-2 text-no-wrap px-2">
                  <span class="font-weight-medium text--secondary">Команда:</span>
                  <span class="ml-1" v-if="item.team">{{ getTeamTitle(item.team) }}</span>
                  <span class="ml-1 grey--text lighten-2 font-italic" v-else>Не назначена</span>
                </div>
                <div class="text-body-2 text-no-wrap px-2">
                  <a :href="'mailto:'+item.email" class=" grey--text">
                    {{ item.email }}
                  </a>
                </div>
                <div class="text-body-2 text-no-wrap px-2 text-center">
                  <v-chip-group v-if="item.tasks && item.tasks.length" column>
                    <v-chip
                        v-for="task in item.tasks"
                        :key="task + item.uid"
                        class="mx-1"
                        small
                        label
                    >
                      {{ getTaskTitle(task) }}
                    </v-chip>
                  </v-chip-group>
                </div>
              </div>
              <row-actions>
                <icon-btn-with-tip
                    v-if="item.active"
                    color="success"
                    icon="mdi-check-decagram"
                >
                  Зарегистрирован
                </icon-btn-with-tip>
                <icon-btn-with-tip
                    v-else
                    :disable="!$can('updateAccountData', item)"
                    color="primary"
                    icon="mdi-account-plus"
                    @click="$emit('invite')"
                >
                  Пригласить
                </icon-btn-with-tip>
                <icon-btn-with-tip
                    :disable="
                                !$can('updateAccountData', item) &&
                                !$can('updatePersonalData', item) &&
                                !$can('updateUserRole', item) &&
                                !$can('updateTeam', item)"
                    color="primary"
                    icon="mdi-account-edit"
                    @click="showEditor(item.uid)"
                >
                  Редактировать
                </icon-btn-with-tip>
                <icon-btn-with-tip
                    :disable="!$can('delete', item)"
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
            </div>
            <v-divider/>
          </template>
          <template v-slot:group.header="data">
            <app-table-group-header :data="data" :header="getGroupHeaderText(data.group, data.groupBy)"/>
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
                :class="{'droppable': dragging}"
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
                    :close="$can('updateAccountData', item)"
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
                :disable="!$can('updateAccountData', item)"
                color="primary"
                icon="mdi-account-plus"
                @click="invite(item.uid)"
                :loading="item.uid === invitingUID"
            >
              Пригласить
            </icon-btn-with-tip>
          </template>
          <template v-slot:item.action="{item}">
            <row-actions>
              <icon-btn-with-tip
                  :disable="
                    !$can('updateAccountData', item) &&
                    !$can('updatePersonalData', item) &&
                    !$can('updateUserRole', item) &&
                    !$can('updateTeam', item)"
                  color="primary"
                  icon="mdi-account-edit"
                  @click="showEditor(item.uid)"
              >
                Редактировать
              </icon-btn-with-tip>
              <icon-btn-with-tip
                  :disable="!$can('delete', item) || item.uid === currentUID"
                  color="error"
                  icon="mdi-delete"
                  @click="onDeleteUser(item.uid)"
              >
                Удалить
              </icon-btn-with-tip>
              <icon-btn-with-tip
                  color="info"
                  icon="mdi-eye"
                  tag="a" :to="{name: 'Employee', params: {uid: item.uid}}"
              >
                Перейти в аккаунт
              </icon-btn-with-tip>
            </row-actions>
          </template>
        </v-data-table>
      </app-base-sheet>
      <app-popup ref="deleteUser">
        Пользователь и все его данные будут удалены. <br>Продолжить?
      </app-popup>
      <user-editor ref="userEditorModal"/>
      <Can :this="$options.someUser" I="create">
        <import-modal ref="importModal"/>
      </Can>
    </template>
    <template v-slot:sidebar>
      <app-filters v-model="filters" :hide-filters="['vacationStatus']">
        <template v-slot:header="{headerText}">
          <organization-employees-tools :inviting="invitingAll" :all-users-registred="isAllActive"/>
        </template>
      </app-filters>
      <Can :on="$options.someUser" I="updateAccountData">
        <app-base-sheet v-if="Object.values(tasks).length">
          <organization-draggable-tasks
              v-model="dragging"
          />
        </app-base-sheet>
      </Can>
    </template>
  </app-block-with-right-navbar>
</template>

<script>
import {currentUID, tasks, user, users} from "@/mixins/ComputedData";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import UserEditor from "@/components/Modals/UserEditor";
import AppPopup from "@/components/AppPopup";
import AppBlockWithRightNavbar from "@/components/UI/app-block-with-sidebar";
import RowActions from "@/components/RowActions";
import AppBaseSheet from "@/components/UI/app-base-sheet";
import OrganizationDraggableTasks from "@/components/Organization/organization-draggable-tasks";
import Users from "@/plugins/TableHeaders/Users";
import ImportModal from "@/components/Modals/ImportModal";
import {Team} from "@/plugins/servises/Team";
import {Post} from "@/plugins/servises/Post";
import {Task} from "@/plugins/servises/Task";
import {User} from "@/plugins/servises/User";
import {Message} from "@/plugins/servises/Message";
import {api} from "@/plugins/api";
import AppGroupToolbar from "@/components/UI/app-group-toolbar";
import AppFilters from "@/components/UI/app-filters";
import {CUSTOM_USER_FILTER} from "@/mixins/Filters";
import AppTableGroupHeader from "@/components/UI/app-table-group-header";
import BtnOpenSidebar from "@/components/UI/btn-open-sidebar";
import OrganizationEmployeesTools from "@/components/Organization/organization-employees-tools";

export default {
  name: 'Employees',
  someUser: new User(),
  mixins: [users, tasks, user, currentUID, CUSTOM_USER_FILTER],
  components: {
    OrganizationEmployeesTools,
    BtnOpenSidebar,
    AppTableGroupHeader,
    AppFilters,
    AppGroupToolbar,
    ImportModal,
    OrganizationDraggableTasks,
    AppBaseSheet,
    RowActions,
    AppBlockWithRightNavbar,
    AppPopup,
    IconBtnWithTip,
    UserEditor,
  },
  headers: Users,
  data() {
    return {
      dragging: false,
      groupBy: null,

      invitingUID: null,
      invitingAll: false,
      filter: {},
      filters: {}
    }
  },
  computed: {
    isAllActive() {
      return Object.values(this.users).every(user => user.active)
    }
  },
  methods: {
    async invite(uid, silent = false) {
      if (!silent) {
        this.invitingUID = uid
      }
      try {
        await api.user.invite(uid)
        if (!silent) {
          Message.successMessage({code: 'auth/user-invited'})
        }
      } catch (e) {
        if (!silent) {
          Message.errorMessage(e)
        }
      } finally {
        if (!silent) {
          this.invitingUID = null
        }
      }
    },
    async inviteAll() {
      try {
        this.invitingAll = true
        let promises = []
        for (let uid in this.users) {
          let user = this.users[uid]
          if (!user.active) {
            promises.push(this.invite(user.uid, true))
          }
        }

        await Promise.all(promises)
        Message.successMessage('Приглашения отправлены')
      } catch (e) {
        Message.errorMessage(e)
      } finally {
        this.invitingAll = false
      }
    },
    getGroupHeaderText(val, [groupBy]) {
      switch (groupBy) {
        case 'active':
          return val ? 'Зарегистрирован' : 'Не зарегистрирован';
        case 'team':
          return this.getTeamTitle(val)
        case 'post':
          return this.getPostTitle(val)
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
      this.$router.push({name: 'Employee', params: {uid}})
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