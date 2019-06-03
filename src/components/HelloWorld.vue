<template>
  <div class="selectRoom">
    <h1>四目並べ</h1>
    {{a}}{{b}}
    <a v-if="isAuth" @click="signOut" class="button">signOut</a>
    <a v-else @click="signIn" class="button">signIn</a>
    <div v-for="(room,index) in data" :key="index" class="room">
      <h2>{{index}}{{room.player.player1.name}}{{room.player.player2.name}}</h2>
      <div @click="enterRoom(index,1)">player1</div>
      <div @click="enterRoom(index,2)">player2</div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import store from "@/store.js";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "",
      isAuth: false,
      data: null
    };
  },
  computed: {
    playerNum: function() {},
    a: function() {
      return store.state.playerNum;
    },
    b: function() {
      return store.state.roomName;
    }
  },
  methods: {
    signIn: function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
    },
    signOut: function() {
      firebase.auth().signOut();
    },
    loadRoom: function() {
      firebase
        .database()
        .ref("/room")
        .on("value", snapshot => {
          this.data = snapshot.val();
        });
    },
    enterRoom: function(_inRoomNum, _inPlayerNum) {
      var payload = {
        roomName: _inRoomNum,
        playerNum: _inPlayerNum
      };
      store.commit("enterRoom", payload);
      var url = "#/SelectRoom";
      window.location.href = url;
    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
    this.loadRoom();
  }
};
</script>

<style scoped>
.selectRoom {
  width: 300px;
  height: auto;
  background-color: aqua;
}

.button {
  width: 200px;
  height: 100px;
  background-color: aqua;
}
.room {
  width: 200px;
  height: 100px;
  background-color: red;
}
</style>
