<template>
  <v-card flat>
    <v-form @submit.prevent="onSubmit" ref="accUserForm">
      <v-card-title v-if="!notitle">Информация</v-card-title>
      <v-card-text>
        <v-row>
          <v-col :cols="12 / cols">
            <v-text-field
              name="email"
              label="Email"
              v-model="user.email"
              :rules="[blankCheck]"
              :disabled="disEmail"
              :append-icon="disEmail ? 'mdi-lock' : ''"
              @change.once="changed"
            >
              <template slot="prepend">
                <v-icon color="blue-grey lighten-1">mdi-email</v-icon>
              </template>
              <template v-if="!!domen && needDomen" slot="append">
                {{domen}}
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
              @change.once="changed"
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
              @change.once="changed"
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
              v-model="user.tasks"
              @change.once="changed"
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
import {inputRules} from "@/mixins/inputRules";

export default {
  mixins:[inputRules],
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
    domen: {
      type: String,
      default: '',
    },
    res: Object,
  },
  data: () => ({
    isChanged: false,
    user: defUser(),
  }),
  created() {
    this.update();
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
    needDomen() {
      return this.user.email.indexOf('@') == -1
    }
  },
  methods: {
    onSubmit() {
      if (this.disSubmit || this.noaction) return;

      this.saveData("user/update", this.user)
        .then(this.successMsg())
        .then((this.isChanged = false))
        .catch((err) => this.successMsg(err));
    },
    saveData(saveMethod, user) {
      return this.$store.dispatch(saveMethod, {
        uid: user.uid,
        email: user.email,
        post: user.post,
        team: user.team,
        tasks: user.tasks,
        workspace: user.workspace,
      });
    },
    successMsg() {
      this.$store.dispatch("setMessage", {
        type: "success",
        text: "Данные сохранены",
      });
    },
    errMsg(err) {
      this.$store.dispatch("setMessage", {
        type: "error",
        text: err.message,
        code: err.code,
      });
    },
    changed() {
      this.isChanged = true;
      this.$emit("change", this.user);
    },
    reset() {
      console.log("reset");
      this.$refs.accUserForm.reset();
      this.user = defUser();
    },
    update() {
      this.user = defUser(this.data);
    },
    getData() {
      let user = this.user
      if (this.needDomen) user.email += this.domen

      return user
    },
    validate() {
      return this.$refs.accUserForm.validate()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>