import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    roomName: "sdfasdf",
    playerNum: "asdfasdf"
  },
  mutations: {
    enterRoom(state, payload) {
      state.roomName = payload.roomName;
      state.playerNum = payload.playerNum;
    }
  },
})
export default store
