<template>
  <div>
    <icon-btn-with-tip
      v-if="vacation.status == 1"
      color="success"
      icon="mdi-check"
      @click.stop="$emit('click', {item: vacation, type: 'accept'})"
    >
      Утвердить
    </icon-btn-with-tip>
    <icon-btn-with-tip
      v-if="vacation.status == 1"
      color="error"
      icon="mdi-close"
      @click.stop="$emit('click', {item: vacation, type: 'reject'})"
    >
      Отклонить
    </icon-btn-with-tip>
    <icon-btn-with-tip
      v-if="vacation.status === 2 || vacation.status === 99"
      color="error"
      icon="mdi-cancel"
      @click.stop="$emit('click', {item: vacation, type: 'cancel'})"
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
    vacation: {
      type: Object,
      required: true
    }
  }
}
</script>