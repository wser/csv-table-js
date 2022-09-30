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

const src = document.getElementById('box1');

window.addEventListener('click', (e) => {
  placeDiv(e.x, e.y);

  arrowLine({
    // source: { x: e.x, y: e.y },
    source: '#box1',
    destination: '#box2',
    thickness: 1,
    color: 'blue',
    curvature: 1.2,
    endpoint: {
      type: 'arrowHead', //squres, circles, arrowHead, arrowHeadFilled, none, custom
      markerIdentifier: '', // Only allowed with custom endpoint type
      fillColor: 'red',
      size: 3,
      position: 'start', //start, end, both
    },
    style: 'solid', // dash, dot, solid, dot-dash
  });
});

function placeDiv(x_pos, y_pos) {
  var d = document.getElementById('box1');
  d.style.position = 'absolute';
  d.style.left = x_pos + 'px';
  d.style.top = y_pos + 'px';
}
