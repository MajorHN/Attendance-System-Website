const observer = new MutationObserver(() => {
  const table = document.querySelector('#attendance-record');
  if (table && !table.dataset.initialized) {
    new DataTable('#attendance-record', {
      ajax: 'https://script.google.com/macros/s/AKfycbwyw7Vmb2svj51hjUpLX14txifQ1460pjtzLJXVcOIPbNW2tMDlDHnOICtimz5jJ0-u/exec',
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
