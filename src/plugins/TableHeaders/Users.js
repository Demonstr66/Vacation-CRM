export default [
  {
    text: 'Имя',
    value: 'fullName',
    cellClass: 'pa-0 px-2',
    class: 'text-no-wrap',
    align: 'start',
    groupable: false,
    width: '40%'
  },
  {
    text: 'Должность',
    value: 'post',
    class: 'text-no-wrap',
    align: 'center',
    width: '10%',
    visible: ['lg', 'xl']
  },
  {
    text: 'Команда',
    value: 'team',
    class: 'text-no-wrap',
    align: 'center',
    width: '10%',
    visible: ['lg', 'xl']
  },
  {
    text: 'Задачи',
    value: 'tasks',
    align: 'center',
    class: 'text-no-wrap',
    groupable: false,
    width: '40%'
  },
  {
    text: 'Статус',
    value: 'active',
    align: 'center',
    class: 'pa-0 text-no-wrap',
    cellClass: 'fit-content',
  },
  {
    text: '',
    value: 'action',
    align: 'center',
    cellClass: 'px-0 fit-content border-left',
    sortable: false,
    groupable: false
  },
]