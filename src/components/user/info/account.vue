<template>
  <v-card flat>
    <v-form ref="accUserForm" @submit.prevent="onSubmit">
      <v-card-title v-if="!notitle">Информация</v-card-title>
      <v-card-text>
        <v-row>
          <v-col :cols="12 / cols">
            <v-text-field
              v-model="user.email"
              :append-icon="disEmail ? 'mdi-lock' : ''"
              :disabled="disEmail"
              :rules="[blankCheck]"
              label="Email"
              name="email"
              @change.once="changed"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-email</v-icon>
              </template>
              <template v-if="!!domen && needDomen" v-slot:append>
                {{ domen }}
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
              @change.once="changed"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1"
                >mdi-get-account-outline
                </v-icon
                >
              </template>
            </v-select>
          </v-col>
          <v-col :cols="12 / cols">
            <v-select
              v-model="user.team"
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
                <v-icon color="blue-grey lighten-1">mdi-account-group</v-icon>
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
              @change.once="changed"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1"
                >mdi-format-list-bulleted-square
                </v-icon
                >
              </template>

            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="!disSubmit && !noaction">
        <v-spacer></v-spacer>
        <v-btn :disabled="!isChanged" color="success" text type="submit">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import {defUser} from "@/plugins/schema";
import {inputRules} from "@/mixins/inputRules";
import {posts, tasks, teams} from "@/mixins/ComputedData";

export default {
  name: 'AccountUserInfo',
  mixins: [inputRules, teams, tasks, posts],
  props: {
    user: {
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
  }),
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