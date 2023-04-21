const Intervals = () => import('@/views/App/Goals/Intervals')
const GoalViewer = () => import('@/views/App/Goals/GoalViewer')
const Goals = () => import('@/views/App/Goals/Goals')

export const goalsRoutes = [

  {
    path: '/goals',
    name: 'Goals',
    component: Goals,
    meta: {
      module: 'goals',
      layout: 'MainEmptyLayout',
      title: 'Мои цели',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    path: '/intervals',
    name: 'Intervals',
    component: Intervals,
    meta: {
      module: 'goals',
      layout: 'MainEmptyLayout',
      title: 'Период',
      protected: {
        accessLevel: [2]
      }
    }
  },
  {
    module: 'goals',
    path: '/goalviewer',
    name: 'GoalViewer',
    component: GoalViewer,
    meta: {
      module: 'goals',
      layout: 'MainEmptyLayout',
      title: 'Просмотр целей',
      protected: {
        accessLevel: [2]
      }
    }
  }
]