import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import signIn from '../views/SignIn.vue'
import signUp from '../views/SignUp.vue'
import TasksList from '../views/TasksList.vue'
import wishList from '../views/WishList.vue'
import settingsMenu from '../views/settingsMenu.vue'

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tasks',
    name: 'taskslist',
    component: TasksList,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: signIn
  },
  {
    path: '/signup',
    name: 'Signup',
    component: signUp
  },
  {
    path: '/wishlist',
    name: 'wishList',
    component: wishList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: settingsMenu,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const getCurrentUser = () => {
  return new Promise ((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if(await getCurrentUser()){
      next()
    }else{
      next('/signin')
    }
  }else{
    next()
  }
})

export default router