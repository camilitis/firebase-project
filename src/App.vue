<template>
    <div v-if="this.$store.state.userid" class="sidebar">
      <nav>
        <vue-feather @click="togglemode" class="moon" type="moon"></vue-feather>
        <router-link to="/"><vue-feather type="home"></vue-feather><p class="sidebar-text">My home</p></router-link>
        <router-link to="/tasks"><vue-feather type="calendar"></vue-feather><p class="sidebar-text">My tasks</p></router-link>
        <!-- <span style="cursor: not-allowed;"><vue-feather type="edit-3"></vue-feather><p class="sidebar-text">Wish List</p></span> -->
        <!-- <span style="cursor: not-allowed;"><vue-feather type="settings"></vue-feather><p class="sidebar-text">Settings</p></span> -->
        <span @click="logout"><vue-feather type="log-out"></vue-feather><p class="sidebar-text">Logout</p></span>
      </nav>
    </div>
    <div v-if="!this.$store.state.userid">
      <router-view/>
    </div>
    <div v-if="this.$store.state.userid" class="content">
      <router-view/>
    </div>
</template>
<script>
import { getAuth, signOut } from 'firebase/auth'
import { ref, update } from 'firebase/database'
import db from '@/main.js'

let auth

export default{
  methods:{
    logout(){
      if(confirm('Are you sure you want to log out?')){
      signOut(auth).then(() => {
        this.$router.push('/signin')
        this.$store.state.userid = null
      })
      }
    },
    togglemode(){
      document.documentElement.classList.toggle('dark')

      if(document.documentElement.classList.contains('dark')){
        update(ref(db, 'users/' + this.$store.state.userid), {
          darkmode: true
        })
      }else if(!document.documentElement.classList.contains('dark')){
        update(ref(db, 'users/' + this.$store.state.userid), {
          darkmode: false
        })
      }
    }
  },
  beforeCreate(){
    auth = getAuth()
    this.$store.commit('setUser')
    this.$store.dispatch('getdate')
    this.$store.dispatch('gethomedata')
  },
  created(){
    this.$store.dispatch('getlocation')
  },
  updated(){
    if(this.$store.state.userid){
      this.$store.commit('setuserinfo')
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/AppStyle.scss';
@import '@/styles/MenuStyle.scss';
</style>
