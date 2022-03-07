<template>
  <BaseModal
    title="Экспорт"
    :show="show"
  >
    Логика модального окна
  </BaseModal>
</template>

<script>
import BaseModal from "../components/BaseModal.vue";

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    availibleFields: {
      type: Array,
      required: true,
    },
  },
  components: {
    BaseModal,
  },
  methods: {
    reset() {

    },
  }
}
</script>
