<template>
  <div class="selectRoom">
    <img src="../assets/logo.png" width="803px">
    <div v-for="(room,index) in data" :key="index" class="room">
      <div class="roomInfo">
        <div>{{"部屋名:"+index}}</div>
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
  name: "Top",
  data() {
    return {
      data: null //全ての部屋データ,DBと即時連携される
    };
  },
  computed: {
    nowUnixTime: function() {
      ////現在のコンピューター時間のUNIX時間を返す
      var date = new Date();
      return date.getTime();
    }
  },
  methods: {
    playerNum: function(_inRoom) {
      ////部屋内プレイヤーをカウントする関数
      var playerNum = 0;
      //過去20秒以内に部屋内のプレイヤー1にDBの書き込みがあったかどうか
      if (this.nowUnixTime - _inRoom.player.player1.lastUpdate < 20000) {
        playerNum++;
      }
      //過去20秒以内に部屋内のプレイヤー2にDBの書き込みがあったかどうか
      if (this.nowUnixTime - _inRoom.player.player2.lastUpdate < 20000) {
        playerNum++;
      }
      return playerNum;
    },
    enterRoom: async function(_inRoomNum, _inRoom) {
      ////部屋に遷移する時の関数
      //過去20秒以内に部屋内のプレイヤー1にDBの書き込みがあったかどうか
      if (this.nowUnixTime - _inRoom.player.player1.lastUpdate > 20000) {
        //部屋番号とプレイヤー番号を発行
        var payload = {
          roomName: _inRoomNum,
          playerNum: 1
        };
        //ストアに発行した部屋番号とプレイヤー番号を保持
        await store.commit("enterRoom", payload);
        //部屋内にアクセス
        window.location.href = "#/Room";
      }
      //過去20秒以内に部屋内のプレイヤー2にDBの書き込みがあったかどうか
      if (this.nowUnixTime - _inRoom.player.player2.lastUpdate > 20000) {
        //部屋番号とプレイヤー番号を発行
        var payload = {
          roomName: _inRoomNum,
          playerNum: 2
        };
        //ストアに発行した部屋番号とプレイヤー番号を保持
        await store.commit("enterRoom", payload);
        //部屋内にアクセス
        window.location.href = "#/Room";
      }
    }
  },
  mounted: function() {
    ////ページに入った時の初期化関数
    firebase
      .database()
      .ref("/room")
      .on("value", snapshot => {
        this.data = snapshot.val();
      });
  }
};
</script>

<style scoped>
.selectRoom {
  width: 800px;
  height: auto;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 20px;
  border-radius: 0px 0px 30px 30px;
  background-color: #eeeeee;
}
.room {
  border-radius: 10px;
  width: 700px;
  height: 100px;
  background: linear-gradient(
    90deg,
    #ff2244 0%,
    #ff2244 3%,
    #ffffff 3%,
    #ffffff 100%
  );
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0px 0px 8px -4px black;
}
.roomInfo {
  float: left;
  padding-top: 10px;
  padding-left: 5%;
  font-size: 25px;
}
.roomButton {
  margin-top: 25px;
  margin-right: 25px;
  float: right;
}
.button {
  width: 200px;
  height: 50px;
  text-align: center;
  font-size: 30px;
  line-height: 1.6em;
  color: #ffffff;
  background-color: #ff2244;
  border-radius: 10px;
  box-shadow: 0px 0px 10px -4px black;
  transition: 300ms all ease 0s;
}
.button:hover {
  background-color: #ff6688;
  box-shadow: 0px 0px 18px -4px black;
}
</style>
