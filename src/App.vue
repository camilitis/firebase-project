<template>
  <section class="header">
    <h2 v-if="this.$store.state.username" style="text-transform: uppercase">{{ this.$store.state.username }}'s to do list</h2>
    <h2 v-else style="text-transform: uppercase;">Your to do list</h2>

    <div class="header-right">
      <vue-feather @click="togglemode" class="moon" type="moon"></vue-feather>
      <div class="dropdown">
        <vue-feather 
          v-if="this.$store.state.userid"
          @click="toggleaddtask"
          class="addTask-button" id="addtaskbutton" type="plus"></vue-feather>
        <div id="myDropdown" class="dropdown-content">
          <AddPost/>
        </div>
      </div>
    </div>
  </section>

  <section v-if="this.$store.state.userid" class="app">
    <nav class="sidebar">
      <router-link to="/"><vue-feather type="calendar"></vue-feather>My projects</router-link>
      <router-link to="/wishlist"><vue-feather type="edit-3"></vue-feather>Wish list</router-link>
      <router-link to="/profile"><vue-feather type="settings"></vue-feather>Settings</router-link>
      <span @click="logout"><vue-feather type="log-out"></vue-feather>Logout</span>
    </nav>
    <div class="content">
      <div class="projects-section-header">
        <p v-if="this.$route.path == '/'">My projects</p>
        <p v-else-if="this.$route.path == '/wishlist'">Wish List</p>
        <p v-else-if="this.$route.path == '/profile'">Settings</p>
        <h3>{{this.$store.state.todaysdate}}</h3>
      </div>
      <router-view/>
    </div>
  </section>

  <section v-if="!this.$store.state.userid">
    <router-view/>
  </section>

  <div 
    v-if="addtaskopen == true"
    @click="toggleaddtask" class="app-backdrop">
  </div>

<!-- 
          <section>
            <label for="priority">Modify priority:</label>
            <select id="priority" v-model="newpriority" name="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <a href="#open-taskoptionsmodal">Cancel</a>
            <button @click="updatePriority(item.id, this.newpriority)">Save</button>
          </section> -->

      <!-- updatePriority(id, priority){
      update(ref(db, 'users/' + this.userID + '/tasks/' + id), { priority: priority })
    } -->
</template>
<script>
import { getAuth, signOut } from 'firebase/auth'
import { ref, update } from 'firebase/database'
import db from '@/main.js'
import AddPost from '@/components/AddPost.vue'

let auth

export default{
  data(){
    return {
      addtaskopen: false,
    }
  },
  components:{
    AddPost,
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
    toggleaddtask(){
      document.getElementById('myDropdown').classList.toggle('show')
      document.getElementById('addtaskbutton').classList.toggle('addTask-button-clicked')
      if(this.addtaskopen == true){
        this.addtaskopen = false
      }else{
        this.addtaskopen = true
      }
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
@import '@/styles/MenuStyle.scss';
</style>
