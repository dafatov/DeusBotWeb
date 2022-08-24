export const defaultOptions = {
  download: false,
  fixedHeader: false,
  print: false,
  rowsPerPageOptions: [10, 25, 100],
  selectableRows: 'none',
  textLabels: {
    body: {
      noMatch: 'Извините, записи не найдены',
      toolTip: 'Сортировка',
      columnHeaderTooltip: column => `Сортировка по ${column.label}`,
    },
    pagination: {
      next: 'Следующая страница',
      previous: 'Предыдущая страница',
      rowsPerPage: 'Строк на странице:',
      displayRows: 'из',
      jumpToPage: 'Перейти на страницу:',
    },
    toolbar: {
      search: 'Поиск',
      downloadCsv: 'Скачать CSV',
      print: 'Печать',
      viewColumns: 'Показывать столбцы',
      filterTable: 'Фильтр',
    },
    filter: {
      all: 'Все',
      title: 'Фильтры',
      reset: 'Сбросить',
    },
    viewColumns: {
      title: 'Показывать столбцы',
      titleAria: 'Скрыть/показать столбцы таблицы',
    },
    selectedRows: {
      text: 'строк(-а,-и) выбрано',
      delete: 'Удалить',
      deleteAria: 'Удалить выбранные строки',
    },
  },
};
