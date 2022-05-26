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

        <v-list :dense="$vuetify.breakpoint.mdAndDown">
          <v-data-iterator
            :custom-filter="userFilter"
            :footer-props="{
                'items-per-page-all-text' : 'Все',
                'items-per-page-text': 'На странице',
              }"
            :items="Object.values(users)"
            :search="JSON.stringify({selectedTeam, selectedTask, selectedPost})"
            :sort-by="selectedSortItem.id"
            :sort-desc="selectedSortItem.desc"
            loading
            no-results-text="Пользователей не найдено"
            @update:options="onDataIteratorUpdateOptions"
          >
            <template v-slot:loading>
              <v-progress-linear indeterminate></v-progress-linear>
            </template>
            <template v-slot:default="{ items }">
              <user-item
                v-for="(user, id) in items"
                :key="id"
                :draggingEl="draggingEl"
                :items="items"
                :on-delete-user="onDeleteUser"
                :on-edit="onEdit"
                :user="user"
              />
            </template>
          </v-data-iterator>
        </v-list>
<!--        <users-tab @editUser="showEditor"></users-tab>-->
      </v-tab-item>
      <v-tab-item>
<!--        <structure-tab></structure-tab>-->
      </v-tab-item>
      <v-tab-item>
<!--        <archive-tab></archive-tab>-->
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
import IconBtnWithTip from "@/components/IconBtnWithTip.vue";
import PersonEditorModal from "@/components/Modals/PersonEditorModal.vue";
import ImportModal from "@/components/Modals/ImportModal";

export default {
  name: "Deportment",
  components: {
    ImportModal,
    IconBtnWithTip,
    PersonEditorModal,
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