<template>
  <div>
    <list-with-add
      :action="$can('manage', 'Post')"
      :items="Object.values(posts)"
      title="Должности"
      @delete="onDelete"
      @save="onSave"
    />
    <app-popup ref="listPopup">
      <template v-slot:default="{data}">
        <div>
          Должность
          <span class="font-weight-medium font-italic">
            {{ data }}
          </span>
          будет удалена.<br>Продолжить?
        </div>
      </template>
    </app-popup>
  </div>
</template>

<script>

import {posts} from "@/mixins/ComputedData";
import ListWithAdd from "./BaseListWidget.vue";
import {Post} from "@/plugins/servises/Post";
import AppPopup from "@/components/AppPopup";
import {Task} from "@/plugins/servises/Task";

export default {
  mixins: [posts],
  components: {
    AppPopup,
    ListWithAdd
  },
  methods: {
    onSave(item) {
      if (!item.id) Post.create(item)
      else Post.update(item)
    },
    async onDelete(id) {
      const post = this.posts[id]
      let result = await this.$refs.listPopup.open(post.title)

      if (result) {
        Post.delete(id)
      }
    },
  },
};
</script>
