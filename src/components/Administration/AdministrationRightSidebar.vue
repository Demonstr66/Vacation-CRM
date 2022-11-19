<template>
  <div class="d-flex flex-column fill-height">
    <Can I="create" :on="$options.someUser">
      <div class="d-flex">
        <v-btn
          class="flex-grow-1"
          color="primary"
          outlined
          text
          @click="$emit('add')"
        >
          Добавить
        </v-btn>
        <icon-btn-with-tip
          btn-class="ml-2"
          btn-style="border-radius: 4px; border-color: rgba(0, 0, 0, 0.12);"
          color="primary"
          icon="mdi-arrow-bottom-left"
          outlined
          @click="$emit('import')"
        >
          Импорт
        </icon-btn-with-tip>

        <!--        <icon-btn-with-tip-->
        <!--          btn-class="ml-2"-->
        <!--          btn-style="border-radius: 4px; border-color: rgba(0, 0, 0, 0.12);"-->
        <!--          color="primary"-->
        <!--          icon="mdi-arrow-top-right"-->
        <!--          outlined-->
        <!--          @click="$emit('export')"-->
        <!--        >-->
        <!--          Экспорт-->
        <!--        </icon-btn-with-tip>-->
      </div>
      <v-btn
        v-if="!isAllActive"
        class="flex-grow-1 mt-2"
        color="primary"
        outlined
        text
        @click="$emit('invite-all')"
        :loading="inviting"
      >
        Пригласить всех
      </v-btn>
    </Can>
    <v-select
      v-model="selectedPost"
      :items="[$options.ALL,...Object.values(posts), $options.NONE ]"
      class="mt-8"
      dense
      hide-details
      item-text="title"
      item-value="id"
      label="Должность"
    >
    </v-select>
    <v-select
      v-model="selectedTeam"
      :items="[$options.ALL,...Object.values(teams), $options.NONE ]"
      class="mt-8"
      dense
      hide-details
      item-text="title"
      item-value="id"
      label="Команда"
    >
    </v-select>
    <v-select
      v-model="selectedTask"
      :items="[$options.ALL,...Object.values(tasks), $options.NONE ]"
      class="mt-8"
      dense
      hide-details
      item-text="title"
      item-value="id"
      label="Задачи"
    >
    </v-select>
    <v-btn
      block
      class="mt-2"
      color="secondary"
      left
      small
      text
      @click="reset"
    >
      сброс
    </v-btn>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import {posts, tasks, teams} from "@/mixins/ComputedData";
import AdministrationDragItems from "@/components/Administration/AdministrationDragItems";
import {User} from "@/plugins/servises/User";

export default {
  name: 'AdministrationRightSidebar',
  someUser: new User(),
  components: {AdministrationDragItems, IconBtnWithTip},
  mixins: [teams, tasks, posts],
  NONE: {id: 'none', title: "Нет"},
  ALL: {id: 'all', title: "Все"},
  props: {
    filter: {},
    inviting: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    filterExtension: false,
    selectedTeam: 'all',
    selectedTask: 'all',
    selectedPost: 'all',
  }),
  computed: {
    isAllActive() {
      const users = Object.values(this.$store.getters['users/get'])
      return !users.some(user => !user.active)
    }
  },
  methods: {
    reset() {
      this.selectedTask = this.$options.ALL.id
      this.selectedTeam = this.$options.ALL.id
      this.selectedPost = this.$options.ALL.id
    },
    updateFilter() {
      const filter = {
        tasks: this.selectedTask,
        team: this.selectedTeam,
        post: this.selectedPost,
      }
      this.$emit('update:filter', filter)
    }
  },
  watch: {
    selectedTask() {
      this.updateFilter()
    },
    selectedTeam() {
      this.updateFilter()
    },
    selectedPost() {
      this.updateFilter()
    }
  }
}
</script>
