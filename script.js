// (A) GET HTML TABLE
// let table = document.getElementById('demoTable');

// (B) AJAX FETCH CSV FILE
// fetch('dummy.csv')
//   .then((res) => {
//     return res.text();
//   })
//   .then((csv) => {
//     // (B1) REMOVE OLD TABLE ROWS
//     table.innerHTML = '';

//     // (B2) GENERATE TABLE
//     csv = csv.split('\r\n');
//     for (let row of csv) {
//       let tr = table.insertRow();
//       for (let col of row.split(',')) {
//         let td = tr.insertCell();
//         td.innerHTML = col;
//       }
//     }
//   });

// arrowLine(
//   { x: 5, y: 10 },
//   { x: 100, y: 80 },
//   { curvature: 1.5, endpoint: { type: 'circles' } }
// );

const line = document.querySelector('#__arrowLineInternal-svg-canvas');

window.addEventListener('click', (e) => {
  placeDiv(e.x, e.y);

  // arrowLine({
  //   // source: { x: e.x, y: e.y },
  //   source: '#box1',
  //   destination: '#box2',
  //   thickness: 1,
  //   color: 'blue',
  //   curvature: 1.2,
  //   endpoint: {
  //     type: 'arrowHead', //squres, circles, arrowHead, arrowHeadFilled, none, custom
  //     markerIdentifier: '', // Only allowed with custom endpoint type
  //     fillColor: 'red',
  //     size: 3,
  //     position: 'end', //start, end, both
  //   },
  //   style: 'solid', // dash, dot, solid, dot-dash
  // });
  // line.firstElementChild.innerHTML = '';
});

function createSVG() {
  var svg = document.getElementById('svg-canvas');
  if (null == svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'svg-canvas');
    svg.setAttribute('style', 'position:absolute;top:0px;left:0px');
    svg.setAttribute('width', document.body.clientWidth);
    svg.setAttribute('height', document.body.clientHeight);
    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    );
    document.body.appendChild(svg);
  }
  return svg;
}

function drawCircle(x, y, radius, color) {
  var svg = createSVG();
  var shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  shape.setAttributeNS(null, 'cx', x);
  shape.setAttributeNS(null, 'cy', y);
  shape.setAttributeNS(null, 'r', radius);
  shape.setAttributeNS(null, 'fill', color);
  svg.appendChild(shape);
}

function findAbsolutePosition(htmlElement) {
  var x = htmlElement.offsetLeft;
  var y = htmlElement.offsetTop;
  for (var x = 0, y = 0, el = htmlElement; el != null; el = el.offsetParent) {
    x += el.offsetLeft;
    y += el.offsetTop;
  }
  return {
    x: x,
    y: y,
  };
}

function connectDivs(leftId, rightId, color, tension) {
  var left = document.getElementById(leftId);
  var right = document.getElementById(rightId);

  var leftPos = findAbsolutePosition(left);
  var x1 = leftPos.x;
  var y1 = leftPos.y;
  x1 += left.offsetWidth;
  y1 += left.offsetHeight / 2;

  var rightPos = findAbsolutePosition(right);
  var x2 = rightPos.x;
  var y2 = rightPos.y;
  y2 += right.offsetHeight / 2;

  var width = x2 - x1;
  var height = y2 - y1;

  drawCircle(x1, y1, 3, color);
  drawCircle(x2, y2, 3, color);
  drawCurvedLine(x1, y1, x2, y2, color, tension);
}

function drawCurvedLine(x1, y1, x2, y2, color, tension) {
  var svg = createSVG();
  var shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  var delta = (x2 - x1) * tension;
  var hx1 = x1 + delta;
  var hy1 = y1;
  var hx2 = x2 - delta;
  var hy2 = y2;
  var path =
    'M ' +
    x1 +
    ' ' +
    y1 +
    ' C ' +
    hx1 +
    ' ' +
    hy1 +
    ' ' +
    hx2 +
    ' ' +
    hy2 +
    ' ' +
    x2 +
    ' ' +
    y2;
  shape.setAttributeNS(null, 'd', path);
  shape.setAttributeNS(null, 'fill', 'none');
  shape.setAttributeNS(null, 'stroke', color);
  svg.appendChild(shape);
}

/********************* */

function placeDiv(x_pos, y_pos) {
  var d = document.getElementById('box1');
  d.style.position = 'relative';
  d.style.left = x_pos + 'px';
  d.style.top = y_pos + 'px';
}

/* TABLE Excle */
for (let i = 0; i < 6; i++) {
  var row = document.querySelector('table').insertRow(-1);
  for (var j = 0; j < 6; j++) {
    var letter = String.fromCharCode('A'.charCodeAt(0) + j - 1);
    row.insertCell(-1).innerHTML =
      i && j ? "<input id='" + letter + i + "'/>" : i || letter;
  }
}

var DATA = {},
  INPUTS = [].slice.call(document.querySelectorAll('input'));
INPUTS.forEach((elm) => {
  elm.onfocus = (e) => (e.target.value = localStorage[e.target.id] || '');

  elm.onblur = function (e) {
    localStorage[e.target.id] = e.target.value;
    computeAll();
  };
  var getter = function () {
    var value = localStorage[elm.id] || '';
    if (value.charAt(0) == '=') with (DATA) return eval(value.substring(1));
    else return isNaN(parseFloat(value)) ? value : parseFloat(value);
  };
  Object.defineProperty(DATA, elm.id, { get: getter });
  Object.defineProperty(DATA, elm.id.toLowerCase(), { get: getter });
});
(window.computeAll = () => {
  INPUTS.forEach(function (elm) {
    try {
      elm.value = DATA[elm.id];
    } catch (e) {}
  });
})();
