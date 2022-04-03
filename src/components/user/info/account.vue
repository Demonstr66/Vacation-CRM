<template>
  <v-card flat>
    <v-form @submit.prevent="onSubmit">
      <v-card-title v-if="!notitle">Информация</v-card-title>
      <v-card-text>
        <v-row>
          <v-col :cols="12 / cols">
            <v-text-field
              name="email"
              label="Email"
              v-model="user.email"
              :disabled="disEmail"
              :append-icon="disEmail ? 'mdi-lock' : ''"
              @change="changed"
            >
              <template slot="prepend">
                <v-icon color="blue-grey lighten-1">mdi-email</v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col :cols="12 / cols">

            <v-autocomplete
              label="Должность"
              name="post"
              :append-icon="disPost ? 'mdi-lock' : ''"
              clearable
              placeholder="Должность не указана"
              :items="posts"
              hide-selected
              single-line
              v-model="user.post"
              @change="changed"
              :disabled="disPost"
              item-text="title"
              item-value="id"
            >
              <template slot="prepend">
                <v-icon color="blue-grey lighten-1"
                  >mdi-file-account-outline</v-icon
                >
              </template>
              <template v-slot:selection="data">
                {{ data.item.title }}
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title v-text="data.item.title">
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col :cols="12 / cols">
            <v-autocomplete
              label="Команда"
              :append-icon="disTeams ? 'mdi-lock' : ''"
              placeholder="Не в команде"
              :items="teams"
              v-model="user.team"
              @change="changed"
              :disabled="disTeams"
              clearable
              item-text="title"
              item-value="id"
            >
              <template slot="prepend">
                <v-icon color="blue-grey lighten-1">mdi-account-group</v-icon>
              </template>
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  outlined
                  small
                  label
                >
                  {{ data.item.title }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title v-text="data.item.title">
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col :cols="12 / cols">
            <v-autocomplete
              label="Задачи"
              :append-icon="disTasks ? 'mdi-lock' : ''"
              multiple
              clearable
              placeholder="Задач нет"
              :items="tasks"
              v-model="user.task"
              @change="changed"
              :disabled="disTasks"
              item-text="title"
              item-value="id"
            >
              <template slot="prepend">
                <v-icon color="blue-grey lighten-1"
                  >mdi-format-list-bulleted-square</v-icon
                >
              </template>
              <template v-slot:selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  outlined
                  small
                  label
                >
                  {{ data.item.title }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title v-text="data.item.title">
                  </v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="!disSubmit && !noaction">
        <v-spacer></v-spacer>
        <v-btn type="submit" color="success" text :disabled="!isChanged">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { defUser } from "../../../plugins/schema";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    disabled: {
      type: [Boolean, Object],
      default: false,
    },
    notitle: {
      type: Boolean,
      default: false,
    },
    noaction: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: Number,
      default: 1,
    },
    res: Object,
  },
  data: () => ({
    isChanged: false,
    user: defUser(),
  }),
  created() {
    this.user = defUser(this.data);
  },
  computed: {
    ...mapState({
      teams: (state) =>
        state.workspace.workspace ? state.workspace.workspace.teams : [],
      tasks: (state) =>
        state.workspace.workspace ? state.workspace.workspace.tasks : [],
      posts: (state) =>
        state.workspace.workspace ? state.workspace.workspace.posts : [],
    }),
    disEmail() {
      return typeof this.disabled == "boolean"
        ? this.disabled
        : this.disabled.email || false;
    },
    disPost() {
      return typeof this.disabled == "boolean"
        ? this.disabled
        : this.disabled.post || false;
    },
    disTeams() {
      return typeof this.disabled == "boolean"
        ? this.disabled
        : this.disabled.teams || false;
    },
    disTasks() {
      return typeof this.disabled == "boolean"
        ? this.disabled
        : this.disabled.tasks || false;
    },
    disSubmit() {
      return typeof this.disabled == "boolean"
        ? this.disabled
        : this.disEmail && this.disPost && this.disTeams && this.disTasks;
    },
  },
  methods: {
    onSubmit() {
      if (this.disSubmit || this.noaction) return;

      this.saveData();
    },
    saveData() {
      this.$store
        .dispatch("user/update", {
          email: this.email,
          post: this.post,
          team: this.team,
          task: this.task,
        })
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Данные сохранены",
          })
        )
        .then((this.isChanged = false));
    },
    changed() {
      this.isChanged = true;
      this.$emit("change", this.user);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>