<template>
  <list-with-add
    action
    :items="Object.values(posts)"
    title="Должности"
    @delete="onDelete"
    @save="onSave"
  >
    <template v-slot:alert="{data}">
      <span>
        Должность
        <span class="font-weight-medium font-italic">
          {{ data ? data.title : '' }}
        </span>
        будет удалена.<br>Продолжить?
      </span>
    </template>
  </list-with-add>
</template>

<script>

import {posts} from "@/mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {Post} from "@/plugins/servises/Post";

export default {
  mixins: [posts],
  components: {
    ListWithAdd
  },
  methods: {
    onSave(item) {
      if (!item.id) Post.create(item)
      else Post.update(item)
    },
    onDelete(id) {
      Post.delete(id)
    },
  },
};
</script>
