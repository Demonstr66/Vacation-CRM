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
        Закрыть все
      </icon-btn-with-tip>
    </div>
    <v-divider></v-divider>
    <v-treeview
      :active="active"
      :items="tree"
      :open.sync="open"
    >
      <template v-slot:label="{item}">
        <v-form class="ma-1" @submit.prevent="onSubmit(item)">
          <span class="pl-2 subtitle-2">{{ item.title }}</span>
          <div class="pl-2">
            <span class="text--secondary">Лидер: </span>
            <span v-if="!item.leaderId" class="primary--text">Не назначен</span>
            <span v-else class="primary--text">
              {{ getShortUserNameByUID(item.leaderId) }}
            </span>
          </div>
        </v-form>
      </template>
      <template v-slot:prepend="{ item }">
        <v-icon
          v-text="`mdi-${item.root ? 'home-variant' : 'folder-network'}`"
        ></v-icon>
      </template>
      <template v-slot:append="{item}">
        <div
          v-if="item.children"
          style="z-index: 1000"
        >
          <v-btn v-if="!item.root" color="error" icon small @click.stop="onDelete(item)">
            <v-icon>
              mdi-minus-circle-outline
            </v-icon>
          </v-btn>
          <v-btn v-if="!item.root" color="info" icon small @click.stop="onEdit(item)">
            <v-icon>
              mdi-pencil-circle-outline
            </v-icon>
          </v-btn>
          <v-btn color="success" icon small @click.stop="addTeam(item.id)">
            <v-icon>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
        </div>
      </template>
    </v-treeview>
    <Alert
      :show="teamEditor"
      :submit-disable="!teamEditorFormValid"
      title="Настройки команды"
      @cancel="closeTeamEditor"
      @submit="teamEditorSubmit"
    >
      <v-form ref="teamEditorForm" v-model="teamEditorFormValid">
        <v-text-field v-show="false" v-model="editingItem.id"></v-text-field>
        <v-text-field v-show="false" v-model="editingItem.parent"></v-text-field>
        <v-text-field
          v-model="editingItem.title"
          :rules="[blankCheck]"
          dense
          flat
          placeholder="Название команды"
          single-line
        ></v-text-field>
        <v-select
          v-model="editingItem.leaderId"
          :items="Object.values(users)"
          clearable
          item-text="fullName"
          item-value="uid"
          placeholder="Выберите лидера"
        >
        </v-select>
      </v-form>
    </Alert>
    <Alert
      :show="deletingAlert"
      @cancel="closeDeletingAlert"
      @submit="deleteItems"
    >
      Команда <span class="font-weight-bold">{{
        deletingItems ? teams[deletingItems[0]].title :
          ''
      }}</span>
      будет удалена,
      продолжить?
      <v-checkbox
        v-if="deletingItems && deletingItems.length > 1"
        v-model="deleteInnerTeams"
        dense
        hide-details
        label="Удалить вложенные команды?"
      ></v-checkbox>
    </Alert>
  </base-widget>
</template>

<script>
import {defTeam} from "@/plugins/schema";
import {getShortUserNameByUID, teams, users, workspace} from '@/mixins/ComputedData';
import ListWithAdd from "@/components/Administration/BaseListWidget";
import {getUserNameById} from "@/mixins/dataHelper";
import BaseWidget from "@/components/Administration/BaseWidget";
import Alert from "@/components/Modals/Alert";
import {inputValidations} from "@/mixins/InputValidations";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {TeamMethods} from "@/mixins/TeamMethods";

function treesIndexes(tree) {
  console.log('tree: ', tree)
  let ids = []
  const f = (d) => {
    ids.push(d.id)
    if (!d.children || !d.children.length) return
    d.children.forEach(f)
  }

  f(tree)

  return ids
}

export default {
  mixins: [teams, TeamMethods, getUserNameById, users, workspace, inputValidations,
    getShortUserNameByUID],
  components: {
    IconBtnWithTip,
    Alert,
    BaseWidget,
    ListWithAdd
  },
  data: () => ({
    deletingAlert: false,
    deletingItems: null,
    deleteInnerTeams: false,
    teamEditor: false,
    teamEditorFormValid: false,
    editingItem: {
      id: null,
      title: null,
      leaderId: null,
      parent: null
    },
    sort: 0,
    open: [],
    active: []
  }),
  computed: {
    tree() {
      const sort = this.sort
      const teams = Object.freeze({...this.teams})
      const keys = Object.keys(teams)
      const values = Object.values(teams)

      let tree = {...this.workspace, children: [], root: true, leaderId: ''}
      tree.leaderId = tree.owner
      let tempTeams = [...values]

      tempTeams = tempTeams.map(t => {
        t.children = [];
        return t
      })
      tempTeams.map((t, index) => {
        if (t.parent === '') return

        const idx = keys.findIndex(i => t.parent === i)
        if (idx === -1) return
        tempTeams[idx].children.push(index)
      })
      tempTeams = tempTeams.map(t => {
        t.children = t.children.map(c => tempTeams[c]);
        return t
      })
      tempTeams = tempTeams.filter(t => t.parent == '')
      tree.children.push(...tempTeams)
      if (sort > 0) tree = this.sortChildren(tree)
      return [{...tree}]
    }
  },
  methods: {
    compare(a, b) {
      return this.sort == 1 ? a > b : a < b
    },
    sortChildren(treeItem) {
      if (treeItem.children && treeItem.children.length) {
        treeItem.children = treeItem.children.sort((a, b) =>
          this.compare(a.title, b.title)
            ? 0
            : -1
        )
        treeItem.children.forEach(this.sortChildren)
      }

      return treeItem
    },
    toggleSort() {
      this.sort = (this.sort + 1) % 3
    },
    expandAll() {
      this.open = treesIndexes(this.tree[0])
    },
    collapseAll() {
      this.open = []
    },
    console(val = "") {
      console.log(val)
    },
    showTeamEditor() {
      this.teamEditor = true
    },
    closeTeamEditor() {
      this.$refs.teamEditorForm.reset()
      this.teamEditor = false
    },
    showDeletingAlert() {
      this.deletingAlert = true
    },
    closeDeletingAlert() {
      this.deletingAlert = false
      this.deletingItems = null
      this.deleteInnerTeams = false
    },
    addTeam(parent) {
      if (parent === this.workspace.id) parent = ''
      this.editingItem.parent = parent

      this.showTeamEditor()
    },
    teamEditorSubmit() {
      const team = defTeam(this.editingItem);

      if (!team.id) this.createTeam(team)
      else this.updateTeam(team)

      this.closeTeamEditor()
    },
    onDelete(item) {
      this.deletingItems = treesIndexes(item)
      this.showDeletingAlert()
    },
    deleteItems() {
      let ids = this.deletingItems
      if (this.deleteInnerTeams) ids.map(id => this.deleteTeam(id))
      else {
        const [id] = ids.splice(0, 1)
        const parent = this.teams[id].parent
        ids.map(t => {
          let team = this.teams[t]
          if (team.parent === id) {
            team.parent = parent
            this.silentSaveTeam(false, team)
          }
        })

        this.deleteTeam(id)
      }
      this.closeDeletingAlert()
    },
    onEdit(item) {
      this.editingItem = {
        id: item.id,
        title: item.title,
        leaderId: item.leaderId,
        parent: item.parent
      }
      this.showTeamEditor()
    }
  },
};
</script>
