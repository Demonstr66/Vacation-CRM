import {parsePostsInArray, parseTeamsInArray} from "@/plugins/utils";
import {posts, teams} from "@/mixins/ComputedData";
import {dataMethods} from "@/mixins/dataHelper";
import {messageHelper} from "@/mixins/MessageMethods";
import {dispatchMethods} from "@/mixins/BaseMethods";

export const importMethods = {
  mixins: [teams, posts, dataMethods, messageHelper, dispatchMethods],
  data: () => ({
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
      if (users) promises.push({
        method: 'users/addMultiple',
        data: users
      })
      if (teams) promises.push({
        method: 'teams/addMultiple',
        data: teams
      })
      if (posts) promises.push({
        method: 'posts/addMultiple',
        data: posts
      })
      return this.dispatchAllMethodsWithMessage({
        tasks: promises,
        msg: 'Данные успешно импортированы'
      })
    },
  }
}
