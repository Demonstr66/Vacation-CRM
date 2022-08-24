<template>
  <div
    class="d-flex justify-space-between align-center"
    :class="{ 'flex-column': vertical }"
  >
    <icon-btn-with-tip
      v-if="!disableAll"
      :disable="disableAll"
      :fab="fab"
      icon="mdi-account-edit"
      color="primary"
      @click="$emit('edit')"
    >
      Редактировать
    </icon-btn-with-tip>
    <icon-btn-with-tip
      v-if="!deleteDisable && !disableAll"
      icon="mdi-delete"
      color="error"
      :fab="fab"
      :disable="deleteDisable || disableAll"
      @click="$emit('delete')"
    >
      Удалить
    </icon-btn-with-tip>
    <icon-btn-with-tip
      icon="mdi-eye"
      color="info"
      :fab="fab"
      @click="$emit('goto')"
    >
      Перейти в аккаунт
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
    disableAll: {
      type: Boolean,
      default: false,
    },
    disable: {}
  },
  computed: {
    deleteDisable() {
      return this.disable ? !!this.disable.delete : this.disableAll
    }
  }
};
</script>
