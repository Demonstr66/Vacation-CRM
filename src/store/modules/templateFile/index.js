import {
  deleteObject,
  getBytes,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes
} from "firebase/storage";
import axios from "axios";
import FileDownload from 'js-file-download'
import JSZip from "jszip";
import {asyncTryDecorator, basePathFunction, isprXML} from "@/plugins/utils";
import {Workspace} from "@/plugins/servises/Workspace";

const basePath = basePathFunction('temp/{wid}')

export default {
  namespaced: true,
  state: () => ({
    file: null,
    ready: false,
    interval: null
  }),
  getters: {
    get: (s) => s.file || null,
    fullPath: (s) => s.file && s.file.fullPath,
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.file = v
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => {
      s.file = null

      s.interval = null
    }
  },
  actions: {
    initialize({dispatch, commit}) {
      return dispatch('subscribe')
      return dispatch('get')
    },
    onLogOut({dispatch, commit}) {
      // dispatch('unsubscribe')
      commit('clear')
    },
    subscribe({rootGetters, dispatch}) {
      const wid = rootGetters['app/getWID']
      const path = basePathFunction(`workspaces/{wid}/templateFile/modified`)(wid)
      const dispatcher = 'templateFile/get'

      return dispatch('DB/subscribe', {path, dispatcher}, {root: true})
    },
    unsubscribe({dispatch, rootGetters}) {
      const wid = rootGetters['app/getWID']
      const path = basePathFunction(`workspaces/{wid}/templateFile/modified`)(wid)

      dispatch('DB/unsubscribe', {path}, {root: true})
    },
    upload({rootGetters, dispatch}, data) {
      if (rootGetters.sandboxMode) return Promise.reject({code: 'sandboxMode'})

      return asyncTryDecorator(() => {
        const storage = getStorage();
        const wid = rootGetters['app/getWID']
        const dataRef = ref(storage, basePath(wid, data.name));

        return uploadBytes(dataRef, data).then(() => {
          Workspace.updateTemplateFileInfo(true, basePath(wid, data.name))
          dispatch('get')
        })
      })
    },
    async download({rootGetters, getters, dispatch}, {name}) {
      await dispatch('get')
      const fullPath = getters.fullPath
      if (!fullPath) return Promise.reject('file-not-found')

      return asyncTryDecorator(async () => {
        const storage = getStorage();
        const url = await getDownloadURL(ref(storage, fullPath))

        const response = await axios({
          url: url,
          method: 'GET',
          responseType: 'blob',
        })

        return FileDownload(response.data, name);
      })
    },
    async delete({rootGetters, getters, dispatch}) {
      if (rootGetters.sandboxMode) return Promise.reject({code: 'sandboxMode'})

      await dispatch('get')
      const fullPath = getters.fullPath
      if (!fullPath) return Promise.reject('file-not-found')

      return asyncTryDecorator(() => {
        const storage = getStorage();
        const dataRef = ref(storage, fullPath);

        return deleteObject(dataRef).then(() => {
          Workspace.updateTemplateFileInfo(false)
          dispatch('get')
        })
      })
    },
    get({rootGetters, commit}) {
      return asyncTryDecorator(() => {
        const storage = getStorage();
        const wid = rootGetters['app/getWID']

        if (!wid) throw new Error('Что-то пошло не так: templateFile/get -> !wid')

        const listRef = ref(storage, basePath(wid));

        return listAll(listRef).then((data) => {
          commit('set', data.items[0])
        })

      })
    },
    async downloadWithData({dispatch, getters}, {data, fileName}) {
      await dispatch('get')
      const fullPath = getters.fullPath
      if (!fullPath) return Promise.reject('file-not-found')

      return asyncTryDecorator(async () => {
        const storage = getStorage();
        const bytes = await getBytes(ref(storage, fullPath))

        const zip = new JSZip();

        const zip2 = await zip.loadAsync(bytes)

        let xmlFile = await zip2.file("word/document.xml").async("string")

        xmlFile = isprXML(xmlFile);

        let newXML = xmlFile
        for (let key in data) {
          newXML = newXML.replace("{" + key + "}", data[key]);
        }

        await zip2.file("word/document.xml", newXML);

        const blob = await zip2.generateAsync({type: "blob"})

        await FileDownload(blob, fileName + ".docx")


        return Promise.resolve()
      })
    },
  }
}
