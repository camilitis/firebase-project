<template>
  <div class="addTask-section">
    <form class="addTask-form">
      <label for="content">Add your new task:</label>
      <input v-model="state.content" id="content" type="text" autocomplete="off">

<hr>

      <div class="addTask-section-duedate">
        <label for="duedate">Due date:</label>
        <input v-model="duedate" v-if="!this.noduedate" id="duedate" type="date" :min="this.$store.state.todayMaxAttr">

        <span>
          <input v-model="this.noduedate" id="noduedate" type="checkbox">
          <label for="noduedate">No due date</label>
        </span>
      </div>

      <br>

      <label for="priority">Priority:</label>
      <select v-model="state.priority" id="priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <a @click="addpost()" type="button" class="register-btn">Add Post</a>
    </form>
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
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/styles/AddTaskStyle.scss';
</style>