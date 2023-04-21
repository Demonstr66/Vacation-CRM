<template>
  <base-widget title="Команды">
    <v-divider></v-divider>
    <div class="text-right">
      <icon-btn-with-tip
          :color="sort !== 0 ? 'primary' : ''"
          :icon="'mdi-sort-alphabetical-' + (sort !== 2 ? 'ascending' : 'descending')"
          @click="toggleSort"
      >
        Сортировка
      </icon-btn-with-tip>

      <icon-btn-with-tip icon="mdi-unfold-more-horizontal" @click="expandAll">
        Раскрыть все
      </icon-btn-with-tip>

      <icon-btn-with-tip icon="mdi-unfold-less-horizontal" @click="collapseAll">
        Свернуть все
      </icon-btn-with-tip>
    </div>
    <v-divider></v-divider>
    <v-treeview
        :active="active"
        :items="sortedTree"
        :open.sync="open"
    >
      <template v-slot:label="{item}">
        <div>
          <span class="pl-2 subtitle-2">{{ item.title }}</span>
          <div class="pl-2">
            <span class="text--secondary">Лидер: </span>
            <span v-if="!item.leaderId" class="primary--text">Не назначен</span>
            <span v-else class="primary--text">
              {{ getShortUserNameByUID(item.leaderId) }}
            </span>
          </div>
        </div>
      </template>
      <template v-slot:prepend="{ item }">
        <v-icon
            v-text="`mdi-${item.root ? 'home-variant' : 'folder-network'}`"
        ></v-icon>
      </template>
      <template v-slot:append="{item}" v-if="$can('manage', 'Team')">
        <div>
          <v-btn v-if="!item.root" color="error" icon small @click.stop="deleteTeam(item)">
            <v-icon>
              mdi-minus-circle-outline
            </v-icon>
          </v-btn>
          <v-btn v-if="!item.root" color="info" icon small @click.stop="editTeam(item)">
            <v-icon>
              mdi-pencil-circle-outline
            </v-icon>
          </v-btn>
          <v-btn color="success" icon small @click.stop="createTeam(item.id)">
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-treeview>

    <app-popup
        ref="editPopup"
    >
      <template v-slot:default="{data, setResData, setSubmitDisable}">
        <v-form v-if="data" @input="(val) => setSubmitDisable(!val)">
          <v-text-field
              :rules="[blankCheck]"
              :value="data.title"
              dense
              flat
              placeholder="Название команды"
              single-line

              @change="(val) => setResData('title', val)"
          ></v-text-field>
          <v-select
              :items="Object.values(users)"
              :value="data.leaderId"
              clearable
              item-text="fullName"
              item-value="uid"
              placeholder="Выберите лидера"
              @change="(val) => setResData('leaderId', val)"
          >
          </v-select>
        </v-form>
      </template>
    </app-popup>
    <app-popup
        ref="deletePopup"
    >
      <template v-slot:default="{data, setResData}">
        Команда
        <span v-if="data" class="font-weight-bold">
          {{ data.title }}
        </span>
        будет удалена, продолжить?
        <v-checkbox
            v-if="data && data.children && data.children.length > 0"
            dense
            hide-details
            label="Удалить вложенные команды?"
            @change="(val) => setResData('deleteChildren', val)"
        ></v-checkbox>
      </template>
    </app-popup>
  </base-widget>
</template>

<script>
import {getShortUserNameByUID, teams, users, workspace} from '@/mixins/ComputedData';
import {getUserNameById} from "@/mixins/dataHelper";
import BaseWidget from "@/components/Organization/BaseWidget";
import {inputValidations} from "@/mixins/InputValidations";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import AppPopup from "@/components/AppPopup";
import {Team} from "@/plugins/servises/Team";
import {User} from "@/plugins/servises/User";

export default {
  mixins: [teams, getUserNameById, users, workspace, inputValidations,
    getShortUserNameByUID],
  components: {
    AppPopup,
    IconBtnWithTip,
    BaseWidget,
  },
  data: () => ({
    sort: 0,
    open: [],
    active: []
  }),
  computed: {
    tree() {
      const {teams, workspace} = this

      let tree = {...workspace, children: [], root: true, leaderId: workspace.owner}

      let tempTeams = {...teams}

      for (let id in tempTeams) {
        let team = tempTeams[id]
        let parent = team.parent

        if (parent === '') {
          continue
        }

        if (!teams[parent].children) {
          tempTeams[parent].children = []
        }
        if (!tempTeams[parent].children.find(child => child.id === team.id)) {
          tempTeams[parent].children.push(team)
        }
      }

      tree.children.push(...Object.values(tempTeams).filter(t => t.parent === ''))

      return [tree]
    },
    sortedTree() {
      const {sort, tree} = this
      if (sort === 0) {
        return tree
      }

      return [this.sortChildren(tree[0])]
    }
  },
  methods: {
    compare(item1, item2) {
      let a = item1.title,
          b = item2.title
      return (this.sort === 1 ? a > b : a < b) ? 0 : -1
    },
    sortChildren(node) {
      if (!node.children || !node.children.length) {
        return {...node}
      }

      let children = [...node.children]
      children = children.sort(this.compare)
      children.forEach(this.sortChildren)
      return Object.assign({}, node, {children})
    },
    toggleSort() {
      this.sort = (this.sort + 1) % 3
    },
    expandAll() {
      this.open = [...Object.keys(this.teams), this.workspace.id]
    },
    collapseAll() {
      this.open = []
    },

    createTeam(parent) {
      if (parent === this.workspace.id) {
        parent = ''
      }

      this.editTeam({parent})
    },
    async editTeam(item) {
      let result = await this.$refs.editPopup.open(item)
      if (result) {
        let promise
        if (item.id) {
          promise = Team.update(Object.assign(item, result.data))
        } else {
          promise = Team.create(Object.assign(item, result.data))
        }

        promise.then(() => {
          User.determinateLeaders()
        })
      }
    },
    async deleteTeam(item) {
      let result = await this.$refs.deletePopup.open(item)

      if (result) {
        let promise = Team.delete(item.id, !!result.data.deleteChildren)

        promise.then(() => {
          User.determinateLeaders()
        })
      }
    },
  },
};
</script>
