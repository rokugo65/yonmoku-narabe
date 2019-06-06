<template>
  <div class="hello">
    <img src="../assets/logo.png" width="803px">
    <div class="roomName">{{roomName}}</div>
    <div v-if="activeSignal">
      <table>
        <tr v-for="(row,rowIndex) in data.board" :key="rowIndex">
          <td v-for="(col, colIndex) in row" v-if="col!=-1" :key="colIndex">
            <div v-if="col==1" class="blackStone"></div>
            <div v-else-if="col==2" class="whiteStone"></div>
            <div v-else class="blank" @click="put(rowIndex,colIndex)"></div>
          </td>
        </tr>
      </table>
      <div class="message">
        <div v-if="canput">
          <div v-if="data.endGame">
            <div v-if="isMyTurn">あなたの負けです</div>
            <div v-else>あなたの勝ちです</div>
            <div @click="resetBoard()" class="replayButton">もう一度プレイする</div>
          </div>
          <div v-else>
            <div v-if="isMyTurn">({{turnColor}})あなたの番です</div>
            <div v-else>({{turnColor}})あいての番です</div>
          </div>
        </div>
        <div v-else>
          <div>引き分けです</div>
          <div @click="resetBoard()" class="replayButton">もう一度プレイする</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="wait">
        <img class="waitImage" src="../assets/wait.png" width="600px">
        <br>対戦相手を待っています...
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
    },
    turnColorNum: function() {
      if (this.data.turn) {
        return 1;
      } else {
        return 2;
      }
    },
    turnColor: function() {
      if (this.data.turn) {
        return "黒";
      } else {
        return "白";
      }
    },
    canput: function() {
      for (var y = 0; y < this.data["board"].length; y++) {
        for (var x = 0; x < this.data["board"][y].length; x++) {
          if (this.data["board"][y][x] == 0) {
            return true;
          }
        }
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
        this.data.board[y][x] = this.turnColorNum;
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
        date.getTime() - this.data.player.player1.lastUpdate > 20000 ||
        date.getTime() - this.data.player.player2.lastUpdate > 20000
      ) {
        return false;
      }
      return true;
    }
  },
  created: async function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
    this.roomName = await store.state.roomName;
    this.playerNum = await store.state.playerNum;

    if (this.roomName != "") {
      this.roomRef = await firebase.database().ref("/room/" + this.roomName);
      this.loadData();
      this.resetBoard();
    } else {
      var url = "#/";
      window.location.href = url;
    }
  },
  mounted: function() {
    var this_ = this;
    window.setInterval(function() {
      this_.activeSignal = this_.isActiveSignal();
      var date = new Date();
      this_.data.player["player" + this_.playerNum].lastUpdate = date.getTime();
      this_.roomRef.set(this_.data);
    }, 1000);
  }
};
</script>

<style scoped>
.hello {
  width: 800px;
  height: auto;
  background-color: #eeeeee;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0px 0px 30px 30px;
  padding-bottom: 20px;
}

.button {
  width: 200px;
  height: 100px;
  background-color: aqua;
}

table {
  border-collapse: collapse;
  background-color: #eeaa44;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
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
.wait {
  text-align: center;
  font-size: 20px;
}

.waitImage {
  margin-left: auto;
  margin-right: auto;
}

.message {
  text-align: center;
  font-size: 30px;
}

.replayButton {
  line-height: 2.3em;
  font-size: 20px;
  color: #ffffff;
  width: 250px;
  height: 50px;
  border-radius: 15px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #ff2244;
  box-shadow: 0px 0px 10px -4px black;
  transition: 300ms all ease 0s;
}

.replayButton:hover {
  background-color: #ff6688;
  box-shadow: 0px 0px 18px -4px black;
}

.roomName {
  font-size: 20px;
  margin-left: 20px;
}
</style>
