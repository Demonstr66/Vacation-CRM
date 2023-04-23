const Intervals = () => import('@/views/App/Modules/Goals/Intervals')
const GoalViewer = () => import('@/views/App/Modules/Goals/GoalViewer')
const Goals = () => import('@/views/App/Modules/Goals/Goals')

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

export const goalNavLinks = {
  module: 'goals',
  header: 'Цели',
  icon: 'mdi-bullseye-arrow',
  children: [
    {to: {name: 'Intervals'}, icon: 'mdi-folder', title: 'Периоды'},
    {to: {name: 'GoalViewer'}, icon: 'mdi-chart-donut', title: 'Просмотр'},
    {to: {name: 'Goals'}, icon: 'mdi-star', title: 'Мои цели'}
  ]
}