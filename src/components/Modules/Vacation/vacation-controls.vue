<template>
  <div class="d-flex flex-nowrap">
    <icon-btn-with-tip
      v-if="status === 1"
      :disable="approveDisabled"
      color="success"
      icon="mdi-check"
      @click.stop="$emit('approve')"
    >
      Утвердить
    </icon-btn-with-tip>

    <icon-btn-with-tip
      v-if="status === 1"
      :disable="rejectDisabled"
      color="error"
      icon="mdi-close"
      @click.stop="$emit('reject')"
    >
      Отклонить
    </icon-btn-with-tip>
    <icon-btn-with-tip
      :disable="cancelDisabled"
      v-if="status === 2 || status === 99"
      color="error"
      icon="mdi-cancel"
      @click.stop="$emit('cancel')"
    >
      Отозвать решение
    </icon-btn-with-tip>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"

export default {
  name: 'VacationTools',
  components: {IconBtnWithTip},
  props: {
    status: {
      type: Number,
      required: true
    },
    approveDisabled: {
      type: Boolean,
      default: true
    },
    rejectDisabled: {
      type: Boolean,
      default: true
    },
    cancelDisabled: {
      type: Boolean,
      default: true
    }
  }
}
</script>