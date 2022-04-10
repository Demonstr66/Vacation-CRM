<template>
  <div>
    <v-row class="ma-0 pa-0 mb-3">
      <v-col cols="12" sm="9" class="mx-0 pa-0">
        <v-tabs v-model="activeTab" fixed-tabs>
          <v-tab>Сотрудники</v-tab>
          <v-tab>Структура</v-tab>
          <v-tab>Архив</v-tab>
        </v-tabs>
      </v-col>
      <v-col
        v-if="$vuetify.breakpoint.smAndUp"
        cols="auto"
        class="justify-self-end text-center mx-0 px-0"
      >
        <icon-btn-with-tip
          v-if="$vuetify.breakpoint.smAndUp"
          icon="mdi-account-plus"
          color="primary"
          @click="addBtnOnClick"
        >
          Создать пользователя
        </icon-btn-with-tip>
        <icon-btn-with-tip
          v-if="$vuetify.breakpoint.smAndUp"
          icon="mdi-tray-arrow-down"
          color="primary"
          @click="onImport"
        >
          Импортирт пользователей
        </icon-btn-with-tip>
        <icon-btn-with-tip
          v-if="$vuetify.breakpoint.smAndUp"
          icon="mdi-tray-arrow-up"
          color="primary"
          @click="onExport"
        >
          Экспорт пользователей
        </icon-btn-with-tip>
      </v-col>
    </v-row>
    <v-tabs-items v-model="activeTab">
      <v-tab-item>
        <users-tab @editUser="showEditor"></users-tab>
      </v-tab-item>
      <v-tab-item>
        <composition></composition>
      </v-tab-item>
      <v-tab-item>
        <archive></archive>
      </v-tab-item>
    </v-tabs-items>
    <PersonEditorModal
      :show="editor.show"
      :options="editor.options"
      @close="editor.show = false"
    />
  </div>
</template>

<script>
import UsersTab from "@/components/Deportment/UsersTabDeportment.vue";
import IconBtnWithTip from "../components/IconBtnWithTip.vue";
import PersonEditorModal from "../components/Modals/PersonEditorModal.vue";
import composition from "../components/Deportment/StructureTabDeportment.vue";
import Archive from "../components/Deportment/ArchiveTabDeportment.vue";

export default {
  name: "Deportment",
  components: {
    UsersTab,
    IconBtnWithTip,
    PersonEditorModal,
    composition,
    Archive,
  },
  data: () => ({
    activeTab: "",
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