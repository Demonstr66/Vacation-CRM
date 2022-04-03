<template>
  <div>
    <v-row>
      <v-col cols="9">
        <v-tabs v-model="tab">
          <v-tab>Сотрудники</v-tab>
          <v-tab>Команды</v-tab>
          <v-tab>Архив</v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="3" class="justify-self-end text-center">
        <icon-btn-with-tip
          icon="mdi-account-plus"
          color="primary"
          @click="addBtnOnClick"
        >
          Создать пользователя
        </icon-btn-with-tip>
        <icon-btn-with-tip
          icon="mdi-tray-arrow-down"
          color="primary"
          @click="onImport"
        >
          Импортирт пользователей
        </icon-btn-with-tip>
        <icon-btn-with-tip
          icon="mdi-tray-arrow-up"
          color="primary"
          @click="onExport"
        >
          Экспорт пользователей
        </icon-btn-with-tip>
      </v-col>
    </v-row>

    <v-tabs-items v-model="tab">
      <v-tab-item transition="fade-transition">
        <users-tab @editUser="showEditor"></users-tab>
      </v-tab-item>
      <v-tab-item transition="fade-transition"> </v-tab-item>
      <v-tab-item transition="fade-transition"> </v-tab-item>
    </v-tabs-items>

    <PersonEditorModal
      :show="editor.show"
      :options="editor.options"
      @close="editor.show = false"
    />
  </div>
</template>

<script>
import UsersTab from "../components/Deportment/users.vue";
import IconBtnWithTip from "../components/IconBtnWithTip.vue";
import PersonEditorModal from "../components/PersonEditorModal.vue";

import { mapState, mapGetters } from "vuex";

export default {
  components: {
    UsersTab,
    IconBtnWithTip,
    PersonEditorModal,
  },
  data: () => ({
    tab: null,
    editor: {
      show: false,
      options: {},
    },
  }),
  methods: {
    addBtnOnClick() {
      this.showEditor();
    },
    onImport() {
      console.log("onImport");
      // this.showImportModal = true;
    },
    onExport() {
      console.log("onExport");
      // this.showExportModal = true;
    },
    showEditor(user) {
      this.editor.options.user = user;
      this.editor.show = true;
    },
  },
};
</script>