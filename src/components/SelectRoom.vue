<template>
  <div class="hello">
    {{roomName}}{{playerNum}}
    <table>
      <tr v-for="(row,rowIndex) in data.board" :key="rowIndex">
        <td v-for="(col, colIndex) in row" v-if="col!=-1" :key="colIndex">
          <div v-if="col==1" class="blackStone"></div>
          <div v-else-if="col==2" class="whiteStone"></div>
          <div v-else class="blank" @click="put(rowIndex,colIndex)"></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import firebase from "firebase";
import store from "@/store.js";

export default {
  name: "HelloWorld",

  data() {
    return {
      msg: "SelectRoomaaaaa",
      roomName: "room1",
      isAuth: false,
      data: null,
      roomRef: null,
      playerNum: null
    };
  },
  computed: {},
  methods: {
    loadData: function() {
      this.roomRef.on("value", snapshot => {
        this.data = snapshot.val();
      });
    },
    resetBoard: function() {
      this.data["board"] = [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      ];
      this.roomRef.set(this.data);
    },
    put(y, x) {
      this.data.board[y][x] = this.playerNum;
      this.roomRef.set(this.data);
    }
  },
  created: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
    this.roomRef = firebase.database().ref("/room/" + this.roomName);
    this.loadData();
    this.resetBoard();
    this.roomName = store.state.roomName;
    this.playerNum = store.state.playerNum;
  }
};
</script>

<style scoped>
.button {
  width: 200px;
  height: 100px;
  background-color: aqua;
}

table {
  border-collapse: collapse;
  background-color: #eeaa44;
}
td {
  border: solid 5px;
  color: #222222;
  width: 60px;
  height: 60px;
}
.blackStone {
  background-color: #222222;
  width: 25px;
  height: 25px;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
}
.whiteStone {
  background-color: #ffffff;
  width: 25px;
  height: 25px;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
}

.blank {
  width: 50px;
  height: 50px;
}
</style>
