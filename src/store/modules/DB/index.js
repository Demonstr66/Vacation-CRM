import {child, get, getDatabase, off, onValue, ref, remove, set} from "firebase/database";


export default {
  namespaced: true,
  actions: {
    subscribe({commit, dispatch}, {path, setter, dispatcher}) {
      return new Promise((res, rej) => {
        const db = getDatabase();
        const dataRef = ref(db, path);

        onValue(dataRef, (data) => {
          res()
          const val = data.val();
          if (setter) commit(setter, val, {root: true})
          if (dispatcher) dispatch(dispatcher, val, {root: true})
        });
      })
    },
    unsubscribe({}, path) {
      const db = getDatabase();
      const wsRef = ref(db, path);
      off(wsRef)
    },
    set({rootGetters}, {path, key, data}) {
      if (rootGetters.sandboxMode) return Promise.reject({code: 'sandboxMode'})

      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          await set(ref(db, `${path}/${key}`), data)
          res(key)
        } catch (e) {
          rej(e)
        }
      })
    },
    delete({rootGetters}, {path, key}) {
      if (rootGetters.sandboxMode) return Promise.reject({code: 'sandboxMode'})

      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          await remove(ref(db, `${path}/${key}`))
          res()
        } catch (e) {
          rej(e)
        }
      })
    },
    checkExiting({}, {key, path}) {
      return new Promise(async (res, rej) => {
        try {
          const db = getDatabase();
          const dbRef = ref(db);
          let result = false
          await get(child(dbRef, `${path}/${key}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                result = true
              }
            })
          res(result)
        } catch (e) {
          rej(e)
        }
      })
    }
  }
}