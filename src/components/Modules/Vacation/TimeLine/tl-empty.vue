<template>
  <div>
    <v-divider class="mt-5"/>
    <div
        class="text-center my-3 subtitle-2 font-weight-regular"
        style="color: rgba(0, 0, 0, 0.38);"
    >
      <span v-if="true">Не найдено подходящих записей</span>
      <span v-else>Отсутствуют данные</span>
    </div>
    <v-divider/>
  </div>
</template>

<script>
export default {
  name: "tl-empty"
}
</script>

<style scoped>

</style>