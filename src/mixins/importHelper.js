import {parsePostsInArray, parseTeamsInArray} from "@/plugins/utils";
import {posts, teams} from "@/mixins/ComputedData";
import {dataMethods} from "@/mixins/dataHelper";
import {messageHelper} from "@/mixins/messageHelper";

export const importHelper = {
  mixins: [teams, posts, dataMethods, messageHelper], data: () => ({
    newItems: {
      selectedTeams: [], selectedPosts: [], teams: [], posts: []
    }
  }),
  methods: {
    mixParseTeamsInArray(users, cols) {
      return new Promise(async (res, rej) => {
        try {
          if (!cols.some(col => col.model == 'team')) return res({users, cols})

          let data = await parseTeamsInArray(users, this.teams)
          this.newItems.teams = data.newTeams
          this.newItems.selectedTeams = data.newTeams.map(nt => nt.id)

          res({users: data.users, cols})
        } catch (e) {
          rej(e)
        }
      })
    },
    mixParsePostsInArray(users, cols) {
      return new Promise(async (res, rej) => {
        try {
          if (!cols.some(col => col.model == 'post')) return res({users, cols})

          let data = await parsePostsInArray(users, this.posts)
          this.newItems.posts = data.newPosts
          this.newItems.selectedPosts = data.newPosts.map(nt => nt.id)

          res({users: data.users, cols})
        } catch (e) {
          rej(e)
        }
      })
    },
    mixSaveAllImportData({users, teams, posts}) {
      let promises = []
      if (users) promises.push(this.mixSaveUsers(users))
      if (teams) promises.push(this.mixSaveTeams(teams))
      if (posts) promises.push(this.mixSavePosts(posts))

      return this.promiseMessages({
        promise: Promise.all(promises),
        msg: 'Данные успешно импортированы'
      })
    },
    mixSaveUsers(users) {
      return this.asyncDispatch({
        method: 'users/addMultiple',
        data: users
      })
    },
    mixSaveTeams(teams) {
      return this.asyncDispatch({
        method: 'teams/addMultiple',
        data: teams
      })
    },
    mixSavePosts(posts) {
      return this.asyncDispatch({
        method: 'posts/addMultiple',
        data: posts
      })
    },
  }
}
