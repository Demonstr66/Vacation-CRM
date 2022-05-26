<template>
  <v-list-item class="archive-list-item">
    <v-list-item-title>{{ user.fullName }}</v-list-item-title>
    <v-list-item-action class="d-block">
      <icon-btn-with-tip color="success" icon="mdi-restore-alert"
                         @click="$emit('userEvent', user.uid, 'restore')"
      >
        Восстановить
      </icon-btn-with-tip>
      <icon-btn-with-tip color="error" icon="mdi-close"
                         @click="$emit('userEvent', user.uid, 'delete')"
      >
        Удалить
      </icon-btn-with-tip>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";

export default {
  name: 'UserItemArchiveTabDeportment',
  components: {IconBtnWithTip},
  props: {user: {}}
}
</script>

<style lang="scss" scoped>
.archive-list-item {
  background-color: rgb(25, 118, 210, 0);
  transition: background-color 0.5s ease-in-out;
  &:hover {
    background-color: rgb(25, 118, 210, 0.12);
  }
}
</style>
