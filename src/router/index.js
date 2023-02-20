import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import {getAuth} from "firebase/auth";

const DEBUG = process.env.VUE_APP_DEBUG;

const Home = () => import('@/views/App/Home.vue')
const Vacations = () => import('@/views/App/Vacations.vue')
const Vacation = () => import('@/views/App/Vacation.vue')
const Administration = () => import('@/views/App/Administration.vue')
const Login = () => import('@/views/Auth/Login.vue')
const LoginByLink = () => import('@/views/Auth/LoginByLink')
const Account = () => import('@/views/App/Account.vue')
const Register = () => import('@/views/Auth/Register.vue')
const ForgetPassword = () => import('@/views/Auth/ResetPassword.vue')
const EmailSending = () => import('@/views/Auth/EmailSending')
const Schedules = () => import('@/views/App/Schedules')
const Schedule = () => import('@/views/App/ScheduleViewer')
const ScheduleEditor = () => import('@/views/App/ScheduleEditor')
const User = () => import('@/views/App/User')
const Tab1 = () => import('@/components/Administration/Users')
const Tab2 = () => import('@/components/Administration/Structure')
const Viewer1 = () => import('@/components/ScheduleViewer/ListView'  )
const Viewer2 = () => import('@/components/ScheduleViewer/TimelineView'  )
const ScheduleStatistic = () => import('@/views/App/ScheduleStatistic')

const Setting = () => import('@/views/App/Account')
const SettingProfile = () => import('@/components/Account/pages/profile')
const SettingVacationTemplate = () => import('@/components/Account/pages/vacations/template')
const SettingVacationPermission = () => import('@/components/Account/pages/vacations/permission')
const SettingVacationNotification = () => import('@/components/Account/pages/vacations/notification')
const SettingWorkspace = () => import('@/components/Account/pages/workspace')


Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      layout: 'MainEmptyLayout',
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
      layout: 'MainEmptyLayout',
      title: 'Мои отпуска',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/vacation/:uid/:id',
    name: 'Vacation',
    component: Vacation,
    meta: {
      layout: 'MainEmptyLayout',
      title: '',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/administration',
    name: 'Administration',
    component: Administration,
    children: [
      {
        path: '/',
        redirect: {name: 'Tab1'}
      },
      {
        path: 'tab1',
        component: Tab1,
        name: 'Tab1',
        meta: {
          layout: 'MainEmptyLayout',
          title: 'Управление',
          protected: {
            accessLevel: [2]
          }
        }
      }, {
        path: 'tab2',
        component: Tab2,
        name: 'Tab2',
        meta: {
          layout: 'MainEmptyLayout',
          title: 'Управление',
          protected: {
            accessLevel: [2]
          }
        }
      }],
    meta: {
      layout: 'MainEmptyLayout',
      title: 'Управление',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/user/:uid',
    name: 'User',
    component: User,
    meta: {
      layout: 'MainEmptyLayout',
      title: 'Профиль',
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
      layout: 'MainEmptyLayout',
      title: 'Графики отпусков',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/schedules/editor',
    component: ScheduleEditor,
    name: 'ScheduleCreate',
    meta: {
      layout: 'MainLayout',
      title: 'Новый график',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/schedules/editor/:id',
    component: ScheduleEditor,
    name: 'ScheduleEditor',
    meta: {
      layout: 'MainLayout',
      title: 'Редактирование',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/schedules/view',
    component: Schedule,
    name: 'ScheduleViewer',
    children: [
      {
        path: '/',
        redirect: {name: 'Viewer1'}
      },
      {
        path: 'list/:id',
        component: Viewer1,
        name: 'Viewer1',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      }, {
        path: 'timeline/:id',
        component: Viewer2,
        name: 'Viewer2',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      }],
    meta: {
      layout: 'MainEmptyLayout',
      title: 'Просмотр',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/schedules/stat/:id',
    component: ScheduleStatistic,
    name: 'ScheduleStatistic',
    meta: {
      layout: 'MainEmptyLayout',
      title: 'Статистика',
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
      layout: 'MainEmptyLayout',
      title: '',
      protected: {
        accessLevel: [2]
      }
    }
  }, {
    path: '/settings',
    component: Setting,
    name: 'Setting',
    children: [
      {
        path: '/',
        redirect: {name: 'SettingProfile'}
      },
      {
        path: 'workspace',
        component: SettingWorkspace,
        name: 'SettingWorkspace',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      },
      {
        path: 'profile',
        component: SettingProfile,
        name: 'SettingProfile',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      }, {
        path: 'v-permission',
        component: SettingVacationPermission,
        name: 'SettingVacationPermission',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      }, {
        path: 'v-rss',
        component: SettingVacationNotification,
        name: 'SettingVacationNotification',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      }, {
        path: 'v-template',
        component: SettingVacationTemplate,
        name: 'SettingVacationTemplate',
        meta: {
          layout: 'MainEmptyLayout',
          title: '',
          protected: {
            accessLevel: [2]
          }
        }
      }],
    meta: {
      layout: 'MainEmptyLayout',
      protected: {
        accessLevel: [2]
      }
    }
  },

  {
    path: '/loginlink',
    name: 'LoginByLink',
    component: LoginByLink,
    meta: {
      layout: 'EmptyLayout',
      title: 'Авторизация',
      protected: {
        accessLevel: [0, 1]
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
  const accessLevel = store.getters['app/getAccessLevel']
  const user = getAuth().currentUser

  if (DEBUG) {
    console.group('beforeEach')
    console.log(user || 'Not currentUser')
    console.log('accessLevel', accessLevel)
    console.log(`from: ${from.path}; to: ${to.path};`)
    console.groupEnd()
  }
  // next()
  if (!to.meta.protected) {
    next()
  } else {
    let available = to.meta.protected.accessLevel
    if (available.some(a => a == accessLevel)) {
      next()
    } else {
      switch (accessLevel) {
        case 0:
          next({name: 'Login'});
          break;
        case 1:
          next({name: 'EmailSending', query: {e: user.email}});
          break;
        case 2:
          next({name: 'Home'});
          break;
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
