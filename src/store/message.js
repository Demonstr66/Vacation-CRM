export default {
  state: () => ({
    message: null,
  }),
  getters: {
    message: (s) => s.message,
    isMessage: (s) => !!s.message
  },
  mutations: {
    setMessage: (s, v) => s.message = v,
    clearMessage: (s) => s.message = null
  },
  actions: {

  }
}





