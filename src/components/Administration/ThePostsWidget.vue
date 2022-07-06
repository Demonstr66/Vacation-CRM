<template>
  <list-with-add
    :items="Object.values(posts)"
    title="Должности"
    @delete="onDelete"
    @save="onSave"
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
import {posts} from "../../mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {PostMethods} from "@/mixins/PostMethods";

export default {
  mixins: [posts, PostMethods],
  components: {
    ListWithAdd
  },
  methods: {

    onSave(item) {
      console.log('try save', item)
      const post = defPost(item);
      if (!post.id) this.createPost(post)
      else this.updatePost(post)
    },
    onDelete(id) {
      this.deletePost(id);
    },
  },
};
</script>
