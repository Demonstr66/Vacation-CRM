<template>
  <div>
    <list-with-add
        :action="$can('manage', 'Post')"
        :items="Object.values(posts)"
        title="Должности"
        @delete="onDelete"
        @save="onSave"
        @create="onCreate"
        @edit="onEdit"
    >
      <template #subtitle="{item}">
        <span>
          {{item.fullTitle}}
        </span>
      </template>
    </list-with-add>
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
    <app-popup ref="listPopup2" title="Должность">
      <template v-slot:default="{data, setResData, setSubmitDisable}">
        <v-form v-if="data" @input="(val) => setSubmitDisable(!val)">
          <v-text-field
              :rules="[blankCheck]"
              :value="data.title"
              dense
              flat
              placeholder="Название"
              single-line

              @change="(val) => setResData('title', val)"
          ></v-text-field>
          <v-text-field
              :rules="[blankCheck]"
              :value="data.fullTitle"
              dense
              flat
              placeholder="Полное название (для заявления)"
              single-line

              @change="(val) => setResData('fullTitle', val)"
          ></v-text-field>
        </v-form>
      </template>
    </app-popup>
  </div>
</template>

<script>

import {posts} from "@/mixins/ComputedData";
import ListWithAdd from "../BaseListWidget.vue";
import {Post} from "@/plugins/servises/Post";
import AppPopup from "@/components/AppPopup";
import {Task} from "@/plugins/servises/Task";
import {inputValidations} from "@/mixins/InputValidations";

export default {
  mixins: [posts, inputValidations],
  components: {
    AppPopup,
    ListWithAdd
  },
  mounted() {
    console.log(this.posts)
  },
  methods: {
    async onCreate() {
      let result = await this.$refs.listPopup2.open({title: '', fullTitle: ''})

      if (result) {
        Post.create(result.data)
      }
    },
    async onEdit(id) {
      let post = this.posts[id]
      let result = await this.$refs.listPopup2.open(post)

      if (result) {
        Post.update(Object.assign(post, result.data))
      }
    },
    onSave(item) {
      if (!item.id) {
        Post.create(item)
      } else {
        Post.update(item)
      }
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
