<template>
  <div class="d-flex flex-nowrap">
    <icon-btn-with-tip
        :disable="disable.edit"
        color="primary"
        icon="mdi-account-edit"
        @click="$emit('editEmployee', uid)"
    >
      Редактировать
    </icon-btn-with-tip>
    <icon-btn-with-tip
        :disable="disable.delete"
        color="error"
        icon="mdi-delete"
        @click="deleteEmployee"
    >
      Удалить
    </icon-btn-with-tip>
    <icon-btn-with-tip
        color="info"
        icon="mdi-eye"
        tag="a"
        :to="{name: 'Employee', params: {uid}}"
    >
      Перейти в аккаунт
    </icon-btn-with-tip>
    <app-popup ref="askDeletingEmployee">
      Пользователь и все его данные будут удалены.<br>Продолжить?
    </app-popup>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import AppPopup from "@/components/AppPopup";

export default {
  name: 'employee-table-tools',
  components: {AppPopup, IconBtnWithTip},
  props: {
    uid: {
      type: String,
      required: true
    },
    disable: {
      type: Object,
      validator: function (val) {
        return val.hasOwnProperty('edit') && val.hasOwnProperty('delete')
      }
    },
  },
  methods: {
    async deleteEmployee() {
      let result = await this.$refs.askDeletingEmployee.open()

      if (result) {
        this.$emit('deleteEmployee', this.uid)
      }
    },
  }
}
</script>