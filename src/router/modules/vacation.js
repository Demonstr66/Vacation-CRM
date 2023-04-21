const Vacations = () => import('@/views/App/Vacation/Vacations.vue')
const Vacation = () => import('@/views/App/Vacation/Vacation.vue')
const Schedules = () => import('@/views/App/Vacation/Schedules')
const Schedule = () => import('@/views/App/Vacation/ScheduleViewer')
const ScheduleEditor = () => import('@/views/App/Vacation/ScheduleEditor')
const Viewer1 = () => import('@/components/ScheduleViewer/ListView'  )
const Viewer2 = () => import('@/components/ScheduleViewer/TimelineView'  )
const ScheduleStatistic = () => import('@/views/App/Vacation/ScheduleStatistic')
const VacationsStats = () => import('@/views/App/Vacation/VacationStatistic')

export const vacationRoutes = [
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
    path: '/stats',
    name: 'Stats',
    component: VacationsStats,
    meta: {
      layout: 'MainEmptyLayout',
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
  }
]