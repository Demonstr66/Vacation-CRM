<template>
  <icon-btn-with-tip
      v-if="active"
      color="success"
      icon="mdi-check-decagram"
  >
    Зарегистрирован
  </icon-btn-with-tip>
  <icon-btn-with-tip
      v-else
      :disable="disable"
      color="primary"
      icon="mdi-account-plus"
      @click="invite"
      :loading="loading"
  >
    Пригласить
  </icon-btn-with-tip>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import {api} from "@/plugins/api";
import {Message} from "@/plugins/servises/Message";

export default {
  name: 'employee-active-status',
  components: {IconBtnWithTip},
  props: {
    uid: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    disable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async invite(uid) {
      this.loading = true
      try {
        await api.user.invite(uid)
        Message.successMessage({code: 'auth/user-invited'})
      } catch (e) {
        Message.errorMessage(e)
      } finally {
        this.loading = false
      }
    },
  }
}
</script>