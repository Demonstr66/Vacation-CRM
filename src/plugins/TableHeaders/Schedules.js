export default [
  {
    text: 'Название',
    value: 'title',
    width: '25%'
  },
  {
    text: 'Год',
    value: 'year',
    width: '25%'
  },
  {
    text: 'Статус',
    value: 'status',
    sortable: true,
    width: '25%'
  },
  {
    text: 'Активация',
    value: 'isApprove',
    align: 'center',
    width: '25%'
  },
  {
    text: '',
    value: 'action',
    align: 'end',
    cellClass: 'px-0 fit-content border-left',
    sortable: false,
    groupable: false,
  },
]