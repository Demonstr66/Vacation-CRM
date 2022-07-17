export default [
  {
    text: 'Имя',
    value: 'uid',
    cellClass: 'pa-0 px-2',
    class: 'text-no-wrap',
    align: 'start',
    groupable: false
  },
  {
    text: 'Даты',
    value: 'start',
    class: 'text-no-wrap',
    align: 'center',
  },
  {
    text: 'Дней',
    value: 'days',
    class: 'text-no-wrap',
    align: 'center',
  },
  {
    text: 'Статус',
    value: 'approved',
    align: 'center',
    class: 'pa-0 text-no-wrap',
    cellClass: 'fit-content',
  },
  {
    text: '',
    value: 'action',
    align: 'end',
    cellClass: 'px-0 fit-content border-left',
    sortable: false,
    groupable: false
  },
]