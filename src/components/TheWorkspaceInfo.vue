<template>
  <v-card flat>
    <component :is="tag" ref="form" @submit.prevent="onSubmit">
      <v-card-title v-if="!hideTitle">Настройки Пространства</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col :cols="12 / cols">
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
          </v-col>
          <v-col :cols="12 / cols">
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
          </v-col>
          <v-col :cols="12 / cols">
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
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="!hideAction && !disabled && solo">
        <v-spacer></v-spacer>
        <v-btn :disabled="!isChanged" color="success" text type="submit">
          Сохранить
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </component>
  </v-card>
</template>

<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {copyToClipboard} from "@/mixins/dataHelper";
import {WorkspaceMethods} from "@/mixins/WorkspaceMethods";
import InputIcon from "@/components/InputIcon";
import {VForm} from "vuetify/lib/components";

export default {
  components: {InputIcon, IconBtnWithTip,VForm},
  mixins: [WorkspaceMethods, copyToClipboard],
  props: {
    solo: {
      type: Boolean,
      default: false
    },
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
    },
    tag() {
      return this.solo ? 'VForm' : 'div'
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

