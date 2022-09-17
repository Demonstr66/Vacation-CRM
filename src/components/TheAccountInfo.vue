<template>
  <app-base-sheet :flat="!solo">
    <v-card flat>
      <component :is="tag" ref="form" @submit.prevent="onSubmit">
        <v-card-title v-if="!hideTitle">Информация</v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col :cols="12 / cols">
              <v-text-field
                v-model="user.email"
                :append-icon="disEmail ? 'mdi-lock' : ''"
                :disabled="disEmail"
                :rules="[blankCheck, emailCheck]"
                label="Email"
                name="email"

                @change="changed"
              >
                <template v-slot:prepend>
                  <input-icon>mdi-email</input-icon>
                </template>
                <template v-slot:append>
                  <v-chip
                    v-if="!!domain && (!user.email || user.email.indexOf('@') === -1)"
                    color="info"
                    label
                    outlined
                    small
                    v-text="domain"
                  ></v-chip>
                </template>
              </v-text-field>
            </v-col>
            <v-col :cols="12 / cols">
              <v-select
                v-model="user.post"
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
                @change="changed"
              >
                <template v-slot:prepend>
                  <input-icon>mdi-account-group</input-icon>
                </template>
              </v-select>
            </v-col>
            <v-col :cols="12 / cols">
              <v-select
                v-model="user.team"
                :append-icon="disTeam ? 'mdi-lock' : ''"
                :disabled="disTeam"
                :items="Object.values(teams)"
                clearable
                item-text="title"
                item-value="id"
                label="Команда"
                placeholder="Не в команде"
                @change="changed"
              >
                <template v-slot:prepend>
                  <input-icon>mdi-account-group</input-icon>
                </template>
              </v-select>
            </v-col>
            <v-col :cols="12 / cols">
              <v-select
                v-model="user.tasks"
                :append-icon="disTasks ? 'mdi-lock' : ''"
                :disabled="disTasks"
                :items="Object.values(tasks)"
                clearable
                item-text="title"
                item-value="id"
                label="Задачи"
                multiple
                placeholder="Задач нет"
                @change="changed"
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
        <v-card-actions v-if="!disSubmit && !hideAction && solo">
          <v-spacer></v-spacer>
          <v-btn :disabled="!isChanged" color="success" text type="submit">
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </component>
    </v-card>
  </app-base-sheet>
</template>

<script>
import {inputValidations} from "@/mixins/InputValidations";
import {domain, posts, tasks, teams} from "@/mixins/ComputedData";
import InputIcon from "@/components/InputIcon";
import {VForm} from "vuetify/lib/components";
import {User} from "@/plugins/servises/User";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: 'TheAccountInfo',
  components: {AppBaseSheet, InputIcon, VForm},
  mixins: [inputValidations, teams, tasks, posts, domain],
  props: {
    solo: {
      type: Boolean,
      default: false
    },
    user: {
      email: String,
      tasks: Array,
      team: String,
      post: String
    },
    disableAll: {
      type: Boolean,
      default: false,
    },
    disableEmail: {
      type: Boolean,
      default: false,
    },
    disablePost: {
      type: Boolean,
      default: false,
    },
    disableTeam: {
      type: Boolean,
      default: false,
    },
    disableTasks: {
      type: Boolean,
      default: false,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    hideAction: {
      type: Boolean,
      default: false,
    },
    cols: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    isChanged: false
  }),
  computed: {
    tag() {
      return this.solo ? 'VForm' : 'div'
    },
    disEmail() {
      return this.disableEmail || this.disableAll
    },
    disPost() {
      return this.disablePost || this.disableAll
    },
    disTeam() {
      return this.disableTeam || this.disableAll
    },
    disTasks() {
      return this.disableTasks || this.disableAll
    },
    disSubmit() {
      return this.disableAll || this.disableEmail && this.disablePost &&
        this.disableTeam && this.disableTasks
    }
  },
  methods: {
    onSubmit() {
      if (this.disSubmit || this.noaction) return;

      this.updateData()
      this.isChanged = false;
    },
    updateData(silent = false) {
      const user = new User(this.user)
      user.update({type: 'edit'}, silent)
    },
    changed() {
      if (this.isChanged) return
      this.isChanged = true
    },
    reset() {
      this.$refs.form.reset();
    },
    getData() {
      return {
        email: this.user.email,
        post: this.user.post,
        tasks: this.user.tasks,
        team: this.user.team
      }
    },
    validate() {
      return this.$refs.form.validate()
    }
  }
};
</script>
