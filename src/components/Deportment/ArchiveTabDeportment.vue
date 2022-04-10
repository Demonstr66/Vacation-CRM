<template>
  <div>
    <v-list v-if="Object.values(archive).length">
      <UserItemArchiveTabDeportment v-for="user in archive" :key="user.uid" :user="user"/>
    </v-list>
    <span v-else>
      В архиве нет ни одного пользователя
    </span>
  </div>
</template>

<script>
import {archive} from "@/mixins/computedData";
import UserItemArchiveTabDeportment from "@/components/Deportment/UserItemArchiveTabDeportment";

export default {
    mixins:[archive],
    components: {UserItemArchiveTabDeportment}
  }
</script>

