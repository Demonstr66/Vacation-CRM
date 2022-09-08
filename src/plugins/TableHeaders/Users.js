export default [
  {
    text: 'Имя',
    value: 'fullName',
    cellClass: 'pa-0 px-2',
    class: 'text-no-wrap',
    align: 'start',
    groupable: false
  },
  // {
  //   text: 'Должность',
  //   value: 'post',
  //   class: 'text-no-wrap',
  //   align: 'center',
  // },
  {
    text: 'Команда',
    value: 'team',
    class: 'text-no-wrap',
    align: 'center',
  },
  {
    text: 'Задачи',
    value: 'tasks',
    align: 'center',
    class: 'text-no-wrap',
    groupable: false
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