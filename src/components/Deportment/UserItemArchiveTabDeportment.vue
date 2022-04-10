<template>
  <v-list-item class="archive-list-item">
    <v-list-item-title>{{user.fullName}}</v-list-item-title>
    <v-list-item-action class="d-block">
      <icon-btn-with-tip icon="mdi-restore-alert" color="success" @click="onRestore">
        Восстановить
      </icon-btn-with-tip>
      <icon-btn-with-tip icon="mdi-close" color="error" @click="onDelete">
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
  props: {user: {}},
  methods: {
    onRestore() {

    },
    onDelete() {

    },
  }
}
</script>

<style lang="scss" scoped>
.archive-list-item {

  &:hover {
    background-color: rgba(196, 233, 241, 0.4);
    transition: background-color 0.3s ease-in-out;
  }
}
</style>
