<template>
  <div>
    <v-data-table
      :headers="$options.HEADERS"
      :items="Object.values(schedules)"
      dense
      no-data-text="Графики ещё не добавлены"
    >
      <template v-slot:top>
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
      <template v-slot:item.isActive="{item}">
        <v-switch
          v-model="item.isActive"
          class="align-center justify-center mt-0"
          color="success"
          dense
          hide-details
          inset
          readonly
          @click="toggleActivation(item)"
        ></v-switch>
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
          <!--suppress JSCheckFunctionSignatures -->
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
          <icon-btn-with-tip v-if="item.status === 0" color="success" icon="mdi-check"
                             @click="sendToFill(item.id)">
            Активировать
          </icon-btn-with-tip>
          <icon-btn-with-tip
            v-if="item.status === 1"
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
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip";
import {schedules} from "@/mixins/ComputedData";
import schedulesHeaders from "@/plugins/TableHeaders/Schedules";
import RowActions from "@/components/RowActions";
import VacationStatusChip from "@/components/AppStatusChip";
import {Schedule} from "@/plugins/servises/Schedule";
import AppPopup from "@/components/AppPopup";


export default {
  name: 'ScheduleItem',
  mixins: [schedules],
  components: {AppPopup, VacationStatusChip, RowActions, IconBtnWithTip},
  HEADERS: schedulesHeaders,
  STATUSES: Schedule.statuses,
  methods: {
    sendToFill(id) {
      this.schedules[id].sendToFill()
    },
    cancelFill(id) {
      this.schedules[id].cancelFill('')
    },
    async deleteAlertShow(id) {
      let result = await this.$refs.deletePopup.open()

      if (result) {
        this.schedules[id].delete()
      }
    },
    async acceptAlertShow(id) {
      let result = await this.$refs.acceptPopup.open()

      if (result) {
        this.schedules[id].activate()
      }
    },
    async deactivateAlertShow(id) {
      let result = await this.$refs.deactivatePopup.open()

      if (result) {
        this.schedules[id].deactivate()
      }
    },
    toggleActivation(item) {
      if (item.isDraft()) return

      if (item.isActive) {
        this.deactivateAlertShow(item.id)
      } else {
        this.acceptAlertShow(item.id)
      }
    },
    gotoEditor(item) {
      let route = {name: 'ScheduleEditor'}

      if (!!item) route.params = {id: item.id}

      this.$router.push(route)
    },
    gotoViewer(id) {
      this.$router.push({name: 'Viewer1', params: {id: id}})
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
