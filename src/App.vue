<template>
  <section class="header">
    <h2 v-if="this.$store.state.username" style="text-transform: uppercase">{{ this.$store.state.username }}'s to do list</h2>
    <h2 v-else style="text-transform: uppercase;">Your to do list</h2>

    <div class="header-right">
      <vue-feather @click="togglemode" class="moon" type="moon"></vue-feather>
      <div class="dropdown">
        <vue-feather @click="openAddTask" class="add-button" type="plus"></vue-feather>
        <div id="myDropdown" class="dropdown-content">
          <AddPost/>
        </div>
      </div>
      <vue-feather type="user"></vue-feather>
    </div>
  </section>

  <section class="app">
    <nav class="sidebar">
      <router-link to="/"><vue-feather type="calendar"></vue-feather>My projects</router-link>
      <router-link to="/wishlist"><vue-feather type="edit-3"></vue-feather>Wish list</router-link>
      <router-link to="/profile"><vue-feather type="settings"></vue-feather>Settings</router-link>
      <span @click="logout"><vue-feather type="log-out"></vue-feather>Logout</span>
    </nav>
    <div class="content">
      <router-view/>
    </div>
  </section>
</template>
<script>
import { getAuth, signOut } from 'firebase/auth'
import { ref, update } from 'firebase/database'
import db from '@/main.js'
import AddPost from '@/components/AddPost.vue'

let auth

export default{
  components:{
    AddPost
  },
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
    },

    openAddTask(){
      document.getElementById("myDropdown").classList.toggle("show")
    },
  },
  beforeCreate(){
    auth = getAuth()
    this.$store.commit('setUser')
    this.$store.dispatch('getdate')
  }
}
</script>
<style lang="scss">
@import '@/styles/AppStyle.scss';
@import '@/styles/DropdownStyle.scss';

nav {
  a {
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
