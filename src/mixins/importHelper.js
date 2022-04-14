import {parsePostsInArray, parseTeamsInArray} from "@/plugins/utils";
import {posts, teams} from "@/mixins/computedData";
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
            if (users) this.mixSaveUsers(users)
            if (teams) this.mixSaveTeams(teams)
            if (posts) this.mixSavePosts(posts)
        },
        mixSaveUsers(users) {
            return this.mixSaveData({
                saveMethod: 'workspace/addManyUsers', isNew: true, data: users
            })
        },
        mixSaveTeams(teams) {
            return this.mixSaveData({
                saveMethod: 'workspace/addManyTeams', isNew: true, data: teams
            })
        },
        mixSavePosts(posts) {
            return this.mixSaveData({
                saveMethod: 'workspace/addManyPosts', isNew: true, data: posts
            })
        },
    }
}
