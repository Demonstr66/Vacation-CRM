<template>
  <BaseModal
    :show="show"
    :submitDisable="!valid"
    :title="title"
    @cancel="onCancel"
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
import {domain, teams} from "@/mixins/ComputedData";
import {UserMethods} from "@/mixins/UserMethods";
import TheAccountInfo from "@/components/TheAccountInfo";
import TheUserInfo from "@/components/TheUserInfo";
import {defUser} from "@/plugins/schema";
import {fullToDisplayName} from "@/plugins/utils";

export default {
  mixins: [UserMethods, teams, domain],
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    user: {}
  },
  components: {
    BaseModal,
    TheUserInfo,
    TheAccountInfo
  },
  data: () => ({
    valid: false,
  }),
  computed: {
    title() {
      return this.user && !this.user.uid ? "Новый сотрудник" : "Редактирование";
    },
  },
  methods: {
    async onSubmit() {
      let user = defUser(
        this.user,
        this.$refs.account.getData(),
        this.$refs.user.getData()
      );

      if (!!!user.displayName) user.displayName = fullToDisplayName(user.fullName)

      const method = !!!user.uid ? this.createUser : this.updateUser

      method(user)
        .then(() => this.closeModal())
        .catch(er => {
        })
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
  watch: {
    show(val) {
      if (!val) this.$refs.form.reset()
    }
  }
};
</script>
