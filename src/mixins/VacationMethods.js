import {dispatchMethods} from "@/mixins/BaseMethods";

export const VacationMethods = {
  mixins: [dispatchMethods],
  methods: {
    createVacation(data) {
      return this.dispatchSaveData({
        method: 'vacations/create',
        isNew: true,
        data
      })
    },
    updateVacation(data) {
      return this.dispatchSaveData({
        method: 'vacations/update',
        isNew: false,
        data
      })
    },

    deleteVacation(vacation) {
      return this.dispatchDeleteData({
          method: "vacations/delete",
          data: vacation
        }
      )
    }
  }
}