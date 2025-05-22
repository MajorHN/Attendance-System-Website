const observer = new MutationObserver(() => {
  const table = document.querySelector('#attendance-record');
  if (table && !table.dataset.initialized) {
    new DataTable('#attendance-record', {
      ajax: 'https://script.google.com/macros/s/AKfycbyGIHMLOtyq7cFoRcxi_Je6C5cleUqW0I4NT9xp8z1pRoJWkXZvPz5he1EFfUlr_lXA/exec',
      columns: [
        { data: 'ID' },
        { data: 'Name' },
        {
          data: 'Date',
          render: function (data) {
            return moment(data).isValid()
              ? moment(data).format('dddd, MMMM D, YYYY')
              : data;
          }
        },
        {
          data: 'Time',
          render: function (data) {
            return moment(data).isValid()
              ? moment(data).format('h:mm:ss A')
              : data;
          }
        }
      ]
    });
    table.dataset.initialized = 'true';
  }
});

observer.observe(document.querySelector('.content'), { childList: true, subtree: true });
