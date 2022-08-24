import {dispatchMethods} from "@/mixins/BaseMethods";
import {currentUID} from "@/mixins/ComputedData";
import {defVacation} from "@/plugins/schema";

export const VacationMethods = {
  mixins: [dispatchMethods, currentUID],
  methods: {
    createVacation(data) {
      const now = this.$moment().toISOString()
      let event = {
        type: 'create',
        by: this.currentUID,
        at: now,
        start: data.start,
        end: data.end,
        days: data.days
      }
      if (!data.events) data.events = []
      data.events.push({...event})

      return this.dispatchSaveData({
        method: 'vacations/create', isNew: true, data
      })
    },
    updateVacation(data, event) {
      const now = this.$moment().toISOString()
      if (!!event) {
        event.at = now
        event.by = this.currentUID

        event.start = data.start
        event.end = data.end
        event.days = data.days

        if (!data.events) data.events = []
        data.events.push({...event})
      }

      return this.dispatchSaveData({
        method: 'vacations/update', isNew: false, data
      })
    },

    deleteVacation({id, sid}) {
      return this.dispatchDeleteData({
        method: "vacations/delete", data: {id, sid}
      })
    },


    acceptVacation(vacation, byUid) {
      const type = 'approved'
      const data = defVacation(vacation, {
        status: 2,
        approved: true,
        statusChangeByUid: byUid,
        statusChangeAt: this.$moment().toISOString()
      })

      return this.updateVacation(data, {type})
    },
    rejectVacation(vacation, byUid, comment) {
      const type = 'reject'
      const data = defVacation(vacation, {
        status: 99, comment, statusChangeByUid: byUid, statusChangeAt: this.$moment().toISOString()
      })

      return this.updateVacation(data, {type, comment})
    },
    cancelAcceptVacation(vacation, byUid, comment) {
      const type = 'cancelAccept'
      const data = defVacation(vacation, {
        status: 1, comment, statusChangeByUid: byUid, statusChangeAt: this.$moment().toISOString()
      })

      return this.updateVacation(data, {type, comment})
    },
  }
}