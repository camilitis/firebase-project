<template>
<div class="log">
<h2>Create an account</h2>

  <section>
    <input v-model="state.username" type="text" placeholder="Username" spellcheck="false">
    <p v-if="v$.username.$error"> {{ v$.username.$errors[0].$message }} </p>

    <input type="text" v-model="state.email" placeholder="Email"  spellcheck="false">
    <p v-if="v$.email.$error"> {{ v$.email.$errors[0].$message }} </p>

    <input type="password" v-model="state.password.password" placeholder="Password">
    <p v-if="v$.password.password.$error"> {{ v$.password.password.$errors[0].$message }} </p>

    <input type="password" v-model="state.password.confirmPassword" placeholder="Confirm Password">
    <p v-if="v$.password.confirmPassword.$error"> {{ v$.password.confirmPassword.$errors[0].$message }} </p>

    <p v-if="errorMsg">{{ errorMsg }}</p>
    <p v-if="popuperror">{{ popuperror }}</p>
    <button @click="registerUser">Sign Up</button>
  </section>

    <div>
    <svg @click="this.$store.dispatch('signInWithGoogle')" fill="#555358" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 11v2.4h3.97c-.16 1.029-1.2 3.02-3.97 3.02-2.39 0-4.34-1.979-4.34-4.42 0-2.44 1.95-4.42 4.34-4.42 1.36 0 2.27.58 2.79 1.08l1.9-1.83c-1.22-1.14-2.8-1.83-4.69-1.83-3.87 0-7 3.13-7 7s3.13 7 7 7c4.04 0 6.721-2.84 6.721-6.84 0-.46-.051-.81-.111-1.16h-6.61zm0 0 17 2h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z" fill-rule="evenodd" clip-rule="evenodd"/></svg>

    <svg @click="this.$store.dispatch('signInWithFacebook')" fill="#555358" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
  </div>

  <nav>
    Have an account already?
    <router-link to="/signin">Log in</router-link>
  </nav>
</div>
</template>
<script>
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import router from '../router'
import useVuelidate from '@vuelidate/core'
import { reactive, computed } from 'vue'
import { ref, set } from "firebase/database"
import db from '@/main.js'

export default {
  setup(){
    const state = reactive({
      email: '',
      password: {
        password: '',
        confirmPassword: ''
      },
      username: ''
    })

    const rules = computed(() => {
      return{
        email: { required, email },
        password: {
          password: { required, minLength: minLength(6) },
          confirmPassword: { required, sameAs: sameAs(state.password.password) }
        },
        username: { required }
      }
    })

    const v$ = useVuelidate(rules, state)

    return{
      state,
      v$,
    }
  },
  data(){
    return{
      errorMsg: null,
      today: ''
    }
  },
  computed:{
    popuperror(){
      return this.$store.state.errorMsg
    },
    userid(){
      return this.$store.state.userid
    }
  },
  methods: {
    firstPost(){
      var newtaskid = Math.random().toString(16).slice(2)

      set(ref(db, 'users/' + this.userid + '/tasks/' + newtaskid), {
        content: 'Create an account',
        priority: 'high',
        date: this.today,
        duedate: 'none',
        done: true
      })
    },
    userPreferences(){
      set(ref(db, 'users/' + this.userid), {
        username: this.state.username,
        darkmode: false
      })
    },


    registerUser(){
      this.v$.$validate()
      if(!this.v$.$error){
        createUserWithEmailAndPassword(getAuth(), this.state.email, this.state.password.password)
        .then(() => {
          this.$store.commit('setUser')

          this.userPreferences()
          this.firstPost()

          router.push('/')
        })
        .catch(error => {
          this.errorMsg = error.message
        })
      }
    },

    mmdd(){
      var today = new Date()
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
      let month = months[today.getMonth()]

      this.today = month + ' ' + today.getDate()
    }
  }
}
</script>
<style>
@import '@/styles/LogStyle.scss';
</style>