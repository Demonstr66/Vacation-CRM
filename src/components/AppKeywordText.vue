<template>
  <div class="mb-3">
    <div class="text-body-1 pl-2 text--primary">
      <span>{</span><span class="font-weight-bold">{{ keyword }}</span><span>}</span>
      <span> - </span>
      <span> {{ label }}</span>
    </div>
    <div class="text-body-2 pl-2" v-if="example !== ''">
      <span>Пример данных: </span>
      <span class="font-italic">{{ example }}</span>
    </div>
    <v-divider class="mt-1"/>
  </div>
</template>
<script>
export default {
  name: 'app-keyword-text',
  props: {
    keyword: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    example: {
      type: String,
      default: ''
    }
  }
}
</script>
