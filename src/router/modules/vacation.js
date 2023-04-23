import {createRoute} from "@/router/utils";

const VacationHome = () => import('@/views/App/Modules/Vacation/VacationHome')
const VacationViewer = () => import('@/views/App/Modules/Vacation/VacationViewer')

const VacationReport = () => import('@/views/App/Modules/Vacation/VacationReport')

const ScheduleHome = () => import('@/views/App/Modules/Vacation/ScheduleHome')
const ScheduleStatistic = () => import('@/components/Modules/Vacation/ScheduleViewer/pages/ScheduleStatistic')
const ScheduleCreator = () => import('@/views/App/Modules/Vacation/ScheduleEditor')
const ScheduleEditor = () => import('@/views/App/Modules/Vacation/ScheduleEditor')
const ScheduleViewer = () => import('@/views/App/Modules/Vacation/ScheduleViewer')
const ScheduleViewerList = () => import('@/components/Modules/Vacation/ScheduleViewer/pages/List'  )
const ScheduleViewerTimeline = () => import('@/components/Modules/Vacation/ScheduleViewer/pages/Timeline'  )

export const vacationRoutes = [
  createRoute('/vacation', VacationHome, {title: 'Мои отпуска',}),
  createRoute('/report', VacationReport),
  createRoute('/vacation/:uid/:id', VacationViewer),
  createRoute('/schedules', ScheduleHome, {title: 'Графики отпусков',}),
  createRoute('/schedules/editor', ScheduleCreator, {title: 'Новый график',}),
  createRoute('/schedules/editor/:id', ScheduleEditor, {title: 'Редактирование',}),
  createRoute(
    '/schedules/viewer',
    ScheduleViewer,
    {
      title: 'Просмотр',
      children: [
        ['/', false, {redirect: {name: 'ScheduleViewerList'}}],
        ['list/:id', ScheduleViewerList,],
        ['timeline/:id', ScheduleViewerTimeline,]
      ],
    }),
  createRoute('/schedules/stat/:id', ScheduleStatistic, {title: 'Статистика',})
]

export const vacationNavLinks = {
  module: 'vacation',
  header: 'Отспуска',
  icon: 'mdi-calendar-outline',
  children: [
    {to: {name: 'ScheduleHome'}, icon: 'mdi-folder', title: 'Графики'},
    {to: {name: 'VacationHome'}, icon: 'mdi-star', title: 'Мои отпуска'},
    {to: {name: 'VacationReport'}, icon: 'mdi-file-chart-outline', title: 'Отчеты'},
  ]
}
