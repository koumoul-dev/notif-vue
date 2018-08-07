export const notificationStore = {
  namespaced: true,
  state: {
    notifications: [],
    notif: null
  },
  mutations: {
    queue(state, notif) {
      if (typeof notif === 'string') notif = {msg: notif}
      if (notif.error) {
        notif.type = 'error'
        notif.errorMsg = (notif.error.response && (notif.error.response.data || notif.error.response.status)) || notif.error.message || notif.error
      }
      state.notifications.push(notif)
      state.notif = state.notifications[0]
    },
    setNotif(state, notif) {
      state.notif = notif
    },
    unqueue(state, notif) {
      state.notifications.splice(0, 1)
      state.notif = state.notifications[0]
    },
    setTime(state) {
      if (!state.notif) return
      state.notif.hideAt = state.notif.hideAt || (new Date()).getTime() + (state.notif.type === 'error' ? 30000 : 6000)
    }
  },
  actions: {
    async queue({commit}, notif) {
      commit('queue', notif)
      commit('setTime')
    },
    async unqueue({commit}) {
      commit('setNotif', null)
      await new Promise(resolve => setTimeout(resolve, 200))
      commit('unqueue')
      commit('setTime')
    },
    checkTime({state, dispatch}) {
      if (!state.notif) return
      if (state.notif.hideAt < (new Date()).getTime()) dispatch('unqueue')
    },
    loop({dispatch}) {
      setInterval(() => { dispatch('checkTime') }, 2000)
    }
  }
}
