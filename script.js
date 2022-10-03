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

/* TABLE Excle */
for (var i = 0; i < 6; i++) {
  var row = document.querySelector('table').insertRow(-1);
  for (var j = 0; j < 6; j++) {
    var letter = String.fromCharCode('A'.charCodeAt(0) + j - 1);
    row.insertCell(-1).innerHTML =
      i && j ? "<input id='" + letter + i + "'/>" : i || letter;
  }
}

var DATA = {},
  INPUTS = [].slice.call(document.querySelectorAll('input'));
INPUTS.forEach(function (elm) {
  elm.onfocus = function (e) {
    e.target.value = localStorage[e.target.id] || '';
  };
  elm.onblur = function (e) {
    localStorage[e.target.id] = e.target.value;
    computeAll();
  };
  var getter = function () {
    var value = localStorage[elm.id] || '';
    if (value.charAt(0) == '=') {
      with (DATA) return eval(value.substring(1));
    } else {
      return isNaN(parseFloat(value)) ? value : parseFloat(value);
    }
  };
  Object.defineProperty(DATA, elm.id, { get: getter });
  Object.defineProperty(DATA, elm.id.toLowerCase(), { get: getter });
});
(window.computeAll = function () {
  INPUTS.forEach(function (elm) {
    try {
      elm.value = DATA[elm.id];
    } catch (e) {}
  });
})();
