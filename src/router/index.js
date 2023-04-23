import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import {getAuth} from "firebase/auth";
import {vacationRoutes} from "@/router/modules/vacation";
import {goalsRoutes} from "@/router/modules/goals";
import {authRoutes} from "@/router/modules/auth";
import {addModuleName, createRoute, getNormalModuleRoutes} from "@/router/utils";

const DEBUG = process.env.VUE_APP_DEBUG;

const Home = () => import('@/views/App/Home')
const Employee = () => import('@/views/App/Employee')

const Organization = () => import('@/views/App/Organization')
const OrganizationEmployees = () => import('@/components/Organization/pages/Employees')
const OrganizationStructure = () => import('@/components/Organization/pages/Structure')

const Setting = () => import('@/views/App/Account')
const SettingProfile = () => import('@/components/Settings/pages/common/Profile')
const SettingAccessPermission = () => import('@/components/Settings/pages/common/AccessPermission')
const SettingVacationTemplate = () => import('@/components/Settings/pages/vacations/VacationTemplate')
const SettingVacationNotification = () => import('@/components/Settings/pages/vacations/VacationNotification')
const SettingWorkspace = () => import('@/components/Settings/pages/common/Workspace')


Vue.use(VueRouter)


const commonRoutes = [
  createRoute('/', Home, {title: 'Главная'}),
  createRoute('/organization', Organization, {
    redirect: 'OrganizationUsers',
    title: 'Управление',
    children: [
      ['employees', OrganizationEmployees],
      ['structure', OrganizationStructure],
    ]
  }),
  createRoute('/organization/employee?id=:uid', Employee, {title: 'Профиль'}),
  createRoute('/settings', Setting, {
    children: [
      ['/', false, {redirect: {name: 'SettingProfile'}}],
      ['profile', SettingProfile],
      ['workspace', SettingWorkspace],
      ['access-permission', SettingAccessPermission],
      ['vacation-notification', SettingVacationNotification],
      ['vacation-template', SettingVacationTemplate],
    ]
  })
]


const routes = [
  ...commonRoutes,
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
