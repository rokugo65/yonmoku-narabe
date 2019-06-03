// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyBS1STzCqjjghYtLuB7e30gjgOlMgvt4D8",
  authDomain: "yonmoku-narabe.firebaseapp.com",
  databaseURL: "https://yonmoku-narabe.firebaseio.com",
  projectId: "yonmoku-narabe",
  storageBucket: "yonmoku-narabe.appspot.com",
  messagingSenderId: "525678683914",
  appId: "1:525678683914:web:e8aebd9d92d4caae"
};
firebase.initializeApp(config);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
