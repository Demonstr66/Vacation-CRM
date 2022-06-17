<template>
  <v-card flat>
    <v-form ref="workspaceForm" @submit.prevent="onSubmit">
      <v-card-title v-if="!notitle">Настройки Пространства</v-card-title>
      <v-card-text>
        <v-row v-if="!!workspace">
          <v-col :cols="12 / cols">
            <div class="d-flex align-top">
              <v-text-field
                  v-model.trim="workspace.id"
                  dense
                  disabled
                  label="ID пространства"
                  name="workspace"
                  single-line
                  @change.once="onChange"
              >
                <template v-slot:prepend>
                  <v-icon color="blue-grey lighten-1">mdi-identifier</v-icon>
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
                v-model.trim="workspace.name"
                :disabled="disabled"
                dense
                label="Название организации"
                name="name"
                single-line
                @change.once="onChange"
            >
              <template v-slot:prepend>
                <v-icon color="blue-grey lighten-1">mdi-sitemap</v-icon>
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
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {defWorkspace} from "@/plugins/schema";
import {workspaceMethods} from "@/mixins/workspaceHelper";
import {workspace} from "@/mixins/ComputedData";
import {copyToClipboard} from "@/mixins/dataHelper";

export default {
  components: {IconBtnWithTip},
  mixins: [workspaceMethods, workspace, copyToClipboard],
  props: {
    disabled: {
      type: [Boolean],
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
      if (this.disabled || this.noaction) return;

      this.mixSaveWorkspace(false, this.workspace)
          .then(res => {
            console.log("res", res)
          })
          .catch(err => {
            console.log("err", err)
          })
    },
    onChange() {
      this.isChanged = true;
      this.$emit("change");
    },
    reset() {
      this.$refs.workspaceForm.reset();
      this.user = defWorkspace();
    },
    getData() {
      return this.workspace
    },
    validate() {
      return this.$refs.workspaceForm.validate()
    }
  },
};
</script>

