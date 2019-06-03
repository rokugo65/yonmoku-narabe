<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <a v-if="isAuth" @click="signOut" class="button">signOut</a>
    <a v-else @click="signIn" class="button">signIn</a>
    {{data}}
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      isAuth: false,
      data: null
    };
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
          console.log(snapshot);
          this.data = snapshot.val();
        });
    }
  },
  mounted: function() {
    firebase.auth().onAuthStateChanged(user => (this.isAuth = !!user));
    this.loadRoom();
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
