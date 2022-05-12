import { createStore } from 'vuex'
import router from '../router'
import { getAuth, onAuthStateChanged, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref, onValue } from 'firebase/database'
import db from '@/main.js'

export default createStore({
  state: {
    errorMsg: '',

    islogged: false,
    userid: null,
    username: '',

    todayMaxAttr: '',
    todaysdate: '',
    taskdate: '',

    numberOfTasks: null,
  },
  getters: {
  },
  mutations: {
    setUser(){
      const auth = getAuth()

      onAuthStateChanged(auth, (user) => {
        if(user){
          this.state.islogged = true
          this.state.userid = user.uid

          onValue(ref(db, 'users/' + this.state.userid + '/darkmode'), (snapshot) => {
            if(snapshot.val() === true){
              document.documentElement.classList.add('dark')
            }else if(snapshot.val() === false){
              document.documentElement.classList.remove('dark')
            }
          }, {
            onlyOnce: true
          })
        }else{
          this.state.islogged = false
        }
      })
    },

    setuserinfo(){
      const userinfo = []
      const colRef = ref(db, 'users/' + this.state.userid)

      onValue(colRef, (snapshot) => {
        snapshot.forEach((element) => {
          userinfo.push({ info: element.key, value: element.val() })
        })
        let username = userinfo.find(user => user.info === 'username')
        this.state.username = username.value
      })
    },
  },
  actions: {
    signInWithGoogle({commit}){
      const provider = new GoogleAuthProvider()
      signInWithPopup(getAuth(), provider)
      .then(() => {
        commit('setUser')

        router.push('/')
      })
      .catch(() => {
        this.state.errorMsg = 'Google login failed'
      })
    },

    signInWithFacebook({commit}){
      const provider = new FacebookAuthProvider()
      signInWithPopup(getAuth(), provider)
      .then(() => {
        commit('setUser')

        router.push('/')
      })
      .catch(() => {
        this.state.errorMsg = 'Facebook login failed'
      })
    },

    getdate(){
      var today = new Date()

      var dd = today.getDate()
      var mm = today.getMonth() + 1
      var yyyy = today.getFullYear()

        if (dd < 10) {
          dd = '0' + dd
        }
        if (mm < 10) {
          mm = '0' + mm
        }

      this.state.todayMaxAttr = yyyy + '-' + mm + '-' + dd

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

      let month = months[today.getMonth()]
      let day = days[today.getDay()]

      this.state.todaysdate = day + ', ' + month + ' ' + today.getDate()

      this.state.taskdate = month + ', ' + today.getDate()
    }
  }
})