import { getDatabase, ref, set, child, get, push, update, onValue, remove } from "firebase/database";
import { defUser, defTeam, updateObject } from "../../plugins/schema";
import { v4 as uuidv4 } from 'uuid';

export default {
  state: () => ({
    persons: [],
    archive: [],
    teams: []
  }),
  getters: {
    getTeamsByPersonId: (state) => (uid) => state.personInTeam.filter(pit => pit.personId == uid),
    getPersonById: (state) => (uid) => state.persons.find(p => p.uid == uid),
    getPersons: (state) => state.persons,
    getTeamTitle: (state) => (id) => {
      const team = state.teams.find(t => t.id == id)

      return team ? team.title : false
    },
  },
  mutations: {
    setPersons: (state, v) => state.persons = v,
    setArchive: (state, v) => state.archive = v,
    setTeams: (state, v) => state.teams = v,
    movePersonToArchive: (state, uid) => {
      state.persons = state.persons.filter(p => {
        if (p.uid != uid) return true

        state.archive.push(p)
        return false
      })
    },
    movePersonFromArchive: (state, uid) => {
      state.archive = state.archive.filter(p => {
        if (p.uid != uid) return true

        state.persons.push(p)
        return false
      })
    }
  },
  actions: {
    getDataFromBase({ commit, getters }) {
      // return new Promise(async (res, rej) => {
      //   let persons = await localStorage.getItem('persons')
      //   const teams = await localStorage.getItem('teams')
      //   const personInTeam = await localStorage.getItem('personInTeam')

      //   if (teams) commit('setTeams', JSON.parse(teams))
      //   if (personInTeam) commit('setPersonsInTeams', JSON.parse(personInTeam))
      //   if (persons) {
      //     persons = JSON.parse(persons)

      //     persons = persons.map(p => {
      //       if (!p.teams) p.teams = []

      //       getters.getTeamsByPersonId(p.uid).map(t => {
      //         p.teams.push({
      //           id: t.teamId,
      //           status: 'active'
      //         })
      //       })

      //       return p
      //     })
      //     commit('setPersons', persons)
      //   }

      //   res()
      // })
    },
    addPersonsToBase({ dispatch, getters }, payload) {
      if (!Array.isArray(payload)) payload = [payload]

      return new Promise(async (res, rej) => {
        let newPersons = []
        if (payload.find(p => !p.fullName)) return rej('Поле ФИО обязательно')

        newPersons = payload.map(data => {
          return defUser({ uid: uuidv4() }, data)
        })

        //Добавляем в базу данных человеков
        const db = getDatabase();

        newPersons.map(async (p) => {
          await dispatch('createUserInfo', p)
          await dispatch('addUserToWorkspace', { uid: p.uid, wid: getters.getWorkspace })
        })

        res();
      })
    },
    updatePerson({ dispatch, state, getters }, payload) {
      return new Promise(async (res, rej) => {
        if (!payload.uid) return rej('Поле UID обязательно')
        if (!payload.fullName) return rej('Поле ФИО обязательно')

        let person = defUser(payload)

        const db = getDatabase();
        const updates = {};

        updates['users/' + payload.uid] = person;

        return res(update(ref(db), updates));
      })
    },
    addTeamsToBase({ dispatch, getters }, payload) {
      if (!Array.isArray(payload)) payload = [payload]

      return new Promise(async (res, rej) => {
        let newTeams = []

        if (payload.find(p => !p.title)) return rej('Название обязательно')
        payload.map(data => {
          let team = defTeam({ id: uuidv4() }, data)
          newTeams.push(team)
        })


        const db = getDatabase();
        const updates = {};

        newTeams.map(t => {
          updates['workspaces/' + getters.getWorkspace + '/teams/' + t.id] = t;

        })
        res(update(ref(db), updates))
      })
    },
    addTeamToPerson({ }, { personId, teamId }) {
      return new Promise((res, rej) => {
        if (!teamId || !personId) rej()

        const db = getDatabase();
        const updates = {};

        updates['users/' + personId + '/teams/' + teamId] = { status: true, id: teamId };

        res(update(ref(db), updates))
      })
    },
    removeTeamToPerson({ }, { personId, teamId }) {
      return new Promise((res, rej) => {
        const db = getDatabase();

        remove(ref(db, 'users/' + personId + '/teams/' + teamId))
        res()

      })
    },
    fetchData({ dispatch }) {
      console.log('fetchData')
      const fp = dispatch('fetchPersons')
      const ft = dispatch('fetchTeams')
      return Promise.all([fp, ft])
    },
    fetchPersons({ commit, getters, dispatch }) {
      console.log('fetchPersons')
      const db = getDatabase();

      return new Promise(async (res, rej) => {
        try {
          const dbRef = ref(getDatabase());

          const usersId = await new Promise(async (res, rej) => {
            get(child(dbRef, 'u2w')).then((snapshot) => {
              if (snapshot.exists()) {
                res(snapshot.val())
              } else {
                res([])
              }
            }).catch((error) => {
              rej(error);
            });
          })

          const archiveId = await new Promise(async (res, rej) => {
            get(child(dbRef, 'archive')).then((snapshot) => {
              if (snapshot.exists()) {
                res(snapshot.val())
              } else {
                res([])
              }
            }).catch((error) => {
              rej(error);
            });
          })

          let users = []
          let archiveUsers = []

          for (let uid in usersId) {
            if (usersId[uid] == getters.getWorkspace) {
              if (archiveId[uid]) archiveUsers.push(uid)
              else users.push(uid)
            }
          }

          if (!users.length) res()

          let persons = []
          let archive = []
          users.map(async (uid) => {
            dispatch('getUserInfo', uid).then(user => {
              user.teams = user.teams ? Object.values(user.teams) : []
              persons.push(user)
            })
          })

          archiveUsers.map(async (uid) => {
            dispatch('getUserInfo', uid).then(user => {
              user.teams = user.teams ? Object.values(user.teams) : []
              archive.push(user)
            })
          })

          commit('setPersons', persons)
          commit('setArchive', archive)
          res()


        } catch (e) {
          console.log(e)
          rej()
        }
      })
    },
    fetchTeams({ commit, getters }) {
      console.log('fetchTeams')
      const db = getDatabase();

      return new Promise((res, rej) => {
        const starCountRef = ref(db, 'workspaces/' + getters.getWorkspace + '/teams');
        try {
          onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            let arr = data ? Object.values(data).map((a, i) => { a.baseId = Object.keys(data)[i]; a.status = 'active'; return a; }) : []
            commit('setTeams', arr)
            res()

          });
        } catch (e) {
          console.log(e)
          rej()
        }

      })
    },
    fetchAllData({ commit, getters }) {
      const db = getDatabase();

      return new Promise((res, rej) => {
        const starCountRef = ref(db, '/');
        try {
          onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            res(data)
          });
        } catch (e) {
          rej(e)
        }

      })
    }
  }
}






