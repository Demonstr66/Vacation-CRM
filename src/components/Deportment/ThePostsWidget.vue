<template>
  <list-with-add
      title="Должности"
      :items="posts"
      @save="onSave"
      @delete="onDelete"
  >
    <template v-slot:alert="{item}">
      <span>
      Должность
      <span class="font-weight-medium font-italic">
          {{ item ? item.title : '' }}
        </span>
      будет удалена у всех пользователей.<br/>Продолжить?
        </span>
    </template>
  </list-with-add>
</template>

<script>

import {defPost} from "../../plugins/schema";
import {posts} from "../../mixins/computedData";
import {postMethods} from "../../mixins/workspaceHelper";
import ListWithAdd from "./BaseListWidget.vue";

export default {
  mixins: [posts, postMethods],
  components: {
    ListWithAdd
  },
  methods: {

    onSave(item) {
      const post = defPost(item);
      this.mixSavePost(!!!post.id, post);
    },
    onDelete(id) {
      this.mixDeletePost(id);
    },
  },
};
</script>
