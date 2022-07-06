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
          <v-btn color="primary" text @click="gotoEditor()">Создать</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{item}">
        <v-menu
          v-if="$vuetify.breakpoint.smAndDown"
          content-class="no-sheet"
          offset-y
          top

        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <div class="d-flex flex-column white">
            <icon-btn-with-tip
              :disable="item.isActive || item.isLoading"
              :icon="item.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
              @click="gotoEditor(item)"
            >
              Редактировать
            </icon-btn-with-tip>
            <icon-btn-with-tip
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
          </div>
        </v-menu>
        <div v-else>
          <icon-btn-with-tip
            :disable="item.isActive || item.isLoading"
            :icon="item.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
            @click="gotoEditor(item)"
          >
            Редактировать
          </icon-btn-with-tip>
          <icon-btn-with-tip
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
        </div>
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


export default {
  name: 'ScheduleItem',
  mixins: [schedules, dataMethods, ScheduleMethods],
  components: {Alert, IconBtnWithTip, ScheduleEditorModal},
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
