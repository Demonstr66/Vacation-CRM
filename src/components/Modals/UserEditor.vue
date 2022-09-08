<template>
  <BaseModal
    :show="show"
    :submitDisable="!valid"
    :title="title"
    @cancel="close"
    @reset="reset"
    @submit="onSubmit"
  >
    <v-form ref="form" v-model="valid" class="mt-4">
      <the-user-info
        ref="user"
        :user="user"
        hide-action
        hide-additional-fields
        hide-title
      >
      </the-user-info>
      <the-account-info
        ref="account"
        :cols="$vuetify.breakpoint.mdAndUp ? 2 : 1"
        :disable-email="false"
        :user="user"
        hide-action
        hide-title
      >
      </the-account-info>
    </v-form>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import TheAccountInfo from "@/components/TheAccountInfo";
import TheUserInfo from "@/components/TheUserInfo";
import {User} from "@/plugins/servises/User";

export default {
  ModalController: null,
  components: {
    BaseModal,
    TheUserInfo,
    TheAccountInfo
  },
  data: () => ({
    show: false,
    valid: false,
    user: {}
  }),
  computed: {
    title() {
      return this.user && !this.user.uid ? "Новый сотрудник" : "Редактирование";
    },
  },
  methods: {
    open(uid) {
      let resolve, reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      if (uid) {
        this.user = {...this.$store.getters['users/getUserById'](uid)}
      } else {
        this.user = new User()
      }

      this.show = true
      this.$options.ModalController = {resolve, reject}
      return result
    },
    async onSubmit() {
      let user = new User(
        {
          ...this.user,
          ...this.$refs.account.getData(),
          ...this.$refs.user.getData()
        }
      );

      !!user.uid
        ? user.update().then(() => this.close())
        : user.create().then(() => this.close())
    },
    close() {
      this.show = false
      this.$options.ModalController.resolve(false)
    },
    reset() {
      this.user = new User()
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    }
  }
};
</script>
