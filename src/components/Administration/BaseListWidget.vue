<template>
  <widget :title="title">
    <template #default>
      <v-divider></v-divider>
      <template v-if="items && items.length > 0">
        <div class="text-right">
          <icon-btn-with-tip
            :color="sort !== 0 ? 'primary' : ''"
            :icon="'mdi-sort-alphabetical-' + (sort !== 2 ? 'ascending' : 'descending')"
            @click="toggleSort"
          >
            Сортировка
          </icon-btn-with-tip>
        </div>
        <v-divider></v-divider>
        <v-list class="pa-0 ma-0">
          <v-list-item
            v-for="(item, id) in sortedItems"
            :key="id"
            :class="{ editing: item.id === newItemId }"
            class="pa-0 border-bottom"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
              <slot :item="item" name="subtitle">
              </slot>
            </v-list-item-content>
            <v-list-item-action v-if="action" class="d-flex flex-row">
              <icon-btn-with-tip
                color="primary"
                icon="mdi-pencil"
                @click="onEditItem(item)"
              >
                Изменить
              </icon-btn-with-tip>
              <icon-btn-with-tip
                color="error"
                icon="mdi-close"
                @click="onDeleteItem(item)"
              >
                Удалить
              </icon-btn-with-tip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <div v-else class="text-center subtitle-1 mt-4">
        {{ noDataText }}
      </div>
    </template>
    <template #actions>
      <v-form
        v-if="action"
        ref="addItem"
        v-model="valid"
        class="mt-4"
        style="display: block; width: 100%;"
        @submit.prevent="saveItem"
      >
        <v-text-field
          ref="inputTitle"
          v-model="newItemTitle"
          :rules="[blankCheck]"
          hint="Введите название"
          placeholder="Добавить новый элемент"
          solo
        >
          <template v-slot:append>
            <icon-btn-with-tip
              v-if="!!newItemId"
              color="error"
              icon="mdi-pencil-off"
              @click="onStopEditing"
            >
              Отмена
            </icon-btn-with-tip>
            <icon-btn-with-tip
              :disable="!valid"
              color="primary"
              icon="mdi-send"
              type="submit"
              @click="saveItem"
            >
              Добавить
            </icon-btn-with-tip>
          </template>
        </v-text-field>
      </v-form>
    </template>

  </widget>
</template>

<script>
import Widget from "./BaseWidget.vue";
import IconBtnWithTip from "../IconBtnWithTip.vue";
import {inputValidations} from "@/mixins/InputValidations";

export default {
  mixins: [inputValidations],
  components: {
    Widget,
    IconBtnWithTip,
  },
  props: {
    title: String,
    items: {
      type: Array,
      required: true
    },
    noDataText: {
      type: String,
      default: "Данные ещё не добавлены"
    },
    action: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    sort: 0,
    newItemTitle: null,
    newItemId: null,
    valid: false,
  }),
  computed: {
    sortedItems() {
      const {items, sort} = this
      const temp = [...items]
      if (sort === 0) return temp

      return temp.sort(this.compare)
    }
  },
  methods: {
    compare(item1, item2) {
      let a = item1.title.toLowerCase(),
        b = item2.title.toLowerCase()
      return (this.sort === 1 ? a > b : a < b) ? 0 : -1
    },
    toggleSort() {
      this.sort = (this.sort + 1) % 3
    },
    onEditItem(item) {
      this.newItemTitle = item.title
      this.newItemId = item.id
      this.$refs.inputTitle.focus();
    },
    onStopEditing() {
      this.clearForm();
    },
    async onDeleteItem(data) {
      this.$emit('delete', data.id)
    },
    saveItem() {
      if (!this.valid) return
      const newItem = {title: this.newItemTitle, id: this.newItemId}
      this.$emit('save', newItem)
      this.clearForm();
    },
    clearForm() {
      this.item = null
      this.newItemId = null
      this.$refs.addItem.reset()
      this.$refs.inputTitle.blur()
    },
  },
};
</script>


<style scoped>
.editing {
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background-color: #cae4ff;
  font-style: italic;
  transition: background-color 0.5s cubic-bezier(0.35, 0.93, 0.5, 1);
}

.border-bottom {
  border-bottom: thin solid #949494;
}
</style>