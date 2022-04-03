<template>
  <BaseModal
    :title="title"
    :show="show"
    :submitDisable="!isValid"
    @submit="onSubmit"
    @cancel="onCancel"
  >
    <v-form class="mt-4" v-if="show">
      <pers-user-info notitle noaction :data="user.fullName" @change="onChange">
      </pers-user-info>
      <account-user-info
        notitle
        noaction
        :data="user"
        :cols="2"
        :disabled="disabled"
        @change="onChange"
      >
      </account-user-info>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "../components/BaseModal.vue";
import persUserInfo from "../components/user/info/personal.vue";
import accountUserInfo from "../components/user/info/account.vue";

import { defUser } from "../plugins/schema.js";
import { mapState } from "vuex";

const short = require("short-uuid");

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Новый сотрудник",
    },
    options: {
      default: {},
    },
  },
  components: {
    BaseModal,
    persUserInfo,
    accountUserInfo,
  },
  data: () => ({
    domen: "@ipsos.com",
    rules: [(value) => !!value || "Заполните поле"],
    user: null,
    isChanged: false,
    disabled: { email: false },
    isNewUser: false
  }),
  created() {
    this.user = defUser();
  },
  computed: {
    ...mapState({ teams: (state) => state.workspace.workspace.teams || [] }),
    isValid() {
      return this.isChanged;
    },
  },
  methods: {
    async onSubmit() {
      let saveMethod = this.isNewUser ? "user/db/create" : "user/update";
      let workspace = this.$store.getters["workspace/id"];
      this.save(saveMethod, workspace);
    },
    save(saveMethod, workspace) {
      this.$store
        .dispatch(saveMethod, {
          uid: this.isNewUser ? short().new() : this.user.uid,
          workspace,
          fullName: this.user.fullName,
          email: this.user.email,
          post: this.user.post,
          team: this.user.team,
          task: this.user.task,
        })
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: this.isNewUser ? "Пользователь добавлен" : "Данные сохранены",
          })
        )
        .then((this.isChanged = false))
        .then(this.closeModal())
        .catch((err) => {
          this.$store.dispatch("setMessage", {
            type: "error",
            code: err.code,
            text: err.message,
          });
        });
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
    onChange(val) {
      console.log(val);
      this.isChanged = true;
      this.user = defUser(this.user, { ...val });
    },
  },
  watch: {
    show(val) {
      if (!val || this.options.user == undefined) {
        this.user = defUser();
        this.isNewUser = true
      } else {
        this.user = this.options.user;
        this.disabled = { email: true };
        this.isNewUser = false
      }
    },
  },
};
</script>
