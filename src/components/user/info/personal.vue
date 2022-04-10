<template>
  <v-card flat>
    <v-form @submit.prevent="onSubmit" ref="persUserForm">
      <v-card-title v-if="!notitle">Личные данные</v-card-title>
      <v-card-text>
        <v-text-field
          name="fullName"
          label="ФИО"
          v-model="fullName"
          :disabled="disabled"
          :rules="[blankCheck]"
          @change.once="changed"
          :append-icon="disabled ? 'mdi-lock' : ''"
        >
          <template slot="prepend">
            <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
          </template></v-text-field
        >
      </v-card-text>
      <v-card-actions v-if="!noaction && !disabled">
        <v-spacer></v-spacer>
        <v-btn type="submit" color="success" text :disabled="!isChanged">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { defUser } from "../../../plugins/schema";
import {inputRules} from "@/mixins/inputRules";
export default {
  mixins:[inputRules],
  props: {
    data: {
      type: [Object],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    notitle: {
      type: Boolean,
      default: false,
    },
    noaction: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isChanged: false,
    fullName: "",
  }),
  created() {
    this.update();
  },
  methods: {
    onSubmit() {
      if (this.disabled || this.noaction) return;

      this.saveData("user/update", this.user)
        .then(this.successMsg())
        .then((this.isChanged = false))
        .catch((err) => this.successMsg(err));
    },
    saveData(saveMethod, user) {
      return this.$store.dispatch(saveMethod, {
        uid: user.uid,
        fullName: user.fullName,
        workspace: user.workspace,
      });
    },
    successMsg() {
      this.$store.dispatch("setMessage", {
        type: "success",
        text: "Данные сохранены",
      });
    },
    errMsg(err) {
      this.$store.dispatch("setMessage", {
        type: "error",
        text: err.message,
        code: err.code,
      });
    },
    changed() {
      this.isChanged = true;
      this.$emit("change", { fullName: this.fullName });
    },
    reset() {
      this.$refs.persUserForm.reset();
      this.user = defUser();
    },
    update() {
      this.fullName = this.data.fullName || "";
    },
    getData() {
      return { fullName: this.fullName };
    },
    validate() {
      return this.$refs.persUserForm.validate()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>