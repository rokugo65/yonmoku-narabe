import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    roomName: "",
    playerNum: ""
  },
  mutations: {
    enterRoom(state, payload) {
      state.roomName = payload.roomName;
      state.playerNum = payload.playerNum;
    }
  },
})
export default store
