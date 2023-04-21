<template>
  <app-base-sheet>
    <v-card flat height="100%">
      <v-form
          ref="form"
          @submit.prevent="onSubmit"
          class="d-flex flex-column"
      >
        <v-card-title>Настройки пространства</v-card-title>
        <v-card-text>
          <setting-row label="ID пространства" description="Поделитесь кодом, для регистрации в вашем пространстве">
            <div class="d-flex align-top">
              <v-text-field
                  v-model="workspace.id"
                  dense
                  disabled
                  label="ID пространства"
                  name="workspace"
                  single-line
              >
                <template v-slot:prepend>
                  <input-icon>mdi-identifier</input-icon>
                </template>
              </v-text-field>
              <v-fab-transition>
                <icon-btn-with-tip
                    v-if="!copiedSuccessful"
                    icon="mdi-content-copy"
                    @click="copyToClipboard(workspace.id)"
                >
                  Копировать
                </icon-btn-with-tip>
                <icon-btn-with-tip
                    v-else
                    color="success"
                    icon="mdi-check-all"
                    tooltipcolor="success"
                >
                  Успешно
                </icon-btn-with-tip>
              </v-fab-transition>
            </div>
          </setting-row>
          <setting-row label="Название пространства" description="Название отдела или компании">
            <v-text-field
                v-model.trim="workspace.title"
                :disabled="disabled"
                dense
                label="Название"
                name="title"
                single-line
                @change.once="onChange"
            >
              <template v-slot:prepend>
                <input-icon>mdi-sitemap</input-icon>
              </template>
            </v-text-field>
          </setting-row>
          <setting-row label="Домен почты"
                       description="Используемый Вами домен для почты. Будет предлагаться по умолчанию, для всех новых пользователей ">
            <v-text-field
                v-model.trim="domain"
                :disabled="disabled"
                dense
                label="Домен для почты по умолчанию"
                name="domain"
                single-line
                @change.once="onChange"
            >
              <template v-slot:prepend>
                <input-icon>mdi-at</input-icon>
              </template>
            </v-text-field>
          </setting-row>
        </v-card-text>
        <v-card-actions class="mt-auto" v-if="!disabled">
          <v-spacer></v-spacer>
          <btn-submit :disabled="!isChanged"/>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-form>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/components/UI/app-base-sheet";
import InputIcon from "@/components/InputIcon";
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {workspace} from "@/mixins/ComputedData";
import {copyToClipboard} from "@/mixins/dataHelper";
import SettingRow from "@/components/Account/setting-row";
import BtnSubmit from "@/components/UI/btn-submit";

export default {
  name: "workspace",
  components: {BtnSubmit, SettingRow, AppBaseSheet, InputIcon, IconBtnWithTip},
  mixins: [workspace, copyToClipboard],
  data: () => ({
    isChanged: false,
    disabled: false
  }),
  computed: {
    domain: {
      get() {
        return this.workspace.domain
      },
      set(val) {
        let isAt = val.indexOf('@') != -1
        let needAt = val != ''
        this.workspace.domain = (!isAt && needAt ? '@' : '') + val
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('try update:', this.disabled, this.hideAction)
      if (this.disabled || this.hideAction) {
        return;
      }
      console.log('try update')
      this.updateWorkspace(this.workspace)
      this.isChanged = false
    },
    onChange() {
      if (this.isChanged) {
        return
      }
      this.isChanged = true
    },
    reset() {
      this.$refs.form.reset();
    },
    getData() {
      return this.workspace
    },
    validate() {
      return this.$refs.form.validate()
    }
  },
}
</script>

<style scoped>

</style>