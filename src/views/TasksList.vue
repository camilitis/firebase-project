<template>
    <div class="projects-header">
      <span class="projects-status">
        <div class="item-status">
          <span class="status-number">{{ this.notdonetasks.length }}</span>
          <span class="status-type">In Progress</span>
        </div>
        <div class="item-status">
          <span class="status-number">{{ this.donetasks.length }}</span>
          <span class="status-type">Completed</span>
        </div>
        <div class="item-status">
          <span class="status-number">{{ this.tasks.length }}</span>
          <span class="status-type">Total Projects</span>
        </div>
      </span>

          <div class="dropdown">
            <span 
              v-if="this.$store.state.userid"
              @click="toggleaddtask"
              class="addtask-button" id="addtaskbutton"
            >
              <vue-feather type="plus"></vue-feather>
              <span class="addtask-text">Add task</span>
            </span>
            <div id="myDropdown" class="dropdown-content">
              <AddPost/>
            </div>
          </div>

    </div>

    <div class="projects-section">
      <ul class="jsGridView project-boxes">

        <vue-feather v-if="this.dataMessage == 'loading'" class="loader" type="loader" animation="spin"></vue-feather>

        <p v-if="this.dataMessage == 'nodata' && this.tasks.length == 0">No tasks yet</p>

        <li v-for="item in tasks" :key="item.id" class="project-box-wrapper">

              <!-- MENU -->
          <div v-if="this.menuactive == item.id" class="menu-container">
            <div class="menu">
              <ul class="menu-list">
                <li class="menu-item"><button class="menu-button"><vue-feather type="edit"></vue-feather>Edit<vue-feather type="chevron-right"></vue-feather></button>
                  <ul class="menu-sub-list">
                    <li @click="toggleEditTask(item.id); this.menuactive = null" class="menu-item menu-sub-item"><button class="menu-button"><vue-feather type="italic"></vue-feather>Task</button></li>
                    <li @click="toggleEditDate(item.id); this.menuactive = null" class="menu-item menu-sub-item"><button class="menu-button"><vue-feather type="calendar"></vue-feather>Date</button></li>
                    <li @click="toggleEditPriority(item.id); this.menuactive = null" class="menu-item menu-sub-item"><button class="menu-button"><vue-feather type="triangle"></vue-feather>Priority</button></li>
                  </ul>
                </li>
              </ul>

              <ul class="menu-list">
                <li class="menu-item">
                  <button class="menu-button" >
                    <vue-feather 
                      v-if="item.done == false || item.done == 'progress'"
                      :class="[item.done === false ? 'menu-svg-notdone' : 'menu-svg-progress']" type="circle">
                    </vue-feather>
                    <vue-feather
                      v-if="item.done == true" type="check-circle" class="checkcircle">
                    </vue-feather>
                        <span v-if="item.done == true">Done</span>
                        <span v-else-if="item.done == false">Not done</span>
                        <span v-else-if="item.done == 'progress'">In progress</span>
                    <vue-feather type="chevron-right"></vue-feather>
                  </button>
                  <ul class="menu-sub-list">
                    <li class="menu-item menu-sub-item">
                      <button @click="settoinprogress(item.id)" class="menu-button">
                        In progress
                        <vue-feather v-if="item.done === 'progress'" class="menu-svg-progress" type="check"></vue-feather>
                      </button></li>
                    <li class="menu-item menu-sub-item">
                      <button @click="settodone(item.id)" class="menu-button">
                        Done
                        <vue-feather v-if="item.done === true" class="checkcircle" type="check"></vue-feather>
                      </button></li>
                    <li class="menu-item menu-sub-item">
                      <button @click="settonotdone(item.id)" class="menu-button">
                        Not done
                        <vue-feather v-if="item.done === false" class="menu-svg-notdone" type="check"></vue-feather>
                      </button></li>
                  </ul>
                </li>
              </ul>
              <ul class="menu-list">
                <li class="menu-item"><button @click="deleteData(item.id)" class="menu-button menu-button--delete"><vue-feather type="trash-2"></vue-feather>Delete</button></li>
              </ul>
            </div>
          </div>
          <!-- MENU -->

          <div :id="'edittask-' + item.id" class="menu-container menu-edit">
              <div class="menu">
                <ul class="menu-list">
                  <li class="menu-item">
                    <input v-model="newtask" type="text" :placeholder="item.content">
                    <button @click="toggleEditTask(item.id)" class="menu-button">
                      <vue-feather type="x"></vue-feather>
                      Cancel
                    </button>
                    <button @click="editTask(item.id, this.newtask)" class="menu-button">
                      <vue-feather type="check"></vue-feather>
                      Save
                    </button>
                  </li>
                </ul>
              </div>
          </div>

          <div :id="'editdate-' + item.id" class="menu-container menu-edit">
              <div class="menu">
                <ul class="menu-list">
                  <li class="menu-item menu-item-flex menu-item-column">
                      <input v-model="newdate" v-if="!this.newnoduedate" :placeholder="item.date" :min="this.$store.state.todayMaxAttr" type="date">
                    <span class="menu-item-flex menu-item-date">
                      <input v-model="this.newnoduedate" @change="this.newdate = ''" :placeholder="item.duedate" id="noduedate" type="checkbox">
                      <label for="noduedate">No due date</label>
                    </span>
                    <button @click="toggleEditDate(item.id)" class="menu-button">
                      <vue-feather type="x"></vue-feather>
                      Cancel
                    </button>
                    <button @click="editDate(item.id, this.newdate)" class="menu-button">
                      <vue-feather type="check"></vue-feather>
                      Save
                    </button>
                  </li>
                </ul>
              </div>
          </div>

          <div :id="'editpriority-' + item.id" class="menu-container menu-edit">
              <div class="menu">
                <ul class="menu-list">
                  <li class="menu-item">
                    <label for="priority">Modify priority:</label>
                    <select id="priority" v-model="newpriority" name="priority">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <button @click="toggleEditPriority(item.id)" class="menu-button">
                      <vue-feather type="x"></vue-feather>
                      Cancel
                    </button>
                    <button @click="editPriority(item.id, this.newpriority)" class="menu-button">
                      <vue-feather type="check"></vue-feather>
                      Save
                    </button>
                  </li>
                </ul>
              </div>
          </div>

          <div 
            :class="item.priority"
            :style="[item.done === true ? {opacity: .6} : {opacity: 1}]" class="project-box">
            <div class="project-box-header">
              <span>{{ item.date }}</span>
              <div class="more-wrapper">
                <vue-feather @click="showMenu(item.id)" type="more-vertical" style="cursor: pointer;"></vue-feather>
              </div>
            </div>
        <div>
          <p v-if="item.done === true" class="box-content-header taskdone">{{ item.content }}</p>
          <p v-else-if="item.done == 'progress'" class="box-content-header">{{ item.content }}</p>
          <p v-else-if="item.done === false" class="box-content-header">{{ item.content }}</p>
        </div>
        <div class="project-box-footer">
          <div class="days-left">
            <span v-if="item.duedate == ''">No due date</span>
            <span v-else-if="this.duedatecountdown(item.duedate) == 'Ended'" style="color: red;">Ended</span>
            <span v-else>{{ this.duedatecountdown(item.duedate) }}</span>
          </div>
          <div v-if="item.done == 'progress' && this.duedatecountdown(item.duedate) >= 1" class="days-left">
            <span>In progress</span>
          </div>
        </div>
          </div>
        </li>
      </ul>
</div>

  <div 
    v-if="this.menuactive !== null"
    @click="this.menuactive = null" class="app-backdrop">
  </div>
</template>
<script>
import { ref, onValue, update, remove } from "firebase/database"
import db from '@/main.js'
import AddPost from '@/components/AddPost.vue'

export default {
  name: 'TasksList',

  data(){
    return {
      tasks: [],
      donetasks: [],
      notdonetasks: [],

      dataMessage: '',
      menuactive: null,

      editmenu: null,
      newpriority: null,
      newtask: null,
      newdate: null,
      newnoduedate: false,
    }
  },
  components:{
    AddPost,
  },
  methods:{
    showData(){
      this.dataMessage = 'loading'

      const colRef = ref(db, 'users/' + this.$store.state.userid + '/tasks')

      onValue(colRef, (snapshot) => {

        this.tasks = []
        this.donetasks = []
        this.notdonetasks = []

        snapshot.forEach((element) => {
          this.tasks.push({ ...element.val(), id: element.key })

          if(element.val().done === true){
            this.donetasks.push({ id: element.key, done: element.val().done })
          }
          if(element.val().done == 'progress'){
            this.notdonetasks.push({ id: element.key, done: element.val().done })
          }
        })
        this.dataMessage = 'nodata'

      })
    },

    toggleEditTask(id){
      document.getElementById('edittask-' + id).classList.toggle('menu-edit-show')
    },
    toggleEditDate(id){
      document.getElementById('editdate-' + id).classList.toggle('menu-edit-show')
    },
    toggleEditPriority(id){
      document.getElementById('editpriority-' + id).classList.toggle('menu-edit-show')
    },

    settodone(id){
      update(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id), { done: true })
    },

    settonotdone(id){
      update(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id), { done: false })
    },

    settoinprogress(id){
      update(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id), { done: 'progress' })
    },

    duedatecountdown(duedate){
      var dt1 = new Date().getTime()

      var dt2 = new Date(duedate)
      const numbOfHours = 3
      dt2.setTime(dt2.getTime() + numbOfHours * 60 * 60 * 1000)

      var distance = dt2 - dt1

      var days = Math.floor(distance / (1000 * 60 * 60 * 24))
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

      if(days < 0 && hours < 0 && minutes < 0){
        return 'Ended'
      }else if(days == 0){
        return 'Tomorrow'
      }else{
      return days + 'd'
      }
    },
    deleteData(id){
      if(confirm('Are you sure you want to delete this task?')){
        remove(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id))
      }
    },

    showMenu(id){
      if(this.menuactive == id){
        this.menuactive = null
      }else if(this.menuactive != id){
        this.menuactive = id
      }
    },

    editTask(id, newtask){
      if(newtask == null){
        alert('Please write a task')
      }else{
        update(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id), { content: newtask })
        this.toggleEditTask(id)
        this.newtask = null
      }
    },
    editDate(id, newdate){
      if(newdate == '' && this.newnoduedate == false){
        alert('Please select a new date')
      }else{
        console.log(this.newdate)
        update(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id), { duedate: newdate })
        this.toggleEditDate(id)
        this.newdate = null
        this.newnoduedate= false
      }
    },
    editPriority(id, priority){
      if(priority == null){
        alert('Please select a priority')
      }else{
        update(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id), { priority: priority })
        this.toggleEditPriority(id)
        this.newpriority = null
      }
    },

    toggleaddtask(){
      this.addtaskopen = !this.addtaskopen

      document.getElementById('myDropdown').classList.toggle('show')
      document.getElementById('addtaskbutton').classList.toggle('addtask-button-clicked')
    },
  },
  created(){
    this.showData()
  }
}
</script>
<style lang="scss">
@import '@/styles/AppStyle.scss';
@import '@/styles/TasksListStyle.scss';
</style>