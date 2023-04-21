import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import {getAuth} from "firebase/auth";
import {vacationRoutes} from "@/router/modules/vacation";
import {goalsRoutes} from "@/router/modules/goals";
import {authRoutes} from "@/router/modules/auth";
import {addModuleName, getNormalModuleRoutes} from "@/router/utils";

const DEBUG = process.env.VUE_APP_DEBUG;

const Home = () => import('@/views/App/Home.vue')
const User = () => import('@/views/App/User')

const Organization = () => import('@/views/App/Organization.vue')
const OrganizationUsers = () => import('@/components/Organization/Users')
const OrganizationStructure = () => import('@/components/Organization/Structure')

const Setting = () => import('@/views/App/Account')
const SettingProfile = () => import('@/components/Account/pages/common/profile')
const SettingPermission = () => import('@/components/Account/pages/common/permission')
const SettingVacationTemplate = () => import('@/components/Account/pages/vacations/v-template')
const SettingVacationNotification = () => import('@/components/Account/pages/vacations/v-notification')
const SettingWorkspace = () => import('@/components/Account/pages/common/workspace')


Vue.use(VueRouter)

function createRoute(options) {
  const route = {
    path: '', name: '', component: '', meta: {
      layout: 'MainEmptyLayout', title: '', protected: {
        accessLevel: [2]
      }
    }
  }


  if (options.component) {
    route.name = options.component.toString().split('()')[0].replace('function ', '')
    route.component = options.component
  }

  if (options.path) {
    route.path = options.path
  }
  if (options.layout) {
    route.meta.layout = options.layout
  }
  if (options.title) {
    route.meta.title = options.title
  }
  if (options.accessLevel) {
    route.meta.protected.accessLevel = options.accessLevel
  }
  if (options.redirect) {
    route.redirect = options.redirect
  }
  if (options.children) {
    route.children = options.children.map(child => {
      if (!child.title) {
        child.title = options.title
      }
      return createRoute(child)
    })
  }

  return route
}


const routes = [{
  path: '/', name: 'Home', component: Home, meta: {
    layout: 'MainEmptyLayout', title: 'Главная', protected: {
      accessLevel: [2]
    }
  }
}, {
  path: '/organization',
  name: 'Organization',
  component: Organization,
  children: [{path: '/', redirect: {name: 'OrganizationUsers'}}, {
    path: 'users', component: OrganizationUsers, name: 'OrganizationUsers', meta: {
      layout: 'MainEmptyLayout', title: 'Управление', protected: {
        accessLevel: [2]
      }
    }
  }, {
    path: 'structure', component: OrganizationStructure, name: 'OrganizationStructure', meta: {
      layout: 'MainEmptyLayout', title: 'Управление', protected: {
        accessLevel: [2]
      }
    }
  }],
  meta: {
    layout: 'MainEmptyLayout', title: 'Управление', protected: {
      accessLevel: [2]
    }
  }
}, {
  path: '/user/:uid', name: 'User', component: User, meta: {
    layout: 'MainEmptyLayout', title: 'Профиль', protected: {
      accessLevel: [2]
    }
  }
}, {
  path: '/settings', component: Setting, name: 'Setting', children: [{
    path: '/', redirect: {name: 'SettingProfile'}
  }, {
    path: 'workspace', component: SettingWorkspace, name: 'SettingWorkspace', meta: {
      layout: 'MainEmptyLayout', title: '', protected: {
        accessLevel: [2]
      }
    }
  }, {
    path: 'profile', component: SettingProfile, name: 'SettingProfile', meta: {
      layout: 'MainEmptyLayout', title: '', protected: {
        accessLevel: [2]
      }
    }
  }, {
    path: 'permission', component: SettingPermission, name: 'PermissionProfile', meta: {
      layout: 'MainEmptyLayout', title: '', protected: {
        accessLevel: [2]
      }
    }
  }, {
    path: 'v-rss', component: SettingVacationNotification, name: 'SettingVacationNotification', meta: {
      layout: 'MainEmptyLayout', title: '', protected: {
        accessLevel: [2]
      }
    }
  }, {
    path: 'v-template', component: SettingVacationTemplate, name: 'SettingVacationTemplate', meta: {
      layout: 'MainEmptyLayout', title: '', protected: {
        accessLevel: [2]
      }
    }
  }], meta: {
    layout: 'MainEmptyLayout', protected: {
      accessLevel: [2]
    }
  }
},
  ...getNormalModuleRoutes(authRoutes, 'auth'),
  ...getNormalModuleRoutes(vacationRoutes, 'vacation'),
  ...getNormalModuleRoutes(goalsRoutes, 'goals')
]

const router = new VueRouter({
  mode: "history", routes
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

export default router
