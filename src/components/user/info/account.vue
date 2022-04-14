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
            <v-select
              label="Должность"
              name="post"
              :append-icon="disPost ? 'mdi-lock' : ''"
              clearable
              placeholder="Должность не указана"
              :items="posts"
              item-text="title"
              item-value="id"
              hide-selected
              v-model="user.post"
              @change.once="changed"
              :disabled="disPost"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1"
                  >mdi-file-account-outline</v-icon
                >
              </template>
            </v-select>
          </v-col>
          <v-col :cols="12 / cols">
            <v-select
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
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-account-group</v-icon>
              </template>
            </v-select>
          </v-col>
          <v-col :cols="12 / cols">
            <v-select
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
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1"
                  >mdi-format-list-bulleted-square</v-icon
                >
              </template>

            </v-select>
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
import { defUser } from "@/plugins/schema";
import {inputRules} from "@/mixins/inputRules";
import {posts, tasks, teams} from "@/mixins/computedData";
import {userData} from "@/mixins/workspaceHelper";

export default {
  mixins:[inputRules, teams, tasks, posts, userData],
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
    disEmail() {
      return this.isDisableItem('email')
    },
    disPost() {
      return this.isDisableItem('post')
    },
    disTeams() {
      return this.isDisableItem('team')
    },
    disTasks() {
      return this.isDisableItem('tasks')
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
    isDisableItem(item) {
      return typeof this.disabled == "boolean"
          ? this.disabled
          : this.disabled[item] || false;
    },
    onSubmit() {
      if (this.disSubmit || this.noaction) return;

      this.mixSaveUserDataToDb(false, this.user)
    },
    changed() {
      this.isChanged = true;
      this.$emit("change");
    },
    reset() {
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