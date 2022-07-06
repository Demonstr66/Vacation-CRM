import {dispatchMethods} from "@/mixins/BaseMethods";

export const WorkspaceMethods = {
  mixins: [dispatchMethods],
  methods: {
    updateWorkspace(data) {
      return this.dispatchSaveData({
        method: "workspace/update",
        data,
        isNew: false
      })
    }
  }
}