<template>
  <v-select
      v-model="selectedDays"
      :items="days"
      item-text="text"
      item-value="value"
      multiple
      label="Получать уведомления"
      persistent-hint
  >
    <template v-slot:prepend>
      <input-icon>mdi-bell</input-icon>
    </template>
    <template v-slot:selection="{item}">
      <v-chip
          label
          small
          close
          @click:close="onCloseDayItem(item.value)"
      >
        {{ item.text }}
      </v-chip>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "app-select",
  props:
}
</script>

<style scoped>

</style>