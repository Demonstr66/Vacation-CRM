import {dispatchMethods} from "@/mixins/BaseMethods";
import {currentUID} from "@/mixins/ComputedData";

export const VacationMethods = {
  mixins: [dispatchMethods, currentUID],
  methods: {
    createVacation(data) {
      const now = this.$moment().toISOString()
      let event = {type: 'create', by: this.currentUID, at: now}
      if (!data.events) data.events = []
      data.events.push({...event})

      return this.dispatchSaveData({
        method: 'vacations/create',
        isNew: true,
        data
      })
    },
    updateVacation(data, event) {
      const now = this.$moment().toISOString()
      if (!!event) {
        event.at = now
        event.by = this.currentUID
        if (!data.events) data.events = []
        data.events.push({...event})
      }

      return this.dispatchSaveData({
        method: 'vacations/update',
        isNew: false,
        data
      })
    },

    deleteVacation({id, sid}) {
      return this.dispatchDeleteData({
          method: "vacations/delete",
          data: {id, sid}
        }
      )
    }
  }
}