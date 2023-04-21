<template>
  <app-base-sheet :flat="!solo">
    <v-card flat height="100%">
      <component :is="tag" ref="theUserForm" v-model="valid"
                 class="d-flex flex-column"
                 style="height: 100%;"
                 @submit.prevent="onSubmit">
        <v-card-title v-if="!hideTitle">Личные данные</v-card-title>
        <v-card-text>
          <setting-row description="Полное ФИО" label="ФИО">
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
          </setting-row>
          <setting-row
              description="Соращенный вариант ФИО или любой другой удобный вариант, который будет отображаться в большинстве мест программы"
              label="Имя для отображения">
            <v-text-field
                v-if="!hideAdditionalFields"
                v-model="user.displayName"
                :append-icon="disabled ? 'mdi-lock' : ''"
                :disabled="disabled"
                :rules="[blankCheck]"
                label="Имя для отображения"
                name="displayName"
                @change="changed"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
              </template>
            </v-text-field
            >
          </setting-row>
          <setting-row description="Этот вариант будет использоваться в шаблоне заявления на отпуск"
                       label="Родительный падеж ФИО">
            <v-text-field
                v-if="!hideAdditionalFields"
                v-model="user.templateName"
                :append-icon="disabled ? 'mdi-lock' : ''"
                :disabled="disabled"
                :rules="[fioCheck]"
                hint="От: "

                label="ФИО для шаблона заявления"
                name="templateName"
                @change="changed"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-account</v-icon>
              </template>
            </v-text-field
            >
          </setting-row>


          <!--          <v-text-field-->
          <!--              v-model="user.fullName"-->
          <!--              :append-icon="disabled ? 'mdi-lock' : ''"-->
          <!--              :disabled="disabled"-->
          <!--              :rules="[blankCheck]"-->
          <!--              label="ФИО"-->

          <!--              name="fullName"-->
          <!--              @change="changed"-->
          <!--          >-->
          <!--            <template v-slot:prepend>-->
          <!--              <v-icon color="blue-grey lighten-1">mdi-account</v-icon>-->
          <!--            </template>-->
          <!--          </v-text-field-->
          <!--          >-->
          <!--          <v-text-field-->
          <!--              v-if="!hideAdditionalFields"-->
          <!--              v-model="user.displayName"-->
          <!--              :append-icon="disabled ? 'mdi-lock' : ''"-->
          <!--              :disabled="disabled"-->
          <!--              :rules="[blankCheck]"-->
          <!--              label="Короткое имя"-->
          <!--              name="displayName"-->
          <!--              @change="changed"-->
          <!--          >-->
          <!--            <template v-slot:prepend>-->
          <!--              <v-icon color="blue-grey lighten-1">mdi-account</v-icon>-->
          <!--            </template>-->
          <!--          </v-text-field-->
          <!--          >-->
          <!--          <v-text-field-->
          <!--              v-if="!hideAdditionalFields"-->
          <!--              v-model="user.templateName"-->
          <!--              :append-icon="disabled ? 'mdi-lock' : ''"-->
          <!--              :disabled="disabled"-->
          <!--              :rules="[fioCheck]"-->
          <!--              hint="От: "-->

          <!--              label="ФИО для шаблона заявления"-->
          <!--              name="templateName"-->
          <!--              @change="changed"-->
          <!--          >-->
          <!--            <template v-slot:prepend>-->
          <!--              <v-icon color="blue-grey lighten-1">mdi-account</v-icon>-->
          <!--            </template>-->
          <!--          </v-text-field-->
          <!--          >-->
        </v-card-text>
        <v-card-actions v-if="!hideAction && !disabled && solo" class="mt-auto">
          <v-spacer></v-spacer>
          <btn-submit :disabled="!isChanged || !valid"/>
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
import AppBaseSheet from "@/components/UI/app-base-sheet";
import {posts} from "@/mixins/ComputedData";
import SettingRow from "@/components/Account/setting-row";
import BtnSubmit from "@/components/UI/btn-submit";

export default {
  name: 'TheUserInfo',
  mixins: [inputValidations],
  components: {BtnSubmit, SettingRow, AppBaseSheet, VForm},
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
      if (this.disabled || this.noaction) {
        return;
      }

      this.updateData()
      this.isChanged = false;
    },
    updateData(silent = false) {
      const user = new User(this.user)
      user.update({type: 'edit'}, silent)
    },
    changed() {
      if (this.isChanged) {
        return
      }
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