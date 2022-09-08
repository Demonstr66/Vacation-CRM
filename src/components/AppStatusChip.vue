<template>
  <v-chip
    :color="statuses[status].color"
    label
    outlined
    small
  >
    {{ statuses[status].label }}
  </v-chip>
</template>
<script>

export default {
  name: 'AppStatusChip',
  props: {
    status: {
      type: [String, Number],
      required: true
    },
    statuses: {
      type: Object,
      required: true
    }
  }
}
</script>