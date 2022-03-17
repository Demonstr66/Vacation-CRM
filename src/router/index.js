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
        auth: true
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
        auth: true
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
        auth: true
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
        auth: true
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
        auth: false
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
        auth: false
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
        auth: false
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
        query: true,
        param: 'u'
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
        auth: false,
        query: true,
        param: 'u'
      }
    }
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = store.getters.isAuth

  if (!to.meta.protected) {
    next()
  } else {
    const p = to.meta.protected
    let path = ''

    if (p.auth === true && !isAuth) path = 'Login'
    if (p.auth === false && isAuth) path = 'Home'
    if (p.query) {
      if (!to.query[p.param]) path = isAuth ? 'Home' : 'Login'
      else {
        if (p.param == 'u') {
          if (to.query[p.param] == getAuth().currentUser.uid) path = ''
          else path = isAuth ? 'Home' : 'Login'
        }
      }
    }

    if (!path) next()
    else next({ name: path })
  }

  // next()
})

export default router
