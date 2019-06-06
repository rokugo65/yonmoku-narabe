<template>
  <div class="selectRoom">
    <img src="../assets/logo.png" width="803px">
    <div v-for="(room,index) in data" :key="index" class="room">
      <div class="roomInfo">
        <div>{{index}}</div>
        <div>{{"入室者数:"+playerNum(room)}}</div>
      </div>
      <div class="roomButton">
        <div v-show="playerNum(room)<2" @click="enterRoom(index,room)" class="button">入室</div>
      </div>
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
    nowUnixTime: function() {
      var date = new Date();
      return date.getTime();
    },
    numEntryperson: function() {}
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
    playerNum: function(_inRoom) {
      var playerNum = 0;
      if (this.nowUnixTime - _inRoom.player.player1.lastUpdate < 20000) {
        playerNum++;
      }
      if (this.nowUnixTime - _inRoom.player.player2.lastUpdate < 20000) {
        playerNum++;
      }
      return playerNum;
    },
    enterRoom: async function(_inRoomNum, _inRoom) {
      await this.loadRoom();
      if (this.nowUnixTime - _inRoom.player.player1.lastUpdate > 20000) {
        var payload = {
          roomName: _inRoomNum,
          playerNum: 1
        };
        await store.commit("enterRoom", payload);
        var url = "#/SelectRoom";
        window.location.href = url;
      }
      if (this.nowUnixTime - _inRoom.player.player2.lastUpdate > 20000) {
        var payload = {
          roomName: _inRoomNum,
          playerNum: 2
        };
        await store.commit("enterRoom", payload);
        var url = "#/SelectRoom";
        window.location.href = url;
      }
    }
  },
  mounted: function() {
    this.loadRoom();
  }
};
</script>

<style scoped>
.selectRoom {
  width: 800px;
  height: auto;
  background-color: #eeeeee;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0px 0px 30px 30px;
  padding-bottom: 20px;
}

.button {
  text-align: center;
  line-height: 1.6em;
  width: 200px;
  height: 50px;
  color: #ffffff;
  background-color: #ff2244;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -4px black;
  font-size: 30px;
  transition: 300ms all ease 0s;
}
.button:hover {
  background-color: #ff6688;
  box-shadow: 0px 0px 18px -4px black;
}

.room {
  border-radius: 20px;
  width: 600px;
  height: 100px;
  background-color: #ffffff;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0px 0px 8px -4px black;
}
.roomInfo {
  float: left;
  padding-left: 10px;
  font-size: 25px;
}
.roomButton {
  margin-top: 25px;
  margin-right: 25px;
  float: right;
}
</style>
