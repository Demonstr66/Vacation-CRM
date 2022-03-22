import { getDatabase, ref, set, child, get } from "firebase/database";
import { defUser } from "../../plugins/schema";

export default {
  state: () => ({

  }),
  getters: {
  },
  mutations: {
  },
  actions: {
    createUserInfo({ }, payload) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        let user = defUser(payload, { status: payload.status })

        set(ref(db, 'users/' + payload.uid), user).then(
          res()
        ).catch(err => rej(err))

        res()
      })
    },
    updateUserInfo({ dispatch }, payload) {
      const db = getDatabase();
      return new Promise(async (res, rej) => {

        let info = await dispatch('getUserInfo', payload.uid)

        let user = defUser(info, payload)
        let teams = {}
        user.teams.map( t => teams[t.id] = t)
        user.teams = teams

        set(ref(db, 'users/' + payload.uid), user).then(
          res()
        ).catch(err => rej(err))

        res()
      })
    },
    getUserInfo({ dispatch }, uid) {
      const dbRef = ref(getDatabase());

      return new Promise((res, rej) => {
        get(child(dbRef, `users/${uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            let user = snapshot.val()
            res(user)
          } else {
            rej({ message: "Данных пользователя с id " + uid + " по запросу не найдено" });
          }
        }).catch((error) => {
          rej(error)
        });
      })
    },
  }
}





