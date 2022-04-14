<template>
  <div>
    <v-row class="ma-0 pa-0 mb-3" justify="space-between">
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
        <structure-tab></structure-tab>
      </v-tab-item>
      <v-tab-item>
        <archive-tab></archive-tab>
      </v-tab-item>
    </v-tabs-items>
    <PersonEditorModal
      :show="editor.show"
      :options="editor.options"
      @close="editor.show = false"
    />
    <ImportModal
        :show="importer.show"
        :available-fields="usersFields"
        data-type="persons"
        @close="importModalClose"
    >

    </ImportModal>
  </div>
</template>

<script>
import UsersTab from "@/components/Deportment/UsersTab.vue";
import IconBtnWithTip from "@/components/IconBtnWithTip.vue";
import PersonEditorModal from "@/components/Modals/PersonEditorModal.vue";
import StructureTab from "@/components/Deportment/StructureTab.vue";
import ArchiveTab from "@/components/Deportment/ArchiveTab.vue";
import ImportModal from "@/components/Modals/ImportModal";

export default {
  name: "Deportment",
  components: {
    ImportModal,
    UsersTab,
    IconBtnWithTip,
    PersonEditorModal,
    StructureTab,
    ArchiveTab,
  },
  data: () => ({
    activeTab: "",
    editor: {
      show: false,
      options: {},
    },
    importer: {
      show: false,
    },
    usersFields: [
      { title: "E-mail", model: "email", required: true, uniq: true },
      { title: "ФИО", model: "fullName" },
      { title: "Должность", model: "post" },
      { title: "Команда", model: "team" },
    ],
  }),
  methods: {
    importModalClose() {
      this.importer.show = false
    },
    addBtnOnClick() {
      this.showEditor();
    },
    onImport() {
      this.importer.show = true;
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