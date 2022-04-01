import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Vacations from '../views/Vacations.vue'
import Deportment from '../views/Deportment.vue'
import Login from '../views/Login.vue'
import Account from '../views/Account.vue'
import Register from '../views/Register.vue'
import ForgetPassword from '../views/ForgetPassword.vue'
import EmailVerifed from '../views/EmailVerifed'
import EmailSending from '../views/EmailSending'
import store from '../store'
import { getAuth } from "firebase/auth";



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
    path: '/deportment',
    name: 'Deportment',
    component: Deportment,
    meta: {
      layout: 'MainLayout',
      title: 'Структура',
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

router.beforeEach((to, from, next) => {
  console.group('beforeEach')
  console.log(getAuth().currentUser || 'Not user')
  console.log(`from: ${from.path}; to: ${to.path};`)
  console.groupEnd()
  const accessLevel = store.getters.getAccessLevel

  if (!to.meta.protected) {
    next()
  } else {
    const avalibleLevels = to.meta.protected.accessLevel

    if (avalibleLevels.some(x => x == accessLevel)) {
      next()
    } else {
      let name = ''
      switch (accessLevel) {
        case 0: name = 'Login'; break;
        case 1: name = 'Login'; break;
        case 2: name = 'Home'; break;
      }

      if (to.name == name) next()
      next({ name })
    }
  }
})

export default router
