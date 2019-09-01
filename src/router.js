import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Profile from './components/Profile.vue'
import Main from './components/Main.vue'
import Ex from './components/Ex.vue'
import Register from './components/Register.vue'
Vue.use(Router)

export default new Router({
  routes: [
   
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    // {
    //   path: '/im/:username',
    //   name: 'messagesbox',
    //   component: MessagesBox
    // },
    {
      path: '/asd',
      name: 'ex',
      component: Ex
    }
   
  ]
})
