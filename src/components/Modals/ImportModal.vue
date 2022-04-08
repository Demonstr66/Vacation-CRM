<template>
  <BaseModal
    :title="title"
    :show="show"
    :submitDisable="!isUploadSuccessful"
    @reset="reset"
    @submit="onSubmit"
    @cancel="onCancel"
  >
    <v-file-input
      placeholder="Excel или CSV файл"
      label="Файл Excel"
      :loading="isLoading"
      v-model="file"
      @change="onChange"
      @click:clear="reset"
    ></v-file-input>
    <div v-if="isUploadSuccessful">
      <v-row>
        <v-col>
          Найденные поля:
          <ul>
            <li v-for="(fild, id) in fields" :key="id">
              {{ fild.label }}
            </li>
          </ul>
        </v-col>
        <v-col> Количество записей: {{ items.length }} </v-col>
      </v-row>
    </div>
    <div v-else-if="isFileUploading" class="error--text">
      Ошибка: не найдено подходящих полей
    </div>
  </BaseModal>
</template>

<script>
import BaseModal from "./Base.vue";
import * as XLSX from "xlsx/xlsx.mjs";

export default {
  components: {
    BaseModal,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    availibleFields: {
      type: Array,
      required: true,
    },
    dataType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Выберите файл",
    },
  },
  data: () => ({
    isFileUploading: false,
    isUploadSuccessful: false,
    isLoading: false,
    file: null,
    fields: [],
    items: [],
  }),
  methods: {
    onChange(file) {
      if (!file) return;

      this.isLoading = true;
      this.readFileToJSON(file);
    },
    readFileToJSON(file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.uploadSuccess(data);
      };

      reader.readAsBinaryString(file);
    },
    uploadSuccess(data) {
      this.isFileUploading = true;
      let cols = data.shift();
      let colToFieldId = {};

      cols.map((c, index) => {
        const fieldId = this.availibleFields.findIndex(
          (af) => af.model.toLowerCase() === c.toLowerCase()
        );

        if (fieldId < 0) return;

        const field = this.availibleFields[fieldId];

        colToFieldId[index] = fieldId;

        this.fields.push({ label: field.label });
      });

      data.map((row) => {
        if (!row.length) return;
        let item = {};

        for (let cID in colToFieldId) {
          let fID = colToFieldId[cID];

          item[this.availibleFields[fID].model] = row[cID];
        }

        this.items.push(item);
      });

      this.isLoading = false;
      this.isUploadSuccessful = !!this.fields.length;
    },
    saveData(data) {
      let func = "",
        callback = "";
      switch (this.dataType) {
        case "persons":
          func = "addPersonsToBase";
          callback = "fetchPersons";
          break;
        case "teams":
          func = "addTeamsToBase";
          callback = "fetchTeams";
          break;
      }

      this.$store.dispatch(func, data); //.then(this.$store.dispatch(callback));
    },
    reset() {
      this.isFileUploading = false;
      this.isUploadSuccessful = false;
      this.fields = [];
      this.items = [];
      this.file = null;
    },
    onSubmit() {
      this.saveData(this.items);
      this.closeModal();
    },
    onCancel() {
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>