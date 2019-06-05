<template>
  <div class="hello">
    <div v-if="activeSignal">
      <div v-if="data.endGame">
        プレイヤー{{data.winner}}の勝ちです
        <div @click="resetBoard()">リセット</div>
      </div>
      <div v-else>
        <div v-if="isMyTurn">あなたの番です</div>
        <div v-else>あいての番です</div>
      </div>
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
    <div v-else>対戦相手を待っています</div>
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
      roomName: "",
      isAuth: false,
      data: null,
      roomRef: null,
      playerNum: null,
      activeSignal: false
    };
  },
  computed: {
    isMyTurn: function() {
      if (this.data.player["player" + this.playerNum].first == this.data.turn) {
        return true;
      }
      return false;
    }
  },
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
      this.data.turn = true;
      this.data.endGame = false;
      this.roomRef.set(this.data);
    },
    isLineup: function(y, x, dy, dx, num) {
      var ary = [this.data.board[y][x]];
      while (this.data.board[y][x] != -1 && num != 1) {
        num--;
        y += dy;
        x += dx;
        ary.push(this.data.board[y][x]);
      }
      if (ary.length >= 4) {
        if (ary[0] == ary[1] && ary[0] == ary[2] && ary[0] == ary[3]) {
          return true;
        }
      }
      return false;
    },
    checkEnd: function(y, x) {
      return (
        this.isLineup(y, x, -1, 0, 4) ||
        this.isLineup(y, x, -1, 1, 4) ||
        this.isLineup(y, x, 0, 1, 4) ||
        this.isLineup(y, x, 1, 1, 4) ||
        this.isLineup(y, x, 1, 0, 4) ||
        this.isLineup(y, x, 1, -1, 4) ||
        this.isLineup(y, x, 0, -1, 4) ||
        this.isLineup(y, x, -1, -1, 4)
      );
    },
    put: function(y, x) {
      if (
        this.data.player["player" + this.playerNum].first == this.data.turn &&
        !this.data.endGame
      ) {
        this.data.board[y][x] = this.playerNum;
        if (this.checkEnd(y, x)) {
          this.data.endGame = true;
          this.data.winner = this.playerNum;
        }
        this.data.turn = !this.data.turn;
        this.roomRef.set(this.data);
      }
    },
    isActiveSignal: function() {
      var date = new Date();
      if (
        date.getTime() - this.data.player.player1.lastUpdate > 30000 ||
        date.getTime() - this.data.player.player2.lastUpdate > 30000
      ) {
        return false;
      }
      return true;
    }
  },
  created: async function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
    this.roomName = store.state.roomName;
    this.playerNum = store.state.playerNum;

    this.roomRef = await firebase.database().ref("/room/" + this.roomName);
    this.loadData();
    this.resetBoard();
  },
  mounted: function() {
    var this_ = this;
    window.setInterval(function() {
      this_.activeSignal = this_.isActiveSignal();
      var date = new Date();
      this_.data.player["player" + this_.playerNum].lastUpdate = date.getTime();
      this_.roomRef.set(this_.data);
    }, 5000);
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
