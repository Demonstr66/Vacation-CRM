import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Vacations from '../views/Vacations.vue'
import Deportment from '../views/Deportment.vue'
import Auth from '../views/Auth.vue'
import SideNavigation from '../components/SideNavigation.vue'


Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      default: Home,
      SideNavigation
    }
  },
  {
    path: '/vacations',
    name: 'Vacations',
    components: {
      default: Vacations,
      SideNavigation
    }
  },
  {
    path: '/deportment',
    name: 'Deportment',
    components: {
      default: Deportment,
      SideNavigation
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  // let isAuthenticated = !!localStorage.getItem('user')
  // console.log(isAuthenticated)

  // if (!isAuthenticated) next({ name: 'Auth' })
  // else if (to.name == 'Auth' && isAuthenticated)  next({ name: 'Home' })
  // else next()
  next()
})

export default router
