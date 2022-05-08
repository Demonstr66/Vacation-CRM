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

const basePath = basePathFunction('temp/{wid}')

export default {
  namespaced: true,
  state: () => ({
    file: null,
    ready: false
  }),
  getters: {
    get: (s) => s.file || null,
    isReady: (s) => s.ready
  },
  mutations: {
    set: (s, v) => {
      if (!s.ready) s.ready = true
      s.file = v
    },
    setReady: (s, v) => s.ready = v,
    clear: (s) => s.file = null
  },
  actions: {
    initialize({dispatch}) {
      dispatch('get')
    },
    onLogOut({dispatch, commit}) {
      // dispatch('unsubscribe')
      commit('clear')
    },
    upload({rootGetters, dispatch}, data) {
      return asyncTryDecorator(() => {
        const storage = getStorage();
        const wid = rootGetters['getWID']
        const dataRef = ref(storage, basePath(wid, data.name));

        return uploadBytes(dataRef, data).then(() => {
          dispatch('get')
        })
      })
    },
    download({rootGetters}, {fullPath, name}) {
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
    delete({rootGetters}, fullPath) {
      return asyncTryDecorator(() => {
        const storage = getStorage();
        const dataRef = ref(storage, fullPath);

        return deleteObject(dataRef)
      })
    },
    get({rootGetters, commit}) {
      return asyncTryDecorator(() => {
        const storage = getStorage();
        const wid = rootGetters['getWID']

        if (!wid) throw new Error('Что-то пошло не так: templateFile/get -> !wid')

        const listRef = ref(storage, basePath(wid));

        return listAll(listRef).then((data) => {
          commit('set', data.items[0])
        })

      })
    },
    generate({dispatch, state}, data) {
      return asyncTryDecorator(async () => {
          const storage = getStorage();
          const bytes = await getBytes(ref(storage, state.file.fullPath))

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
          return FileDownload(blob, "example.docx");
      })
    },
  }
}
