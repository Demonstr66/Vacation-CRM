import {dictionary} from "@/plugins/utils.js";

export default {
  state: () => ({
    messages: [],
    pull: []
  }),
  getters: {
    messages: (s) => s.messages,
  },
  mutations: {
    addMessage: (s, v) => s.messages.push(v),
    setMessages: (s, v) => s.messages = v
  },
  actions: {
    setMessage({commit,getters}, data) {
      console.log('setMessage', data)
      let obj = {}
      obj.message = dictionary[data.code] || data.text || "Неизвестное сообщение";
      obj.color = data.type || 'info';
      obj.timeout = 2000 + 500 * getters.messages.length
      // obj.timeout = -1
      if (data.type === "error") obj.message = "[Ошибка]: " + obj.message

      commit('addMessage', obj)
    }
  }
}





