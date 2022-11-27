<template>
  <app-base-sheet>
    <v-data-table
      :headers="$options.HEADERS"
      :items="Object.values(schedules)"
      dense
      no-data-text="Графики ещё не добавлены"
    >
      <template v-if="$can('create', 'Schedule')" v-slot:top>
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-btn v-if="$can('create', 'Schedule')" color="primary" text
                 @click="gotoEditor()">Создать
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{item}">
        <vacation-status-chip
          :status="item.status"
          :statuses="$options.STATUSES"
        />
      </template>
      <template v-slot:item.isApprove="{item}">
        <v-switch
          :disabled="(!item.isActive && !item.isApprove)"
          readonly
          v-model="item.isApprove"
          class="align-center justify-center mt-0"
          color="success"
          dense
          hide-details
          inset
          @click="toggleActivation(item)"
        />
      </template>
      <template v-slot:item.action="{item}">
        <RowActions>
          <icon-btn-with-tip
            :disable="item.isApprove || !$can('update', 'Schedule')"
            :icon="item.isApprove ? 'mdi-pencil-lock' : 'mdi-pencil'"
            @click="gotoEditor(item)"
          >
            Редактировать
          </icon-btn-with-tip>

          <icon-btn-with-tip
            :disable="!$can('delete', 'Schedule') ||
              (item.isActive && !$can('deactivate', 'Schedule')) ||
              (item.isApprove && !$can('cancel', 'Schedule'))"
            color="error"
            icon="mdi-delete"
            @click="deleteAlertShow(item.id)"
          >
            Удалить
          </icon-btn-with-tip>
          <icon-btn-with-tip
            color="light-green darken-1"
            icon="mdi-chart-box-outline"
            @click="gotoStat(item.id)"
          >
            Статистика
          </icon-btn-with-tip>
          <icon-btn-with-tip color="info" icon="mdi-eye"  tag="a" :to="{name: 'Viewer1', params: {id: item.id}}">
            Просмотр
          </icon-btn-with-tip>
          <icon-btn-with-tip color="info" icon="mdi-chart-gantt" tag="a" :to="{name: 'Viewer2', params: {id: item.id}}">
            Таймлайн
          </icon-btn-with-tip>
          <icon-btn-with-tip
            v-if="item.isDraft"
            :disable="!$can('activate', 'Schedule')"
            color="success"
            icon="mdi-check"
            @click="sendToFill(item.id)"
          >
            Активировать
          </icon-btn-with-tip>
          <icon-btn-with-tip
            v-if="item.isActive"
            :disable="!$can('deactivate', 'Schedule')"
            color="warning" icon="mdi-cancel"
            @click="cancelFill(item.id)"
          >
            Деактивировать
          </icon-btn-with-tip>
        </RowActions>
      </template>
    </v-data-table>
    <app-popup
      ref="deletePopup"
    >
      Вы хотите удалить график. Так же будут удалены все прикреплённые к нему отпуска<br>Продолжить?
    </app-popup>
    <app-popup
      ref="acceptPopup"
    >
      Утвердить график? Пользователи больше не смогут вносить изменения в отпуска<br>Продолжить?
    </app-popup>
    <app-popup
      ref="deactivatePopup"
    >
      Отозвать график? Пользователи снова смогут вносить изменения в отпуска<br>Продолжить?
    </app-popup>
  </app-base-sheet>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {schedules} from "@/mixins/ComputedData";
import schedulesHeaders from "@/plugins/TableHeaders/Schedules";
import RowActions from "@/components/RowActions";
import VacationStatusChip from "@/components/AppStatusChip";
import {Schedule} from "@/plugins/servises/Schedule";
import AppPopup from "@/components/AppPopup";
import AppBaseSheet from "@/layouts/AppBaseSheet";


export default {
  name: 'ScheduleItem',
  mixins: [schedules],
  components: {AppBaseSheet, AppPopup, VacationStatusChip, RowActions, IconBtnWithTip},
  HEADERS: schedulesHeaders,
  STATUSES: Schedule.statuses,
  methods: {
    sendToFill(id) {
      this.schedules[id].activate()
    },
    cancelFill(id) {
      this.schedules[id].deactivate()
    },
    async deleteAlertShow(id) {
      let result = await this.$refs.deletePopup.open()

      if (result) {
        this.schedules[id].delete()
      }
    },
    async approveAlertShow(id) {
      let result = await this.$refs.acceptPopup.open()

      if (result) {
        this.schedules[id].approve()
      }
    },
    async cancelAlertShow(id) {
      let result = await this.$refs.deactivatePopup.open()

      if (result) {
        this.schedules[id].cancel()
      }
    },
    toggleActivation(item) {
      if (
        item.isDraft &&
        (item.isApprove && !this.$can('cancel', 'Schedule')) ||
        (!item.isApprove && !this.$can('approve', 'Schedule'))
      ) return

      if (item.isApprove) {
        this.cancelAlertShow(item.id)
      } else {
        this.approveAlertShow(item.id)
      }
    },
    gotoEditor(item) {
      let route = {name: 'ScheduleEditor'}

      if (!!item) {
        route.name = 'ScheduleCreate'
        route.params = {id: item.id}
      }

      this.$router.push(route)
    },
    gotoStat(id) {
      this.$router.push({name: 'ScheduleStatistic', params: {id: id}})
    },
    gotoViewer(id) {
      this.$router.push({name: 'Viewer1', params: {id: id}})
    },
    gotoTimeline(id) {
      this.$router.push({name: 'Viewer2', params: {id: id}})
    },
  }
}
</script>

<style lang="css">
.v-input__slot {
  align-items: center !important;
  justify-content: center !important;
}
</style>
