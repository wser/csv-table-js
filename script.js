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

// arrowLine(
//   { x: 5, y: 10 },
//   { x: 100, y: 80 },
//   { curvature: 1.5, endpoint: { type: 'circles' } }
// );

window.addEventListener('click', (e) => {
  placeDiv(e.x, e.y);

  arrowLine({
    source: '#box1',
    destination: '#box2',
    thickness: 3,
    style: 'dot',
  });
});

function placeDiv(x_pos, y_pos) {
  var d = document.getElementById('box1');
  d.style.position = 'absolute';
  d.style.left = x_pos + 'px';
  d.style.top = y_pos + 'px';
}
