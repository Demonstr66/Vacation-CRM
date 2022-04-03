<template>
  <v-card flat>
    <v-form @submit.prevent="onSubmit">
      <v-card-title v-if="!notitle">Личные данные</v-card-title>
      <v-card-text>
        <v-text-field
          name="fullName"
          label="ФИО"
          v-model="fullName"
          :disabled="disabled"
          @change="changed"
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
export default {
  props: {
    data: {
      type: [Object, String],
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
  mounted() {
    if (typeof this.data !== "string") this.fullName = this.data.fullName || "";
    else this.fullName = this.data;
  },
  methods: {
    onSubmit() {
      if (this.disabled || this.noaction) return;

      this.$store
        .dispatch("user/update", { fullName: this.fullName })
        .then(
          this.$store.dispatch("setMessage", {
            type: "success",
            text: "Данные сохранены",
          })
        )
        .then((this.isChanged = false));
    },
    changed() {
      this.isChanged = true;
      this.$emit("change", { fullName: this.fullName });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>