<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="Object.values(schedules)"
      dense
      item-class="clickable"
      no-data-text="Графики ещё не добавлены"
    >
      <template v-slot:top>
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-btn v-if="$can('create', 'Shcedule')" color="primary" text
                 @click="gotoEditor()">Создать
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{item}">
        <RowActions>
            <icon-btn-with-tip
              v-if="$can('update', 'Schedule')"
              :disable="item.isActive || item.isLoading"
              :icon="item.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
              @click="gotoEditor(item)"
            >
              Редактировать
            </icon-btn-with-tip>
            <icon-btn-with-tip
              v-if="$can('delete', 'Schedule')"
              :disable="item.isActive || item.isLoading"
              color="error"
              icon="mdi-delete"
              @click="deleteAlertShow(item.id)"
            >
              Удалить
            </icon-btn-with-tip>
            <icon-btn-with-tip color="info" icon="mdi-eye" @click="gotoViewer(item.id)">
              Просмотр
            </icon-btn-with-tip>
        </RowActions>
      </template>
    </v-data-table>
    <Alert
      :show="deleteAlert.show"
      @cancel="deleteAlertCancel"
      @submit="deleteAlertSubmit"
    >
      Вы хотите удалить график. Так же будут удалены все прикреплённые к нему отпуска<br>Продолжить?
    </Alert>
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import ScheduleEditorModal from "@/components/Modals/ScheduleEditorModal";
import {schedules} from "@/mixins/ComputedData";
import Alert from "@/components/Modals/Alert";
import {dataMethods} from "@/mixins/dataHelper";
import schedulesHeaders from "@/plugins/TableHeaders/Schedules";
import {ScheduleMethods} from "@/mixins/ScheduleMethods";
import RowActions from "@/components/RowActions";


export default {
  name: 'ScheduleItem',
  mixins: [schedules, dataMethods, ScheduleMethods],
  components: {RowActions, Alert, IconBtnWithTip, ScheduleEditorModal},
  data: () => ({
    headers: schedulesHeaders,
    deleteAlert: {
      show: false,
      id: null,
    }
  }),
  methods: {
    deleteAlertShow(id) {
      this.deleteAlert.id = id
      this.deleteAlert.show = true
    },
    deleteAlertCancel() {
      this.deleteAlertClose()
    },
    deleteAlertSubmit() {
      this.deleteSchedule(this.deleteAlert.id)
      this.deleteAlertClose()
    },
    deleteAlertClose() {
      this.deleteAlert.id = null
      this.deleteAlert.show = false
    },
    gotoEditor(item) {
      if (!!item) this.$router.push({name: 'ScheduleEditor', params: {id: item.id}})
      else this.$router.push({name: 'ScheduleCreate'})
    },
    gotoViewer(id) {
      this.$router.push({name: 'Viewer1', params: {id: id}})
    },
  }
}
</script>
