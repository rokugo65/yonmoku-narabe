<template>
  <div class="room">
    <img src="../assets/logo.png" width="803px">
    <div class="topButton" @click="toTop()">もどる</div>
    <div class="roomName">{{"部屋名:"+roomName}}</div>
    <div v-if="isActiveSignal">
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
        {{message}}
        <div v-if="isShowReplaybutton" @click="resetBoard()" class="replayButton">もう一度プレイする</div>
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
  name: "Room",
  data() {
    return {
      roomName: "", //部屋番号,Topページ側で発行される
      data: null, //ゲーム全体のデータ,DBと即時連携
      roomRef: null, //DB更新のため必要なRef
      playerNum: null, //自分のプレイヤー番号,Topページ側で発行される
      isActiveSignal: false, //お互いのプレイヤー通信がアクティブかどうか
      setInterval: null
    };
  },
  computed: {
    message: function() {
      if (this.isCanPut) {
        if (this.data.endGame) {
          if (this.isMyTurn) {
            return "あなたの負けです";
          } else {
            return "あなたの勝ちです";
          }
        } else {
          if (this.isMyTurn) {
            return "(" + this.turnColor + ")あなたの番です";
          } else {
            return "(" + this.turnColor + ")あいての番です";
          }
        }
      } else {
        return "引き分けです";
      }
    },
    isMyTurn: function() {
      ////自分のターンかどうか判定
      if (this.data.player["player" + this.playerNum].first == this.data.turn) {
        return true;
      }
      return false;
    },
    turnColorNum: function() {
      ////今のターン(boolean)の色の数を返す
      if (this.data.turn) {
        return 1; //黒
      } else {
        return 2; //白
      }
    },
    turnColor: function() {
      ////今のターン(boolean)の色を返す
      if (this.data.turn) {
        return "黒";
      } else {
        return "白";
      }
    },
    isCanPut: function() {
      ////ボードに空きがあるかどうか判定
      for (var y = 0; y < this.data["board"].length; y++) {
        for (var x = 0; x < this.data["board"][y].length; x++) {
          if (this.data["board"][y][x] == 0) {
            return true;
          }
        }
      }
      return false;
    },
    isShowReplaybutton: function() {
      ////ゲームのリプレイボタンを表示するかしないかを判定
      if (this.isCanPut) {
        if (this.data.endGame) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  methods: {
    resetBoard: function() {
      ////ゲームを初期化する関数
      //ボードを初期化
      //0:空 1:黒 2:白 -1:壁
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
      this.data.turn = true; //手番を黒にする
      this.data.endGame = false; //エンドゲームフラグを初期化

      //先攻後攻をランダムで決める
      if (Math.random() > 0.5) {
        this.data.player.player1.first = true;
        this.data.player.player2.first = false;
      } else {
        this.data.player.player1.first = false;
        this.data.player.player2.first = true;
      }

      //初期内容をDBに反映
      this.roomRef.set(this.data);
    },

    isLineup: function(y, x, dy, dx, num) {
      ////ボードの座標と方向から石がnum個並んでいるか判定する関数
      y += dy;
      x += dx;
      num--;
      if (this.data.board[y][x] == this.turnColorNum) {
        if (num == 1) {
          return true;
        } else {
          return this.isLineup(y, x, dy, dx, num);
        }
      } else {
        return false;
      }
    },
    checkEnd: function(y, x) {
      ////石が置かれた場所から八方向の石の並びを確認する関数
      //一方向でもそろっていた場合trueを返す
      return (
        this.isLineup(y, x, -1, 0, 4) || //上
        this.isLineup(y, x, -1, 1, 4) || //右上
        this.isLineup(y, x, 0, 1, 4) || //右
        this.isLineup(y, x, 1, 1, 4) || //右下
        this.isLineup(y, x, 1, 0, 4) || //下
        this.isLineup(y, x, 1, -1, 4) || //左下
        this.isLineup(y, x, 0, -1, 4) || //左
        this.isLineup(y, x, -1, -1, 4) //左上
      );
    },
    put: function(y, x) {
      ////碁盤に石を置いた時の関数
      if (
        //ゲームが終了しているか自分の手番の場合
        this.data.player["player" + this.playerNum].first == this.data.turn &&
        !this.data.endGame
      ) {
        //今の手番の色の石を置く
        this.data.board[y][x] = this.turnColorNum;
        if (this.checkEnd(y, x)) {
          //置かれた石によってゲームが終了した場合
          //ゲーム終了フラグを立てる
          this.data.endGame = true;
        }
        //手番を交代
        this.data.turn = !this.data.turn;
        //DB更新
        this.roomRef.set(this.data);
      }
      //ゲームが終了しているか自分の手番ではない場合何もしない
    },
    isisActiveSignal: function() {
      ////プレイヤー同士の通信がアクティブか確認する関数
      ////プレイヤー間に時差があった場合未対応
      var date = new Date();
      if (
        //過去20秒以内に両プレイヤーにDBの書き込みがあったかどうか
        date.getTime() - this.data.player.player1.lastUpdate > 20000 ||
        date.getTime() - this.data.player.player2.lastUpdate > 20000
      ) {
        return false;
      }
      return true;
    },
    toTop: function() {
      ////Topページへ遷移する関数
      //setIntervalを停止
      window.clearInterval(this.setInterval);
      //Topページに戻る
      window.location.href = "#/";
    }
  },
  mounted: async function() {
    ////ページに入った時の初期化関数
    //Topページで発行された情報を代入
    this.roomName = await store.state.roomName;
    this.playerNum = await store.state.playerNum;

    if (this.roomName != "") {
      //変数の中身から参照すべきDBを設定しRefを保持
      this.roomRef = await firebase.database().ref("/room/" + this.roomName);
      //DB内容をページ即時反映させるよう設定
      this.roomRef.on("value", snapshot => {
        this.data = snapshot.val();
      });

      var this_ = this;
      //プレイヤーとの通信がアクティブかどうか監視
      this.setInterval = window.setInterval(function() {
        console.log("aaa");
        this_.isActiveSignal = this_.isisActiveSignal();
        var date = new Date();
        this_.data.player[
          "player" + this_.playerNum
        ].lastUpdate = date.getTime();
        this_.roomRef.set(this_.data);
      }, 1000);

      //ゲーム状況を初期化
      this.resetBoard();
    } else {
      //Topページから遷移してこなかった場合roomNameが空
      //Topページに戻る
      window.location.href = "#/";
    }
  }
};
</script>

<style scoped>
.room {
  width: 800px;
  height: auto;
  padding-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0px 0px 30px 30px;
  background-color: #eeeeee;
}
table {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  border-collapse: collapse;
  background-color: #eeaa44;
}
td {
  width: 60px;
  height: 60px;
  border: solid 5px;
  color: #222222;
}
.blackStone {
  width: 25px;
  height: 25px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  background-color: #222222;
}
.whiteStone {
  width: 25px;
  height: 25px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  background-color: #ffffff;
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
  width: 250px;
  height: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #ffffff;
  line-height: 2.3em;
  font-size: 20px;
  border-radius: 15px;
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
  line-height: 3.3em;
  font-size: 20px;
  float: left;
}

.topButton {
  width: 130px;
  height: 50px;
  margin-left: 10px;
  margin-top: 10px;
  float: left;
  color: #ffffff;
  line-height: 2.3em;
  font-size: 20px;
  text-align: center;
  border-radius: 15px;
  background-color: #ff2244;
  box-shadow: 0px 0px 10px -4px black;
  transition: 300ms all ease 0s;
}

.topButton:hover {
  background-color: #ff6688;
  box-shadow: 0px 0px 18px -4px black;
}
</style>
