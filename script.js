// (A) GET HTML TABLE
let table = document.getElementById('demoTable');

// (B) AJAX FETCH CSV FILE
fetch('dummy.csv')
  .then((res) => {
    return res.text();
  })
  .then((csv) => {
    // (B1) REMOVE OLD TABLE ROWS
    table.innerHTML = '';

    // (B2) GENERATE TABLE
    csv = csv.split('\r\n');
    for (let row of csv) {
      let tr = table.insertRow();
      for (let col of row.split(',')) {
        let td = tr.insertCell();
        td.innerHTML = col;
      }
    }
  });
