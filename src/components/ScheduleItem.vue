<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="Object.values(schedules)"
      :loading="!schedulesReady"
      item-class="clickable"
      item-key="id"
    >
      <template v-slot:no-data>
        <v-row justify="center">
          Отпуска ещё не добавлены
        </v-row>
      </template>
      <template v-slot:top>
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onAddNewSchedule">Создать</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.isActive="{item}">
        <v-switch
          v-model="item.isActive"
          :loading="item.isLoading"
          :messages="item.isActive ? 'Утверждён' : 'Заполняется'"
          color="success"
          @click.prevent="onActivationChange(item.id)"
        >
        </v-switch>
      </template>
      <template v-slot:item.action="{item}">
        <v-row class="d-flex ma-0 pa-0" style="max-width: fit-content">
          <v-col class="ma-0 pa-0">
            <icon-btn-with-tip
              :disable="item.isActive || item.isLoading"
              :icon="item.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
              @click="onEdit(item)"
            >
              Редактировать
            </icon-btn-with-tip>
          </v-col>
          <v-col class="ma-0 pa-0">
            <icon-btn-with-tip
              :disable="item.isActive || item.isLoading"
              color="error"
              icon="mdi-delete"
              @click="onDelete(item.id)"
            >
              Удалить
            </icon-btn-with-tip>
          </v-col>
          <v-col class="ma-0 pa-0">
            <icon-btn-with-tip color="info" icon="mdi-eye">
              Просмотр
            </icon-btn-with-tip>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
    <Alert
      :show="activation.show"
      @cancel="onActivationCancel"
      @submit="onActivationSubmit"
    >
      {{ activation.text }}<br>Продолжить?
    </Alert>
    <Alert
      :show="deleting.show"
      @cancel="onDeletingCancel"
      @submit="onDeletingSubmit"
    >
      Вы хотите удалить график. Так же будут удалены все прикреплённые к нему отпуска<br>Продолжить?
    </Alert>
    <ScheduleEditorModal
      :data="editor.item"
      :show="editor.show"
      @close="onCloseModal"
    />
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import ScheduleEditorModal from "@/components/Modals/ScheduleEditorModal";
import {schedules} from "@/mixins/ComputedData";
import {mapGetters} from "vuex";
import Alert from "@/components/Modals/Alert";
import {dataMethods} from "@/mixins/dataHelper";


export default {
  name: 'ScheduleItem',
  mixins: [schedules, dataMethods],
  components: {Alert, IconBtnWithTip, ScheduleEditorModal},
  data: () => ({
    headers: [
      {
        text: 'Название',
        value: 'title',
      },
      {
        text: 'Год',
        value: 'year',
      },
      {
        text: 'Статус',
        value: 'isActive',
        sortable: false
      },
      {
        text: 'Действия',
        value: 'action',
        align: 'end',
        sortable: false
      },
    ],
    editor: {
      show: false,
      item: null
    },
    activation: {
      show: false,
      item: null,
      text: null,
      msg: null
    },
    deleting: {
      show: false,
      id: null,
    }
  }),
  computed: {
    ...mapGetters('schedules', {schedulesReady: 'isReady'})
  },
  methods: {
    onActivationChange(id) {
      const isActive = this.schedules[id].isActive
      const text = isActive ? 'После активации вносить изменения сможет только Администратор.' :
        'После деактивации график станет доступным для редактирования всеми пользователями'

      const msg = isActive ? 'График активирован' : 'График деактивирован'
      this.showActivationAlert(id, text, msg)
      this.schedules[id].isLoading = true
      this.schedules[id].isTemp = !isActive
    },
    showActivationAlert(id, text, msg) {
      this.activation.item = this.schedules[id]
      this.activation.text = text
      this.activation.msg = msg

      this.$nextTick(() => {
        this.activation.show = true
      })
    },
    onActivationSubmit() {
      this.asyncDispatchWithMessage({
        method: 'schedules/update',
        data: this.activation.item,
        msg: this.activation.msg,
      })

      this.closeActivationAlert()
    },
    onActivationCancel() {
      const id = this.activation.item.id
      this.schedules[id].isLoading = false
      this.schedules[id].isActive = !this.schedules[id].isActive
      this.schedules[id].isTemp = !this.schedules[id].isTemp

      this.closeActivationAlert()
    },
    closeActivationAlert() {
      this.activation.show = false

      this.$nextTick(() => {
        this.activation.item = null
        this.activation.text = null
        this.activation.msg = null
      })
    },
    onDelete(id) {
      this.deleting.id = id
      this.deleting.show = true
    },
    onDeletingCancel() {
      this.closeDeletingAlert()
    },
    onDeletingSubmit() {
      this.asyncDispatchWithMessage({
        method: 'schedules/delete',
        data: this.deleting.id,
        msg: 'График удалён'
      })

      this.closeDeletingAlert()
    },
    closeDeletingAlert() {
      this.deleting.id = null
      this.deleting.show = false
    },
    onEdit(item) {
      this.editor.item = item
      this.showEditorModal()
    },
    onAddNewSchedule() {
      this.showEditorModal()
    },
    showEditorModal() {
      this.editor.show = true
    },
    onCloseModal() {
      this.editor.show = false
      this.editor.item = null
    }
  }
}
</script>
