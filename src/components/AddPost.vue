<template>
  <div class="addtask">
    <form class="addtask-form" @submit.prevent="">
      <label for="content">Add your new task:</label>
      <textarea v-model="state.content" id="content"></textarea>

      <section class="addtask-info">
        <div class="addtask-duedate">
          <label for="duedate" class="addtask-info-header">Due date:</label>
          <input v-model="duedate" v-if="!this.noduedate" id="duedate" type="date" :min="this.$store.state.todayMaxAttr">

          <span class="addtask-noduedate">
            <input v-model="this.noduedate" id="noduedate" type="checkbox">
            <label for="noduedate">No due date</label>
          </span>
        </div>

        <div class="addtask-priority">
          <label for="priority" class="addtask-info-header">Priority:</label>
          <select v-model="state.priority" id="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </section>

      <p><a @click="addpost()" type="button">Add Post</a></p>
    </form>
  </div>

  <div 
    v-if="this.addtaskopen == true"
    @click="toggleaddtask" class="app-backdrop">
  </div>

</template>
<script>
import { reactive, computed } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { ref, set } from 'firebase/database'
import db from '@/main.js'

export default {
  name: 'AddPost',
  setup(){
    const state = reactive({
      priority: '',
      content: '',
    })
    const rules = computed(() => {
      return{
        priority: { required },
        content: { required },
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
      duedate: '',
      noduedate: false,

      addtaskopen: false,
    }
  },

  methods:{
    addpost(){
      this.v$.$validate()
      if (!this.v$.$error){
        var newtaskid = Math.random().toString(16).slice(2)

        set(ref(db, 'users/' + this.$store.state.userid + '/tasks/' + newtaskid), {
          content: this.state.content,
          priority: this.state.priority,
          date: this.$store.state.taskdate,
          duedate: this.duedate,
          done: false
        })
        .then(() => {
          document.getElementById("myDropdown").classList.toggle("show")

          this.state.content = ''
          this.state.priority = ''
          this.duedate = ''
          this.v$.$reset()
        })
      }else{
        alert('Please fill in all the fields')
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/AddTaskStyle.scss';
</style>