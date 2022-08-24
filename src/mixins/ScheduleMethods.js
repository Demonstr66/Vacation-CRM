import {dispatchMethods} from "@/mixins/BaseMethods";

export const ScheduleMethods = {
  mixins: [dispatchMethods],
  methods: {
    createSchedule(data) {
      return this.dispatchSaveData({
        method: 'schedules/create',
        isNew: true,
        data,
        msg: 'График создан'
      })
    },
    updateSchedule(data, event) {
      if (!!event) {
        event.at = this.$moment().toISOString()
        event.by = this.currentUID

        if (!data.events) data.events = []
        data.events.push({...event})
      }

      return this.dispatchSaveData({
        method: 'schedules/update',
        isNew: false,
        data,
        msg: 'График обновлен'
      })
    },
    activateSchedule(data) {
      return this.dispatchSaveData({
        method: 'schedules/update',
        isNew: false,
        data,
        msg: 'График активирован'
      })
    },
    deactivateSchedule(data) {
      return this.dispatchSaveData({
        method: 'schedules/update',
        isNew: false,
        data,
        msg: 'График деактивирован'
      })
    },
    silentUpdateSchedule(data) {
      return this.dispatchMethod({
        method: 'schedules/update',
        data
      })
    },
    deleteSchedule(id) {
      return this.dispatchAllMethodsWithMessage({
        tasks: [
          {method: 'schedules/delete', data: id},
          {method: 'vacations/deleteAllBySid', data: id}
        ],
        msg: 'График удален'
      })
    }
  }
}