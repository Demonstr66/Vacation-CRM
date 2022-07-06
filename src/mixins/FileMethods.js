import {dispatchMethods} from "@/mixins/BaseMethods";

export const FileMethods = {
  mixins: [dispatchMethods],
  methods: {
    uploadFile(data) {
      return this.dispatchMethodWithMessage({
        method: 'templateFile/upload',
        data,
        msg: 'Файл загружен'
      })
    },
    downloadFile(data) {
      return this.dispatchMethod({
        method: 'templateFile/download',
        data
      })
    },
    deleteFile(data) {
      return this.dispatchDeleteData({
        method: 'templateFile/delete',
        data: data.fullPath,
        msg: 'Файл удалён'
      })
    },
    downloadWithDataFile(data) {
      return this.dispatchMethod({
        method: 'templateFile/downloadWithData',
        data
      })
    }
  }
}