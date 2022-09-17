<template>
  <app-base-sheet :flat="!solo">
    <v-card flat height="100%">
      <component :is="tag" ref="theUserForm" v-model="valid"
                 class="d-flex flex-column"
                 style="height: 100%;"
                 @submit.prevent="onSubmit">
        <v-card-title v-if="!hideTitle">Личные данные</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="user.fullName"
            :append-icon="disabled ? 'mdi-lock' : ''"
            :disabled="disabled"
            :rules="[blankCheck]"
            label="ФИО"

            name="fullName"
            @change="changed"
          >
            <template v-slot:prepend>
              <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
            </template>
          </v-text-field
          >
          <v-text-field
            v-if="!hideAdditionalFields"
            v-model="user.displayName"
            :append-icon="disabled ? 'mdi-lock' : ''"
            :disabled="disabled"
            :rules="[blankCheck]"
            label="Короткое имя"
            name="displayName"
            @change="changed"
          >
            <template v-slot:prepend>
              <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
            </template>
          </v-text-field
          >
          <!--        <v-text-field-->
          <!--          v-if="!hideAdditionalFields"-->
          <!--          v-model="user.templateName"-->
          <!--          :append-icon="disabled ? 'mdi-lock' : ''"-->
          <!--          :disabled="disabled"-->
          <!--          :rules="[fioCheck]"-->
          <!--          hint="От: "-->
          <!--          -->
          <!--          label="ФИО для шаблона заявления"-->
          <!--          name="templateName"-->
          <!--          @change="changed"-->
          <!--        >-->
          <!--          <template v-slot:prepend>-->
          <!--            <v-icon color="blue-grey lighten-1">mdi-account</v-icon>-->
          <!--          </template>-->
          <!--        </v-text-field-->
          <!--        >-->
        </v-card-text>
        <v-card-actions class="mt-auto" v-if="!hideAction && !disabled && solo">
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!isChanged || !valid"
            color="success"
            text
            type="submit"
          >
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </component>
    </v-card>
  </app-base-sheet>
</template>

<script>
import {inputValidations} from "@/mixins/InputValidations";
import {VForm} from "vuetify/lib/components";
import {User} from "@/plugins/servises/User";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: 'TheUserInfo',
  mixins: [inputValidations],
  components: {AppBaseSheet, VForm},
  props: {
    solo: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hideTitle: {
      type: Boolean,
      default: false,
    },
    hideAction: {
      type: Boolean,
      default: false,
    },
    hideAdditionalFields: {
      type: Boolean,
      default: false,
    }

  },
  data: () => ({
    isChanged: false,
    valid: false
  }),
  computed: {
    tag() {
      return this.solo ? 'VForm' : 'div'
    }
  },
  methods: {
    onSubmit() {
      if (this.disabled || this.noaction) return;

      this.updateData()
      this.isChanged = false;
    },
    updateData(silent = false) {
      const user = new User(this.user)
      user.update({type: 'edit'}, silent)
    },
    changed() {
      if (this.isChanged) return
      this.isChanged = true
    },
    reset() {
      this.$refs.theUserForm.reset();
    },
    getData() {
      return {
        fullName: this.user.fullName
      }
    },
    validate() {
      return this.$refs.form.validate()
    }
  },
};
</script>