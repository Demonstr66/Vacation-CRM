<template>
  <BaseModal
      :show="show"
      :submitDisable="!isValid"
      :title="title"
      @cancel="onCancel"
      @submit="onSubmit"
  >
    <v-form v-if="show" ref="userform" class="mt-4">
      <pers-user-info
          ref="pers"
          :user="user"
          noaction
          notitle
          @change="onChange"
      >
      </pers-user-info>
      <account-user-info
          ref="account"
          :cols="$vuetify.breakpoint.mdAndUp ? 2 : 1"
          :user="user"
          :disabled="disabled"
          :domen="domen"
          noaction
          notitle
          @change="onChange"
      >
      </account-user-info>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import persUserInfo from "../user/info/personal.vue";
import accountUserInfo from "../user/info/account.vue";

import {defUser} from "@/plugins/schema.js";

import {domen, teams} from "@/mixins/ComputedData";
import {userData} from "@/mixins/workspaceHelper";

export default {
  mixins: [userData, teams, domen],
  props: {
    show: {
      type: Boolean,
      required: true,
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
    user: null,
    showForm: false,
    isChanged: false,
    disabled: {email: false},
    isNewUser: false,
  }),
  created() {
    this.user = defUser();
  },
  computed: {
    isValid() {
      return this.isChanged;
    },
    title() {
      return this.isNewUser ? "Новый сотрудник" : "Редактирование";
    },
  },
  methods: {
    async onSubmit() {
      let val1 = this.$refs.pers.validate()
      let val2 = this.$refs.account.validate()
      if (!val1 || !val2) return

      let user = defUser(
          this.user,
          this.$refs.account.getData(),
          this.$refs.pers.getData()
      );

      this.mixSaveUserDataToDb(this.isNewUser, user)
          .then(() => this.isChanged = false)
          .then(() => this.closeModal());
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
    onChange() {
      this.isChanged = true;
    },
  },
  watch: {
    show(val) {
      if (!val || this.options.user === undefined) {
        this.user = defUser();
        this.disabled = false;
        this.isNewUser = true;
      } else {
        this.user = defUser(this.options.user);
        this.disabled = {email: true};
        this.isNewUser = false;
      }
    },
  },
};
</script>
