import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Vacations from '@/views/Vacations.vue'
import Vacation from '@/views/Vacation.vue'
import Deportment from '@/views/Deportment.vue'
import Login from '@/views/Login.vue'
import Account from '@/views/Account.vue'
import Register from '@/views/Register.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'
import EmailVerifed from '@/views/EmailVerifed'
import EmailSending from '@/views/EmailSending'
import Schedules from '@/views/Schedules'
import Schedule from '@/views/Schedule'
import store from '@/store'
import {getAuth} from "firebase/auth";


Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      layout: 'MainLayout',
      title: 'Главная',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/vacations',
    name: 'Vacations',
    component: Vacations,
    meta: {
      layout: 'MainLayout',
      title: 'Мои отпуска',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/vacation/:id',
    name: 'Vacation',
    component: Vacation,
    meta: {
      layout: 'MainLayout',
      title: 'Мои отпуска',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/deportment',
    name: 'Deportment',
    component: Deportment,
    meta: {
      layout: 'MainLayout',
      title: 'Управление',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/schedules',
    name: 'Schedules',
    component: Schedules,
    meta: {
      layout: 'MainLayout',
      title: 'Графики отпусков',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/schedule/:id',
    name: 'Schedule',
    component: Schedule,
    meta: {
      layout: 'MainLayout',
      title: 'График отпусков',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      layout: 'MainLayout',
      title: 'Настройки аккаунта',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      layout: 'EmptyLayout',
      title: 'Авторизация',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      layout: 'EmptyLayout',
      title: 'Регистрация',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/resetpassword',
    name: 'Reset',
    component: ForgetPassword,
    meta: {
      layout: 'EmptyLayout',
      title: 'Восстановление пароля',
      protected: {
        accessLevel: [0, 1]
      }
    }
  },
  {
    path: '/emailverify',
    name: 'EmailVerifed',
    component: EmailVerifed,
    meta: {
      layout: 'EmptyLayout',
      title: 'Емейл подтверждён',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/emailsending',
    name: 'EmailSending',
    component: EmailSending,
    meta: {
      layout: 'EmptyLayout',
      title: 'Запрос отправлен',
      protected: {
        accessLevel: [1]
      }
    }
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

router.beforeEach(async (to, from, next) => {
  const accessLevel = store.getters.getAccessLevel
  const user = getAuth().currentUser
  console.group('beforeEach')
  console.log(user || 'Not currentUser')
  console.log('accessLevel', accessLevel)
  console.log(`from: ${from.path}; to: ${to.path};`)
  console.groupEnd()

  if (!to.meta.protected) next()
  else {
    let available = to.meta.protected.accessLevel
    if (available.some(a => a == accessLevel)) next()
    else {
      switch (accessLevel) {
        case 0: next({name: 'Login'}); console.log('Redirect to Login'); break;
        case 1: next({name: 'EmailSending', query: {e: user.email}}); console.log('Redirect to' +
          ' EmailSending'); break;
        case 2: next({name: 'Home'}); console.log('Redirect to Home'); break;
      }
    }
  }
})
// router.beforeEach(async (to, from, next) => {
//   const ready = store.getters.isReady
//   let redirect = null
//
//   if (!ready) {
//     console.log('!ready')
//     redirect = await store.dispatch('loadUserData')
//   }
//   // if (redirect && redirect.name) {
//   //   console.log('redirect recived', redirect)
//   //   return next({name: redirect.name})
//   // }
//
//   const accessLevel = store.getters.getAccessLevel
//
//   console.group('beforeEach')
//   console.log(getAuth().currentUser || 'Not currentUser')
//   console.log(`from: ${from.path}; to: ${to.path};`)
//   console.groupEnd()
//   next()
//   // if (!to.meta.protected) {
//   //   next()
//   // } else {
//   //   const availableLevels = to.meta.protected.accessLevel
//   //
//   //   if (availableLevels.some(x => x == accessLevel)) {
//   //     next()
//   //   } else {
//   //     let name = ''
//   //     switch (accessLevel) {
//   //       case 0:
//   //         name = 'Login';
//   //         break;
//   //       case 1:
//   //         name = 'Login';
//   //         break;
//   //       case 2:
//   //         name = 'Home';
//   //         break;
//   //     }
//   //
//   //     if (to.name == name) next()
//   //     next({name})
//   //   }
//   // }
// })

export default router
