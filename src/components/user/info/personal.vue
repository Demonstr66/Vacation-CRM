<template>
  <v-card flat>
    <v-form ref="persUserForm" @submit.prevent="onSubmit">
      <v-card-title v-if="!notitle">Личные данные</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="user.fullName"
          :append-icon="disabled ? 'mdi-lock' : ''"
          :disabled="disabled"
          :rules="[blankCheck]"
          label="ФИО"
          name="fullName"
          @change.once="changed"
        >
          <template v-slot:prepend>
            <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
          </template>
        </v-text-field
        >
      </v-card-text>
      <v-card-actions v-if="!noaction && !disabled">
        <v-spacer></v-spacer>
        <v-btn :disabled="!isChanged" color="success" text type="submit">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import {defUser} from "@/plugins/schema";
import {inputRules} from "@/mixins/inputRules";

export default {
  name: 'PersonalUserInfo',
  mixins: [inputRules],
  props: {
    user: {
      type: Object,
      required: true,
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
  }),
  methods: {
    onSubmit() {
      if (this.disabled || this.noaction) return;

      this.saveUser(false, this.user)
    },
    changed() {
      this.isChanged = true;
      this.$emit("change");
    },
    reset() {
      this.$refs.persUserForm.reset();
      this.user = defUser();
    },
    update() {
      this.user = defUser(this.data);
    },
    getData() {
      return {fullName: this.user.fullName};
    },
    validate() {
      return this.$refs.persUserForm.validate()
    }
  },
};
</script>

<style lang="scss" scoped>
</style>