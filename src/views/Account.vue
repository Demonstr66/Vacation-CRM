<template>
  <!-- <v-row class="">
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
              name="fullName"
              @change="onChange"
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
              @change="onChange"
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
              @change="onChange"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="3"> </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="Команды"
              @change="onChange"
            ></v-text-field>
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
              @change="onChange"
            ></v-text-field>
          </v-col> </v-row
        ><v-row dense>
          <v-col cols="3">
            <div class="headline text-right"></div>
          </v-col>
          <v-col cols="9">
            <v-text-field
              dense
              outlined
              label="Пространство"
              @change="onChange"
            ></v-text-field>
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
              @change="onChange"
            ></v-text-field>
          </v-col>
        </v-row>
        <div class="d-flex flex-row justify-center">
          <v-btn
            :disabled="!isChanged"
            class="mt-10 mx-3"
            outlined
            color="success"
            type="submit"
          >
            Сохранить
          </v-btn>
          <v-btn class="mt-10 mx-3" outlined color="error">
            Удалить аккаунт
          </v-btn>
        </div>
      </v-col>
      <v-col cols="4"> </v-col>
    </v-row> -->
  <v-row>
    <v-col>
      <v-card flat>
        <v-form @submit.prevent="onSubmit">
          <v-card-title>Личные данные</v-card-title>
          <v-card-text>
            <v-text-field
              name="fullName"
              label="ФИО"
              v-model="user.fullName"
              @change="isChanged = true"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="success" text :disabled="!isChanged">
              Сохранить
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-col>
    <v-col>
      <v-card flat>
        <v-card-title>Информация</v-card-title>
        <v-card-text>
          <v-text-field
            name="email"
            label="Email"
            v-model="user.email"
            disabled
            color="warning"
            append-icon="mdi-lock"
          ></v-text-field>
          <v-text-field
            name="post"
            label="Должность"
            v-model="user.post"
            disabled
            append-icon="mdi-lock"
          ></v-text-field>
          <v-autocomplete
            label="Команда"
            append-icon="mdi-lock"
            :items="tasks"
            v-model="team"
            item-text="label"
            item-value="id"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                outlined
                label
                class="ma-1"
              >
                {{ data.item.label }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-text="data.item.label">
                  {{ data.item.label }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            label="Задачи"
            append-icon="mdi-lock"
            multiple
            :items="tasks"
            v-model="userTasks"
            item-text="label"
            item-value="id"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                outlined
                label
                class="ma-1"
              >
                {{ data.item.label }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-text="data.item.label">
                  {{ data.item.label }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  data: () => ({
    items: [],
    tasks: [
      { id: 1, label: "task1" },
      { id: 2, label: "task2" },
      { id: 3, label: "task3" },
    ],
    userTasks: [1, 2],
    team: 1,
    isChanged: false,
  }),
  mounted() {
    this.$store.dispatch("user/getCurrentUserData");
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
    }),
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch("user/update", this.user)
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Данные сохранены",
          })
        )
        .then((this.isChanged = false));
    },
  },
};
</script>