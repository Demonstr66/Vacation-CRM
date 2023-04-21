<template>
  <BaseModal
      :show="show"
      :submitDisable="!valid"
      :title="title"
      large
      @cancel="close"
      @reset="reset"
      @submit="onSubmit"
  >
    <v-form ref="form" v-model="valid" class="mt-4">
      <the-user-info
          ref="user"
          :disabled="!$can('updatePersonalData', user)"
          :user="user"
          hide-action
          hide-additional-fields
          hide-title
      >
      </the-user-info>
      <the-account-info
          ref="account"
          :cols="$vuetify.breakpoint.mdAndUp ? 1 : 1"
          :disable-team="!$can('updateTeam', user)"
          :disableAll="!$can('updateAccountData', user)"
          :user="user"
          hide-action
          hide-title
      >
      </the-account-info>
    </v-form>
    <Can I="updateUserRole" :this="user">
      <div>
        <v-switch
            v-model="role"
            class="ml-auto"
            color="error"
            flat
            hide-details
            inset
            label="Администратор"
            style="width: 200px"
        />
      </div>
    </Can>
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
    user: {},
    role: false
  }),
  computed: {
    title() {
      return this.user && !this.user.uid ? "Новый сотрудник" : "Редактирование";
    },
  },
  methods: {
    open(uid) {
      let resolve,
          reject
      const result = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })

      if (uid) {
        this.user = this.$store.getters['users/getUserById'](uid)
        this.role = 'admin' === this.user.role
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
      )

      let shouldDeterminateRole = false
      if (this.$can('updateUserRole', this.user)) {
        if (this.role) {
          user.role = 'admin'
        } else if (user.role === 'admin') {
          user.role = 'user'
          shouldDeterminateRole = true
        }
      }

      const promise = user.uid ? user.update() : user.create()

      promise.then(() => {
        if (shouldDeterminateRole) {
          User.determinateLeaders()
        }
        this.close()
      })
    },
    close() {
      this.show = false
      this.$options.ModalController.resolve(false)
    },
    reset() {
      this.user = new User()
      this.role = false
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    }
  }
};
</script>
