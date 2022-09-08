<template>
  <app-base-sheet>
    <v-list v-if="Object.values(archive).length">
      <UserItemArchiveTabDeportment
        v-for="user in archive"
        :key="user.uid"
        :user="user"
        @userEvent="onItemEvent"
      />
    </v-list>
    <div v-else class="text-center my-5 subtitle-1" style="color: black;">
      <span>
        В архиве нет ни одного пользователя
      </span>
    </div>
    <Alert :show="isAlertRestore" @cancel="onCancelAlert" @submit="onSubmitAlert">
      Пользователь будет восстановлен.
      <br>Продолжить?
    </Alert>
    <Alert :show="isAlertDelete" @cancel="onCancelAlert" @submit="onSubmitAlert">
      Пользователь будет удалён. Все его данные будут стёрты.
      <br>Продолжить?
    </Alert>
  </app-base-sheet>
</template>

<script>
import {archive} from "@/mixins/ComputedData";
import UserItemArchiveTabDeportment from "@/components/Administration/ArchiveTabUserItem";
import Alert from "@/components/Modals/Alert";
import {UserMethods} from "@/mixins/UserMethods";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  mixins: [archive, UserMethods],
  components: {AppBaseSheet, Alert, UserItemArchiveTabDeportment},
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
      this.restoreUser(uid)
    },
    onDeleteSubmit(uid) {
      console.log('onDeleteSubmit')
      this.deleteUser(uid)
    },
  }
}
</script>

