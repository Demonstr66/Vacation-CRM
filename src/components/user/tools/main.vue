<template>
  <div
    class="d-flex justify-space-between align-center"
    :class="{ 'flex-column': vertical }"
  >
    <icon-btn-with-tip
      v-if="active"
      :fab="fab"
      icon="mdi-check-decagram"
      color="success"
    >
      Зарегистрирован
    </icon-btn-with-tip>
    <icon-btn-with-tip
      :fab="fab"
      v-else
      icon="mdi-account-plus"
      color="primary"
      @click="$emit('invite')"
    >
      Пригласить
    </icon-btn-with-tip>
    <icon-btn-with-tip
      :fab="fab"
      icon="mdi-account-edit"
      color="primary"
      @click="$emit('edit')"
    >
      Редактировать
    </icon-btn-with-tip>
    <icon-btn-with-tip
      icon="mdi-delete"
      color="error"
      :fab="fab"
      :disable="deleteDisable"
      @click="$emit('delete')"
    >
      Удалить
    </icon-btn-with-tip>
  </div>
</template>

<script>
import IconBtnWithTip from "../../IconBtnWithTip.vue";
export default {
  components: { IconBtnWithTip },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    bgcolor: {
      type: String,
      default: "",
    },
    fab: {
      type: Boolean,
      default: false,
    },
    disable: {}
  },
  computed: {
    deleteDisable() {
      return this.disable ? !!this.disable.delete : false
    }
  }
};
</script>
