<template>
    <div class="projects-status">
      {{ this.tasks.length }} tasks in total
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
                    <li @click="$refs.editTask.openModal()" class="menu-item"><button class="menu-button"><vue-feather type="italic"></vue-feather>Task</button></li>
                    <li @click="$refs.editDate.openModal()" class="menu-item"><button class="menu-button"><vue-feather type="calendar"></vue-feather>Date</button></li>
                    <li @click="$refs.editPriority.openModal()" class="menu-item"><button class="menu-button"><vue-feather type="triangle"></vue-feather>Priority</button></li>
                  </ul>
                </li>
              </ul>
              <ul class="menu-list">
                <li class="menu-item"><button class="menu-button menu-button--black"><vue-feather type="circle"></vue-feather>No status<vue-feather type="chevron-right"></vue-feather></button>
                  <ul class="menu-sub-list">
                    <li class="menu-item"><button class="menu-button menu-button--purple"><vue-feather type="circle"></vue-feather>In progress</button></li>
                    <li class="menu-item"><button class="menu-button menu-button--green"><vue-feather type="circle"></vue-feather>Done</button></li>
                    <li class="menu-item"><button class="menu-button menu-button--black menu-button--checked"><vue-feather type="circle"></vue-feather>No status<vue-feather type="check"></vue-feather></button></li>
                  </ul>
                </li>
              </ul>
              <ul class="menu-list">
                <li class="menu-item"><button @click="deleteData(item.id)" class="menu-button menu-button--delete"><vue-feather type="trash-2"></vue-feather>Delete</button></li>
              </ul>
            </div>
          </div>
          <!-- MENU -->

          <div class="project-box" :class="item.priority">
            <p @click="toggledone(item.id)" v-if="item.done === true">Done</p>
            <p @click="toggledone(item.id)" v-else-if="item.done === false">Not done yet</p>
            <div class="project-box-header">
              <span>{{ item.date }}</span>
              <div class="more-wrapper">
                <vue-feather @click="showMenu(item.id)" type="more-vertical"></vue-feather>
              </div>
            </div>
        <div class="project-box-content-header">
          <p class="box-content-header">{{ item.content }}</p>
        </div>
        <div class="project-box-footer">
          <div class="days-left">
            <span v-if="item.duedate == ''">No due date</span>
            <span v-else>{{ this.duedatecountdown(item.duedate) }}</span>
          </div>
        </div>
          </div>
        </li>
      </ul>
</div>

  <ModalComponent ref="editTask">
    <template v-slot:body>
      Edit task
    </template>
  </ModalComponent>

  <ModalComponent ref="editDate">
    <template v-slot:body>
      Edit date
    </template>
  </ModalComponent>

  <ModalComponent ref="editPriority">
    <template v-slot:body>
      Edit priority
    </template>
  </ModalComponent>
</template>
<script>
import { ref, onValue, update, remove } from "firebase/database"
import db from '@/main.js'
import ModalComponent from '@/components/ModalComponent.vue'

export default {
  name: 'TasksList',

  data(){
    return {
      tasks: [],
      dataMessage: '',
      menuactive: null
    }
  },

  components:{
    ModalComponent
  },
  methods:{
    showData(){
      this.dataMessage = 'loading'

      const colRef = ref(db, 'users/' + this.$store.state.userid + '/tasks')

      onValue(colRef, (snapshot) => {
        this.tasks = []
        snapshot.forEach((element) => {
          this.tasks.push({ ...element.val(), id: element.key })
        })

      this.dataMessage = 'nodata'
      })
    },

    toggledone(id){
      var taskRef = ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id + '/done')
      var task = ref(db, 'users/' + this.$store.state.userid + '/tasks/' + id)

      onValue(taskRef, (snapshot) => {
        if(snapshot.val() == true){
          update(task, { done: false })
        }else if(snapshot.val() == false){
          update(task, { done: true })
        }
      }, {onlyOnce: true})
      return
    },

    duedatecountdown(duedate){
      var dt1 = new Date().getTime()
      var dt2 = new Date(duedate).setHours(0,0,0,0)

      var distance = dt2 - dt1

      var days = Math.floor(distance / (1000 * 60 * 60 * 24))
      // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      // var seconds = Math.floor((distance % (1000 * 60)) / 1000)


      //var dt1 = new Date()
      // var dt2 = new Date(toDate)

      // return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24))

      return days + "d "
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
    hideMenu(){
      if(this.menuactive != null){
        this.menuactive = null
      }
    }
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