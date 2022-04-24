<template>
  <div>
    <v-list v-if="Object.values(archive).length">
      <UserItemArchiveTabDeportment
          v-for="user in archive"
          :key="user.uid"
          :user="user"
          @userEvent="onItemEvent"
      />
    </v-list>
    <span v-else>
      В архиве нет ни одного пользователя
    </span>
    <Alert :show="isAlertRestore" @cancel="onCancelAlert" @submit="onSubmitAlert">
      Пользователь будет восстановлен.
      <br>Продолжить?
    </Alert>
    <Alert :show="isAlertDelete" @cancel="onCancelAlert" @submit="onSubmitAlert">
      Пользователь будет удалён. Все его данные будут стёрты.
      <br>Продолжить?
    </Alert>
  </div>
</template>

<script>
import {archive} from "@/mixins/ComputedData";
import UserItemArchiveTabDeportment from "@/components/Deportment/ArchiveTabUserItem";
import Alert from "@/components/Modals/Alert";
import {userData} from "@/mixins/workspaceHelper";

export default {
  mixins: [archive, userData],
  components: {Alert, UserItemArchiveTabDeportment},
  data: () => ({
    isAlertDelete: false,
    isAlertRestore: false,
    item: {
      uid: null,
      type: null
    },
  }),
  methods: {
    onCancelAlert() {
      this.closeAlert()
    },
    onSubmitAlert() {
      console.log('onSubmitAlert', this.item.type)
      if (this.item.type == 'restore') this.onRestoreSubmit(this.item.uid);
      if (this.item.type == 'delete') this.onDeleteSubmit(this.item.uid);

      this.closeAlert()
    },
    closeAlert() {
      this.item = {uid: null, type: null}
      this.isAlertRestore = false
      this.isAlertDelete = false
    },
    showAlert(type) {
      if (type == 'restore') this.isAlertRestore = true
      if (type == 'delete') this.isAlertDelete = true
    },
    onItemEvent(uid, type) {
      this.item = {uid, type}
      this.showAlert(type)
    },
    onRestoreSubmit(uid) {
      console.log('onRestoreSubmit')
      this.mixRestoreUserFromArchive(uid)
    },
    onDeleteSubmit(uid) {
      console.log('onDeleteSubmit')
      this.mixDeleteUser(uid)
    },
  }
}
</script>

