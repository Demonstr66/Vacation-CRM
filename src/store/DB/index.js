import {getDatabase, off, onValue, ref, remove, set} from "firebase/database";


export default {
  namespaced: true,
  actions: {
    subscribe({commit, dispatch}, {path, setter, dispatcher}) {
      const db = getDatabase();
      const dataRef = ref(db, path);

      onValue(dataRef, (data) => {
        const res = data.val();
        commit(setter, res, {root: true})
        if (dispatcher) dispatch(dispatcher, res, {root: true})
      });
    },
    unsubscribe({}, path) {
      const db = getDatabase();
      const wsRef = ref(db, path);
      off(wsRef)
    },
    set({}, {path, key, data}) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          await set(ref(db, `${path}/${key}`), data)
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    delete({}, {path, key}) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          await remove(ref(db, `${path}/${key}`))
          res()
        } catch (e) {
          rej(e)
        }
      })
    }
  }
}