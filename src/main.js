import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import VueFeather from 'vue-feather'

const firebaseConfig = {
  apiKey: "AIzaSyATFjL0MAbXRJN7kUK9OaLS-E4JooHns0g",
  authDomain: "firstexample-5aaee.firebaseapp.com",
  databaseURL: "https://firstexample-5aaee-default-rtdb.firebaseio.com",
  projectId: "firstexample-5aaee",
  storageBucket: "firstexample-5aaee.appspot.com",
  messagingSenderId: "653423389872",
  appId: "1:653423389872:web:8d35817046ae2df7675f75",
  measurementId: "G-HQ0H21R12M"
 }

initializeApp(firebaseConfig)

const db = getDatabase()

export default db

createApp(App).use(store).use(router).component(VueFeather.name, VueFeather).mount('#app')