<template>
  <v-form @submit.prevent="onSubmit">
    <v-row class="">
      <v-col cols="8">
        <v-row dense>
          <v-col cols="3">
            <div class="headline text-right">Личные данные</div>
          </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="ФИО"
              v-model="user.fullName"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <div class="headline text-right">Работа</div>
          </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="Должность"
              v-model="user.post"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3"> </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="Табельный номер"
              v-model="user.tabId"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3"> </v-col>
          <v-col cols="9">
            <v-text-field dense outlined label="Команды"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3">
            <div class="headline text-right">Аккаунт</div>
          </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="Email"
              v-model="user.email"
            ></v-text-field>
          </v-col> </v-row
        ><v-row dense>
          <v-col cols="3">
            <div class="headline text-right"></div>
          </v-col>
          <v-col cols="9">
            <v-text-field dense outlined label="Пространство"></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3"> </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="Роль"
              v-model="user.role"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex flex-row justify-center">
          <v-btn class="mt-10 mx-3" outlined color="success" type="submit">
            Сохранить
          </v-btn>
          <v-btn class="mt-10 mx-3" outlined color="error">
            Удалить аккаунт
          </v-btn>
        </div>
      </v-col>
      <v-col cols="4"> </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    user: {},
    items: [],
  }),
  mounted() {
    this.user = this.$store.getters.getUser;
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("updateUserInfo", this.user)
        .then(
          this.$store.commit("setMessage", {
            type: "success",
            text: "Данные успешно сохранены",
          })
        )
    },
  },
};
</script>