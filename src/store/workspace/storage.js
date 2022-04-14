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

export default {
  namespaced: true,
  state: () => ({
    file: ''
  }),
  mutations: {
    setFile: (s, v) => s.file = v
  },
  getters: {
    file: (s) => s.file || ''
  },
  actions: {

    download({rootGetters}, {fullPath, name}) {
      console.log('try downloading')
      return new Promise(async (res, rej) => {
        try {
          const storage = getStorage();
          getDownloadURL(ref(storage, fullPath))
            .then((url) => {
              console.log('url:', url)
              axios({
                url: url,
                method: 'GET',
                responseType: 'blob', // important
              }).then(async (response) => {
                await FileDownload(response.data, name);
                res()
              });
            })
            .catch((error) => {
              rej(error)
            });

        } catch (e) {
          rej(e)
        }
      })
    },
    upload({rootGetters}, data) {
      return new Promise(async (res, rej) => {
        try {
          const storage = getStorage();
          const wid = rootGetters['workspace/get'].id
          const dataRef = ref(storage, `temp/${wid}/${data.name}`);

          uploadBytes(dataRef, data).then((snapshot) => {
            res()
          }).catch(err => {
            rej(err)
          })

        } catch (e) {
          rej(e)
        }
      })
    },
    delete({rootGetters}, fullPath) {
      console.log('delete fp: ', fullPath)
      return new Promise(async (res, rej) => {
        try {
          const storage = getStorage();
          const dataRef = ref(storage, fullPath);

          deleteObject(dataRef).then(() => {
            res()
          }).catch(err => {
            rej(err)
          })

        } catch (e) {
          rej(e)
        }
      })
    },
    getAll({rootGetters, commit}, payload) {
      return new Promise((res, rej) => {
        try {
          const storage = getStorage();
          const wid = (payload && payload.wid) ? payload.wid : rootGetters['workspace/get'].id

          if (!wid) throw new Error('Что-то пошло не так')

          const listRef = ref(storage, `temp/${wid}/`);

          listAll(listRef)
            .then((data) => {
              console.log(data.items)
              commit('setFile', data.items[0])
              res()
            })
            .catch((error) => {
              rej(error)
            });
        } catch (e) {
          rej(e)
        }
      })
    },
    generate({dispatch, state}, data) {

      console.log('generate')
      return new Promise(async (res, rej) => {
        try {
          const storage = getStorage();
          getBytes(ref(storage, state.file.fullPath))
            .then((val) => {
              let file = new File([val], 'myFile')
              const zip = new JSZip();
              const zip2 = new JSZip();

              zip.loadAsync(val)
                .then(function (zip) {
                  // в архиве найти файл word/document.xml
                  console.log('zip: ', zip)
                  zip.file("word/document.xml").async("string").then(async function (xmlfile) {

                    xmlfile = await dispatch('isprXML', xmlfile);

                    let newxml = xmlfile;
                    console.log('newxml: ', newxml)
                    for (let key in data) {
                      newxml = newxml.replace("{" + key + "}", data[key]);
                    }
                    zip.file("word/document.xml", newxml);

                    var promise = null;
                    if (JSZip.support.uint8array) {
                      promise = zip.generateAsync({type: "uint8array"});
                    }
                    zip2.file("out.docx", promise);

                    zip2.generateAsync({type: "blob"})
                      .then(function (blob) {
                        FileDownload(blob, "out.zip");
                      });
                  })
                })
                .catch((e) => {
                  console.log('err: ', e)
                })
            })
            .catch((error) => {
              rej(error)
            });
        } catch (e) {
          rej(e)
        }
      })
    },

    // обработка WORD
    isprXML({}, xmlfile) {
      // //почистить шаблон до правильного вида переменных {permennaya}
      const re = /({.*?})/sg;
      const re2 = /(<.*?>)/g;

      let result = xmlfile.match(re) || [];
      let newres = [];
      result.forEach(element => {
        var newel = element.replace(re2, "");
        xmlfile = xmlfile.replace(element, newel);
      });
      return xmlfile;
    }
  }
}
