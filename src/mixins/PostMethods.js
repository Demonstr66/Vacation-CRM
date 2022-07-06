import {dispatchMethods} from "@/mixins/BaseMethods";

export const PostMethods = {
  mixins: [dispatchMethods],
  methods: {
    createPost(data) {
     console.log('createPost')
      return this.dispatchSaveData({
        method: 'posts/create',
        isNew: true,
        data,
        msg: 'Должность добавлена'
      })
    },
    updatePost(data) {
      return this.dispatchSaveData({
        method: 'posts/update',
        isNew: false,
        data,
        msg: 'Должность обновлена'
      })
    },
    silentUpdatePost(data) {
      return this.dispatchMethod({
        method: 'posts/update',
        data
      })
    },
    deletePost(id) {
      return this.dispatchAllMethodsWithMessage({
        tasks: [
          {method: 'posts/delete', data: id},
          {method: 'users/deletePostFromUsers', data: id}
        ],
        msg: 'Должность удалена'
      })
    }
  }
}