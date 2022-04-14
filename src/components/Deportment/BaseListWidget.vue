<template>
  <widjet :title="title">
    <v-toolbar v-if="$vuetify.breakpoint.smAndUp" dense flat>
      <v-spacer>
      </v-spacer>
      <icon-btn-with-tip color="primary" icon="mdi-import">
        Импорт
      </icon-btn-with-tip>
      <icon-btn-with-tip color="primary" icon="mdi-export">
        Экспорт
      </icon-btn-with-tip>
      <icon-btn-with-tip color="primary" icon="mdi-help-circle-outline">
        Инфо
      </icon-btn-with-tip>
    </v-toolbar>
    <v-list v-if="items && items.length > 0" class="pa-0 ma-0">
      <v-list-item
          v-for="(item, id) in items"
          :key="id"
          :class="{ editing: item.id == newItem.id }"
          class="pa-0 borderbtm"
      >
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <slot name="subtitle" :item="item">
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
              @click="onDeleteItem(item)"
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
        @submit.prevent="onSubmitForm"
    >
      <v-text-field
          ref="inputTitle"
          v-model="newItem.title"
          :error="error"
          :error-messages="error ? 'Заполните поле' : ''"
          hint="Введите название"
          placeholder="Добавить новый элемент"
          solo
          @blur="error = false"
      >
        <template slot="append">
          <v-btn v-if="!!newItem.id" color="error" icon @click="onStopEditing">
            <v-icon>mdi-pencil-off</v-icon>
          </v-btn>
          <v-btn color="primary" icon type="submit">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-form>
    <Alert
        :data="deletingItem ? deletingItem.id : null"
        :show="isAlertShow"
        @cancel="onCancelAlert"
        @submit="onSubmitAlert"
    >
      <slot :item="deletingItem" name="alert">
      </slot>
    </Alert>
  </widjet>
</template>

<script>
import Widjet from "./BaseWidget.vue";
import IconBtnWithTip from "../IconBtnWithTip.vue";
import Alert from "../Modals/Alert.vue";

export default {
  components: {
    Widjet,
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
    }
  },
  data: () => ({
    newItem: {
      title: "",
      id: "",
    },
    error: false,
    deletingItem: null,
  }),
  computed: {
    valid: {
      get() {
        return !!this.newItem.title;
      },
      set() {
      },
    },
    isAlertShow() {
      return !!this.deletingItem;
    },
  },
  methods: {
    onSubmitForm() {
      if (!this.valid) {
        this.error = true;
        return;
      }

      this.addNewItem();
    },
    onDeleteItem(item) {
      this.deletingItem = item;
    },
    onCancelAlert() {
      this.deletingItem = null;
    },
    onSubmitAlert(id) {
      this.deleteItem(id)
    },
    onEditItem(item) {
      this.newItem = {...item};
      this.$refs.inputTitle.focus();
    },
    onStopEditing() {
      this.clearForm();
    },
    clearForm() {
      this.newItem.id = null;
      this.$refs.addItem.reset();
      this.$refs.inputTitle.blur();
    },
    addNewItem() {
      this.$emit('save', {...this.newItem})
      this.clearForm();
    },
    deleteItem(id) {
      this.deletingItem = null;
      this.$emit('delete', id)
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

.borderbtm {
  border-bottom: thin solid #949494;
}
</style>