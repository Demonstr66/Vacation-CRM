<template>
  <app-base-sheet>
    <v-card flat height="100%">
      <v-form ref="form" @submit.prevent="onSubmit"
              class="d-flex flex-column"
              style="height: 100%;">
        <v-card-title v-if="!hideTitle">Настройки</v-card-title>
        <v-card-text>
          <div class="d-flex flex-column">
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
              <icon-btn-with-tip icon="mdi-help-circle-outline">
                Код может понадобитьсья при регистрации,<br>
                чтобы присоедениться к Вашему пространству
              </icon-btn-with-tip>
              <v-fab-transition>
                <icon-btn-with-tip
                  v-if="!copiedSuccessful"
                  icon="mdi-content-copy"
                  @click="copyToClipboard(workspace.id)"
                >
                  Копировать
                </icon-btn-with-tip>
                <icon-btn-with-tip
                  v-if="copiedSuccessful"
                  color="success"
                  icon="mdi-check-all"
                  tooltipcolor="success"
                >
                  Успешно
                </icon-btn-with-tip>
              </v-fab-transition>
            </div>
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
                <v-icon color="blue-grey lighten-1">mdi-at</v-icon>
              </template>
            </v-text-field>
            <!--            <v-checkbox-->
            <!--              label="Разрешить исправлять отклонённые отпуска"-->
            <!--              hide-details-->
            <!--            />-->
          </div>
        </v-card-text>
        <v-card-actions class="mt-auto" v-if="!hideAction && !disabled">
          <v-spacer></v-spacer>
          <v-btn :disabled="!isChanged" color="success" text type="submit">
            Сохранить
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-form>
    </v-card>
  </app-base-sheet>
</template>

<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {copyToClipboard} from "@/mixins/dataHelper";
import {WorkspaceMethods} from "@/mixins/WorkspaceMethods";
import InputIcon from "@/components/InputIcon";
import {VForm} from "vuetify/lib/components";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  components: {AppBaseSheet, InputIcon, IconBtnWithTip},
  mixins: [WorkspaceMethods, copyToClipboard],
  props: {
    workspace: {
      id: String,
      domain: Array,
      title: String
    },
    disabled: {
      type: [Boolean],
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
    cols: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    isChanged: false,
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
      if (this.disabled || this.hideAction) return;
      console.log('try update')
      this.updateWorkspace(this.workspace)
      this.isChanged = false
    },
    onChange() {
      if (this.isChanged) return
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
};
</script>

