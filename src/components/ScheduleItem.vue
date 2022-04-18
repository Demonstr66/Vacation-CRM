<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="schedules"
      item-class="clickable"
      item-key="id"
    >
      <template v-slot:top>
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onAddNewSchedule">Создать</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.isActive="{item}">
        <v-switch
          v-model="item.isActive"
          @click.prevent="myF"
          loading
          :messages="item.isActive ? 'Утверждён' : 'Заполняется'"
          color="success"
        >
        </v-switch>
<!--        <v-chip-->
<!--          :color="!item.isTemp ? !item.isActive ? '' : 'success' : 'warning'"-->
<!--          label-->
<!--          outlined-->
<!--          small-->
<!--        >-->
<!--          {{ !item.isTemp ? !item.isActive ? '' : 'Утверждён' : 'Заполняется' }}-->
<!--        </v-chip>-->
      </template>
      <template v-slot:item.action="{item}">
        <v-row  class="d-flex ma-0 pa-0" style="max-width: fit-content">
          <v-col class="ma-0 pa-0">
            <icon-btn-with-tip
              :disable="item.isActive"
              :icon="item.isActive ? 'mdi-pencil-lock' : 'mdi-pencil'"
              @click="onEdit(item)"
            >
              Редактировать
            </icon-btn-with-tip>
          </v-col>
          <v-col class="ma-0 pa-0">
            <icon-btn-with-tip
              :disable="item.isActive"
              color="error"
              icon="mdi-delete"
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
import {schedules} from "@/mixins/computedData";


export default {
  name: 'ScheduleItem',
  mixins: [schedules],
  components: {IconBtnWithTip, ScheduleEditorModal},
  data: () => ({
    headers: [
      {
        text: 'Название',
        value: 'name',
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
    }
  }),
  methods: {
    myF(val, val2) {
      console.log(val, val2)
    },
    onActivateItem(id) {
      let idx = this.schedules.findIndex(s => s.id == id)
      this.schedules[idx].isActive = true
      this.schedules[idx].isTemp = false
    },
    onDeactivateItem(id) {
      let idx = this.schedules.findIndex(s => s.id == id)
      this.schedules[idx].isActive = false
      this.schedules[idx].isTemp = true
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
