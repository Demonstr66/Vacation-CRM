<template>
  <v-card flat>
    <v-card-title v-if="!noTitle">Информация</v-card-title>
    <v-card-text>
      <v-row>
        <v-col :cols="12 / cols">
          <v-text-field
            v-model="email"
            :append-icon="disEmail ? 'mdi-lock' : ''"
            :disabled="disEmail"
            :rules="[blankCheck, emailCheck]"
            label="Email"
            name="email"
            @change.once="changed"
          >
            <template v-slot:prepend>
              <input-icon>mdi-email</input-icon>
            </template>
            <template v-if="!!domain && needDomain" v-slot:append>
              {{ domain }}
            </template>
          </v-text-field>
        </v-col>
        <v-col :cols="12 / cols">
          <v-select
            v-model="post"
            :append-icon="disPost ? 'mdi-lock' : ''"
            :disabled="disPost"
            :items="Object.values(posts)"
            clearable
            hide-selected
            item-text="title"
            item-value="id"
            label="Должность"
            name="post"
            placeholder="Должность не указана"
            @change.once="changed"
          >
            <template v-slot:prepend>
              <input-icon>mdi-account-group</input-icon>
            </template>
          </v-select>
        </v-col>
        <v-col :cols="12 / cols">
          <v-select
            v-model="team"
            :append-icon="disTeams ? 'mdi-lock' : ''"
            :disabled="disTeams"
            :items="Object.values(teams)"
            clearable
            item-text="title"
            item-value="id"
            label="Команда"
            placeholder="Не в команде"
            @change.once="changed"
          >
            <template v-slot:prepend>
              <input-icon>mdi-account-group</input-icon>
            </template>
          </v-select>
        </v-col>
        <v-col :cols="12 / cols">
          <v-select
            v-model="userTasks"
            :append-icon="disTasks ? 'mdi-lock' : ''"
            :disabled="disTasks"
            :items="Object.values(tasks)"
            clearable
            item-text="title"
            item-value="id"
            label="Задачи"
            multiple
            placeholder="Задач нет"
            @change.once="changed"
          >
            <template v-slot:prepend>
              <input-icon>
                mdi-format-list-bulleted-square
              </input-icon>
            </template>

          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="!disSubmit && !noAction">
      <v-spacer></v-spacer>
      <v-btn :disabled="!isChanged" color="success" text type="submit">
        Сохранить
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
import {defUser} from "@/plugins/schema";
import {inputRules} from "@/mixins/inputRules";
import {appReady, domain, posts, tasks, teams} from "@/mixins/ComputedData";
import InputIcon from "@/components/user/info/InputIcon";

export default {
  name: 'AccountUserInfo',
  components: {InputIcon},
  mixins: [inputRules, teams, tasks, posts, domain, appReady],
  props: {
    user: {
      email: String,
      tasks: Array,
      team: String,
      post: String
    },
    disabled: {
      type: [Boolean, Object],
      default: false,
    },
    noTitle: {
      type: Boolean,
      default: false,
    },
    noAction: {
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
    email: "",
    post: null,
    userTasks: null,
    team: null
  }),
  mounted() {
    this.initialize()
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
    needDomain() {
      const email = this.email
      if (!email) return

      return this.email.indexOf('@') == -1
    }
  },
  methods: {
    initialize() {
      if (!this.user) return

      const {email, post, tasks, team} = this.user

      this.email = email
      this.post = post
      this.userTasks = tasks
      this.team = team
    },
    isDisableItem(item) {
      return typeof this.disabled == "boolean"
        ? this.disabled
        : this.disabled[item] || false;
    },
    onSubmit() {
      if (this.disSubmit || this.noaction) return;

      this.saveUser(false, this.user)
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
      if (this.needDomain) user.email += this.domain

      return user
    },
    validate() {
      return this.$refs.accUserForm.validate()
    }
  },
  watch: {
    appReady(val) {
      if (val) this.initialize()
    }
  }
};
</script>
