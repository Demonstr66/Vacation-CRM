import { getDatabase, ref, set, child, get } from "firebase/database";
import { defWorkspace } from "../../plugins/schema";

export default {
  namespaced: true,
  state: () => ({
    workspace: null
  }),
  getters: {
    get: (s) => s.workspace
  },
  mutations: {
    set: (s, v) => s.workspace = v,
    update: (s, v) => s.workspace = updateObject(workspace, v),
    clear: (s, v) => s.workspace = null
  },
  actions: {
    create({}, data) {

    },
    read({}, data) {

    },
    update({}, data) {

    },
    delete({}, data) {
      
    }
  }
}





