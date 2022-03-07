import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    persons: [],
    teams: [],
    personInTeam: []
  },
  getters: {
    getTeamsByPersonId: (state) => (uid) => state.personInTeam.filter(pit => pit.personId == uid),
    getPersonById: (state) => (uid) => state.persons.find(p => p.uid == uid),
    getPersons: (state) => state.persons,
    getTeamTitle: (state) => (uid) => {
      const team = state.teams.find(t => t.uid == uid)

      return team ? team.title : false
    }
  },
  mutations: {
    setPersons: (state, v) => state.persons = v
    ,
    setTeams: (state, v) => state.teams = v,
    setPersonsInTeams: (state, v) => state.personInTeam = v,
  },
  actions: {
    getDataFromBase({ commit, getters }) {
      console.log('getDataFromBase')
      return new Promise(async (res, rej) => {
        let persons = await localStorage.getItem('persons')
        const teams = await localStorage.getItem('teams')
        const personInTeam = await localStorage.getItem('personInTeam')

        if (teams) commit('setTeams', JSON.parse(teams))
        if (personInTeam) commit('setPersonsInTeams', JSON.parse(personInTeam))
        if (persons) {
          persons = JSON.parse(persons)

          persons = persons.map(p => {
            if (!p.teams) p.teams = []
            
            getters.getTeamsByPersonId(p.uid).map( t => {
              p.teams.push({
                id: t.teamId,
                status: 'active'
              })
            })

            return p
          })
          commit('setPersons', persons)
        }

        res()
      })
    },
    addPersonsToBase({ dispatch, state }, payload) {
      console.log('addPersonsToBase')
      if (!Array.isArray(payload)) payload = [payload]

      return new Promise(async (res, rej) => {
        let newPersons = []
        let newPersonInTeam = []
        if (payload.find(p => !p.fullName)) return rej('Поле ФИО обязательно')

        payload.map(data => {
          let person = {
            uid: uuidv4(),
            tabId: data.tabId || '',
            fullName: data.fullName,
            email: data.email || '',
            post: data.post || '',
            role: data.role || '',
            workspace: data.workspace || ''
          }

          newPersons.push(person)

          if (data.teams) {
            data.teams.map(teamId => {
              newPersonInTeam.push({ personId: person.uid, teamId })
            })
          }

        })

        //Добавляем в базу данных человеков
        let persons = JSON.parse(localStorage.getItem('persons') || "[]")
        persons.push(...newPersons)
        localStorage.setItem('persons', JSON.stringify(persons))

        //Добавляем в базу данных соответсвие человек -> команда
        let personInTeam = JSON.parse(localStorage.getItem('personInTeam') || "[]")
        personInTeam.push(...newPersonInTeam)
        localStorage.setItem('personInTeam', JSON.stringify(personInTeam))

        res()
      })
    },
    updatePerson({ dispatch, state, getters }, payload) {
      console.log('updatePerson')

      return new Promise(async (res, rej) => {
        if ( !payload.uid ) return rej('Поле UID обязательно')
        if ( !payload.fullName ) return rej('Поле ФИО обязательно')

        let newPersonInTeam = []

        let person = {
          uid: payload.uid,
          tabId: payload.tabId || '',
          fullName: payload.fullName,
          email: payload.email || '',
          post: payload.post || '',
          role: payload.role || '',
          workspace: payload.workspace || ''
        }

        if (payload.teams) {
          payload.teams.map(team => {
            newPersonInTeam.push({ personId: person.uid, teamId: team.id })
          })
        }
        

        //Добавляем в базу данных человеков
        let persons = JSON.parse(localStorage.getItem('persons') || "[]")
        persons = persons.map( p => {
          if ( p.uid == person.uid ) return person

          return p
        })
        localStorage.setItem('persons', JSON.stringify(persons))

        //Добавляем в базу данных соответсвие человек -> команда
        let personInTeam = JSON.parse(localStorage.getItem('personInTeam') || "[]")
        personInTeam = personInTeam.filter( pit => pit.personId != person.uid)
        personInTeam.push(...newPersonInTeam)
        localStorage.setItem('personInTeam', JSON.stringify(personInTeam))

        res()
      })
    },
    addTeamsToBase({ dispatch }, payload) {
      console.log('addTeamToBase')
      if (!Array.isArray(payload)) payload = [payload]

      return new Promise(async (res, rej) => {
        let newTeams = []

        if (payload.find(p => !p.title)) return rej('Название обязательно')

        payload.map(data => {
          let team = {
            id: data.id || uuidv4(),
            title: data.title,
            leader: data.leader || ''
          }

          newTeams.push(team)
        })

        //Добавляем в базу данных
        let teams = JSON.parse(localStorage.getItem('teams') || "[]")
        teams.push(...newTeams)
        localStorage.setItem('teams', JSON.stringify(teams))

        res()
      })
    },
    addTeamToPerson({ }, payload) {
      return new Promise((res, rej) => {
        if (!payload.teamId || !payload.personId) rej()

        //Добавляем в базу данных соответсвие человек -> команда
        let personInTeam = JSON.parse(localStorage.getItem('personInTeam') || "[]")
        personInTeam.push({personId: payload.personId, teamId: payload.teamId})
        localStorage.setItem('personInTeam', JSON.stringify(personInTeam))
        res()
      })
    },
    removeTeamToPerson({ }, payload) {
      return new Promise((res, rej) => {
        if (!payload.teamId || !payload.personId) rej('Поля personId, teamId обязательны')

        //Добавляем в базу данных соответсвие человек -> команда
        let personInTeam = JSON.parse(localStorage.getItem('personInTeam') || "[]")
        personInTeam = personInTeam.filter( pit => {
          if (pit.personId == payload.personId && pit.teamId == payload.teamId) return false

          return true
        })

        localStorage.setItem('personInTeam', JSON.stringify(personInTeam))
        res()
      })
    }
  },
  modules: {
  }
})
