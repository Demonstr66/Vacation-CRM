<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="show">
    <template v-slot:default="">
      <v-card>
        <v-toolbar color="primary" dark>Выберите файл</v-toolbar>
        <v-card-text>
          <v-file-input
            placeholder="Excel или CSV файл"
            label="Файл Excel"
            @change="onChange"
            :loading="isLoading"
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
              <v-col> Найдено человек: {{ persons.length }} </v-col>
            </v-row>
          </div>
          <div v-else-if="isFileUploading" class="red--text">
            Ошибка: не найдено подходящих полей
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-form @submit.prevent="onSubmit">
            <v-spacer></v-spacer>
            <v-btn color="warning" text @click="onCancel"> Отмена </v-btn>
            <v-btn
              color="success"
              text
              @click="onSubmit"
              :disabled="!isUploadSuccessful"
            >
              Подтвердить
            </v-btn>
          </v-form>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import * as XLSX from "xlsx/xlsx.mjs";

export default {
  props: {
    show: {
      type: Boolean,
    },
  },
  data: () => ({
    isFileUploading: false,
    isUploadSuccessful: false,
    isLoading: false,
    availibleFields: [
      { label: "ФИО", model: "fullname" },
      { label: "E-mail", model: "email" },
      { label: "Табельный номер", model: "id" },
    ],
    fields: [],
    persons: [],
  }),
  methods: {
    onChange(file) {
      this.isLoading = true;
      this.readFileToJSON(file);
    },
    readFileToJSON(file) {
      this.file = file;
      if (this.file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.uploadSuccess(data);
        };

        reader.readAsBinaryString(this.file);
      }
    },
    uploadSuccess(data) {
      this.isFileUploading = true;
      let cols = data.shift();
      let colToFieldId = {};

      cols.map((c, index) => {
        const fieldId = this.availibleFields.findIndex((af) => af.model.toLowerCase() === c.toLowerCase());

        if ( fieldId < 0 ) return

        const field = this.availibleFields[ fieldId ]

        colToFieldId[index] = fieldId

        this.fields.push({ label: field.label });
      });

      data.map( row => {
        let person = {};

        for( let cID in colToFieldId ) {
          let fID = colToFieldId[cID]

          person[ this.availibleFields[ fID ].model ] = row[ cID ]
        }

        this.persons.push(person)
      });

      this.isLoading = false;
      this.isUploadSuccessful = !!this.fields.length;
    },
    reset() {
      this.isFileUploading = false;
      this.isUploadSuccessful = false;
      this.fields = [];
    },
    onCancel() {
      this.$emit("cancel");
    },
    onSubmit() {
      this.$emit("submit", this.persons);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>