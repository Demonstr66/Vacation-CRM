export default {
  state: () => ({
    message: null,
    pull: []
  }),
  getters: {
    message: (s) => s.message,
    isMessage: (s) => !!s.message,
    getPull: (s) => s.pull,
  },
  mutations: {
    setMessage: (s, v) => s.message = v,
    clearMessage: (s) => s.message = null,
    setPull: (s, v) => s.pull = v,
    addToPull: (s, v) => s.pull.push(v)
  },
  actions: {
    setMessage({ commit }, message) {
      commit('clearMessage')
      setTimeout(
        function () {
          commit("setMessage", message);
        },
        300
      );
    }
  }
}





