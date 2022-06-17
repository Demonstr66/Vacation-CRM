<template>
  <widget :title="title">
    <v-list v-if="items && items.length > 0" class="pa-0 ma-0">
      <v-list-item
        v-for="(item, id) in items"
        :key="id"
        :class="{ editing: item.id === newItemId }"
        class="pa-0 border-bottom"
      >
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <slot :item="item" name="subtitle">
          </slot>
        </v-list-item-content>
        <v-list-item-action class="d-flex flex-row">
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
            @click="onDeleteItem(item.id)"
          >
            Удалить
          </icon-btn-with-tip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <span v-else>
      {{ noDataText }}
    </span>
    <v-form
      ref="addItem"
      v-model="valid"
      class="mt-4"
      @submit.prevent="saveItem"
    >
      <v-text-field
        v-model="newItemTitle"
        ref="inputTitle"
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
            color="primary"
            icon="mdi-send"
            type="submit"
            :disable="!valid"
          >
            Добавить
          </icon-btn-with-tip>
        </template>
      </v-text-field>
    </v-form>
    <Alert
      :show="showAlert"
      @cancel="closeAlert"
      @submit="deleteItem"
    >
      <slot :item="deletingId" name="alert">
      </slot>
    </Alert>
  </widget>
</template>

<script>
import Widget from "./BaseWidget.vue";
import IconBtnWithTip from "../IconBtnWithTip.vue";
import Alert from "../Modals/Alert.vue";
import {inputRules} from "@/mixins/inputRules";
import {messageHelper} from "@/mixins/messageHelper";

export default {
  mixins: [inputRules, messageHelper],
  components: {
    Widget,
    IconBtnWithTip,
    Alert,
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
  },
  data: () => ({
    newItemTitle: null,
    newItemId: null,
    deletingId: null,
    valid: false,
    showAlert: false
  }),
  methods: {
    onEditItem(item) {
      this.newItemTitle = item.title
      this.newItemId = item.id
      this.$refs.inputTitle.focus();
    },
    onStopEditing() {
      this.clearForm();
    },

    onDeleteItem(id) {
      this.deletingId = id
      this.showAlert = true
    },
    closeAlert() {
      this.deletingId = null
      this.showAlert = false
    },

    saveItem() {
      const newItem = {title: this.newItemTitle, id: this.newItemId}
      this.$emit('save', newItem)
      this.clearForm();
    },
    deleteItem() {
      const id = this.deletingId
      this.$emit('delete', id)
      this.closeAlert()
    },
    clearForm() {
      this.item = null
      this.newItemId = null
      this.deletingId = null
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