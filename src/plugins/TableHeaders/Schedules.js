export default [
  {
    text: 'Название',
    value: 'title',
  },
  {
    text: 'Год',
    value: 'year',
  },
  {
    text: 'Статус',
    value: 'status',
    sortable: true,
  },
  {
    text: 'Активация',
    value: 'isApprove',
    align: 'center'
  },
  {
    text: 'Действия',
    value: 'action',
    align: 'center',
    cellClass: 'px-0 fit-content border-left',
    sortable: false,
    groupable: false
  },
]