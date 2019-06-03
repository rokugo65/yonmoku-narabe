<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    {{data}}
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "HelloWorld",

  data() {
    return {
      msg: "SelectRoom",
      roomName: "room1",
      isAuth: false,
      data: null,
      roomRef: null
    };
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
      this.roomRef.set(this.data);
    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
    this.roomRef = firebase.database().ref("/room/" + this.roomName);
    this.loadData();
    this.resetBoard();
  }
};
</script>

<style scoped>
.button {
  width: 200px;
  height: 100px;
  background-color: aqua;
}
</style>
